import mysql from 'mysql2/promise';

async function verificarEstrutura() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'P@$$w0rd',
        database: 'segredodosabor'
    });

    console.log('📋 Estrutura da tabela RESERVA:\n');
    
    const [columns] = await connection.execute('DESCRIBE reserva');
    
    columns.forEach(col => {
        console.log(`- ${col.Field} (${col.Type}) ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });

    console.log('\n📋 Estrutura da tabela CLIENTE:\n');
    
    const [clienteColumns] = await connection.execute('DESCRIBE cliente');
    
    clienteColumns.forEach(col => {
        console.log(`- ${col.Field} (${col.Type}) ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });

    await connection.end();
}

verificarEstrutura().catch(console.error);
