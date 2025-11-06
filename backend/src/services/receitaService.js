import * as receitaRepository from '../repository/receitaRepository.js';

/**
 * Adiciona ou atualiza ingredientes da receita de um produto
 */
export async function salvarReceitaProduto(idproduto, ingredientes) {
    try {
        if (!idproduto) {
            throw new Error('ID do produto é obrigatório');
        }

        if (!Array.isArray(ingredientes) || ingredientes.length === 0) {
            throw new Error('Lista de ingredientes é obrigatória');
        }

        // Validar ingredientes
        for (const ing of ingredientes) {
            if (!ing.idingrediente) {
                throw new Error('ID do ingrediente é obrigatório');
            }
            if (!ing.quantidade || ing.quantidade <= 0) {
                throw new Error('Quantidade do ingrediente deve ser maior que zero');
            }
            if (!ing.unidadeMedida) {
                throw new Error('Unidade de medida é obrigatória');
            }
        }

        await receitaRepository.adicionarIngredientesReceita(idproduto, ingredientes);
        
        return {
            sucesso: true,
            mensagem: 'Receita salva com sucesso'
        };
    } catch (error) {
        throw new Error(`Erro ao salvar receita: ${error.message}`);
    }
}

/**
 * Lista ingredientes da receita de um produto
 */
export async function buscarReceitaProduto(idproduto) {
    try {
        return await receitaRepository.listarIngredientesReceita(idproduto);
    } catch (error) {
        throw new Error(`Erro ao buscar receita: ${error.message}`);
    }
}

/**
 * Produzir produto e dar baixa nos ingredientes
 */
export async function produzirProduto(idproduto, quantidade = 1) {
    try {
        if (!idproduto) {
            throw new Error('ID do produto é obrigatório');
        }

        if (quantidade <= 0) {
            throw new Error('Quantidade deve ser maior que zero');
        }

        const resultado = await receitaRepository.darBaixaIngredientes(idproduto, quantidade);
        
        if (!resultado.sucesso) {
            throw new Error(resultado.mensagem);
        }

        return resultado;
    } catch (error) {
        throw new Error(`Erro ao produzir produto: ${error.message}`);
    }
}

/**
 * Calcular custo de produção
 */
export async function calcularCusto(idproduto) {
    try {
        return await receitaRepository.calcularCustoProducao(idproduto);
    } catch (error) {
        throw new Error(`Erro ao calcular custo: ${error.message}`);
    }
}

/**
 * Verificar estoque de ingredientes
 */
export async function verificarEstoque(idproduto, quantidade = 1) {
    try {
        return await receitaRepository.verificarEstoqueIngredientes(idproduto, quantidade);
    } catch (error) {
        throw new Error(`Erro ao verificar estoque: ${error.message}`);
    }
}

export default {
    salvarReceitaProduto,
    buscarReceitaProduto,
    produzirProduto,
    calcularCusto,
    verificarEstoque
};
