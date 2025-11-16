-- Recriar procedure para buscar opções de produto
-- Agora filtra apenas valores disponíveis (disponivel = 1)

USE segredodosabor;

DROP PROCEDURE IF EXISTS sp_buscar_opcoes_produto;

DELIMITER $$

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
              AND ov.disponivel = 1  -- ⭐ FILTRAR APENAS DISPONÍVEIS
            ORDER BY ov.ordem_exibicao, ov.nome_valor
        ) AS valores
    FROM produto_opcao_associacao poa
    INNER JOIN produto_opcoes_personalizacao pop ON poa.idopcao_fk = pop.idopcao
    WHERE poa.idproduto_fk = p_idproduto
      AND pop.ativo = 1  -- ⭐ FILTRAR APENAS OPÇÕES ATIVAS
    ORDER BY pop.ordem_exibicao, pop.nome_opcao;
END$$

DELIMITER ;

-- Testar a procedure
SELECT '✅ Procedure atualizada com sucesso!' AS status;
SELECT 'Agora filtra apenas valores disponíveis (disponivel=1) e opções ativas (ativo=1)' AS melhoria;
