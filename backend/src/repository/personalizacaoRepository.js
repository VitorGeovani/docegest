import pool from './connection.js';

/**
 * RF052 + RF053: Repository para Personalização de Produtos
 * Gerencia opções de personalização e cálculo de acréscimos
 */

// ==================== OPÇÕES DE PERSONALIZAÇÃO ====================

/**
 * Listar todas as opções de personalização ativas
 */
export async function listarOpcoes() {
    const comando = `
        SELECT 
            idopcao,
            nome_opcao,
            descricao,
            tipo_selecao,
            obrigatorio,
            ativo,
            ordem_exibicao,
            data_criacao,
            data_atualizacao
        FROM produto_opcoes_personalizacao
        WHERE ativo = TRUE
        ORDER BY ordem_exibicao, nome_opcao
    `;
    
    const [registros] = await pool.query(comando);
    return registros;
}

/**
 * Buscar opção por ID
 */
export async function buscarOpcaoPorId(idopcao) {
    const comando = `
        SELECT 
            idopcao,
            nome_opcao,
            descricao,
            tipo_selecao,
            obrigatorio,
            ativo,
            ordem_exibicao
        FROM produto_opcoes_personalizacao
        WHERE idopcao = ?
    `;
    
    const [registros] = await pool.query(comando, [idopcao]);
    return registros[0];
}

/**
 * Criar nova opção de personalização
 */
export async function criarOpcao(opcao) {
    const comando = `
        INSERT INTO produto_opcoes_personalizacao (
            nome_opcao,
            descricao,
            tipo_selecao,
            obrigatorio,
            ordem_exibicao
        ) VALUES (?, ?, ?, ?, ?)
    `;
    
    const [resultado] = await pool.query(comando, [
        opcao.nome_opcao,
        opcao.descricao,
        opcao.tipo_selecao || 'radio',
        opcao.obrigatorio || false,
        opcao.ordem_exibicao || 0
    ]);
    
    return resultado.insertId;
}

/**
 * Atualizar opção de personalização
 */
export async function atualizarOpcao(idopcao, opcao) {
    const comando = `
        UPDATE produto_opcoes_personalizacao
        SET nome_opcao = ?,
            descricao = ?,
            tipo_selecao = ?,
            obrigatorio = ?,
            ordem_exibicao = ?
        WHERE idopcao = ?
    `;
    
    const [resultado] = await pool.query(comando, [
        opcao.nome_opcao,
        opcao.descricao,
        opcao.tipo_selecao,
        opcao.obrigatorio,
        opcao.ordem_exibicao,
        idopcao
    ]);
    
    return resultado.affectedRows > 0;
}

/**
 * Desativar opção (soft delete)
 */
export async function desativarOpcao(idopcao) {
    const comando = `
        UPDATE produto_opcoes_personalizacao
        SET ativo = FALSE
        WHERE idopcao = ?
    `;
    
    const [resultado] = await pool.query(comando, [idopcao]);
    return resultado.affectedRows > 0;
}

// ==================== VALORES DAS OPÇÕES ====================

/**
 * Listar valores de uma opção
 */
export async function listarValoresOpcao(idopcao) {
    const comando = `
        SELECT 
            idvalor,
            idopcao_fk,
            nome_valor,
            preco_adicional,
            disponivel,
            ordem_exibicao
        FROM opcao_valores
        WHERE idopcao_fk = ?
        AND disponivel = TRUE
        ORDER BY ordem_exibicao, nome_valor
    `;
    
    const [registros] = await pool.query(comando, [idopcao]);
    return registros;
}

/**
 * Criar valor para opção
 */
export async function criarValorOpcao(valor) {
    const comando = `
        INSERT INTO opcao_valores (
            idopcao_fk,
            nome_valor,
            preco_adicional,
            ordem_exibicao
        ) VALUES (?, ?, ?, ?)
    `;
    
    const [resultado] = await pool.query(comando, [
        valor.idopcao_fk,
        valor.nome_valor,
        valor.preco_adicional || 0.00,
        valor.ordem_exibicao || 0
    ]);
    
    return resultado.insertId;
}

/**
 * Atualizar valor de opção
 */
export async function atualizarValorOpcao(idvalor, valor) {
    const comando = `
        UPDATE opcao_valores
        SET nome_valor = ?,
            preco_adicional = ?,
            ordem_exibicao = ?
        WHERE idvalor = ?
    `;
    
    const [resultado] = await pool.query(comando, [
        valor.nome_valor,
        valor.preco_adicional,
        valor.ordem_exibicao,
        idvalor
    ]);
    
    return resultado.affectedRows > 0;
}

