import * as reservaRepository from '../repository/reservaRepository.js';
import * as produtoRepository from '../repository/produtoRepository.js';
import * as personalizacaoService from './personalizacaoService.js';

/**
 * Valida os dados de uma reserva
 * @param {Object} reserva - Dados da reserva a serem validados
 * @throws {Error} Se os dados forem inválidos
 */
function validarReserva(reserva) {
    const erros = [];

    if (!reserva.data) {
        erros.push('Data de entrega é obrigatória');
    }

    if (!reserva.horario) {
        erros.push('Horário de entrega é obrigatório');
    }

    if (!reserva.pontoEntrega || reserva.pontoEntrega.trim() === '') {
        erros.push('Ponto de entrega é obrigatório');
    }

    if (!reserva.totalGeral || isNaN(reserva.totalGeral) || reserva.totalGeral <= 0) {
        erros.push('Valor total deve ser maior que zero');
    }

    if (!reserva.pagamento || reserva.pagamento.trim() === '') {
        erros.push('Forma de pagamento é obrigatória');
    }

    if (!reserva.clienteId || isNaN(reserva.clienteId)) {
        erros.push('ID do cliente inválido');
    }

    if (!Array.isArray(reserva.produtos) || reserva.produtos.length === 0) {
        erros.push('A reserva deve conter pelo menos um produto');
    }

    if (!Array.isArray(reserva.produtosComQuantidade) || reserva.produtosComQuantidade.length === 0) {
        erros.push('Informações de quantidade dos produtos são obrigatórias');
    }

    if (erros.length > 0) {
        throw new Error(erros.join('; '));
    }
}

/**
 * Valida se há estoque suficiente para os produtos
 * @param {Array} produtos - Lista de produtos com quantidades
 * @throws {Error} Se não houver estoque suficiente
 */
async function validarEstoque(produtos) {
    for (const item of produtos) {
        const produto = await produtoRepository.listarProdutoPorId(item.id);
        
        if (!produto) {
            throw new Error(`Produto com ID ${item.id} não encontrado`);
        }

        if (produto.quantidade < item.quantidade) {
            throw new Error(`Estoque insuficiente para o produto "${produto.nome}". Disponível: ${produto.quantidade}, Solicitado: ${item.quantidade}`);
        }
    }
}

/**
 * Lista todas as reservas
 * @returns {Promise<Array>} Lista de reservas
 */
export async function listarReservas() {
    try {
        return await reservaRepository.listarReservas();
    } catch (error) {
        throw new Error(`Erro ao listar reservas: ${error.message}`);
    }
}

/**
 * Lista reservas pendentes
 * @returns {Promise<Array>} Lista de reservas pendentes
 */
export async function listarReservasPendentes() {
    try {
        return await reservaRepository.listarReservasPendentes();
    } catch (error) {
        throw new Error(`Erro ao listar reservas pendentes: ${error.message}`);
    }
}

/**
 * Lista reservas por status
 * @param {string} status - Status das reservas (Pendente, Confirmado, Preparando, Pronto, Entregue)
 * @returns {Promise<Array>} Lista de reservas com o status especificado
 */
export async function listarReservasPorStatus(status) {
    try {
        const statusValidos = ['Pendente', 'Confirmado', 'Preparando', 'Pronto', 'Entregue', 'Cancelado'];
        if (!statusValidos.includes(status)) {
            throw new Error('Status inválido');
        }
        return await reservaRepository.listarReservasPorStatus(status);
    } catch (error) {
        throw new Error(`Erro ao listar reservas por status: ${error.message}`);
    }
}

/**
 * Lista todas as reservas ativas (exceto canceladas)
 * @returns {Promise<Array>} Lista de todas as reservas ativas
 */
export async function listarTodasReservasComCliente() {
    try {
        return await reservaRepository.listarTodasReservasComCliente();
    } catch (error) {
        throw new Error(`Erro ao listar todas as reservas: ${error.message}`);
    }
}

/**
 * Insere uma nova reserva
 * @param {Object} reserva - Dados da reserva
 * @returns {Promise<number>} ID da reserva inserida
 */
