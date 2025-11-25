import mysql from 'mysql2/promise';
import fs from 'fs';

async function corrigirProcedure() {
    const conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'P@$$w0rd',
        database: 'segredodosabor',
        multipleStatements: true
    });

    try {
        console.log('\n========================================');
        console.log('🔧 CORRIGINDO STORED PROCEDURE');
        console.log('========================================\n');

        // Dropar procedure antiga
        await conn.query(`DROP PROCEDURE IF EXISTS sp_buscar_opcoes_produto`);
        console.log('🗑️  Procedure antiga removida\n');

        // Criar nova procedure
        const createProcedure = `
            CREATE PROCEDURE sp_buscar_opcoes_produto(
                IN p_idproduto INT
            )
            BEGIN
                SELECT
                    poa.idopcao_fk AS idopcao,
                    pop.nome_opcao AS nome,
                    pop.descricao,
                    pop.tipo_selecao AS tipo,
                    poa.obrigatorio,
                    CASE
                        WHEN pop.tipo_selecao = 'checkbox' THEN 1
                        ELSE 0
                    END AS multipla_selecao,
                    (
                        SELECT JSON_ARRAYAGG(
                            JSON_OBJECT(
                                'idvalor', ov.idvalor,
                                'nome', ov.nome_valor,
                                'preco', ov.preco_adicional,
                                'ordem', ov.ordem_exibicao
                            )
                        )
                        FROM opcao_valores ov
                        WHERE ov.idopcao_fk = poa.idopcao_fk
                          AND ov.disponivel = 1
                        ORDER BY ov.ordem_exibicao, ov.nome_valor
                    ) AS valores
                FROM produto_opcao_associacao poa
                INNER JOIN produto_opcoes_personalizacao pop ON poa.idopcao_fk = pop.idopcao
                WHERE poa.idproduto_fk = p_idproduto
                  AND pop.ativo = 1
                ORDER BY pop.ordem_exibicao, pop.nome_opcao;
            END
        `;

        await conn.query(createProcedure);
        
        console.log('✅ Procedure sp_buscar_opcoes_produto atualizada!\n');
        console.log('📝 Melhorias aplicadas:');
        console.log('   - Filtra apenas valores com disponivel = 1');
        console.log('   - Filtra apenas opções com ativo = 1');
        console.log('   - Ordena valores por ordem_exibicao\n');

        // Testar
        console.log('🧪 Testando procedure atualizada...\n');
        const [result] = await conn.query(`CALL sp_buscar_opcoes_produto(2)`);
        const opcoes = result[0];

        console.log(`✅ ${opcoes.length} opções retornadas (sem itens indisponíveis):\n`);
        
        opcoes.forEach((opcao, index) => {
            let valores = opcao.valores;
            if (Buffer.isBuffer(valores)) {
                valores = JSON.parse(valores.toString('utf8'));
            } else if (typeof valores === 'string') {
                valores = JSON.parse(valores);
            }

            console.log(`${index + 1}. ${opcao.nome} (${opcao.tipo})`);
            console.log(`   Valores: ${valores ? valores.length : 0} itens\n`);
        });

        console.log('========================================');
        console.log('✅ CORREÇÃO CONCLUÍDA!');
        console.log('========================================\n');

    } catch (error) {
        console.error('❌ Erro:', error.message);
    } finally {
        await conn.end();
    }
}

corrigirProcedure();
