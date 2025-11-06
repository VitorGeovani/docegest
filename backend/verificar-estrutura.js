import mysql from 'mysql2/promise';

async function verificar() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'P@$$w0rd',
        database: 'segredodosabor'
    });

    console.log('📊 Estrutura da tabela produto_opcoes_personalizacao:\n');
    const [columns] = await connection.query('DESC produto_opcoes_personalizacao');
    console.table(columns);

    console.log('\n📊 Dados atuais:\n');
    const [data] = await connection.query('SELECT * FROM produto_opcoes_personalizacao LIMIT 5');
    console.table(data);

    await connection.end();
}

verificar();
