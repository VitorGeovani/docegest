import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function verificarEstrutura() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
    });

    try {
        console.log('🔍 Verificando estrutura da tabela cliente...\n');

        // Verificar estrutura da tabela cliente
        const [columns] = await connection.query('DESCRIBE cliente');
        console.log('📋 ESTRUTURA DA TABELA CLIENTE:');
        console.table(columns);

        // Buscar o telefone mais longo
        const [longest] = await connection.query(`
            SELECT telefone, LENGTH(telefone) as tamanho 
            FROM cliente 
            ORDER BY LENGTH(telefone) DESC 
            LIMIT 5
        `);
        console.log('\n📱 TELEFONES MAIS LONGOS NO BANCO:');
        console.table(longest);

        // Buscar clientes recentes
        const [recent] = await connection.query(`
            SELECT idcliente, nome, telefone, LENGTH(telefone) as tamanho_telefone
            FROM cliente 
            ORDER BY idcliente DESC 
            LIMIT 5
        `);
        console.log('\n👥 CLIENTES RECENTES:');
        console.table(recent);

    } catch (error) {
        console.error('❌ Erro:', error.message);
    } finally {
        await connection.end();
    }
}

verificarEstrutura();
