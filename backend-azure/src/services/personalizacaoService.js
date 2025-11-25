import * as personalizacaoRepository from '../repository/personalizacaoRepository.js';

/**
 * RF052 + RF053: Service para Personalização de Produtos
 * Lógica de negócio para gerenciar personalizações e acréscimos
 */

// ==================== OPÇÕES DE PERSONALIZAÇÃO ====================

/**
 * Listar todas as opções
 */
export async function listarOpcoes() {
    return await personalizacaoRepository.listarOpcoes();
}

/**
 * Listar opções completas com valores
 */
export async function listarOpcoesCompletas() {
    return await personalizacaoRepository.listarOpcoesCompletas();
}

/**
 * Buscar opção por ID
 */
export async function buscarOpcaoPorId(idopcao) {
    const opcao = await personalizacaoRepository.buscarOpcaoPorId(idopcao);
    
    if (!opcao) {
        throw new Error('Opção não encontrada');
    }
    
    // Buscar valores da opção
    const valores = await personalizacaoRepository.listarValoresOpcao(idopcao);
    opcao.valores = valores;
    
    return opcao;
}

/**
 * Criar nova opção (RF052)
 */
export async function criarOpcao(opcaoData) {
    // Validações
    if (!opcaoData.nome_opcao || opcaoData.nome_opcao.trim() === '') {
        throw new Error('Nome da opção é obrigatório');
    }
    
    if (!['radio', 'checkbox', 'select'].includes(opcaoData.tipo_selecao)) {
        throw new Error('Tipo de seleção inválido. Use: radio, checkbox ou select');
    }
    
    const idopcao = await personalizacaoRepository.criarOpcao(opcaoData);
    
    return {
        idopcao,
        mensagem: 'Opção criada com sucesso'
    };
}

/**
 * Atualizar opção
 */
export async function atualizarOpcao(idopcao, opcaoData) {
    // Verificar se existe
    await buscarOpcaoPorId(idopcao);
    
    // Validações
    if (opcaoData.nome_opcao && opcaoData.nome_opcao.trim() === '') {
        throw new Error('Nome da opção não pode ser vazio');
    }
    
    if (opcaoData.tipo_selecao && !['radio', 'checkbox', 'select'].includes(opcaoData.tipo_selecao)) {
        throw new Error('Tipo de seleção inválido');
    }
    
    const sucesso = await personalizacaoRepository.atualizarOpcao(idopcao, opcaoData);
    
    if (!sucesso) {
        throw new Error('Erro ao atualizar opção');
    }
    
    return {
        mensagem: 'Opção atualizada com sucesso'
    };
}

/**
 * Deletar opção (soft delete)
 */
export async function deletarOpcao(idopcao) {
    // Verificar se existe
    await buscarOpcaoPorId(idopcao);
    
    const sucesso = await personalizacaoRepository.desativarOpcao(idopcao);
    
    if (!sucesso) {
        throw new Error('Erro ao deletar opção');
    }
    
    return {
        mensagem: 'Opção deletada com sucesso'
    };
}

// ==================== VALORES DAS OPÇÕES ====================

/**
 * Listar valores de uma opção
 */
export async function listarValoresOpcao(idopcao) {
    return await personalizacaoRepository.listarValoresOpcao(idopcao);
}

/**
 * Adicionar valor a opção (RF053 - preço adicional)
 */
export async function adicionarValorOpcao(valorData) {
    // Validações
    if (!valorData.idopcao_fk) {
        throw new Error('ID da opção é obrigatório');
    }
    
    if (!valorData.nome_valor || valorData.nome_valor.trim() === '') {
        throw new Error('Nome do valor é obrigatório');
    }
    
    if (valorData.preco_adicional && valorData.preco_adicional < 0) {
        throw new Error('Preço adicional não pode ser negativo');
    }
    
    const idvalor = await personalizacaoRepository.criarValorOpcao(valorData);
    
    return {
        idvalor,
        mensagem: 'Valor adicionado com sucesso'
    };
}

/**
 * Atualizar valor
 */
export async function atualizarValorOpcao(idvalor, valorData) {
    if (valorData.nome_valor && valorData.nome_valor.trim() === '') {
        throw new Error('Nome do valor não pode ser vazio');
    }
    
    if (valorData.preco_adicional !== undefined && valorData.preco_adicional < 0) {
        throw new Error('Preço adicional não pode ser negativo');
    }
    
    const sucesso = await personalizacaoRepository.atualizarValorOpcao(idvalor, valorData);
    
    if (!sucesso) {
        throw new Error('Erro ao atualizar valor');
    }
    
    return {
        mensagem: 'Valor atualizado com sucesso'
    };
}

