import mysql from 'mysql2/promise';

async function verificarEstrutura() {
    const conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'P@$$w0rd',
        database: 'segredodosabor'
    });

    try {
        // Verificar tabelas de personalização
        console.log('\n=== TABELAS DE PERSONALIZAÇÃO ===');
        const [tables] = await conn.query("SHOW TABLES LIKE '%personalizacao%'");
        console.log('Tabelas encontradas:', tables);

        // Estrutura da tabela personalizacao_ingrediente
        console.log('\n=== ESTRUTURA personalizacao_ingrediente ===');
        const [structure] = await conn.query("DESCRIBE personalizacao_ingrediente");
        console.log(structure);

        // Dados de exemplo
        console.log('\n=== DADOS DE EXEMPLO ===');
        const [dados] = await conn.query(`
            SELECT 
                pi.*,
                v.nome_valor,
                i.nome as nome_ingrediente,
                i.quantidade_estoque
            FROM personalizacao_ingrediente pi
            LEFT JOIN opcao_valores v ON pi.idvalor_fk = v.idvalor
            LEFT JOIN ingrediente i ON pi.idingrediente_fk = i.idingrediente
            LIMIT 10
        `);
        console.log('Registros:', JSON.stringify(dados, null, 2));

    } catch (error) {
        console.error('Erro:', error.message);
    } finally {
        await conn.end();
    }
}

verificarEstrutura();
