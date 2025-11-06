import * as reservaService from '../services/reservaService.js';
import whatsappService from '../services/whatsappService.js';
import { Router } from "express";

const endpoints = Router();

/**
 * POST /pedido/criar
 * Cria um novo pedido e envia notificação WhatsApp automática
 */
endpoints.post('/pedido/criar', async (req, resp) => {
    try {
        const pedidoData = req.body;
        
        // Validação básica
        if (!pedidoData.clienteId || !pedidoData.produtos || !pedidoData.produtosComQuantidade) {
            return resp.status(400).json({ erro: 'Dados incompletos do pedido' });
        }

        // 1. Criar reserva no banco
        const idReserva = await reservaService.inserirReserva(pedidoData);
        
        // 2. Gerar número do pedido
        const numeroPedido = `PED${String(idReserva).padStart(6, '0')}`;
        
        // 3. Preparar dados para notificação WhatsApp
        const dadosNotificacao = {
            numero: numeroPedido,
            cliente: {
                nome: pedidoData.nomeCliente,
                telefone: pedidoData.telefoneCliente
            },
            itens: pedidoData.produtosComQuantidade.map(item => {
                const produtoInfo = pedidoData.produtos.find(p => p.id === item.id);
                return {
                    nome: produtoInfo?.nome || 'Produto',
                    quantidade: item.quantidade,
                    valor: produtoInfo?.valor || 0
                };
            }),
            total: pedidoData.totalGeral,
            metodoPagamento: pedidoData.pagamento,
            pontoEntrega: pedidoData.enderecoEntrega || pedidoData.pontoEntrega
        };

        // 4. Enviar notificação WhatsApp
        let whatsappEnviado = false;
        try {
            await whatsappService.notificarPedidoRecebido(dadosNotificacao);
            whatsappEnviado = true;
            
            // Log de sucesso
            console.log(`✅ WhatsApp enviado para ${pedidoData.telefoneCliente} - Pedido ${numeroPedido}`);
        } catch (whatsappError) {
            console.error('⚠️ Erro ao enviar WhatsApp:', whatsappError.message);
            // Não falha o pedido se o WhatsApp falhar
        }

        // 5. Enviar notificação para o número de negócios
        try {
            const mensagemNegocio = `🔔 *NOVO PEDIDO RECEBIDO!*\n\n` +
                `📦 *Pedido:* ${numeroPedido}\n` +
                `👤 *Cliente:* ${pedidoData.nomeCliente}\n` +
                `📱 *Telefone:* ${pedidoData.telefoneCliente}\n` +
                `📍 *Endereço:* ${pedidoData.enderecoEntrega || pedidoData.pontoEntrega}\n\n` +
                `🛍️ *Itens:*\n` +
                dadosNotificacao.itens.map(item => `• ${item.quantidade}x ${item.nome} - R$ ${(item.valor * item.quantidade).toFixed(2)}`).join('\n') +
                `\n\n💰 *Total:* R$ ${pedidoData.totalGeral.toFixed(2)}\n` +
                `💳 *Pagamento:* ${pedidoData.pagamento}\n` +
                (pedidoData.observacoes ? `\n📝 *Obs:* ${pedidoData.observacoes}` : '');

            await whatsappService.enviarMensagem('5511967696744', mensagemNegocio);
            console.log(`✅ Notificação enviada para WhatsApp Business: ${numeroPedido}`);
        } catch (businessError) {
            console.error('⚠️ Erro ao notificar WhatsApp Business:', businessError.message);
        }

        // 6. Retornar sucesso
        resp.status(201).json({
            sucesso: true,
            id: idReserva,
            numeroPedido: numeroPedido,
            whatsappEnviado: whatsappEnviado,
            mensagem: 'Pedido criado com sucesso!'
        });

    } catch (err) {
        console.error('Erro ao criar pedido:', err);
        resp.status(500).json({ 
            erro: err.message || 'Erro ao criar pedido',
            detalhes: err.stack
        });
    }
});

/**
 * PUT /pedido/:id/confirmar-pagamento
 * Confirma pagamento e envia notificação WhatsApp
 */