/**
 * Deletar valor
 */
export async function deletarValorOpcao(idvalor) {
    const sucesso = await personalizacaoRepository.desativarValorOpcao(idvalor);
    
    if (!sucesso) {
        throw new Error('Erro ao deletar valor');
    }
    
    return {
        mensagem: 'Valor deletado com sucesso'
    };
}

// ==================== ASSOCIAÇÃO PRODUTO-OPÇÃO ====================

/**
 * Buscar opções de um produto (RF052)
 */
export async function buscarOpcoesProduto(idproduto) {
    return await personalizacaoRepository.buscarOpcoesProduto(idproduto);
}

/**
 * Associar opção a produto
 */
export async function associarOpcaoProduto(idproduto, idopcao, obrigatorio = false) {
    const sucesso = await personalizacaoRepository.associarOpcaoProduto(
        idproduto,
        idopcao,
        obrigatorio
    );
    
    if (!sucesso) {
        throw new Error('Erro ao associar opção ao produto');
    }
    
    return {
        mensagem: 'Opção associada ao produto com sucesso'
    };
}

/**
 * Remover associação
 */
export async function removerAssociacaoProdutoOpcao(idproduto, idopcao) {
    const sucesso = await personalizacaoRepository.removerAssociacaoProdutoOpcao(
        idproduto,
        idopcao
    );
    
    if (!sucesso) {
        throw new Error('Associação não encontrada');
    }
    
    return {
        mensagem: 'Associação removida com sucesso'
    };
}

/**
 * Listar produtos com opções
 */
export async function listarProdutosComOpcoes() {
    return await personalizacaoRepository.listarProdutosComOpcoes();
}

// ==================== PERSONALIZAÇÃO DE PEDIDOS ====================

/**
 * Calcular acréscimo de personalização (RF053)
 */
export async function calcularAcrescimo(personalizacoes) {
    if (!Array.isArray(personalizacoes) || personalizacoes.length === 0) {
        return 0.00;
    }
    
    // Validar estrutura das personalizações
    for (const item of personalizacoes) {
        if (!item.idvalor) {
            throw new Error('Cada personalização deve ter idvalor');
        }
    }
    
    const valorAcrescimo = await personalizacaoRepository.calcularAcrescimoPersonalizacao(
        personalizacoes
    );
    
    return valorAcrescimo;
}

/**
 * Salvar personalização do pedido (RF052 + RF053)
 */
export async function salvarPersonalizacaoPedido(idreserva, idproduto, personalizacoes) {
    // Validações
    if (!idreserva || !idproduto) {
        throw new Error('ID da reserva e produto são obrigatórios');
    }
    
    if (!Array.isArray(personalizacoes) || personalizacoes.length === 0) {
        throw new Error('Personalizações são obrigatórias');
    }
    
    // Validar estrutura
    for (const item of personalizacoes) {
        if (!item.idopcao || !item.idvalor) {
            throw new Error('Cada personalização deve ter idopcao e idvalor');
        }
    }
    
    const resultado = await personalizacaoRepository.salvarPersonalizacaoPedido(
        idreserva,
        idproduto,
        personalizacoes
    );
    
    return resultado;
}

/**
 * Buscar personalizações de um pedido
 */
export async function buscarPersonalizacoesPedido(idreserva) {
    return await personalizacaoRepository.buscarPersonalizacoesPedido(idreserva);
}

/**
 * Relatório de personalizações
 */
export async function relatorioPersonalizacoes(filtros = {}) {
    return await personalizacaoRepository.relatorioPersonalizacoes(filtros);
}

/**
 * Validar personalizações obrigatórias (RF052)
 */
export async function validarPersonalizacoesObrigatorias(idproduto, personalizacoesSelecionadas) {
    // Buscar opções do produto
    const opcoesProduto = await buscarOpcoesProduto(idproduto);
    
    // Verificar opções obrigatórias
    const opcoesObrigatorias = opcoesProduto.filter(op => op.obrigatorio);
    
    const erros = [];
    
    for (const opcaoObrigatoria of opcoesObrigatorias) {
        const selecionada = personalizacoesSelecionadas.find(
            p => p.idopcao === opcaoObrigatoria.idopcao
        );
        
        if (!selecionada) {
            erros.push(`Opção obrigatória não selecionada: ${opcaoObrigatoria.nome_opcao}`);
        }
    }
    
    if (erros.length > 0) {
        throw new Error(erros.join('; '));
    }
    
    return {
        valido: true,
        mensagem: 'Todas as personalizações obrigatórias foram selecionadas'
    };
}