/**
 * Desativar valor (soft delete)
 */
export async function desativarValorOpcao(idvalor) {
    const comando = `
        UPDATE opcao_valores
        SET disponivel = FALSE
        WHERE idvalor = ?
    `;
    
    const [resultado] = await pool.query(comando, [idvalor]);
    return resultado.affectedRows > 0;
}

// ==================== ASSOCIAÇÃO PRODUTO-OPÇÃO ====================

/**
 * Buscar opções de um produto (RF052)
 */
export async function buscarOpcoesProduto(idproduto) {
    const comando = `CALL sp_buscar_opcoes_produto(?)`;
    
    const [result] = await pool.query(comando, [idproduto]);
    const opcoes = result[0];
    
    // Converter valores se necessário
    return opcoes.map(opcao => {
        let valores = opcao.valores || [];
        
        // Se for Buffer, converter para string e fazer parse
        if (Buffer.isBuffer(valores)) {
            valores = JSON.parse(valores.toString('utf8'));
        }
        // Se for string, fazer parse
        else if (typeof valores === 'string') {
            valores = JSON.parse(valores);
        }
        // Se já é array ou null, usar diretamente
        
        return {
            ...opcao,
            valores: valores || []
        };
    });
}

/**
 * Associar opção a produto
 */
export async function associarOpcaoProduto(idproduto, idopcao, obrigatorio = false) {
    const comando = `
        INSERT INTO produto_opcao_associacao (
            idproduto_fk,
            idopcao_fk,
            obrigatorio
        ) VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE obrigatorio = VALUES(obrigatorio)
    `;
    
    const [resultado] = await pool.query(comando, [
        idproduto,
        idopcao,
        obrigatorio
    ]);
    
    return resultado.affectedRows > 0;
}

/**
 * Remover associação produto-opção
 */
export async function removerAssociacaoProdutoOpcao(idproduto, idopcao) {
    const comando = `
        DELETE FROM produto_opcao_associacao
        WHERE idproduto_fk = ?
        AND idopcao_fk = ?
    `;
    
    const [resultado] = await pool.query(comando, [idproduto, idopcao]);
    return resultado.affectedRows > 0;
}

/**
 * Listar produtos com opções
 */
export async function listarProdutosComOpcoes() {
    const comando = `
        SELECT * FROM vw_produtos_com_opcoes
        ORDER BY produto_nome, nome_opcao
    `;
    
    const [registros] = await pool.query(comando);
    return registros;
}

// ==================== PERSONALIZAÇÃO DE PEDIDOS ====================

/**
 * Salvar personalização do pedido (RF052 + RF053)
 */
export async function salvarPersonalizacaoPedido(idreserva, idproduto, personalizacoes) {
    const comando = `CALL sp_salvar_personalizacao_pedido(?, ?, ?)`;
    
    const personalizacoesJson = JSON.stringify(personalizacoes);
    
    const [result] = await pool.query(comando, [
        idreserva,
        idproduto,
        personalizacoesJson
    ]);
    
    return result[0][0];
}

/**
 * Buscar personalizações de um pedido
 */
export async function buscarPersonalizacoesPedido(idreserva) {
    const comando = `
        SELECT 
            id,
            idproduto_fk,
            personalizacoes,
            valor_acrescimo,
            data_criacao
        FROM pedido_personalizacoes
        WHERE idreserva_fk = ?
    `;
    
    const [registros] = await pool.query(comando, [idreserva]);
    
    // Parse do JSON de personalizações
    return registros.map(reg => ({
        ...reg,
        personalizacoes: JSON.parse(reg.personalizacoes)
    }));
}

/**
 * Calcular acréscimo de personalização (RF053)
 */
export async function calcularAcrescimoPersonalizacao(personalizacoes) {
    // Calcular somando os preços dos valores selecionados
    if (!Array.isArray(personalizacoes) || personalizacoes.length === 0) {
        return 0.00;
    }
    
    const ids = personalizacoes.map(p => p.idvalor).join(',');
    
    const comando = `
        SELECT COALESCE(SUM(preco_adicional), 0) AS valor_acrescimo
        FROM opcao_valores
        WHERE idvalor IN (${ids})
          AND disponivel = 1
    `;
    
    const [rows] = await pool.query(comando);
    
    return parseFloat(rows[0].valor_acrescimo || 0);
}

/**
 * Relatório de personalizações
 */
