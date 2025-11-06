import * as ingredienteRepository from '../repository/ingredienteRepository.js';

/**
 * Valida os dados de um ingrediente
 */
function validarIngrediente(ingrediente) {
    const erros = [];

    if (!ingrediente.nome || ingrediente.nome.trim() === '') {
        erros.push('Nome do ingrediente é obrigatório');
    }

    if (!ingrediente.unidadeMedida || ingrediente.unidadeMedida.trim() === '') {
        erros.push('Unidade de medida é obrigatória');
    }

    const unidadesValidas = ['kg', 'g', 'L', 'ml', 'unidade'];
    if (ingrediente.unidadeMedida && !unidadesValidas.includes(ingrediente.unidadeMedida)) {
        erros.push(`Unidade de medida inválida. Use: ${unidadesValidas.join(', ')}`);
    }

    if (!ingrediente.precoUnitario || isNaN(ingrediente.precoUnitario) || ingrediente.precoUnitario <= 0) {
        erros.push('Preço unitário deve ser maior que zero');
    }

    if (ingrediente.quantidadeEstoque !== undefined && (isNaN(ingrediente.quantidadeEstoque) || ingrediente.quantidadeEstoque < 0)) {
        erros.push('Quantidade em estoque deve ser maior ou igual a zero');
    }

    if (ingrediente.estoqueMinimo !== undefined && (isNaN(ingrediente.estoqueMinimo) || ingrediente.estoqueMinimo < 0)) {
        erros.push('Estoque mínimo deve ser maior ou igual a zero');
    }

    if (erros.length > 0) {
        throw new Error(erros.join('; '));
    }
}

/**
 * Lista todos os ingredientes
 */
export async function listarIngredientes() {
    try {
        return await ingredienteRepository.listarIngredientes();
    } catch (error) {
        throw new Error(`Erro ao listar ingredientes: ${error.message}`);
    }
}

/**
 * Busca ingrediente por ID
 */
export async function buscarIngredientePorId(id) {
    try {
        if (!id || isNaN(id)) {
            throw new Error('ID inválido');
        }

        const ingrediente = await ingredienteRepository.buscarIngredientePorId(id);
        
        if (!ingrediente) {
            throw new Error('Ingrediente não encontrado');
        }

        return ingrediente;
    } catch (error) {
        throw new Error(`Erro ao buscar ingrediente: ${error.message}`);
    }
}

/**
 * Insere novo ingrediente
 */
export async function inserirIngrediente(ingrediente) {
    try {
        validarIngrediente(ingrediente);
        return await ingredienteRepository.inserirIngrediente(ingrediente);
    } catch (error) {
        throw new Error(`Erro ao inserir ingrediente: ${error.message}`);
    }
}

/**
 * Atualiza ingrediente
 */
export async function alterarIngrediente(id, ingrediente) {
    try {
        if (!id || isNaN(id)) {
            throw new Error('ID inválido');
        }

        validarIngrediente(ingrediente);

        const linhasAfetadas = await ingredienteRepository.alterarIngrediente(id, ingrediente);
        
        if (linhasAfetadas === 0) {
            throw new Error('Ingrediente não encontrado');
        }

        return linhasAfetadas;
    } catch (error) {
        throw new Error(`Erro ao atualizar ingrediente: ${error.message}`);
    }
}

/**
 * Remove ingrediente
 */
export async function removerIngrediente(id) {
    try {
        if (!id || isNaN(id)) {
            throw new Error('ID inválido');
        }

        const linhasAfetadas = await ingredienteRepository.removerIngrediente(id);
        
        if (linhasAfetadas === 0) {
            throw new Error('Ingrediente não encontrado');
        }

        return linhasAfetadas;
    } catch (error) {
        throw new Error(`Erro ao remover ingrediente: ${error.message}`);
    }
}

/**
 * Lista ingredientes com estoque baixo
 */
export async function listarIngredientesEstoqueBaixo() {
    try {
        return await ingredienteRepository.listarIngredientesEstoqueBaixo();
    } catch (error) {
        throw new Error(`Erro ao listar ingredientes com estoque baixo: ${error.message}`);
    }
}

/**
 * Registra entrada ou saída de estoque
 */
export async function registrarMovimentacao(movimentacao) {
    try {
        // Validações
        if (!movimentacao.idIngrediente || isNaN(movimentacao.idIngrediente)) {
            throw new Error('ID do ingrediente inválido');
        }

        if (!['ENTRADA', 'SAIDA', 'AJUSTE'].includes(movimentacao.tipo)) {
            throw new Error('Tipo de movimentação inválido. Use: ENTRADA, SAIDA ou AJUSTE');
        }

        if (!movimentacao.quantidade || isNaN(movimentacao.quantidade) || movimentacao.quantidade <= 0) {
            throw new Error('Quantidade deve ser maior que zero');
        }

        if (!movimentacao.motivo || movimentacao.motivo.trim() === '') {
            throw new Error('Motivo é obrigatório');
        }

        // Verificar se ingrediente existe
        await buscarIngredientePorId(movimentacao.idIngrediente);

        return await ingredienteRepository.registrarMovimentacao(movimentacao);
    } catch (error) {
        throw new Error(`Erro ao registrar movimentação: ${error.message}`);
    }
}

/**
 * Lista histórico de movimentações
 */
export async function listarMovimentacoes(filtros) {
    try {
        return await ingredienteRepository.listarMovimentacoes(filtros);
    } catch (error) {
        throw new Error(`Erro ao listar movimentações: ${error.message}`);
    }
}

/**
 * Gera lista de compras
 */
export async function gerarListaCompras() {
    try {
        const lista = await ingredienteRepository.gerarListaCompras();
        return lista;
    } catch (error) {
        throw new Error(`Erro ao gerar lista de compras: ${error.message}`);
    }
}