export async function inserirReserva(reserva) {
    try {
        validarReserva(reserva);
        
        // Valida o estoque antes de criar a reserva
        await validarEstoque(reserva.produtosComQuantidade);
        
        // Atualiza a quantidade de produtos no estoque
        await reservaRepository.atualizarQuantidadeProdutos(reserva.produtosComQuantidade);
        
        // Insere a reserva
        const idReserva = await reservaRepository.inserirReserva(reserva);
        
        // Processar personalizações se houver
        if (reserva.personalizacoes && Array.isArray(reserva.personalizacoes) && reserva.personalizacoes.length > 0) {
            try {
                console.log(`🎨 Processando personalizações para reserva ${idReserva}...`);
                
                const resultado = await personalizacaoService.processarPersonalizacaoComEstoque(
                    reserva.personalizacoes,
                    idReserva,
                    reserva.usuario || 'Cliente'
                );
                
                console.log(`✅ Personalizações processadas: ${resultado.ingredientes_atualizados} ingredientes atualizados`);
            } catch (errorPers) {
                console.error('⚠️ Erro ao processar personalizações:', errorPers.message);
                // Não falha a reserva, apenas loga o erro
                // Pode-se decidir reverter ou não a reserva dependendo da regra de negócio
            }
        }
        
        return idReserva;
    } catch (error) {
        throw new Error(`Erro ao inserir reserva: ${error.message}`);
    }
}

/**
 * Atualiza uma reserva existente
 * @param {number} id - ID da reserva
 * @param {Object} reserva - Novos dados da reserva
 * @returns {Promise<number>} Número de linhas afetadas
 */
export async function alterarReserva(id, reserva) {
    try {
        if (!id || isNaN(id)) {
            throw new Error('ID inválido');
        }

        const linhasAfetadas = await reservaRepository.alterarReserva(id, reserva);
        
        if (linhasAfetadas === 0) {
            throw new Error('Reserva não encontrada');
        }

        return linhasAfetadas;
    } catch (error) {
        throw new Error(`Erro ao atualizar reserva: ${error.message}`);
    }
}

/**
 * Remove uma reserva
 * @param {number} id - ID da reserva
 * @returns {Promise<number>} Número de linhas afetadas
 */
export async function removerReserva(id) {
    try {
        if (!id || isNaN(id)) {
            throw new Error('ID inválido');
        }

        const linhasAfetadas = await reservaRepository.removerReserva(id);
        
        if (linhasAfetadas === 0) {
            throw new Error('Reserva não encontrada');
        }

        return linhasAfetadas;
    } catch (error) {
        throw new Error(`Erro ao remover reserva: ${error.message}`);
    }
}

/**
 * Confirma uma reserva pendente
 * @param {number} id - ID da reserva
 * @returns {Promise<number>} Número de linhas afetadas
 */
export async function confirmarReserva(id) {
    try {
        if (!id || isNaN(id)) {
            throw new Error('ID inválido');
        }

        const linhasAfetadas = await reservaRepository.confirmarReserva(id);
        
        if (linhasAfetadas === 0) {
            throw new Error('Reserva não encontrada ou já confirmada');
        }

        return linhasAfetadas;
    } catch (error) {
        throw new Error(`Erro ao confirmar reserva: ${error.message}`);
    }
}

/**
 * Cancela uma reserva e devolve produtos ao estoque
 * @param {number} id - ID da reserva
 * @param {Array} produtos - Lista de produtos a devolver
 * @returns {Promise<boolean>} Sucesso da operação
 */
export async function cancelarReserva(id, produtos) {
    try {
        if (!id || isNaN(id)) {
            throw new Error('ID inválido');
        }

        if (!Array.isArray(produtos) || produtos.length === 0) {
            throw new Error('Lista de produtos inválida');
        }

        return await reservaRepository.cancelarReserva(id, produtos);
    } catch (error) {
        throw new Error(`Erro ao cancelar reserva: ${error.message}`);
    }
}

/**
 * Busca uma reserva por ID
 * @param {number} id - ID da reserva
 * @returns {Promise<Object>} Dados da reserva
 */
