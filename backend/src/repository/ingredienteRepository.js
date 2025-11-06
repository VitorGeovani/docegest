import connection from './connection.js';

/**
 * Lista todos os ingredientes
 */
export async function listarIngredientes() {
    const comando = `
        SELECT 
            idingrediente AS id,
            nome,
            unidade_medida AS unidadeMedida,
            preco_unitario AS precoUnitario,
            quantidade_estoque AS quantidadeEstoque,
            estoque_minimo AS estoqueMinimo,
            fornecedor,
            ativo,
            data_cadastro AS dataCadastro
        FROM ingrediente
        WHERE ativo = 1
        ORDER BY nome;
    `;
    
    const [registros] = await connection.query(comando);
    return registros;
}

/**
 * Busca ingrediente por ID
 */
export async function buscarIngredientePorId(id) {
    const comando = `
        SELECT 
            idingrediente AS id,
            nome,
            unidade_medida AS unidadeMedida,
            preco_unitario AS precoUnitario,
            quantidade_estoque AS quantidadeEstoque,
            estoque_minimo AS estoqueMinimo,
            fornecedor,
            ativo
        FROM ingrediente
        WHERE idingrediente = ?;
    `;
    
    const [registros] = await connection.query(comando, [id]);
    return registros[0];
}

/**
 * Insere novo ingrediente
 */
export async function inserirIngrediente(ingrediente) {
    const comando = `
        INSERT INTO ingrediente (
            nome,
            unidade_medida,
            preco_unitario,
            quantidade_estoque,
            estoque_minimo,
            fornecedor
        ) VALUES (?, ?, ?, ?, ?, ?);
    `;
    
    const [info] = await connection.query(comando, [
        ingrediente.nome,
        ingrediente.unidadeMedida,
        ingrediente.precoUnitario,
        ingrediente.quantidadeEstoque || 0,
        ingrediente.estoqueMinimo || 0,
        ingrediente.fornecedor
    ]);
    
    return info.insertId;
}

/**
 * Atualiza ingrediente
 */
export async function alterarIngrediente(id, ingrediente) {
    const comando = `
        UPDATE ingrediente 
        SET 
            nome = ?,
            unidade_medida = ?,
            preco_unitario = ?,
            quantidade_estoque = ?,
            estoque_minimo = ?,
            fornecedor = ?
        WHERE idingrediente = ?;
    `;
    
    const [info] = await connection.query(comando, [
        ingrediente.nome,
        ingrediente.unidadeMedida,
        ingrediente.precoUnitario,
        ingrediente.quantidadeEstoque,
        ingrediente.estoqueMinimo,
        ingrediente.fornecedor,
        id
    ]);
    
    return info.affectedRows;
}

/**
 * Remove (desativa) ingrediente
 */
export async function removerIngrediente(id) {
    const comando = `
        UPDATE ingrediente 
        SET ativo = 0
        WHERE idingrediente = ?;
    `;
    
    const [info] = await connection.query(comando, [id]);
    return info.affectedRows;
}

/**
 * Lista ingredientes com estoque baixo
 */
export async function listarIngredientesEstoqueBaixo() {
    const comando = `
        SELECT 
            i.idingrediente,
            i.nome,
            i.preco_unitario,
            i.quantidade_estoque,
            i.estoque_minimo,
            i.unidade_medida,
            i.fornecedor,
            GREATEST(0, i.estoque_minimo - i.quantidade_estoque) AS quantidade_necessaria,
            CASE 
                WHEN i.quantidade_estoque = 0 THEN 'SEM ESTOQUE'
                WHEN i.quantidade_estoque <= i.estoque_minimo THEN 'COMPRAR URGENTE'
                WHEN i.quantidade_estoque <= (i.estoque_minimo * 1.5) THEN 'COMPRAR EM BREVE'
                ELSE 'ESTOQUE OK'
            END AS status
        FROM ingrediente i
        WHERE i.quantidade_estoque <= i.estoque_minimo
        ORDER BY i.quantidade_estoque ASC;
    `;
    
    const [registros] = await connection.query(comando);
    return registros;
}

/**
 * Registra movimentação de estoque
 */
export async function registrarMovimentacao(movimentacao) {
    const comando = `
        INSERT INTO movimentacao_estoque (
            idingrediente,
            tipo,
            quantidade,
            valor_unitario,
            motivo,
            idreserva,
            usuario
        ) VALUES (?, ?, ?, ?, ?, ?, ?);
    `;
    
    const [info] = await connection.query(comando, [
        movimentacao.idIngrediente,
        movimentacao.tipo,
        movimentacao.quantidade,
        movimentacao.valorUnitario,
        movimentacao.motivo,
        movimentacao.idReserva || null,
        movimentacao.usuario || 'Sistema'
    ]);
    
    // Atualiza estoque do ingrediente
    const comandoUpdate = `
        UPDATE ingrediente 
        SET quantidade_estoque = quantidade_estoque + ?
        WHERE idingrediente = ?;
    `;
    
    const fator = movimentacao.tipo === 'ENTRADA' ? 1 : -1;
    await connection.query(comandoUpdate, [
        movimentacao.quantidade * fator,
        movimentacao.idIngrediente
    ]);
    
    return info.insertId;
}

/**
 * Lista histórico de movimentações
 */
export async function listarMovimentacoes(filtros = {}) {
    let comando = `
        SELECT 
            m.idmovimentacao AS id,
            m.idingrediente AS idIngrediente,
            i.nome AS nomeIngrediente,
            m.tipo,
            m.quantidade,
            m.valor_unitario AS valorUnitario,
            m.motivo,
            m.data_movimentacao AS dataMovimentacao,
            m.usuario
        FROM movimentacao_estoque m
        INNER JOIN ingrediente i ON m.idingrediente = i.idingrediente
        WHERE 1=1
    `;
    
    const params = [];
    
    if (filtros.idIngrediente) {
        comando += ` AND m.idingrediente = ?`;
        params.push(filtros.idIngrediente);
    }
    
    if (filtros.tipo) {
        comando += ` AND m.tipo = ?`;
        params.push(filtros.tipo);
    }
    
    if (filtros.dataInicio) {
        comando += ` AND DATE(m.data_movimentacao) >= ?`;
        params.push(filtros.dataInicio);
    }
    
    if (filtros.dataFim) {
        comando += ` AND DATE(m.data_movimentacao) <= ?`;
        params.push(filtros.dataFim);
    }
    
    comando += ` ORDER BY m.data_movimentacao DESC LIMIT 100`;
    
    const [registros] = await connection.query(comando, params);
    return registros;
}

/**
 * Gera lista de compras baseada no estoque
 */
export async function gerarListaCompras() {
    const comando = `
        SELECT 
            i.idingrediente,
            i.nome,
            i.unidade_medida,
            i.quantidade_estoque AS quantidade_atual,
            i.estoque_minimo,
            GREATEST(0, (i.estoque_minimo * 2) - i.quantidade_estoque) AS quantidade_comprar,
            i.preco_unitario,
            GREATEST(0, ((i.estoque_minimo * 2) - i.quantidade_estoque) * i.preco_unitario) AS valor_estimado,
            i.fornecedor
        FROM ingrediente i
        WHERE i.quantidade_estoque <= i.estoque_minimo
        ORDER BY 
            CASE 
                WHEN i.quantidade_estoque = 0 THEN 1
                WHEN i.quantidade_estoque <= i.estoque_minimo * 0.5 THEN 2
                ELSE 3
            END,
            i.nome;
    `;
    
    const [registros] = await connection.query(comando);
    return registros;
}