endpoints.put('/pedido/:id/confirmar-pagamento', async (req, resp) => {
    try {
        const { id } = req.params;
        
        // Buscar dados do pedido
        const pedido = await reservaService.buscarReservaPorId(id);
        
        if (!pedido) {
            return resp.status(404).json({ erro: 'Pedido não encontrado' });
        }

        // Atualizar status
        await reservaService.confirmarReserva(id);

        // Enviar notificação WhatsApp
        try {
            const dadosNotificacao = {
                numero: `PED${String(id).padStart(6, '0')}`,
                cliente: {
                    nome: pedido.nomeCliente,
                    telefone: pedido.telefoneCliente
                }
            };

            await whatsappService.notificarPagamentoConfirmado(dadosNotificacao);
            console.log(`✅ Confirmação de pagamento enviada via WhatsApp - Pedido ${id}`);
        } catch (whatsappError) {
            console.error('⚠️ Erro ao enviar confirmação WhatsApp:', whatsappError.message);
        }

        resp.status(200).json({ 
            sucesso: true,
            mensagem: 'Pagamento confirmado!' 
        });

    } catch (err) {
        console.error('Erro ao confirmar pagamento:', err);
        resp.status(500).json({ erro: err.message });
    }
});

/**
 * PUT /pedido/:id/marcar-pronto
 * Marca pedido como pronto e notifica cliente
 */
endpoints.put('/pedido/:id/marcar-pronto', async (req, resp) => {
    try {
        const { id } = req.params;
        
        // Buscar dados do pedido
        const pedido = await reservaService.buscarReservaPorId(id);
        
        if (!pedido) {
            return resp.status(404).json({ erro: 'Pedido não encontrado' });
        }

        // Atualizar status para "pronto"
        await reservaService.atualizarStatusPedido(id, 'pronto');

        // Enviar notificação WhatsApp
        try {
            const dadosNotificacao = {
                numero: `PED${String(id).padStart(6, '0')}`,
                cliente: {
                    nome: pedido.nomeCliente,
                    telefone: pedido.telefoneCliente
                },
                pontoEntrega: pedido.pontoEntrega || pedido.enderecoEntrega
            };

            await whatsappService.notificarPedidoPronto(dadosNotificacao);
            console.log(`✅ Notificação de pedido pronto enviada - Pedido ${id}`);
        } catch (whatsappError) {
            console.error('⚠️ Erro ao enviar notificação WhatsApp:', whatsappError.message);
        }

        resp.status(200).json({ 
            sucesso: true,
            mensagem: 'Pedido marcado como pronto!' 
        });

    } catch (err) {
        console.error('Erro ao marcar pedido como pronto:', err);
        resp.status(500).json({ erro: err.message });
    }
});

/**
 * PUT /pedido/:id/cancelar
 * Cancela pedido e notifica cliente
 */
endpoints.put('/pedido/:id/cancelar', async (req, resp) => {
    try {
        const { id } = req.params;
        const { motivo, produtos } = req.body;
        
        // Buscar dados do pedido
        const pedido = await reservaService.buscarReservaPorId(id);
        
        if (!pedido) {
            return resp.status(404).json({ erro: 'Pedido não encontrado' });
        }

        // Cancelar e devolver ao estoque
        await reservaService.cancelarReserva(id, produtos);

        // Enviar notificação WhatsApp
        try {
            const dadosNotificacao = {
                numero: `PED${String(id).padStart(6, '0')}`,
                cliente: {
                    nome: pedido.nomeCliente,
                    telefone: pedido.telefoneCliente
                }
            };

            await whatsappService.notificarCancelamento(dadosNotificacao, motivo || 'Não especificado');
            console.log(`✅ Notificação de cancelamento enviada - Pedido ${id}`);
        } catch (whatsappError) {
            console.error('⚠️ Erro ao enviar notificação WhatsApp:', whatsappError.message);
        }

        resp.status(200).json({ 
            sucesso: true,
            mensagem: 'Pedido cancelado com sucesso!' 
        });

    } catch (err) {
        console.error('Erro ao cancelar pedido:', err);
        resp.status(500).json({ erro: err.message });
    }
});

export default endpoints;
