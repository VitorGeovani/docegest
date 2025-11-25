import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'P@$$w0rd',
    database: 'segredodosabor',
    multipleStatements: true
};

async function executarMigracaoLimpa() {
    let connection;
    
    try {
        console.log('🔄 Conectando ao banco de dados...');
        connection = await mysql.createConnection(dbConfig);
        console.log('✅ Conectado!\n');

        // Limpar dados existentes
        console.log('🧹 Limpando dados existentes...');
        await connection.query('DROP TABLE IF EXISTS personalizacao_ingrediente');
        await connection.query('DROP VIEW IF EXISTS vw_personalizacao_com_ingredientes');
        await connection.query('DROP VIEW IF EXISTS vw_disponibilidade_personalizacao');
        await connection.query('DROP PROCEDURE IF EXISTS sp_verificar_disponibilidade_personalizacao');
        console.log('✅ Limpeza concluída!\n');

        // Ler e executar SQL
        const sqlPath = path.join(__dirname, '..', 'vincular-personalizacao-ingredientes.sql');
        console.log('📄 Executando migração...');
        const sqlContent = fs.readFileSync(sqlPath, 'utf8');
        await connection.query(sqlContent);
        console.log('✅ Migração executada!\n');

        // Verificar
        const [count] = await connection.query('SELECT COUNT(*) as total FROM personalizacao_ingrediente');
        console.log(`✅ Vínculos criados: ${count[0].total}\n`);

        const [examples] = await connection.query(`
            SELECT 
                o.nome_opcao,
                v.nome_valor,
                i.nome AS ingrediente,
                pi.quantidade_usada,
                i.unidade_medida
            FROM personalizacao_ingrediente pi
            INNER JOIN opcao_valores v ON pi.idvalor_fk = v.idvalor
            INNER JOIN produto_opcoes_personalizacao o ON v.idopcao_fk = o.idopcao
            INNER JOIN ingrediente i ON pi.idingrediente_fk = i.idingrediente
            LIMIT 5
        `);
        
        console.log('📊 Exemplos criados:');
        examples.forEach(ex => {
            console.log(`   ${ex.nome_opcao} → ${ex.nome_valor}: ${ex.ingrediente} (${ex.quantidade_usada}${ex.unidade_medida})`);
        });
        
        console.log('\n✅ SUCESSO! Migração concluída.\n');

    } catch (error) {
        console.error('\n❌ ERRO:', error.message);
        process.exit(1);
    } finally {
        if (connection) await connection.end();
    }
}

executarMigracaoLimpa();
