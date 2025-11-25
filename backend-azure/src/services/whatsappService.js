import axios from 'axios';
import mensagemRepository from '../repository/mensagemWhatsAppRepository.js';

/**
 * Serviço de integração com WhatsApp via Evolution API
 * RF027, RF029, RF065 - Sistema completo de mensageria
 * 
 * CONFIGURAÇÃO (via Evolution API):
 * Variáveis de ambiente necessárias:
 *    - EVOLUTION_API_URL (ex: http://localhost:8080)
 *    - EVOLUTION_API_KEY (chave de API)
 *    - EVOLUTION_INSTANCE_NAME (nome da instância)
 */

class WhatsAppService {
    constructor() {
        // Configurações Evolution API
        this.evolutionApiUrl = process.env.EVOLUTION_API_URL || 'http://localhost:8080';
        this.evolutionApiKey = process.env.EVOLUTION_API_KEY || '';
        this.evolutionInstance = process.env.EVOLUTION_INSTANCE_NAME || '';
        
        // Se não houver configuração completa, modo de demonstração
        this.demoMode = !this.evolutionApiKey || !this.evolutionInstance;
        
        if (this.demoMode) {
            console.warn('⚠️  WhatsApp Service rodando em MODO DEMO (Evolution API não configurado)');
        } else {
            console.log('✅ WhatsApp conectado via Evolution API');
        }
    }

