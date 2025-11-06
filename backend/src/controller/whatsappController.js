import whatsappService from '../services/whatsappService.js';
import connection from '../repository/connection.js';
import { Router } from 'express';

const endpoints = Router();

/**
 * Controller para gerenciar notificações WhatsApp
 * Endpoints para envio manual e automático de mensagens
 */

/**
 * GET /whatsapp/config
 * Retorna configuração atual do WhatsApp
 */
endpoints.get('/whatsapp/config', async (req, res) => {
    try {
        const config = {
            configured: !whatsappService.isDemoMode(),
            demoMode: whatsappService.isDemoMode(),
            businessPhone: whatsappService.getNumeroWhatsApp(),
            message: whatsappService.isDemoMode() 
                ? 'WhatsApp rodando em modo demo. Configure as variáveis de ambiente para ativar.' 
                : 'WhatsApp Business API configurado e operacional'
        };

        res.status(200).json(config);
    } catch (error) {
        console.error('Erro ao buscar config WhatsApp:', error);
        res.status(500).json({ error: 'Erro ao buscar configuração' });
    }
});

/**
 * POST /whatsapp/enviar
 * Envia mensagem manual para um número
 * Body: { telefone, mensagem }
 */
endpoints.post('/whatsapp/enviar', async (req, res) => {
    try {
        const { telefone, mensagem } = req.body;

        if (!telefone || !mensagem) {
            return res.status(400).json({ error: 'Telefone e mensagem são obrigatórios' });
        }

        const resultado = await whatsappService.enviarMensagem(telefone, mensagem);

        res.status(200).json({
            success: true,
            demo: resultado.demo || false,
            message: resultado.demo 
                ? 'Mensagem registrada (modo demo)' 
                : 'Mensagem enviada com sucesso'
        });
    } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /whatsapp/notificar-pedido/:pedidoId
 * Envia notificação de pedido recebido
 */
endpoints.post('/whatsapp/notificar-pedido/:pedidoId', async (req, res) => {
    try {
        const { pedidoId } = req.params;

        // Buscar dados do pedido no banco
        const [pedidos] = await connection.query(
            `SELECT r.*, c.nome as cliente_nome, c.email, c.telefone
             FROM tb_reserva r
             INNER JOIN tb_cliente c ON r.id_cliente = c.id_cliente
             WHERE r.id_reserva = ?`,
            [pedidoId]
        );

        if (pedidos.length === 0) {
            return res.status(404).json({ error: 'Pedido não encontrado' });
        }

        const pedido = pedidos[0];

        // Buscar itens do pedido
        const [itens] = await connection.query(
            `SELECT p.nome_produto as nome, rp.quantidade, p.preco
             FROM tb_reserva_produto rp
             INNER JOIN tb_produto p ON rp.id_produto = p.id_produto
             WHERE rp.id_reserva = ?`,
            [pedidoId]
        );

        // Montar objeto do pedido
        const pedidoCompleto = {
            numero: pedido.id_reserva,
            cliente: {
                nome: pedido.cliente_nome,
                telefone: pedido.telefone
            },
            itens: itens,
            total: parseFloat(pedido.valor_total || 0),
            metodoPagamento: pedido.forma_pagamento || 'PIX',
            pontoEntrega: pedido.ponto_entrega || 'Loja Principal'
        };

        // Enviar notificação
        await whatsappService.notificarPedidoRecebido(pedidoCompleto);

        res.status(200).json({
            success: true,
            message: 'Notificação de pedido enviada com sucesso'
        });
    } catch (error) {
        console.error('Erro ao notificar pedido:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /whatsapp/confirmar-pagamento/:pedidoId
 * Envia notificação de pagamento confirmado
 */
endpoints.post('/whatsapp/confirmar-pagamento/:pedidoId', async (req, res) => {
    try {
        const { pedidoId } = req.params;

        const [pedidos] = await connection.query(
            `SELECT r.*, c.nome as cliente_nome, c.telefone
             FROM tb_reserva r
             INNER JOIN tb_cliente c ON r.id_cliente = c.id_cliente
             WHERE r.id_reserva = ?`,
            [pedidoId]
        );

        if (pedidos.length === 0) {
            return res.status(404).json({ error: 'Pedido não encontrado' });
        }

        const pedido = {
            numero: pedidos[0].id_reserva,
            cliente: {
                nome: pedidos[0].cliente_nome,
                telefone: pedidos[0].telefone
            }
        };

        await whatsappService.notificarPagamentoConfirmado(pedido);

        // Atualizar status do pedido no banco
        await connection.query(
            `UPDATE tb_reserva SET status_pagamento = 'confirmado' WHERE id_reserva = ?`,
            [pedidoId]
        );

        res.status(200).json({
            success: true,
            message: 'Confirmação de pagamento enviada'
        });
    } catch (error) {
        console.error('Erro ao confirmar pagamento:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /whatsapp/pedido-pronto/:pedidoId
 * Notifica que o pedido está pronto para retirada
 */
endpoints.post('/whatsapp/pedido-pronto/:pedidoId', async (req, res) => {
    try {
        const { pedidoId } = req.params;

        const [pedidos] = await connection.query(
            `SELECT r.*, c.nome as cliente_nome, c.telefone
             FROM tb_reserva r
             INNER JOIN tb_cliente c ON r.id_cliente = c.id_cliente
             WHERE r.id_reserva = ?`,
            [pedidoId]
        );

        if (pedidos.length === 0) {
            return res.status(404).json({ error: 'Pedido não encontrado' });
        }

        const pedido = {
            numero: pedidos[0].id_reserva,
            cliente: {
                nome: pedidos[0].cliente_nome,
                telefone: pedidos[0].telefone
            },
            pontoEntrega: pedidos[0].ponto_entrega || 'Loja Principal'
        };

        await whatsappService.notificarPedidoPronto(pedido);

        // Atualizar status do pedido
        await connection.query(
            `UPDATE tb_reserva SET status_pedido = 'pronto' WHERE id_reserva = ?`,
            [pedidoId]
        );

        res.status(200).json({
            success: true,
            message: 'Notificação de pedido pronto enviada'
        });
    } catch (error) {
        console.error('Erro ao notificar pedido pronto:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /whatsapp/lembrete-retirada/:pedidoId
 * Envia lembrete de retirada
 */
endpoints.post('/whatsapp/lembrete-retirada/:pedidoId', async (req, res) => {
    try {
        const { pedidoId } = req.params;

        const [pedidos] = await connection.query(
            `SELECT r.*, c.nome as cliente_nome, c.telefone
             FROM tb_reserva r
             INNER JOIN tb_cliente c ON r.id_cliente = c.id_cliente
             WHERE r.id_reserva = ? AND status_pedido = 'pronto'`,
            [pedidoId]
        );

        if (pedidos.length === 0) {
            return res.status(404).json({ error: 'Pedido não encontrado ou não está pronto' });
        }

        const pedido = {
            numero: pedidos[0].id_reserva,
            cliente: {
                nome: pedidos[0].cliente_nome,
                telefone: pedidos[0].telefone
            },
            pontoEntrega: pedidos[0].ponto_entrega || 'Loja Principal'
        };

        await whatsappService.enviarLembreteRetirada(pedido);

        res.status(200).json({
            success: true,
            message: 'Lembrete de retirada enviado'
        });
    } catch (error) {
        console.error('Erro ao enviar lembrete:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /whatsapp/agradecimento/:pedidoId
 * Envia agradecimento pós-entrega
 */
endpoints.post('/whatsapp/agradecimento/:pedidoId', async (req, res) => {
    try {
        const { pedidoId } = req.params;

        const [pedidos] = await connection.query(
            `SELECT r.*, c.nome as cliente_nome, c.telefone
             FROM tb_reserva r
             INNER JOIN tb_cliente c ON r.id_cliente = c.id_cliente
             WHERE r.id_reserva = ?`,
            [pedidoId]
        );

        if (pedidos.length === 0) {
            return res.status(404).json({ error: 'Pedido não encontrado' });
        }

        const pedido = {
            numero: pedidos[0].id_reserva,
            cliente: {
                nome: pedidos[0].cliente_nome,
                telefone: pedidos[0].telefone
            }
        };

        await whatsappService.enviarAgradecimento(pedido);

        res.status(200).json({
            success: true,
            message: 'Agradecimento enviado'
        });
    } catch (error) {
        console.error('Erro ao enviar agradecimento:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /whatsapp/webhook
 * RF027: Webhook para receber notificações do WhatsApp
 */
endpoints.post('/whatsapp/webhook', async (req, res) => {
    try {
        // Verificação do webhook (primeiro setup)
        if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token']) {
            const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || 'segredodosabor2025';
            
            if (req.query['hub.verify_token'] === verifyToken) {
                console.log('✅ Webhook verificado com sucesso');
                return res.status(200).send(req.query['hub.challenge']);
            } else {
                console.error('❌ Token de verificação inválido');
                return res.status(403).send('Token inválido');
            }
        }

        // Processar eventos recebidos
        const body = req.body;
        
        if (body.object === 'whatsapp_business_account') {
            for (const entry of body.entry || []) {
                for (const change of entry.changes || []) {
                    // Processar mensagens recebidas
                    if (change.value.messages) {
                        for (const message of change.value.messages) {
                            const from = message.from;
                            const messageId = message.id;
                            const messageBody = message.text?.body || '';

                            console.log(`📩 Mensagem recebida de ${from}: ${messageBody}`);

                            // Processar mensagem
                            await whatsappService.processarMensagemRecebida(
                                from,
                                messageBody,
                                messageId
                            );
                        }
                    }

                    // Processar status de mensagens (entregue, lido)
                    if (change.value.statuses) {
                        for (const status of change.value.statuses) {
                            const messageId = status.id;
                            const statusType = status.status; // sent, delivered, read, failed

                            console.log(`📊 Status atualizado: ${messageId} -> ${statusType}`);

                            // Atualizar status no banco
                            const statusMap = {
                                'sent': 'enviado',
                                'delivered': 'entregue',
                                'read': 'lido',
                                'failed': 'falha'
                            };

                            if (statusMap[statusType]) {
                                await connection.query(
                                    `UPDATE tb_mensagens_whatsapp 
                                     SET status_envio = ?,
                                         data_hora_entrega = CASE WHEN ? = 'entregue' THEN NOW() ELSE data_hora_entrega END,
                                         data_hora_leitura = CASE WHEN ? = 'lido' THEN NOW() ELSE data_hora_leitura END
                                     WHERE whatsapp_message_id = ?`,
                                    [statusMap[statusType], statusMap[statusType], statusMap[statusType], messageId]
                                );
                            }
                        }
                    }
                }
            }

            res.status(200).send('EVENT_RECEIVED');
        } else {
            res.status(404).send('Not Found');
        }
    } catch (error) {
        console.error('Erro no webhook:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /whatsapp/webhook
 * Verificação do webhook (Meta requer GET)
 */
endpoints.get('/whatsapp/webhook', (req, res) => {
    const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || 'segredodosabor2025';
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === verifyToken) {
        console.log('✅ Webhook verificado via GET');
        res.status(200).send(challenge);
    } else {
        res.status(403).send('Forbidden');
    }
});

/**
 * GET /whatsapp/historico/:telefone
 * RF029: Buscar histórico de mensagens
 */
endpoints.get('/whatsapp/historico/:telefone', async (req, res) => {
    try {
        const { telefone } = req.params;
        const limite = parseInt(req.query.limite) || 50;

        const historico = await whatsappService.buscarHistorico(telefone, limite);

        res.status(200).json({
            success: true,
            telefone,
            total: historico.length,
            mensagens: historico
        });
    } catch (error) {
        console.error('Erro ao buscar histórico:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /whatsapp/estatisticas
 * RF065: Buscar estatísticas de mensagens
 */
endpoints.get('/whatsapp/estatisticas', async (req, res) => {
    try {
        const dataInicio = req.query.dataInicio || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const dataFim = req.query.dataFim || new Date().toISOString().split('T')[0];

        const estatisticas = await whatsappService.buscarEstatisticas(dataInicio, dataFim);

        res.status(200).json({
            success: true,
            periodo: { inicio: dataInicio, fim: dataFim },
            estatisticas
        });
    } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /whatsapp/status
 * RF065: Status do bot em tempo real
 */
endpoints.get('/whatsapp/status', async (req, res) => {
    try {
        const status = await whatsappService.buscarStatusBot();

        res.status(200).json({
            success: true,
            status
        });
    } catch (error) {
        console.error('Erro ao buscar status:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /whatsapp/mensagens/:pedidoId
 * Buscar mensagens de um pedido específico
 */
endpoints.get('/whatsapp/mensagens/:pedidoId', async (req, res) => {
    try {
        const { pedidoId } = req.params;

        const [mensagens] = await connection.query(
            `SELECT * FROM tb_mensagens_whatsapp
             WHERE id_reserva = ?
             ORDER BY data_hora_envio DESC`,
            [pedidoId]
        );

        res.status(200).json({
            success: true,
            pedidoId,
            total: mensagens.length,
            mensagens
        });
    } catch (error) {
        console.error('Erro ao buscar mensagens do pedido:', error);
        res.status(500).json({ error: error.message });
    }
});

export default endpoints;
