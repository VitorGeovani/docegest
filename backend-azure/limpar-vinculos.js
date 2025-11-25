import mysql from 'mysql2/promise';

const c = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'P@$$w0rd',
    database: 'segredodosabor'
});

await c.query('DELETE FROM personalizacao_ingrediente');
console.log('✅ Vínculos removidos. Execute popular-personalizacao-ingredientes.js novamente');
await c.end();