export async function buscarReservaPorId(id) {
    try {
        if (!id || isNaN(id)) {
            throw new Error('ID inválido');
        }

        const reserva = await reservaRepository.buscarReservaPorId(id);
        
        if (!reserva) {
            throw new Error('Reserva não encontrada');
        }

        // Parse dos JSONs
        if (typeof reserva.produtos === 'string') {
            reserva.produtos = JSON.parse(reserva.produtos);
        }
        if (typeof reserva.qtdReserva === 'string') {
            reserva.qtdReserva = JSON.parse(reserva.qtdReserva);
        }

        return reserva;
    } catch (error) {
        throw new Error(`Erro ao buscar reserva: ${error.message}`);
    }
}

/**
 * Atualiza o status do pedido
 * @param {number} id - ID da reserva
 * @param {string} novoStatus - Novo status
 * @returns {Promise<number>} Número de linhas afetadas
 */
export async function atualizarStatusPedido(id, novoStatus) {
    try {
        if (!id || isNaN(id)) {
            throw new Error('ID inválido');
        }

        const statusValidos = ['Pendente', 'Confirmado', 'Preparando', 'Pronto', 'Entregue', 'Cancelado'];
        if (!statusValidos.includes(novoStatus)) {
            throw new Error('Status inválido');
        }

        const linhasAfetadas = await reservaRepository.atualizarStatusPedido(id, novoStatus);
        
        if (linhasAfetadas === 0) {
            throw new Error('Reserva não encontrada');
        }

        // TODO: Enviar notificação WhatsApp sobre mudança de status
        // await whatsappService.notificarMudancaStatus(id, novoStatus);

        return linhasAfetadas;
    } catch (error) {
        throw new Error(`Erro ao atualizar status: ${error.message}`);
    }
}

/**
 * Busca pedidos por telefone do cliente
 * @param {string} telefone - Telefone do cliente
 * @returns {Promise<Array>} Lista de pedidos do cliente
 */
export async function buscarPedidosPorTelefone(telefone) {
    try {
        if (!telefone || telefone.trim() === '') {
            throw new Error('Telefone inválido');
        }

        const pedidos = await reservaRepository.buscarPedidosPorTelefone(telefone);
        
        // Parse dos JSONs para cada pedido
        return pedidos.map(pedido => {
            if (typeof pedido.produtos === 'string') {
                pedido.produtos = JSON.parse(pedido.produtos);
            }
            if (typeof pedido.qtdReserva === 'string') {
                pedido.qtdReserva = JSON.parse(pedido.qtdReserva);
            }
            if (typeof pedido.historicoStatus === 'string') {
                pedido.historicoStatus = JSON.parse(pedido.historicoStatus);
            }
            return pedido;
        });
    } catch (error) {
        throw new Error(`Erro ao buscar pedidos: ${error.message}`);
    }
}

/**
 * Busca detalhes completos de um pedido
 * @param {number} id - ID do pedido
 * @returns {Promise<Object>} Detalhes completos do pedido
 */
export async function buscarDetalhePedidoCompleto(id) {
    try {
        if (!id || isNaN(id)) {
            throw new Error('ID inválido');
        }

        const pedido = await reservaRepository.buscarDetalhePedidoCompleto(id);
        
        if (!pedido) {
            throw new Error('Pedido não encontrado');
        }

        // Parse dos JSONs
        if (typeof pedido.produtos === 'string') {
            pedido.produtos = JSON.parse(pedido.produtos);
        }
        if (typeof pedido.qtdReserva === 'string') {
            pedido.qtdReserva = JSON.parse(pedido.qtdReserva);
        }
        if (typeof pedido.historicoStatus === 'string') {
            pedido.historicoStatus = JSON.parse(pedido.historicoStatus);
        }

        return pedido;
    } catch (error) {
        throw new Error(`Erro ao buscar detalhes do pedido: ${error.message}`);
    }
}

/**
 * RF049: Buscar dados do cliente de um pedido
 * @param {number} idReserva - ID da reserva
 * @returns {Promise<Object>} Dados do cliente
 */
export async function buscarClienteDoPedido(idReserva) {
    return await reservaRepository.buscarClientePorReserva(idReserva);
}

/**
 * RF049: Registrar reenvio de confirmação
 * @param {number} idReserva - ID da reserva
 */
export async function registrarReenvioConfirmacao(idReserva) {
    await reservaRepository.registrarReenvioConfirmacao(idReserva);
}
