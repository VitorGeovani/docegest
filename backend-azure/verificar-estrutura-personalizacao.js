// Verificar estrutura das tabelas de personalização
import mysql from 'mysql2/promise';

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'P@$$w0rd',
    database: 'segredodosabor'
};

async function verificarEstruturas() {
    const connection = await mysql.createConnection(dbConfig);
    
    try {
        console.log('\n📋 ESTRUTURA: produto_opcoes_personalizacao');
        const [estrutura1] = await connection.query('DESCRIBE produto_opcoes_personalizacao');
        estrutura1.forEach(c => console.log(`  ${c.Field} (${c.Type})`));
        
        console.log('\n📋 ESTRUTURA: opcao_valores');
        const [estrutura2] = await connection.query('DESCRIBE opcao_valores');
        estrutura2.forEach(c => console.log(`  ${c.Field} (${c.Type})`));
        
        console.log('\n📋 ESTRUTURA: personalizacao_ingrediente');
        const [estrutura3] = await connection.query('DESCRIBE personalizacao_ingrediente');
        estrutura3.forEach(c => console.log(`  ${c.Field} (${c.Type})`));
        
        console.log('\n📊 DADOS: produto_opcoes_personalizacao');
        const [dados1] = await connection.query('SELECT * FROM produto_opcoes_personalizacao LIMIT 5');
        console.log(JSON.stringify(dados1, null, 2));
        
        console.log('\n📊 DADOS: opcao_valores');
        const [dados2] = await connection.query('SELECT * FROM opcao_valores LIMIT 10');
        console.log(JSON.stringify(dados2, null, 2));
        
    } catch (error) {
        console.error('❌ Erro:', error.message);
    } finally {
        await connection.end();
    }
}

verificarEstruturas();
