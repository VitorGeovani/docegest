import pool from './connection.js';

// Listar todas as categorias
export async function listarCategorias() {
    const comando = `
        SELECT 
            idcategoria as id,
            nome,
            descricao,
            ativo,
            data_cadastro as data_criacao,
            (SELECT COUNT(*) FROM produto WHERE idcategoria = categoria.idcategoria) as total_produtos
        FROM categoria
        ORDER BY nome ASC
    `;
    const [resultado] = await pool.query(comando);
    return resultado;
}

// Listar apenas categorias ativas
export async function listarCategoriasAtivas() {
    const comando = `
        SELECT 
            idcategoria as id,
            nome,
            descricao
        FROM categoria
        WHERE ativo = 1
        ORDER BY nome ASC
    `;
    const [resultado] = await pool.query(comando);
    return resultado;
}

// Buscar categoria por ID
export async function buscarCategoriaPorId(id) {
    const comando = `
        SELECT 
            idcategoria as id,
            nome,
            descricao,
            ativo,
            data_cadastro as data_criacao
        FROM categoria
        WHERE idcategoria = ?
    `;
    const [resultado] = await pool.query(comando, [id]);
    return resultado[0];
}

// Criar nova categoria
export async function criarCategoria(categoria) {
    const comando = `
        INSERT INTO categoria (nome, descricao, ativo)
        VALUES (?, ?, ?)
    `;
    const [resultado] = await pool.query(comando, [
        categoria.nome,
        categoria.descricao,
        categoria.ativo
    ]);
    return resultado.insertId;
}

// Atualizar categoria
export async function atualizarCategoria(id, categoria) {
    const comando = `
        UPDATE categoria
        SET nome = ?,
            descricao = ?,
            ativo = ?
        WHERE idcategoria = ?
    `;
    const [resultado] = await pool.query(comando, [
        categoria.nome,
        categoria.descricao,
        categoria.ativo,
        id
    ]);
    return resultado.affectedRows;
}

// Excluir categoria
export async function excluirCategoria(id) {
    const comando = `DELETE FROM categoria WHERE idcategoria = ?`;
    const [resultado] = await pool.query(comando, [id]);
    return resultado.affectedRows;
}

// Buscar categoria por nome
export async function buscarCategoriaPorNome(nome) {
    const comando = `
        SELECT * FROM categoria
        WHERE LOWER(nome) = LOWER(?)
    `;
    const [resultado] = await pool.query(comando, [nome]);
    return resultado[0];
}
