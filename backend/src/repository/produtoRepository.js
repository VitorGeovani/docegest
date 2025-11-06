import connection from './connection.js';

export async function listarProdutos() {
    const comando = `
      SELECT 
        p.idproduto AS id,
        p.nome,
        p.descricao,
        p.preco,
        p.quantidade,
        p.idcategoria,
        p.ativo,
        p.img_Produto AS caminhoImagem,
        c.nome AS categoria
      FROM produto p
      LEFT JOIN categoria c ON p.idcategoria = c.idcategoria
      WHERE p.ativo = 1
      ORDER BY p.nome;
    `;
    
    let resp = await connection.query(comando);
    let registros = resp[0];
    
    return registros;
}


export async function listarProdutosDisponiveis() {
  const comando = `
    SELECT 
      p.idproduto AS id,
      p.nome,
      p.descricao,
      p.preco,
      p.quantidade,
      p.idcategoria,
      p.ativo,
      p.img_Produto AS caminhoImagem,
      c.nome AS categoria
    FROM produto p
    LEFT JOIN categoria c ON p.idcategoria = c.idcategoria
    WHERE p.ativo = 1 AND p.quantidade > 0
    ORDER BY p.nome;
  `;
  
  let resp = await connection.query(comando);
  let registros = resp[0];
  
  return registros;
}

export async function listarProdutoPorId(id) {
    const comando = `
      SELECT 
        idproduto AS id,
        nome,
        descricao,
        preco,
        quantidade,
        idcategoria,
        ativo,
        img_Produto AS caminhoImagem
      FROM produto
      WHERE idproduto = ?;
    `;
    
    let resp = await connection.query(comando, [id]);
    let registro = resp[0][0]; // Retorna apenas o primeiro registro encontrado
    
    return registro;
}



export async function inserirProduto(produto) {
    let comando = `
      INSERT INTO produto (nome, descricao, preco, quantidade, idcategoria, img_Produto, ativo) 
      VALUES (?, ?, ?, ?, ?, ?, ?);
    `;
    let [info] = await connection.query(comando, [
      produto.nome,
      produto.descricao,
      produto.preco,
      produto.quantidade,
      produto.idcategoria || null, // Adiciona a categoria (ou null se não informado)
      produto.caminhoImagem, // Adiciona o caminho da imagem
      produto.disponivel !== undefined ? (produto.disponivel ? 1 : 0) : 1 // Define ativo baseado em disponivel, default 1
    ]);
    return info.insertId;
}

export async function alterarProduto(id, produto) {
    let comando = `
      UPDATE produto 
      SET 
        nome = ?, 
        descricao = ?, 
        preco = ?, 
        quantidade = ?,
        idcategoria = ?,
        img_Produto = ?,
        ativo = ?
      WHERE idproduto = ?;
    `;
    let [info] = await connection.query(comando, [
      produto.nome,
      produto.descricao,
      produto.preco,
      produto.quantidade,
      produto.idcategoria || null, // Atualiza a categoria (ou null se não informado)
      produto.caminhoImagem, // Atualiza o caminho da imagem
      produto.disponivel !== undefined ? (produto.disponivel ? 1 : 0) : 1, // Atualiza ativo baseado em disponivel
      id
    ]);
    return info.affectedRows;
}

export async function removerProduto(id) {
    let comando = `
      DELETE FROM produto 
      WHERE idproduto = ?;
    `;
    let [info] = await connection.query(comando, [id]);
    return info.affectedRows;
}

/**
 * Listar TODOS os produtos (incluindo inativos e sem estoque)
 */
export async function listarTodosProdutos() {
    const comando = `
        SELECT 
            p.idproduto,
            p.nome,
            p.descricao,
            p.preco,
            p.quantidade,
            p.ativo,
            p.custo_producao,
            p.margem_lucro,
            p.tempo_preparo,
            p.codigo_produto,
            p.img_Produto AS caminhoImagem,
            c.nome AS categoria
        FROM produto p
        LEFT JOIN categoria c ON p.idcategoria = c.idcategoria
        ORDER BY p.nome;
    `;
    
    const [registros] = await connection.query(comando);
    return registros;
}

/**
 * Análise de estoque com produtos em falta
 */
export async function obterAnaliseEstoque() {
    const comando = `
        SELECT 
            idproduto,
            nome,
            quantidade,
            CASE 
                WHEN quantidade = 0 THEN 'SEM ESTOQUE'
                WHEN quantidade <= 5 THEN 'CRÍTICO'
                WHEN quantidade <= 10 THEN 'BAIXO'
                ELSE 'OK'
            END AS status_estoque,
            preco,
            ativo
        FROM produto
        WHERE ativo = 1
        ORDER BY quantidade ASC, nome;
    `;
    
    const [registros] = await connection.query(comando);
    return registros;
}

/**
 * Análise de custos de produtos com receitas cadastradas
 */
export async function analiseCustosProdutos() {
    const comando = `
        SELECT 
            p.idproduto,
            p.nome,
            p.preco,
            IFNULL(SUM(r.quantidade * i.preco_unitario), 0) AS custo_producao,
            p.preco - IFNULL(SUM(r.quantidade * i.preco_unitario), 0) AS lucro,
            CASE 
                WHEN p.preco > 0 THEN 
                    ((p.preco - IFNULL(SUM(r.quantidade * i.preco_unitario), 0)) / p.preco * 100)
                ELSE 0
            END AS margem_percentual,
            CASE 
                WHEN SUM(r.quantidade * i.preco_unitario) IS NULL THEN 0
                ELSE 1
            END AS tem_receita
        FROM produto p
        LEFT JOIN receita r ON p.idproduto = r.idproduto
        LEFT JOIN ingrediente i ON r.idingrediente = i.idingrediente
        WHERE p.ativo = 1
        GROUP BY p.idproduto, p.nome, p.preco
        ORDER BY tem_receita DESC, p.nome;
    `;
    
    const [registros] = await connection.query(comando);
    return registros;
}
