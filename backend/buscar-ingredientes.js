import mysql from 'mysql2/promise';

const c = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'P@$$w0rd',
    database: 'segredodosabor'
});

const [r] = await c.query(`
    SELECT nome FROM ingrediente 
    WHERE nome LIKE '%chocol%' OR nome LIKE '%moran%' OR nome LIKE '%manteig%'
    ORDER BY nome
`);

console.log('Ingredientes encontrados:');
r.forEach(i => console.log(`  - ${i.nome}`));

await c.end();