// ==================== VÍNCULO COM INGREDIENTES ====================

/**
 * Vincular valor de personalização com ingrediente
 */
export async function vincularValorIngrediente(idvalor, idingrediente, quantidadeUsada) {
    // Validações
    if (!idvalor || !idingrediente) {
        throw new Error('ID do valor e ingrediente são obrigatórios');
    }
    
    if (!quantidadeUsada || quantidadeUsada <= 0) {
        throw new Error('Quantidade usada deve ser maior que zero');
    }
    
    const sucesso = await personalizacaoRepository.vincularValorIngrediente(
        idvalor,
        idingrediente,
        quantidadeUsada
    );
    
    if (!sucesso) {
        throw new Error('Erro ao vincular ingrediente à personalização');
    }
    
    return {
        mensagem: 'Ingrediente vinculado com sucesso'
    };
}

/**
 * Remover vínculo valor-ingrediente
 */
export async function removerVinculoValorIngrediente(idvalor, idingrediente) {
    const sucesso = await personalizacaoRepository.removerVinculoValorIngrediente(
        idvalor,
        idingrediente
    );
    
    if (!sucesso) {
        throw new Error('Vínculo não encontrado');
    }
    
    return {
        mensagem: 'Vínculo removido com sucesso'
    };
}

/**
 * Listar ingredientes de um valor
 */
export async function listarIngredientesValor(idvalor) {
    return await personalizacaoRepository.listarIngredientesValor(idvalor);
}

/**
 * Verificar disponibilidade baseado em estoque
 */
export async function verificarDisponibilidadePersonalizacao(idvalor) {
    return await personalizacaoRepository.verificarDisponibilidadePersonalizacao(idvalor);
}

/**
 * Processar personalização e dar baixa nos ingredientes
 * Esta função deve ser chamada quando o pedido for confirmado
 */
export async function processarPersonalizacaoComEstoque(personalizacoes, idreserva, usuario = 'Sistema') {
    // Validar personalizações
    if (!Array.isArray(personalizacoes) || personalizacoes.length === 0) {
        return {
            sucesso: true,
            mensagem: 'Nenhuma personalização para processar',
            ingredientes_atualizados: 0
        };
    }
    
    // Verificar disponibilidade de todas as personalizações
    for (const pers of personalizacoes) {
        const disponibilidade = await verificarDisponibilidadePersonalizacao(pers.idvalor);
        
        if (!disponibilidade.disponivel) {
            throw new Error(`Personalização indisponível: ${disponibilidade.nome_valor}. ${disponibilidade.ingredientes_faltando || 'Estoque insuficiente'}`);
        }
    }
    
    // Dar baixa nos ingredientes
    const resultado = await personalizacaoRepository.darBaixaIngredientesPersonalizacao(
        personalizacoes,
        idreserva,
        usuario
    );
    
    return {
        sucesso: true,
        mensagem: 'Personalização processada e estoque atualizado',
        ingredientes_atualizados: resultado.ingredientes_atualizados
    };
}

export default {
    // Opções
    listarOpcoes,
    listarOpcoesCompletas,
    buscarOpcaoPorId,
    criarOpcao,
    atualizarOpcao,
    deletarOpcao,
    
    // Valores
    adicionarValorOpcao,
    atualizarValorOpcao,
    deletarValorOpcao,
    
    // Associações
    buscarOpcoesProduto,
    associarOpcaoProduto,
    removerAssociacaoProdutoOpcao,
    listarProdutosComOpcoes,
    
    // Personalizações
    calcularAcrescimo,
    salvarPersonalizacaoPedido,
    buscarPersonalizacoesPedido,
    validarPersonalizacoesObrigatorias,
    relatorioPersonalizacoes,
    
    // Ingredientes
    vincularValorIngrediente,
    removerVinculoValorIngrediente,
    listarIngredientesValor,
    verificarDisponibilidadePersonalizacao,
    processarPersonalizacaoComEstoque
};
