import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carregar variáveis de ambiente
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Configuração do banco
const dbConfig = {
    host: process.env.DB_HOST || process.env.MYSQL_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || process.env.MYSQL_PORT || '3306'),
    user: process.env.DB_USER || process.env.MYSQL_USER || 'root',
    password: process.env.DB_PASSWORD || process.env.MYSQL_PASSWORD || '',
    database: process.env.DB_DATABASE || process.env.MYSQL_DATABASE || 'docegest_db',
    multipleStatements: true
};

console.log('🔧 Configuração do banco:');
console.log(`   Host: ${dbConfig.host}:${dbConfig.port}`);
console.log(`   User: ${dbConfig.user}`);
console.log(`   Database: ${dbConfig.database}`);
console.log(`   Password: ${dbConfig.password ? '***' : '(vazio)'}\n`);

/**
 * Parser inteligente de SQL que remove DELIMITERs e processa blocos
 * Detecta CREATE PROCEDURE/TRIGGER e conta BEGIN/END
 */
function parseSqlComBlocos(sql) {
    const linhas = sql.split('\n');
    const comandos = [];
    let comandoAtual = '';
    let dentroDeBloco = false;
    let profundidadeBEGIN = 0;

    for (let linha of linhas) {
        // Remove comentários SQL
        const linhaSemComentario = linha.replace(/--.*$/, '').trim();
        
        // Ignora linhas vazias ou com apenas comentários
        if (!linhaSemComentario) continue;
        
        // Ignora DELIMITERs
        if (linhaSemComentario.match(/^DELIMITER/i)) continue;

        // Detecta início de bloco (PROCEDURE, FUNCTION, TRIGGER)
        if (linhaSemComentario.match(/^CREATE\s+(PROCEDURE|FUNCTION|TRIGGER)/i)) {
            dentroDeBloco = true;
            profundidadeBEGIN = 0;
        }

        // Conta BEGIN e END para rastrear profundidade
        const beginMatches = linhaSemComentario.match(/\bBEGIN\b/gi);
        const endMatches = linhaSemComentario.match(/\bEND\b/gi);
        
        if (beginMatches) profundidadeBEGIN += beginMatches.length;
        if (endMatches) profundidadeBEGIN -= endMatches.length;

        comandoAtual += linha + '\n';

        // Se estamos em um bloco e chegamos ao END final
        if (dentroDeBloco && profundidadeBEGIN === 0 && endMatches) {
            comandos.push(comandoAtual.trim());
            comandoAtual = '';
            dentroDeBloco = false;
        }
        // Se não estamos em bloco e encontramos ';'
        else if (!dentroDeBloco && linhaSemComentario.endsWith(';')) {
            comandos.push(comandoAtual.trim());
            comandoAtual = '';
        }
    }

    // Adiciona comando pendente
    if (comandoAtual.trim()) {
        comandos.push(comandoAtual.trim());
    }

    return comandos.filter(cmd => cmd.length > 0);
}

