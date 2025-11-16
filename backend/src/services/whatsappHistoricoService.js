import connection from '../repository/connection.js';
import whatsappService from './whatsappService_EVOLUTION.js';

/**
 * RF049: Reenvio de Confirmação de Pedido
 * RF027/RF029: Sistema de Mensagens WhatsApp
 * RF065: Consulta de Status via WhatsApp
 */

class WhatsAppHistoricoService {
    /**
     * Formatar data corretamente sem problemas de timezone
     * @param {string|Date} data - Data no formato YYYY-MM-DD ou objeto Date
     * @returns {string} Data formatada em DD/MM/YYYY
     */
    formatarData(data) {
        if (!data) return 'Data não disponível';
        
        // Se vier como string do MySQL (YYYY-MM-DD), usar diretamente
        if (typeof data === 'string' && data.includes('-')) {
            const partes = data.split('T')[0].split('-'); // Remove hora se houver
            const ano = partes[0];
            const mes = partes[1];
            const dia = partes[2];
            return `${dia}/${mes}/${ano}`;
        }
        
        // Se for Date, usar toLocaleDateString
        if (data instanceof Date) {
            return data.toLocaleDateString('pt-BR');
        }
        
        // Fallback: tentar converter
        try {
            return new Date(data).toLocaleDateString('pt-BR');
        } catch {
            return 'Data inválida';
        }
    }

    /**
     * Salva mensagem enviada no histórico
     */
    async salvarMensagem(telefone, mensagem, tipo, idreserva = null) {
        try {
            await connection.query(
                `INSERT INTO mensagens_whatsapp 
                (telefone, mensagem, tipo, idreserva_fk, data_envio, status)
                VALUES (?, ?, ?, ?, NOW(), 'enviado')`,
                [telefone, mensagem, tipo, idreserva]
            );
        } catch (error) {
            console.error('Erro ao salvar mensagem no histórico:', error);
            // Não lança erro para não interromper o fluxo principal
        }
    }

    /**
     * RF029: Busca histórico de mensagens de um cliente
     */
    async buscarHistoricoCliente(telefone) {
        try {
            const [mensagens] = await connection.query(
                `SELECT 
                    m.*,
                    r.codigo_pedido,
                    r.status as status_pedido
                FROM mensagens_whatsapp m
                LEFT JOIN reserva r ON m.idreserva_fk = r.idreserva
                WHERE m.telefone = ?
                ORDER BY m.data_envio DESC
                LIMIT 50`,
                [telefone]
            );

            return mensagens;
        } catch (error) {
            console.error('Erro ao buscar histórico:', error);
            throw error;
        }
    }

    /**
     * RF029: Busca histórico de mensagens de um pedido
     */
    async buscarHistoricoPedido(idreserva) {
        try {
            const [mensagens] = await connection.query(
                `SELECT * FROM mensagens_whatsapp
                WHERE idreserva_fk = ?
                ORDER BY data_envio ASC`,
                [idreserva]
            );

            return mensagens;
        } catch (error) {
            console.error('Erro ao buscar histórico do pedido:', error);
            throw error;
        }
    }

    /**
     * Atualiza status de uma mensagem
     */
    async atualizarStatus(idmensagem, status) {
        try {
            await connection.query(
                `UPDATE mensagens_whatsapp 
                SET status = ?, data_status = NOW()
                WHERE idmensagem = ?`,
                [status, idmensagem]
            );
        } catch (error) {
            console.error('Erro ao atualizar status da mensagem:', error);
        }
    }

    /**
     * RF065: Processa mensagem recebida do cliente (webhook)
     */
    async processarMensagemRecebida(telefone, mensagem) {
        try {
            // Salvar mensagem recebida
            await connection.query(
                `INSERT INTO mensagens_whatsapp 
                (telefone, mensagem, tipo, data_envio, status, direcao)
                VALUES (?, ?, 'recebida', NOW(), 'lido', 'entrada')`,
                [telefone, mensagem]
            );

            // Identificar intenção da mensagem
            const mensagemLower = mensagem.toLowerCase().trim();

            // Consultar status de pedido
            if (mensagemLower.includes('status') || 
                mensagemLower.includes('pedido') || 
                mensagemLower.includes('onde está')) {
                return await this.responderConsultaStatus(telefone);
            }

            // Reenviar confirmação
            if (mensagemLower.includes('confirmação') || 
                mensagemLower.includes('confirmar') || 
                mensagemLower.includes('reenviar')) {
                return await this.responderReenvioConfirmacao(telefone);
            }

            // Cancelar pedido
            if (mensagemLower.includes('cancelar')) {
                return await this.responderCancelamento(telefone);
            }

            // Menu de ajuda
            if (mensagemLower.includes('ajuda') || 
                mensagemLower.includes('menu') || 
                mensagemLower === 'oi' || 
                mensagemLower === 'olá') {
                return this.gerarMenuAjuda();
            }

            // Resposta padrão
            return {
                tipo: 'ajuda',
                resposta: '❓ Não entendi sua mensagem.\n\n' + this.gerarMenuAjuda()
            };

        } catch (error) {
            console.error('Erro ao processar mensagem recebida:', error);
            return {
                tipo: 'erro',
                resposta: '⚠️ Desculpe, ocorreu um erro. Por favor, tente novamente em alguns instantes.'
            };
        }
    }

