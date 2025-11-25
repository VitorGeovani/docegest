import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Configurar __dirname para ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carregar variáveis de ambiente do arquivo .env na pasta backend
const envPath = path.join(__dirname, '.env');
dotenv.config({ path: envPath });

console.log('📂 Carregando configurações do arquivo .env...');
console.log('📍 Caminho do .env:', envPath);
console.log('🔍 Arquivo .env existe?', fs.existsSync(envPath) ? 'Sim ✅' : 'Não ❌');

// Verificar se as variáveis foram carregadas
if (!process.env.DB_HOST && !process.env.MYSQL_HOST && !process.env.DB_USER && !process.env.MYSQL_USER) {
    console.warn('\n⚠️  AVISO: Variáveis de ambiente não foram carregadas!');
    console.warn('   Usando valores padrão...\n');
}

/**
 * Script para executar a migração de preferências de clientes (RF055)
 * 
 * Este script cria:
 * - Tabela cliente_preferencias
 * - 4 Stored Procedures
 * - 2 Views
 * - 1 Trigger para histórico
 * - Índices para otimização
 */

async function executarMigracaoPreferencias() {
    let connection;
    
    try {
        console.log('🔄 Iniciando migração de preferências de clientes...\n');
        
        // Configurações de conexão (suporta ambos os formatos de variáveis)
        const dbConfig = {
            host: process.env.DB_HOST || process.env.MYSQL_HOST || 'localhost',
            user: process.env.DB_USER || process.env.MYSQL_USER || 'root',
            password: process.env.DB_PASSWORD || process.env.MYSQL_PWD || '',
            database: process.env.DB_DATABASE || process.env.MYSQL_DB || 'segredodosabor',
            multipleStatements: true
        };
        
        // Exibir configurações (sem senha)
        console.log('🔐 Configurações de conexão:');
        console.log(`   Host: ${dbConfig.host}`);
        console.log(`   User: ${dbConfig.user}`);
        console.log(`   Password: ${dbConfig.password ? '***' + dbConfig.password.slice(-3) : '(vazia)'}`);
        console.log(`   Database: ${dbConfig.database}\n`);
        
        // Criar conexão com o banco
        connection = await mysql.createConnection(dbConfig);
        
        console.log('✅ Conectado ao banco de dados\n');
        
        // Ler arquivo SQL
        const sqlFilePath = path.join(__dirname, '..', 'adicionar-preferencias-clientes.sql');
        
        if (!fs.existsSync(sqlFilePath)) {
            throw new Error(`Arquivo SQL não encontrado: ${sqlFilePath}`);
        }
        
        let sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
        console.log('✅ Arquivo SQL carregado\n');
        
        console.log('🔧 Processando arquivo SQL...');
        
        // Remover comentários de múltiplas linhas /* ... */
        sqlContent = sqlContent.replace(/\/\*[\s\S]*?\*\//g, '');
        
        // Remover comentários de linha única --
        sqlContent = sqlContent.replace(/--[^\n]*/g, '');
        
        // Remover comandos DELIMITER (não suportados em conexões programáticas)
        sqlContent = sqlContent.replace(/DELIMITER\s+\$\$/gi, '');
        sqlContent = sqlContent.replace(/DELIMITER\s+;/gi, '');
        
        // Substituir $$ por ; (delimitador padrão)
        sqlContent = sqlContent.replace(/\$\$/g, ';');
        
        // Dividir o SQL em comandos individuais
        // Divide por ; mas mantém ; que estão dentro de procedures/triggers
        const commands = [];
        let currentCommand = '';
        let insideBlock = false;
        let blockDepth = 0;
        
        const lines = sqlContent.split('\n');
        
        for (const line of lines) {
            const trimmedLine = line.trim();
            
            // Ignorar linhas vazias
            if (trimmedLine.length === 0) continue;
            
            // Detectar início de bloco (CREATE PROCEDURE, CREATE TRIGGER, etc)
            if (trimmedLine.match(/^CREATE\s+(PROCEDURE|TRIGGER|FUNCTION)/i)) {
                insideBlock = true;
                blockDepth = 0;
            }
            
            // Contar BEGIN/END para detectar fim de bloco
            if (trimmedLine.match(/\bBEGIN\b/i)) {
                blockDepth++;
            }
            if (trimmedLine.match(/\bEND\b/i)) {
                blockDepth--;
            }
            
            currentCommand += line + '\n';
            
            // Se encontrou ; e não está dentro de bloco, é fim de comando
            if (trimmedLine.endsWith(';')) {
                if (!insideBlock || (insideBlock && blockDepth === 0 && trimmedLine.match(/\bEND\b/i))) {
                    commands.push(currentCommand.trim());
                    currentCommand = '';
                    insideBlock = false;
                }
            }
        }
        
        // Adicionar último comando se houver
        if (currentCommand.trim().length > 0) {
            commands.push(currentCommand.trim());
        }
        
        console.log(`✅ SQL processado: ${commands.length} comandos identificados\n`);
        console.log(`📋 Total de comandos a executar: ${commands.length}\n`);
        
        let successCount = 0;
        let errorCount = 0;
        
        // Executar cada comando
        for (let i = 0; i < commands.length; i++) {
            const command = commands[i];
            
            // Ignorar comentários
            if (command.startsWith('--') || command.startsWith('/*')) {
                continue;
            }
            
            // Identificar tipo de comando
            let commandType = 'UNKNOWN';
            if (command.includes('CREATE TABLE')) {
                commandType = 'CREATE TABLE';
            } else if (command.includes('CREATE PROCEDURE')) {
                commandType = 'CREATE PROCEDURE';
            } else if (command.includes('CREATE VIEW')) {
                commandType = 'CREATE VIEW';
            } else if (command.includes('CREATE TRIGGER')) {
                commandType = 'CREATE TRIGGER';
            } else if (command.includes('CREATE INDEX')) {
                commandType = 'CREATE INDEX';
            } else if (command.includes('DROP')) {
                commandType = 'DROP';
            }
            
            try {
                console.log(`⚙️  Executando [${i + 1}/${commands.length}]: ${commandType}...`);
                
                // Executar comando
                await connection.query(command);
                
                console.log(`✅ Sucesso: ${commandType}\n`);
                successCount++;
                
            } catch (error) {
                // Alguns erros são aceitáveis (como DROP de objetos que não existem)
                if (error.code === 'ER_BAD_TABLE_ERROR' || 
                    error.code === 'ER_SP_DOES_NOT_EXIST' ||
                    error.code === 'ER_TRG_DOES_NOT_EXIST') {
                    console.log(`⚠️  Aviso: ${commandType} - ${error.message}\n`);
                    successCount++;
                } else {
                    console.error(`❌ Erro ao executar ${commandType}:`);
                    console.error(`   ${error.message}\n`);
                    errorCount++;
                }
            }
        }
        
        // Resumo da execução
        console.log('\n' + '='.repeat(60));
        console.log('📊 RESUMO DA MIGRAÇÃO');
        console.log('='.repeat(60));
        console.log(`✅ Comandos executados com sucesso: ${successCount}`);
        console.log(`❌ Comandos com erro: ${errorCount}`);
        console.log(`📋 Total processado: ${commands.length}`);
        console.log('='.repeat(60) + '\n');
        
        // Verificar se a tabela foi criada
        console.log('🔍 Verificando estrutura criada...\n');
        
        const dbName = dbConfig.database;
        
        const [tables] = await connection.query(`
            SELECT TABLE_NAME 
            FROM information_schema.TABLES 
            WHERE TABLE_SCHEMA = '${dbName}' 
            AND TABLE_NAME = 'cliente_preferencias'
        `);
        
        if (tables.length > 0) {
            console.log('✅ Tabela cliente_preferencias criada com sucesso\n');
            
            // Verificar colunas
            const [columns] = await connection.query(`
                SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE, COLUMN_DEFAULT
                FROM information_schema.COLUMNS
                WHERE TABLE_SCHEMA = '${dbName}'
                AND TABLE_NAME = 'cliente_preferencias'
                ORDER BY ORDINAL_POSITION
            `);
            
            console.log('📋 Colunas da tabela cliente_preferencias:');
            columns.forEach(col => {
                console.log(`   - ${col.COLUMN_NAME} (${col.COLUMN_TYPE}) ${col.IS_NULLABLE === 'NO' ? 'NOT NULL' : 'NULL'}`);
            });
            console.log('');
        } else {
            console.log('⚠️  Tabela cliente_preferencias não foi encontrada\n');
        }
        
        // Verificar Stored Procedures
        const [procedures] = await connection.query(`
            SELECT ROUTINE_NAME
            FROM information_schema.ROUTINES
            WHERE ROUTINE_SCHEMA = '${dbName}'
            AND ROUTINE_TYPE = 'PROCEDURE'
            AND ROUTINE_NAME LIKE '%preferencias%'
        `);
        
        console.log(`✅ Stored Procedures criadas: ${procedures.length}`);
        procedures.forEach(proc => {
            console.log(`   - ${proc.ROUTINE_NAME}`);
        });
        console.log('');
        
        // Verificar Views
        const [views] = await connection.query(`
            SELECT TABLE_NAME
            FROM information_schema.VIEWS
            WHERE TABLE_SCHEMA = '${dbName}'
            AND TABLE_NAME LIKE '%preferencias%'
        `);
        
        console.log(`✅ Views criadas: ${views.length}`);
        views.forEach(view => {
            console.log(`   - ${view.TABLE_NAME}`);
        });
        console.log('');
        
        // Verificar Triggers
        const [triggers] = await connection.query(`
            SELECT TRIGGER_NAME, EVENT_MANIPULATION, EVENT_OBJECT_TABLE
            FROM information_schema.TRIGGERS
            WHERE TRIGGER_SCHEMA = '${dbName}'
            AND TRIGGER_NAME LIKE '%preferencias%'
        `);
        
        console.log(`✅ Triggers criadas: ${triggers.length}`);
        triggers.forEach(trg => {
            console.log(`   - ${trg.TRIGGER_NAME} (${trg.EVENT_MANIPULATION} on ${trg.EVENT_OBJECT_TABLE})`);
        });
        console.log('');
        
        if (errorCount === 0) {
            console.log('🎉 MIGRAÇÃO CONCLUÍDA COM SUCESSO!\n');
            console.log('📝 Próximos passos:');
            console.log('   1. Reinicie o backend: npm start');
            console.log('   2. Teste os endpoints de preferências via Postman');
            console.log('   3. Consulte POSTMAN_COLLECTION_RF049_RF055.md para exemplos\n');
        } else {
            console.log('⚠️  MIGRAÇÃO CONCLUÍDA COM ALGUNS ERROS\n');
            console.log('   Verifique os erros acima e corrija se necessário.\n');
        }
        
    } catch (error) {
        console.error('\n❌ ERRO FATAL NA MIGRAÇÃO:');
        console.error(error.message);
        console.error('\n📝 Detalhes do erro:');
        console.error(error);
        process.exit(1);
        
    } finally {
        if (connection) {
            await connection.end();
            console.log('🔌 Conexão com o banco encerrada\n');
        }
    }
}

// Executar migração
console.log('\n' + '='.repeat(60));
console.log('🚀 MIGRAÇÃO DE PREFERÊNCIAS DE CLIENTES (RF055)');
console.log('='.repeat(60) + '\n');

executarMigracaoPreferencias()
    .then(() => {
        console.log('✅ Script finalizado\n');
        process.exit(0);
    })
    .catch(error => {
        console.error('❌ Erro ao executar migração:', error);
        process.exit(1);
    });
