/**
 * Script para executar a migração do banco de dados DoceGest
 * Executa o arquivo migracao_docegest_v3.sql no MySQL
 */

import { createConnection } from 'mysql2/promise';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Função para dividir o SQL em múltiplos statements
function dividirSQL(sql) {
    // Remove comentários de linha
    sql = sql.replace(/--.*$/gm, '');
    
    // Separa por delimitadores, mantendo DELIMITER commands
    const statements = [];
    let currentStatement = '';
    let delimiter = ';';
    
    const lines = sql.split('\n');
    
    for (let line of lines) {
        const trimmedLine = line.trim();
        
        // Detecta mudança de delimiter
        if (trimmedLine.toUpperCase().startsWith('DELIMITER')) {
            if (currentStatement.trim()) {
                statements.push(currentStatement.trim());
                currentStatement = '';
            }
            const newDelimiter = trimmedLine.split(/\s+/)[1];
            if (newDelimiter) {
                delimiter = newDelimiter;
            }
            continue;
        }
        
        currentStatement += line + '\n';
        
        // Verifica se chegou no delimiter atual
        if (trimmedLine.endsWith(delimiter)) {
            // Remove o delimiter do final
            currentStatement = currentStatement.substring(0, currentStatement.lastIndexOf(delimiter));
            if (currentStatement.trim()) {
                statements.push(currentStatement.trim());
            }
            currentStatement = '';
        }
    }
    
    // Adiciona o último statement se houver
    if (currentStatement.trim()) {
        statements.push(currentStatement.trim());
    }
    
    return statements.filter(s => s.length > 0);
}

async function executarMigracao() {
    let connection;
    
    try {
        console.log('🔄 Iniciando migração do banco de dados DoceGest...\n');
        
        // Lê as configurações do .env
        const envContent = readFileSync(join(__dirname, '.env'), 'utf-8');
        const config = {};
        
        envContent.split('\n').forEach(line => {
            const [key, ...valueParts] = line.split('=');
            if (key && valueParts.length > 0) {
                config[key.trim()] = valueParts.join('=').trim();
            }
        });
        
        console.log('📡 Conectando ao banco de dados...');
        
        // Prepara configurações de conexão
        const connectionConfig = {
            host: config.HOST || 'localhost',
            user: config.USER || 'root',
            database: config.DATABASE || 'segredodosabor',
            multipleStatements: true
        };
        
        // Adiciona senha apenas se estiver definida
        if (config.PASSWORD && config.PASSWORD.length > 0) {
            connectionConfig.password = config.PASSWORD;
        }
        
        // Conecta ao MySQL
        connection = await createConnection(connectionConfig);
        
        console.log('✅ Conexão estabelecida!\n');
        
        // Lê o arquivo de migração
        console.log('📖 Lendo arquivo de migração...');
        const sqlContent = readFileSync(join(__dirname, '..', 'migracao_docegest_v3.sql'), 'utf-8');
        
        // Divide em statements individuais
        console.log('🔧 Processando statements SQL...');
        const statements = dividirSQL(sqlContent);
        
        console.log(`📝 Total de ${statements.length} operações a executar\n`);
        
        // Executa cada statement
        let executados = 0;
        let erros = 0;
        
        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i];
            
            try {
                // Detecta o tipo de operação
                let tipo = 'QUERY';
                if (statement.toUpperCase().includes('CREATE TABLE')) tipo = 'CREATE TABLE';
                else if (statement.toUpperCase().includes('ALTER TABLE')) tipo = 'ALTER TABLE';
                else if (statement.toUpperCase().includes('CREATE VIEW')) tipo = 'CREATE VIEW';
                else if (statement.toUpperCase().includes('CREATE PROCEDURE')) tipo = 'CREATE PROCEDURE';
                else if (statement.toUpperCase().includes('CREATE INDEX')) tipo = 'CREATE INDEX';
                
                process.stdout.write(`[${i + 1}/${statements.length}] Executando ${tipo}... `);
                
                await connection.query(statement);
                
                console.log('✅');
                executados++;
                
            } catch (error) {
                // Ignora erros de "já existe"
                if (error.code === 'ER_TABLE_EXISTS_ERROR' || 
                    error.code === 'ER_DUP_FIELDNAME' ||
                    error.message.includes('already exists')) {
                    console.log('⚠️  (já existe)');
                } else {
                    console.log(`❌ ERRO: ${error.message}`);
                    erros++;
                }
            }
        }
        
        console.log('\n' + '='.repeat(60));
        console.log('📊 RESULTADO DA MIGRAÇÃO:');
        console.log('='.repeat(60));
        console.log(`✅ Operações executadas com sucesso: ${executados}`);
        console.log(`❌ Erros encontrados: ${erros}`);
        console.log('='.repeat(60));
        
        if (erros === 0) {
            console.log('\n🎉 MIGRAÇÃO CONCLUÍDA COM SUCESSO!');
            console.log('✨ O banco de dados está pronto para o DoceGest MVP!\n');
        } else {
            console.log('\n⚠️  Migração concluída com alguns erros.');
            console.log('💡 Verifique se os erros são críticos ou apenas avisos.\n');
        }
        
        // Verifica as novas tabelas criadas
        console.log('🔍 Verificando tabelas criadas...\n');
        const [tables] = await connection.query(`
            SELECT TABLE_NAME 
            FROM information_schema.TABLES 
            WHERE TABLE_SCHEMA = '${config.DATABASE || 'segredodosabor'}' 
            AND TABLE_NAME IN ('categoria', 'ingrediente', 'receita', 'custo_indireto', 'movimentacao_estoque', 'configuracao')
        `);
        
        tables.forEach(table => {
            console.log(`  ✅ ${table.TABLE_NAME}`);
        });
        
        console.log('\n✨ Sistema DoceGest está pronto para uso!\n');
        
    } catch (error) {
        console.error('\n❌ ERRO FATAL:', error.message);
        console.error('💡 Verifique as configurações do banco de dados no arquivo backend/.env\n');
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Executa a migração
executarMigracao();
