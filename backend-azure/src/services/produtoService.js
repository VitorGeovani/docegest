import * as produtoRepository from '../repository/produtoRepository.js';

/**
 * Valida os dados de um produto
 * @param {Object} produto - Dados do produto a serem validados
 * @throws {Error} Se os dados forem inválidos
 */
function validarProduto(produto) {
    const erros = [];

    if (!produto.nome || produto.nome.trim() === '') {
        erros.push('Nome do produto é obrigatório');
    }

    if (!produto.preco || isNaN(produto.preco) || produto.preco <= 0) {
        erros.push('Preço deve ser um número válido maior que zero');
    }

    // Campos opcionais - define valores padrão se não forem fornecidos
    if (!produto.descricao) {
        produto.descricao = '';
    }

    if (!produto.quantidade || isNaN(produto.quantidade)) {
        produto.quantidade = 0; // Quantidade padrão
    }

    if (erros.length > 0) {
        throw new Error(erros.join('; '));
    }
}

/**
 * Lista todos os produtos
 * @returns {Promise<Array>} Lista de produtos
 */
export async function listarProdutos() {
    try {
        return await produtoRepository.listarProdutos();
    } catch (error) {
        throw new Error(`Erro ao listar produtos: ${error.message}`);
    }
}

/**
 * Lista produtos disponíveis (com estoque)
 * @returns {Promise<Array>} Lista de produtos disponíveis
 */
export async function listarProdutosDisponiveis() {
    try {
        return await produtoRepository.listarProdutosDisponiveis();
    } catch (error) {
        throw new Error(`Erro ao listar produtos disponíveis: ${error.message}`);
    }
}

/**
 * Busca um produto por ID
 * @param {number} id - ID do produto
 * @returns {Promise<Object>} Produto encontrado
 * @throws {Error} Se o produto não for encontrado
 */
export async function buscarProdutoPorId(id) {
    try {
        if (!id || isNaN(id)) {
            throw new Error('ID inválido');
        }

        const produto = await produtoRepository.listarProdutoPorId(id);
        
        if (!produto) {
            throw new Error('Produto não encontrado');
        }

        return produto;
    } catch (error) {
        throw new Error(`Erro ao buscar produto: ${error.message}`);
    }
}

/**
 * Insere um novo produto
 * @param {Object} produto - Dados do produto
 * @returns {Promise<number>} ID do produto inserido
 */
export async function inserirProduto(produto) {
    try {
        validarProduto(produto);
        
        return await produtoRepository.inserirProduto(produto);
    } catch (error) {
        throw new Error(`Erro ao inserir produto: ${error.message}`);
    }
}

/**
 * Atualiza um produto existente
 * @param {number} id - ID do produto
 * @param {Object} produto - Novos dados do produto
 * @returns {Promise<number>} Número de linhas afetadas
 */
export async function alterarProduto(id, produto) {
    try {
        if (!id || isNaN(id)) {
            throw new Error('ID inválido');
        }

        validarProduto(produto);

        const linhasAfetadas = await produtoRepository.alterarProduto(id, produto);
        
        if (linhasAfetadas === 0) {
            throw new Error('Produto não encontrado');
        }

        return linhasAfetadas;
    } catch (error) {
        throw new Error(`Erro ao atualizar produto: ${error.message}`);
    }
}

/**
 * Remove um produto
 * @param {number} id - ID do produto
 * @returns {Promise<number>} Número de linhas afetadas
 */
export async function removerProduto(id) {
    try {
        if (!id || isNaN(id)) {
            throw new Error('ID inválido');
        }

        const linhasAfetadas = await produtoRepository.removerProduto(id);
        
        if (linhasAfetadas === 0) {
            throw new Error('Produto não encontrado');
        }

        return linhasAfetadas;
    } catch (error) {
        throw new Error(`Erro ao remover produto: ${error.message}`);
    }
}

/**
 * Análise de custos de todos os produtos
 * @returns {Promise<Array>} Análise de custos dos produtos
 */
export async function analiseCustosProdutos() {
    try {
        return await produtoRepository.analiseCustosProdutos();
    } catch (error) {
        throw new Error(`Erro ao gerar análise de custos: ${error.message}`);
    }
}