async function executarMigracao() {
    let connection;
    
    try {
        console.log('📦 Conectando ao banco de dados...');
        connection = await mysql.createConnection(dbConfig);
        console.log('✅ Conectado com sucesso!\n');

        // Ler arquivo SQL
        const sqlPath = path.resolve(__dirname, '..', 'adicionar-personalizacao-produtos.sql');
        console.log(`📄 Lendo arquivo: ${sqlPath}`);
        
        if (!fs.existsSync(sqlPath)) {
            throw new Error(`Arquivo SQL não encontrado: ${sqlPath}`);
        }

        const sqlContent = fs.readFileSync(sqlPath, 'utf8');
        console.log('✅ Arquivo SQL lido com sucesso!\n');

        // Parse do SQL
        console.log('🔍 Processando comandos SQL...');
        const comandos = parseSqlComBlocos(sqlContent);
        console.log(`✅ ${comandos.length} comandos identificados\n`);

        // Executar comandos
        console.log('🚀 Executando migração...\n');
        let sucessos = 0;
        let erros = 0;

        for (let i = 0; i < comandos.length; i++) {
            const comando = comandos[i];
            const preview = comando.substring(0, 80).replace(/\s+/g, ' ');
            
            try {
                await connection.query(comando);
                console.log(`✅ [${i + 1}/${comandos.length}] ${preview}...`);
                sucessos++;
            } catch (error) {
                console.error(`❌ [${i + 1}/${comandos.length}] Erro: ${error.message}`);
                console.error(`   Comando: ${preview}...`);
                erros++;
            }
        }

        console.log('\n' + '='.repeat(60));
        console.log(`✅ Comandos executados: ${sucessos}`);
        console.log(`❌ Comandos com erro: ${erros}`);
        console.log('='.repeat(60) + '\n');

        // Validação dos objetos criados
        console.log('🔍 Validando objetos criados...\n');

        // Verificar tabelas
        const [tables] = await connection.query(`
            SELECT TABLE_NAME 
            FROM INFORMATION_SCHEMA.TABLES 
            WHERE TABLE_SCHEMA = ? 
            AND TABLE_NAME IN (
                'produto_opcoes_personalizacao',
                'opcao_valores',
                'produto_opcao_associacao',
                'pedido_personalizacoes'
            )
        `, [dbConfig.database]);

        console.log(`📊 Tabelas criadas (${tables.length}/4):`);
        tables.forEach(t => console.log(`   ✅ ${t.TABLE_NAME}`));

        // Verificar procedures
        const [procedures] = await connection.query(`
            SELECT ROUTINE_NAME 
            FROM INFORMATION_SCHEMA.ROUTINES 
            WHERE ROUTINE_SCHEMA = ? 
            AND ROUTINE_TYPE = 'PROCEDURE'
            AND ROUTINE_NAME IN (
                'sp_buscar_opcoes_produto',
                'sp_calcular_acrescimo_personalizacao',
                'sp_salvar_personalizacao_pedido'
            )
        `, [dbConfig.database]);

        console.log(`\n⚙️  Stored Procedures criadas (${procedures.length}/3):`);
        procedures.forEach(p => console.log(`   ✅ ${p.ROUTINE_NAME}`));

        // Verificar views
        const [views] = await connection.query(`
            SELECT TABLE_NAME 
            FROM INFORMATION_SCHEMA.VIEWS 
            WHERE TABLE_SCHEMA = ? 
            AND TABLE_NAME IN (
                'vw_opcoes_personalizacao_completas',
                'vw_relatorio_personalizacoes'
            )
        `, [dbConfig.database]);

        console.log(`\n👁️  Views criadas (${views.length}/2):`);
        views.forEach(v => console.log(`   ✅ ${v.TABLE_NAME}`));

        // Verificar triggers
        const [triggers] = await connection.query(`
            SELECT TRIGGER_NAME 
            FROM INFORMATION_SCHEMA.TRIGGERS 
            WHERE TRIGGER_SCHEMA = ? 
            AND TRIGGER_NAME = 'trg_atualizar_valor_com_personalizacao'
        `, [dbConfig.database]);

        console.log(`\n⚡ Triggers criados (${triggers.length}/1):`);
        triggers.forEach(t => console.log(`   ✅ ${t.TRIGGER_NAME}`));

        // Verificar dados de exemplo
        const [opcoesCount] = await connection.query(`
            SELECT COUNT(*) as total 
            FROM produto_opcoes_personalizacao
        `);

        const [valoresCount] = await connection.query(`
            SELECT COUNT(*) as total 
            FROM opcao_valores
        `);

        console.log(`\n📦 Dados de exemplo inseridos:`);
        console.log(`   ✅ ${opcoesCount[0].total} opções de personalização`);
        console.log(`   ✅ ${valoresCount[0].total} valores de opções`);

        console.log('\n' + '='.repeat(60));
        console.log('🎉 MIGRAÇÃO RF052 + RF053 CONCLUÍDA COM SUCESSO!');
        console.log('='.repeat(60) + '\n');

        console.log('📋 Próximos passos:');
        console.log('   1. Teste os endpoints da API via Postman');
        console.log('   2. Implemente o frontend de gerenciamento (admin)');
        console.log('   3. Implemente o seletor de personalização (cliente)');
        console.log('   4. Teste o fluxo completo de personalização\n');

    } catch (error) {
        console.error('\n❌ ERRO NA MIGRAÇÃO:');
        console.error(error);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
            console.log('🔌 Conexão encerrada.\n');
        }
    }
}

// Executar
executarMigracao();
