import mysql from 'mysql2/promise';

async function corrigirProcedure() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'P@$$w0rd',
        database: 'segredodosabor'
    });

    console.log('🔧 Corrigindo procedure sp_buscar_opcoes_produto...');

    await connection.query('DROP PROCEDURE IF EXISTS sp_buscar_opcoes_produto');
    
    await connection.query(`
        CREATE PROCEDURE sp_buscar_opcoes_produto(
            IN p_idproduto INT
        )
        BEGIN
            SELECT 
                poa.idopcao_fk AS idopcao,
                pop.nome_opcao AS nome,
                pop.tipo_selecao AS tipo,
                pop.obrigatorio,
                CASE 
                    WHEN pop.tipo_selecao = 'checkbox' THEN 1
                    ELSE 0
                END AS multipla_selecao,
                (
                    SELECT JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'idvalor', ov.idvalor,
                            'nome', ov.nome_valor,
                            'preco', ov.preco_adicional
                        )
                    )
                    FROM opcao_valores ov
                    WHERE ov.idopcao_fk = poa.idopcao_fk
                ) AS valores
            FROM produto_opcao_associacao poa
            INNER JOIN produto_opcoes_personalizacao pop ON poa.idopcao_fk = pop.idopcao
            WHERE poa.idproduto_fk = p_idproduto
            ORDER BY pop.ordem_exibicao;
        END
    `);

    console.log('✅ Procedure corrigida!');

    // Testar
    console.log('\n🧪 Testando com produto ID 1...');
    const [result] = await connection.query('CALL sp_buscar_opcoes_produto(1)');
    console.log(`   ✅ Retornou ${result[0].length} opções`);
    
    if (result[0].length > 0) {
        console.log('\n📋 Primeira opção:');
        console.log(result[0][0]);
    }

    await connection.end();
}

corrigirProcedure();