export async function relatorioPersonalizacoes(filtros = {}) {
    let comando = `
        SELECT * FROM vw_relatorio_personalizacoes
        WHERE 1=1
    `;
    
    const params = [];
    
    if (filtros.data_inicio) {
        comando += ` AND data_entrega >= ?`;
        params.push(filtros.data_inicio);
    }
    
    if (filtros.data_fim) {
        comando += ` AND data_entrega <= ?`;
        params.push(filtros.data_fim);
    }
    
    if (filtros.idproduto) {
        comando += ` AND idproduto = ?`;
        params.push(filtros.idproduto);
    }
    
    comando += ` ORDER BY data_personalizacao DESC`;
    
    if (filtros.limit) {
        comando += ` LIMIT ?`;
        params.push(parseInt(filtros.limit));
    }
    
    const [registros] = await pool.query(comando, params);
    
    // Parse do JSON de personalizações
    return registros.map(reg => ({
        ...reg,
        personalizacoes: JSON.parse(reg.personalizacoes)
    }));
}

// ==================== VÍNCULO PERSONALIZAÇÃO-INGREDIENTE ====================

/**
 * Vincular valor de personalização a ingrediente
 */
export async function vincularValorIngrediente(idvalor, idingrediente, quantidadeUsada) {
    const comando = `
        INSERT INTO personalizacao_ingrediente (
            idvalor_fk,
            idingrediente_fk,
            quantidade_usada
        ) VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE quantidade_usada = VALUES(quantidade_usada)
    `;
    
    const [resultado] = await pool.query(comando, [
        idvalor,
        idingrediente,
        quantidadeUsada
    ]);
    
    return resultado.affectedRows > 0;
}

/**
 * Remover vínculo valor-ingrediente
 */
export async function removerVinculoValorIngrediente(idvalor, idingrediente) {
    const comando = `
        DELETE FROM personalizacao_ingrediente
        WHERE idvalor_fk = ? AND idingrediente_fk = ?
    `;
    
    const [resultado] = await pool.query(comando, [idvalor, idingrediente]);
    return resultado.affectedRows > 0;
}

/**
 * Listar ingredientes de um valor de personalização
 */
export async function listarIngredientesValor(idvalor) {
    const comando = `
        SELECT 
            pi.id,
            pi.quantidade_usada,
            i.idingrediente,
            i.nome AS ingrediente_nome,
            i.unidade_medida,
            i.quantidade_estoque,
            i.estoque_minimo,
            CASE 
                WHEN i.quantidade_estoque < pi.quantidade_usada THEN 'INDISPONÍVEL'
                WHEN i.quantidade_estoque < (pi.quantidade_usada * 5) THEN 'ESTOQUE BAIXO'
                ELSE 'DISPONÍVEL'
            END AS status_estoque
        FROM personalizacao_ingrediente pi
        INNER JOIN ingrediente i ON pi.idingrediente_fk = i.idingrediente
        WHERE pi.idvalor_fk = ?
    `;
    
    const [registros] = await pool.query(comando, [idvalor]);
    return registros;
}

/**
 * Verificar disponibilidade de personalização baseado no estoque
 */
export async function verificarDisponibilidadePersonalizacao(idvalor) {
    const comando = `
        SELECT 
            v.idvalor,
            v.nome_valor,
            o.nome_opcao,
            CASE 
                WHEN COUNT(pi.id) = 0 THEN TRUE
                WHEN COUNT(pi.id) = SUM(CASE WHEN i.quantidade_estoque >= pi.quantidade_usada THEN 1 ELSE 0 END) THEN TRUE
                ELSE FALSE
            END AS disponivel,
            GROUP_CONCAT(
                CASE 
                    WHEN i.quantidade_estoque < pi.quantidade_usada 
                    THEN CONCAT(i.nome, ' (falta ', ROUND(pi.quantidade_usada - i.quantidade_estoque, 2), ' ', i.unidade_medida, ')')
                    ELSE NULL
                END 
                SEPARATOR ', '
            ) AS ingredientes_faltando
        FROM opcao_valores v
        INNER JOIN produto_opcoes_personalizacao o ON v.idopcao_fk = o.idopcao
        LEFT JOIN personalizacao_ingrediente pi ON v.idvalor = pi.idvalor_fk
        LEFT JOIN ingrediente i ON pi.idingrediente_fk = i.idingrediente
        WHERE v.idvalor = ?
        GROUP BY v.idvalor, v.nome_valor, o.nome_opcao
    `;
    
    const [registros] = await pool.query(comando, [idvalor]);
    return registros[0];
}

/**
 * Dar baixa nos ingredientes usados em personalizações
 */
