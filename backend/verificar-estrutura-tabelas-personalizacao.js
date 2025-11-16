import mysql from 'mysql2/promise';

async function verificarEstrutura() {
    const conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'P@$$w0rd',
        database: 'segredodosabor'
    });

    try {
        console.log('\n=== ESTRUTURA opcao_valores ===');
        const [structureValores] = await conn.query("DESCRIBE opcao_valores");
        console.table(structureValores);

        console.log('\n=== ESTRUTURA personalizacao_produto ===');
        const [structurePP] = await conn.query("DESCRIBE personalizacao_produto");
        console.table(structurePP);

        console.log('\n=== ESTRUTURA produto_opcoes_personalizacao ===');
        const [structurePOP] = await conn.query("DESCRIBE produto_opcoes_personalizacao");
        console.table(structurePOP);

    } catch (error) {
        console.error('Erro:', error.message);
    } finally {
        await conn.end();
    }
}

verificarEstrutura();
