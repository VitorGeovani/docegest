import mysql from 'mysql2/promise';

async function verificar() {
    const conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'P@$$w0rd',
        database: 'segredodosabor'
    });
    
    const [vela] = await conn.query("SELECT * FROM opcao_valores WHERE nome_valor LIKE '%vela%'");
    
    console.log('\n🎂 Vela de Aniversário:');
    console.log(JSON.stringify(vela, null, 2));
    
    await conn.end();
}

verificar();
