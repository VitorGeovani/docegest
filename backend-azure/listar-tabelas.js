import mysql from 'mysql2/promise';

async function listarTabelas() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'P@$$w0rd',
        database: 'segredodosabor'
    });

    console.log('📋 Tabelas do banco segredodosabor:\n');
    const [tables] = await connection.query('SHOW TABLES');
    
    tables.forEach((t, i) => {
        const tableName = Object.values(t)[0];
        console.log(`${i + 1}. ${tableName}`);
    });

    // Buscar tabela que contém "produto"
    console.log('\n🔍 Tabelas com "produto" no nome:');
    const produtoTables = tables.filter(t => {
        const name = Object.values(t)[0].toLowerCase();
        return name.includes('produto');
    });

    produtoTables.forEach(t => {
        const tableName = Object.values(t)[0];
        console.log(`   - ${tableName}`);
    });

    await connection.end();
}

listarTabelas();