export async function darBaixaIngredientesPersonalizacao(personalizacoes, idreserva, usuario = 'Sistema') {
    if (!Array.isArray(personalizacoes) || personalizacoes.length === 0) {
        return { sucesso: true, ingredientes_atualizados: 0 };
    }

    const connection_obj = await connection.getConnection();
    
    try {
        await connection_obj.beginTransaction();
        
        let ingredientesAtualizados = 0;
        
        for (const pers of personalizacoes) {
            // Buscar ingredientes vinculados a este valor
            const [ingredientes] = await connection_obj.query(`
                SELECT 
                    pi.idingrediente_fk,
                    pi.quantidade_usada,
                    i.nome,
                    i.unidade_medida,
                    i.quantidade_estoque
                FROM personalizacao_ingrediente pi
                INNER JOIN ingrediente i ON pi.idingrediente_fk = i.idingrediente
                WHERE pi.idvalor_fk = ?
            `, [pers.idvalor]);
            
            for (const ing of ingredientes) {
                // Verificar se há estoque suficiente
                if (ing.quantidade_estoque < ing.quantidade_usada) {
                    throw new Error(`Estoque insuficiente de ${ing.nome}. Disponível: ${ing.quantidade_estoque} ${ing.unidade_medida}, Necessário: ${ing.quantidade_usada} ${ing.unidade_medida}`);
                }
                
                // Dar baixa no estoque
                await connection_obj.query(`
                    UPDATE ingrediente 
                    SET quantidade_estoque = quantidade_estoque - ?
                    WHERE idingrediente = ?
                `, [ing.quantidade_usada, ing.idingrediente_fk]);
                
                // Registrar movimentação
                await connection_obj.query(`
                    INSERT INTO movimentacao_estoque (
                        idingrediente,
                        tipo,
                        quantidade,
                        motivo,
                        idreserva,
                        usuario
                    ) VALUES (?, 'SAIDA', ?, ?, ?, ?)
                `, [
                    ing.idingrediente_fk,
                    ing.quantidade_usada,
                    `Personalização: ${pers.nome_valor || 'Item personalizado'}`,
                    idreserva,
                    usuario
                ]);
                
                ingredientesAtualizados++;
            }
        }
        
        await connection_obj.commit();
        
        return {
            sucesso: true,
            ingredientes_atualizados: ingredientesAtualizados
        };
        
    } catch (error) {
        await connection_obj.rollback();
        throw error;
    } finally {
        connection_obj.release();
    }
}

// ==================== VIEW COMPLETA ====================

/**
 * Listar opções completas com valores (para admin)
 */
export async function listarOpcoesCompletas() {
    const comando = `
        SELECT * FROM vw_opcoes_personalizacao_completas
        ORDER BY opcao_ordem, valor_ordem
    `;
    
    const [registros] = await pool.query(comando);
    
    // Agrupar valores por opção
    const opcoesMap = new Map();
    
    registros.forEach(reg => {
        if (!opcoesMap.has(reg.idopcao)) {
            opcoesMap.set(reg.idopcao, {
                idopcao: reg.idopcao,
                nome_opcao: reg.nome_opcao,
                descricao: reg.opcao_descricao,
                tipo_selecao: reg.tipo_selecao,
                obrigatorio: reg.obrigatorio,
                ativo: reg.opcao_ativa,
                ordem_exibicao: reg.opcao_ordem,
                valores: []
            });
        }
        
        if (reg.idvalor) {
            opcoesMap.get(reg.idopcao).valores.push({
                idvalor: reg.idvalor,
                nome_valor: reg.nome_valor,
                preco_adicional: parseFloat(reg.preco_adicional),
                disponivel: reg.valor_disponivel,
                ordem_exibicao: reg.valor_ordem
            });
        }
    });
    
    return Array.from(opcoesMap.values());
}

export default {
    // Opções
    listarOpcoes,
    buscarOpcaoPorId,
    criarOpcao,
    atualizarOpcao,
    desativarOpcao,
    listarOpcoesCompletas,
    
    // Valores
    listarValoresOpcao,
    criarValorOpcao,
    atualizarValorOpcao,
    desativarValorOpcao,
    
    // Associações
    buscarOpcoesProduto,
    associarOpcaoProduto,
    removerAssociacaoProdutoOpcao,
    listarProdutosComOpcoes,
    
    // Personalizações de pedidos
    salvarPersonalizacaoPedido,
    buscarPersonalizacoesPedido,
    calcularAcrescimoPersonalizacao,
    relatorioPersonalizacoes,
    
    // Vínculos com ingredientes
    vincularValorIngrediente,
    removerVinculoValorIngrediente,
    listarIngredientesValor,
    verificarDisponibilidadePersonalizacao,
    darBaixaIngredientesPersonalizacao
};