    /**
     * Envia uma mensagem de texto via WhatsApp Business API
     * RF029: Registra a mensagem no histórico
     */
    async enviarMensagem(telefone, mensagem, idReserva = null, tipoNotificacao = null) {
        const telefoneFormatado = this.formatarTelefone(telefone);
        let whatsappMessageId = null;
        
        try {
            if (this.demoMode) {
                console.log(`📱 [DEMO] WhatsApp para ${telefoneFormatado}: ${mensagem}`);
                whatsappMessageId = `demo_${Date.now()}`;
            } else {
                // Enviar via Evolution API
                const response = await axios.post(
                    `${this.evolutionApiUrl}/message/sendText/${this.evolutionInstance}`,
                    {
                        number: telefoneFormatado,
                        textMessage: {
                            text: mensagem
                        },
                        delay: 1200
                    },
                    {
                        headers: {
                            'apikey': this.evolutionApiKey,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                
                console.log(`✅ Mensagem WhatsApp enviada para ${telefoneFormatado}`);
                whatsappMessageId = response.data?.key?.id || `evo_${Date.now()}`;
            }

            // RF029: Registrar mensagem no histórico
            await mensagemRepository.registrarMensagemEnviada({
                idReserva,
                telefone: telefoneFormatado,
                conteudo: mensagem,
                tipoNotificacao,
                whatsappMessageId
            });

            return { success: true, messageId: whatsappMessageId, demo: this.demoMode };
        } catch (error) {
            console.error('❌ Erro ao enviar WhatsApp:', error.response?.data?.error || error.message);
            
            // Registrar erro no banco
            try {
                await mensagemRepository.registrarMensagemEnviada({
                    idReserva,
                    telefone: telefoneFormatado,
                    conteudo: mensagem,
                    tipoNotificacao,
                    whatsappMessageId: null
                });
            } catch (dbError) {
                console.error('Erro ao registrar mensagem falhada:', dbError);
            }
            
            throw new Error('Falha ao enviar mensagem WhatsApp');
        }
    }

    /**
     * Envia mensagem usando template aprovado
     */
    async enviarTemplate(telefone, templateName, parametros = []) {
        if (this.demoMode) {
            console.log(`📱 [DEMO] WhatsApp Template "${templateName}" para ${telefone}`);
            return { success: true, demo: true };
        }

        try {
            const response = await axios.post(
                `${this.apiUrl}/${this.phoneNumberId}/messages`,
                {
                    messaging_product: 'whatsapp',
                    to: this.formatarTelefone(telefone),
                    type: 'template',
                    template: {
                        name: templateName,
                        language: { code: 'pt_BR' },
                        components: parametros.length > 0 ? [
                            {
                                type: 'body',
                                parameters: parametros.map(p => ({ type: 'text', text: p }))
                            }
                        ] : []
                    }
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            return { success: true, data: response.data };
        } catch (error) {
            console.error('Erro ao enviar template WhatsApp:', error.response?.data || error.message);
            throw new Error('Falha ao enviar template WhatsApp');
        }
    }

    /**
     * NOTIFICAÇÕES ESPECÍFICAS DO SISTEMA
     */

    // RF026: Notificação de pedido recebido
    async notificarPedidoRecebido(pedido) {
        const mensagem = `🎉 *Pedido Confirmado!*\n\n` +
            `Olá *${pedido.cliente.nome}*!\n\n` +
            `Recebemos seu pedido *#${pedido.numero}* com sucesso!\n\n` +
            `📦 *Resumo do Pedido:*\n` +
            pedido.itens.map(item => `• ${item.quantidade}x ${item.nome}`).join('\n') +
            `\n\n💰 *Total:* R$ ${pedido.total.toFixed(2)}\n` +
            `💳 *Pagamento:* ${pedido.metodoPagamento}\n\n` +
            `Assim que confirmarmos seu pagamento, você receberá outra mensagem.\n\n` +
            `Dúvidas? Responda esta mensagem!`;

        return await this.enviarMensagem(
            pedido.cliente.telefone, 
            mensagem, 
            pedido.id || pedido.idreserva,
            'pedido_recebido'
        );
    }

    // RF027: Confirmação de pagamento
    async notificarPagamentoConfirmado(pedido) {
        const mensagem = `✅ *Pagamento Confirmado!*\n\n` +
            `Olá *${pedido.cliente.nome}*!\n\n` +
            `Confirmamos o pagamento do seu pedido *#${pedido.numero}*!\n\n` +
            `Já iniciamos a preparação dos seus doces. Em breve você receberá uma notificação quando estiverem prontos! 🧁\n\n` +
            `Obrigado pela preferência! 💜`;

        return await this.enviarMensagem(
            pedido.cliente.telefone, 
            mensagem,
            pedido.id || pedido.idreserva,
            'pagamento_confirmado'
        );
    }

    // RF028: Pedido pronto para retirada
    async notificarPedidoPronto(pedido) {
        const mensagem = `🎊 *Pedido Pronto!*\n\n` +
            `Olá *${pedido.cliente.nome}*!\n\n` +
            `Seu pedido *#${pedido.numero}* está prontinho e esperando por você! 😍\n\n` +
            `📍 *Local de Retirada:*\n${pedido.pontoEntrega}\n\n` +
            `Estamos te esperando!\n\n` +
            `_Lembre-se de trazer este número do pedido: *#${pedido.numero}*_`;

        return await this.enviarMensagem(
            pedido.cliente.telefone, 
            mensagem,
            pedido.id || pedido.idreserva,
            'pedido_pronto'
        );
    }

    // RF029: Lembrete de retirada
    async enviarLembreteRetirada(pedido) {
        const mensagem = `⏰ *Lembrete de Retirada*\n\n` +
            `Olá *${pedido.cliente.nome}*!\n\n` +
            `Seu pedido *#${pedido.numero}* continua te esperando! 🥰\n\n` +
            `📍 *Local:* ${pedido.pontoEntrega}\n\n` +
            `Não se esqueça de buscar seus doces deliciosos!\n\n` +
            `Qualquer dúvida, é só responder esta mensagem.`;

        return await this.enviarMensagem(
            pedido.cliente.telefone, 
            mensagem,
            pedido.id || pedido.idreserva,
            'lembrete'
        );
    }

    // RF030: Agradecimento pós-entrega
    async enviarAgradecimento(pedido) {
        const mensagem = `💜 *Obrigado pela preferência!*\n\n` +
            `Olá *${pedido.cliente.nome}*!\n\n` +
            `Esperamos que tenha adorado nossos doces! ✨\n\n` +
            `Sua opinião é muito importante para nós. Como foi sua experiência?\n\n` +
            `Adoraríamos receber seu feedback! 🥰\n\n` +
            `Até a próxima! 🍰`;

        return await this.enviarMensagem(
            pedido.cliente.telefone, 
            mensagem,
            pedido.id || pedido.idreserva,
            'agradecimento'
        );
    }

    // Notificação de cancelamento
    async notificarCancelamento(pedido, motivo) {
        const mensagem = `❌ *Pedido Cancelado*\n\n` +
            `Olá *${pedido.cliente.nome}*,\n\n` +
            `Infelizmente seu pedido *#${pedido.numero}* foi cancelado.\n\n` +
            `*Motivo:* ${motivo}\n\n` +
            `Se você realizou o pagamento, o reembolso será processado em até 3 dias úteis.\n\n` +
            `Dúvidas? Entre em contato conosco respondendo esta mensagem.`;

        return await this.enviarMensagem(
            pedido.cliente.telefone, 
            mensagem,
            pedido.id || pedido.idreserva,
            'cancelamento'
        );
    }

    /**
     * RF027: Processar mensagem recebida do cliente
     */
    async processarMensagemRecebida(telefone, conteudo, whatsappMessageId) {
        try {
            // Registrar mensagem recebida
            const mensagem = await mensagemRepository.registrarMensagemRecebida(
                telefone, 
                conteudo, 
                whatsappMessageId
            );

            // Buscar configuração do bot
            const config = await mensagemRepository.buscarConfigBot();

            // Verificar se está no horário de funcionamento
            const agora = new Date();
            const horaAtual = agora.getHours();
            const horaInicio = parseInt(config.horario_funcionamento_inicio.split(':')[0]);
            const horaFim = parseInt(config.horario_funcionamento_fim.split(':')[0]);

            // Se fora do horário, enviar mensagem ausente
            if (horaAtual < horaInicio || horaAtual >= horaFim) {
                await this.enviarMensagem(telefone, config.mensagem_ausente);
                return { tipo: 'ausente', mensagem };
            }

            // Verificar comandos
            const palavras = conteudo.toLowerCase().trim().split(' ');
            const primeiraPalavra = palavras[0];

            const comando = await mensagemRepository.buscarComandoPorPalavra(primeiraPalavra);

            if (comando) {
                // Comando encontrado
                if (comando.tipo_resposta === 'texto' || comando.tipo_resposta === 'menu') {
                    await this.enviarMensagem(telefone, comando.resposta_texto);
                    return { tipo: 'comando', comando: comando.palavra_chave, mensagem };
                }

                if (comando.tipo_resposta === 'acao' && comando.palavra_chave === 'consultar') {
                    // Buscar último pedido do cliente
                    return { tipo: 'acao', acao: 'consultar_pedido', mensagem };
                }
            }

            // Se não encontrou comando, enviar mensagem de boas-vindas
            if (config.resposta_automatica_ativa) {
                await this.enviarMensagem(telefone, config.mensagem_boas_vindas);
                return { tipo: 'boas_vindas', mensagem };
            }

            return { tipo: 'recebida', mensagem };
        } catch (error) {
            console.error('Erro ao processar mensagem recebida:', error);
            throw error;
        }
    }

    /**
     * RF029: Buscar histórico de conversas
     */
    async buscarHistorico(telefone, limite = 50) {
        return await mensagemRepository.buscarHistorico(telefone, limite);
    }

    /**
     * RF065: Buscar estatísticas do WhatsApp
     */
    async buscarEstatisticas(dataInicio, dataFim) {
        return await mensagemRepository.buscarEstatisticas(dataInicio, dataFim);
    }

    /**
     * RF065: Status do bot em tempo real
     */
    async buscarStatusBot() {
        const status = await mensagemRepository.buscarStatusBot();
        const config = await mensagemRepository.buscarConfigBot();
        
        return {
            ...status,
            configuracao: config,
            demoMode: this.demoMode,
            apiConfigurada: !this.demoMode
        };
    }

    /**
     * UTILITÁRIOS
     */

    formatarTelefone(telefone) {
        // Remove caracteres não numéricos
        let numeros = telefone.replace(/\D/g, '');
        
        // Se não tem código do país, adiciona 55 (Brasil)
        if (!numeros.startsWith('55')) {
            numeros = '55' + numeros;
        }
        
        return numeros;
    }

    getNumeroWhatsApp() {
        return this.businessPhone;
    }

    isDemoMode() {
        return this.demoMode;
    }
}

export default new WhatsAppService();
