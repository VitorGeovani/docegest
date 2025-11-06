import whatsappHistoricoService from '../services/whatsappHistoricoService.js';
import whatsappService from '../services/whatsappService_EVOLUTION.js';
import connection from '../repository/connection.js';
import { Router } from 'express';

const endpoints = Router();

/**
 * RF049: Reenvio de Confirmação
 * RF027: Receber Pedidos via WhatsApp  
 * RF029: Sincronizar Mensagens
 * RF065: Consulta de Status
 */

/**
 * POST /whatsapp/reenviar-confirmacao/:idreserva
 * RF049: Reenviar confirmação de pedido
 */
endpoints.post('/whatsapp/reenviar-confirmacao/:idreserva', async (req, resp) => {
    try {
        const { idreserva } = req.params;

        // Buscar pedido
        const [pedidos] = await connection.query(
            `SELECT r.*, c.nome as nome_cliente, c.telefone
            FROM reserva r
            JOIN cliente c ON r.idcliente_fk = c.idcliente
            WHERE r.idreserva = ?`,
            [idreserva]
        );

        if (!pedidos || pedidos.length === 0) {
            return resp.status(404).json({ 
                erro: 'Pedido não encontrado' 
            });
        }

        const pedido = pedidos[0];

        // Reenviar notificação
        await whatsappService.notificarPedido(pedido);

        // Salvar no histórico
        await whatsappHistoricoService.salvarMensagem(
            pedido.telefone,
            `Confirmação reenviada do pedido #${pedido.codigo_pedido}`,
            'confirmacao_reenvio',
            idreserva
        );

        resp.status(200).json({
            sucesso: true,
            mensagem: 'Confirmação reenviada com sucesso',
            pedido: {
                codigo: pedido.codigo_pedido,
                telefone: pedido.telefone
            }
        });

    } catch (error) {
        console.error('Erro ao reenviar confirmação:', error);
        resp.status(500).json({ 
            erro: 'Erro ao reenviar confirmação',
            detalhes: error.message 
        });
    }
});

    /**
     * GET /whatsapp/historico/cliente/:telefone
     * RF029: Buscar histórico de mensagens de um cliente
     */
    endpoints.get('/whatsapp/historico/cliente/:telefone', async (req, resp) => {
        try {
            const { telefone } = req.params;

            const historico = await whatsappHistoricoService.buscarHistoricoCliente(telefone);

            resp.status(200).json({
                telefone,
                total_mensagens: historico.length,
                mensagens: historico
            });

        } catch (error) {
            console.error('Erro ao buscar histórico do cliente:', error);
            resp.status(500).json({ 
                erro: 'Erro ao buscar histórico',
                detalhes: error.message 
            });
        }
    });

    /**
     * GET /whatsapp/historico/pedido/:idreserva
     * RF029: Buscar histórico de mensagens de um pedido
     */
    endpoints.get('/whatsapp/historico/pedido/:idreserva', async (req, resp) => {
        try {
            const { idreserva } = req.params;

            const historico = await whatsappHistoricoService.buscarHistoricoPedido(idreserva);

            resp.status(200).json({
                idreserva: parseInt(idreserva),
                total_mensagens: historico.length,
                mensagens: historico
            });

        } catch (error) {
            console.error('Erro ao buscar histórico do pedido:', error);
            resp.status(500).json({ 
                erro: 'Erro ao buscar histórico',
                detalhes: error.message 
            });
        }
    });

    /**
     * POST /whatsapp/webhook
     * RF027 e RF065: Webhook para receber mensagens do WhatsApp
     * Integração com Evolution API
     */
    endpoints.post('/whatsapp/webhook', async (req, resp) => {
        try {
            console.log('📥 Webhook recebido:', JSON.stringify(req.body, null, 2));

            const { event, data } = req.body;

            // Processar apenas mensagens recebidas
            if (event === 'messages.upsert' && data) {
                const message = data.message || data;
                const from = message.key?.remoteJid || message.from;
                const messageText = message.message?.conversation || 
                                   message.message?.extendedTextMessage?.text ||
                                   message.body;

                if (from && messageText) {
                    // Limpar número de telefone
                    const telefone = from.replace('@s.whatsapp.net', '');

                    console.log(`💬 Mensagem de ${telefone}: ${messageText}`);

                    // Processar mensagem
                    const resposta = await whatsappHistoricoService.processarMensagemRecebida(
                        telefone, 
                        messageText
                    );

                    // Enviar resposta automática
                    if (resposta && resposta.resposta) {
                        await whatsappService.enviarMensagem(telefone, resposta.resposta);

                        // Salvar resposta no histórico
                        await whatsappHistoricoService.salvarMensagem(
                            telefone,
                            resposta.resposta,
                            resposta.tipo,
                            null
                        );
                    }
                }
            }

            // Responder OK para o webhook
            resp.status(200).json({ received: true });

        } catch (error) {
            console.error('❌ Erro ao processar webhook:', error);
            // Sempre retornar 200 para não causar reenvios
            resp.status(200).json({ 
                received: true, 
                error: error.message 
            });
        }
    });

    /**
     * POST /whatsapp/consultar-status
     * RF065: Cliente consulta status do pedido via API
     */
    endpoints.post('/whatsapp/consultar-status', async (req, resp) => {
        try {
            const { telefone } = req.body;

            if (!telefone) {
                return resp.status(400).json({ 
                    erro: 'Telefone é obrigatório' 
                });
            }

            const resultado = await whatsappHistoricoService.responderConsultaStatus(telefone);

            resp.status(200).json({
                sucesso: true,
                tipo: resultado.tipo,
                mensagem: resultado.resposta
            });

        } catch (error) {
            console.error('Erro ao consultar status:', error);
            resp.status(500).json({ 
                erro: 'Erro ao consultar status',
                detalhes: error.message 
            });
        }
    });

    /**
     * POST /whatsapp/enviar-mensagem-manual
     * Enviar mensagem manual para um cliente
     */
    endpoints.post('/whatsapp/enviar-mensagem-manual', async (req, resp) => {
        try {
            const { telefone, mensagem, idreserva } = req.body;

            if (!telefone || !mensagem) {
                return resp.status(400).json({ 
                    erro: 'Telefone e mensagem são obrigatórios' 
                });
            }

            // Enviar mensagem
            await whatsappService.enviarMensagem(telefone, mensagem);

            // Salvar no histórico
            await whatsappHistoricoService.salvarMensagem(
                telefone,
                mensagem,
                'manual',
                idreserva || null
            );

            resp.status(200).json({
                sucesso: true,
                mensagem: 'Mensagem enviada com sucesso'
            });

        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
            resp.status(500).json({ 
                erro: 'Erro ao enviar mensagem',
                detalhes: error.message 
            });
        }
    });

    /**
     * GET /whatsapp/estatisticas
     * Estatísticas de mensagens enviadas
     */
    endpoints.get('/whatsapp/estatisticas', async (req, resp) => {
        try {
            const [stats] = await connection.query(`
                SELECT 
                    COUNT(*) as total_mensagens,
                    COUNT(DISTINCT telefone) as clientes_unicos,
                    SUM(CASE WHEN tipo = 'confirmacao' THEN 1 ELSE 0 END) as confirmacoes,
                    SUM(CASE WHEN tipo = 'status' THEN 1 ELSE 0 END) as atualizacoes_status,
                    SUM(CASE WHEN tipo = 'confirmacao_reenvio' THEN 1 ELSE 0 END) as reenvios,
                    SUM(CASE WHEN direcao = 'entrada' THEN 1 ELSE 0 END) as mensagens_recebidas,
                    SUM(CASE WHEN direcao = 'saida' THEN 1 ELSE 0 END) as mensagens_enviadas
                FROM mensagens_whatsapp
                WHERE DATE(data_envio) >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
            `);

            resp.status(200).json({
                periodo: 'Últimos 30 dias',
                estatisticas: stats[0]
            });

        } catch (error) {
            console.error('Erro ao buscar estatísticas:', error);
            resp.status(500).json({ 
                erro: 'Erro ao buscar estatísticas',
                detalhes: error.message 
            });
        }
    });

export default endpoints;