    /**
     * RF065: Responde consulta de status de pedido
     */
    async responderConsultaStatus(telefone) {
        try {
            // Buscar último pedido do cliente
            const [pedidos] = await connection.query(
                `SELECT r.*, c.nome as nome_cliente
                FROM reserva r
                JOIN cliente c ON r.idcliente_fk = c.idcliente
                WHERE c.telefone = ?
                AND r.status NOT IN ('Cancelado', 'Entregue')
                ORDER BY r.data_criacao DESC
                LIMIT 1`,
                [telefone]
            );

            if (!pedidos || pedidos.length === 0) {
                return {
                    tipo: 'status',
                    resposta: '📦 Não encontrei pedidos ativos no momento.\n\n' +
                             'Se você fez um pedido recentemente, aguarde alguns instantes.'
                };
            }

            const pedido = pedidos[0];
            const statusEmoji = this.getStatusEmoji(pedido.status);

            return {
                tipo: 'status',
                resposta: `${statusEmoji} *Status do Pedido #${pedido.codigo_pedido}*\n\n` +
                         `Status: *${pedido.status}*\n` +
                         `Data do Pedido: ${this.formatarData(pedido.data_criacao)}\n` +
                         `${pedido.data_entrega ? `Previsão: ${this.formatarData(pedido.data_entrega)} às ${pedido.hora_entrega}\n` : ''}` +
                         `Valor: R$ ${parseFloat(pedido.valor_total).toFixed(2)}\n\n` +
                         this.getStatusDescricao(pedido.status)
            };

        } catch (error) {
            console.error('Erro ao consultar status:', error);
            throw error;
        }
    }

    /**
     * RF049: Responde solicitação de reenvio de confirmação
     */
    async responderReenvioConfirmacao(telefone) {
        try {
            // Buscar último pedido do cliente
            const [pedidos] = await connection.query(
                `SELECT r.*, c.nome as nome_cliente
                FROM reserva r
                JOIN cliente c ON r.idcliente_fk = c.idcliente
                WHERE c.telefone = ?
                ORDER BY r.data_criacao DESC
                LIMIT 1`,
                [telefone]
            );

            if (!pedidos || pedidos.length === 0) {
                return {
                    tipo: 'confirmacao',
                    resposta: '❌ Não encontrei pedidos para este número.\n\n' +
                             'Verifique se o número está correto.'
                };
            }

            const pedido = pedidos[0];

            // Reenviar confirmação
            await whatsappService.notificarPedido(pedido);

            return {
                tipo: 'confirmacao',
                resposta: '✅ *Confirmação Reenviada!*\n\n' +
                         `Pedido #${pedido.codigo_pedido}\n` +
                         `Status: ${pedido.status}\n` +
                         `Valor: R$ ${parseFloat(pedido.valor_total).toFixed(2)}`
            };

        } catch (error) {
            console.error('Erro ao reenviar confirmação:', error);
            throw error;
        }
    }

    /**
     * Responde solicitação de cancelamento
     */
    async responderCancelamento(telefone) {
        try {
            // Buscar último pedido cancelável
            const [pedidos] = await connection.query(
                `SELECT r.*
                FROM reserva r
                JOIN cliente c ON r.idcliente_fk = c.idcliente
                WHERE c.telefone = ?
                AND r.status IN ('Pendente', 'Confirmado')
                AND TIMESTAMPDIFF(HOUR, r.data_criacao, NOW()) < 24
                ORDER BY r.data_criacao DESC
                LIMIT 1`,
                [telefone]
            );

            if (!pedidos || pedidos.length === 0) {
                return {
                    tipo: 'cancelamento',
                    resposta: '⚠️ Não há pedidos que possam ser cancelados no momento.\n\n' +
                             'Pedidos só podem ser cancelados nas primeiras 24 horas.\n' +
                             'Para cancelamentos, entre em contato conosco.'
                };
            }

            const pedido = pedidos[0];

            return {
                tipo: 'cancelamento',
                resposta: `📋 *Pedido #${pedido.codigo_pedido}*\n\n` +
                         `Para cancelar, responda: CONFIRMAR CANCELAMENTO\n\n` +
                         `⚠️ Atenção: Esta ação não pode ser desfeita.`
            };

        } catch (error) {
            console.error('Erro ao processar cancelamento:', error);
            throw error;
        }
    }

    /**
     * Gera menu de ajuda
     */
    gerarMenuAjuda() {
        return `🍰 *Segredo do Sabor - Menu de Ajuda*\n\n` +
               `Envie uma das opções:\n\n` +
               `📦 *STATUS* - Consultar status do pedido\n` +
               `✉️ *CONFIRMAÇÃO* - Reenviar confirmação\n` +
               `❌ *CANCELAR* - Cancelar pedido\n` +
               `🛒 *CARDÁPIO* - Ver produtos\n` +
               `📞 *CONTATO* - Falar com atendente\n\n` +
               `Ou faça seu pedido em:\n` +
               `🌐 www.segredodosabor.com.br`;
    }

    /**
     * Retorna emoji baseado no status
     */
    getStatusEmoji(status) {
        const emojis = {
            'Pendente': '⏳',
            'Confirmado': '✅',
            'Em Produção': '👨‍🍳',
            'Pronto': '🎉',
            'Saiu para Entrega': '🚚',
            'Entregue': '✅',
            'Cancelado': '❌'
        };
        return emojis[status] || '📦';
    }

    /**
     * Retorna descrição do status
     */
    getStatusDescricao(status) {
        const descricoes = {
            'Pendente': 'Aguardando confirmação do estabelecimento.',
            'Confirmado': 'Pedido confirmado! Em breve começaremos a preparar.',
            'Em Produção': 'Seu pedido está sendo preparado com carinho! 👨‍🍳',
            'Pronto': 'Seu pedido está pronto! Pode vir buscar. 🎉',
            'Saiu para Entrega': 'Pedido a caminho! Logo chega. 🚚',
            'Entregue': 'Pedido entregue! Aproveite! 😋',
            'Cancelado': 'Este pedido foi cancelado.'
        };
        return descricoes[status] || 'Status em atualização.';
    }
}

export default new WhatsAppHistoricoService();
