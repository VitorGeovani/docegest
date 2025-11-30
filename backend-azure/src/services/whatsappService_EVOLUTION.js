import axios from 'axios';

/**
 * 🚀 WhatsApp Service com Evolution API
 * 
 * INSTALAÇÃO RÁPIDA:
 * 1. Execute: docker run -d --name evolution-api -p 8080:8080 atendai/evolution-api
 * 2. Acesse: http://localhost:8080
 * 3. Crie uma instância e escaneie o QR Code
 * 4. Configure o .env com a API Key
 * 
 * ALTERNATIVA (sem Docker):
 * 1. Clone: git clone https://github.com/EvolutionAPI/evolution-api.git
 * 2. Execute: cd evolution-api && npm install && npm start
 */

class WhatsAppService {
    constructor() {
        // CONFIGURAÇÃO 1: Evolution API (Recomendado - Gratuito)
        this.useEvolution = process.env.WHATSAPP_PROVIDER === 'evolution';
        this.evolutionUrl = process.env.EVOLUTION_API_URL || 'http://localhost:8080';
        this.evolutionKey = process.env.EVOLUTION_API_KEY || '';
        this.evolutionInstance = process.env.EVOLUTION_INSTANCE || 'segredodosabor';
        
        // CONFIGURAÇÃO 2: Meta WhatsApp Business API (Oficial)
        this.useMeta = process.env.WHATSAPP_PROVIDER === 'meta';
        this.metaUrl = 'https://graph.facebook.com/v18.0';
        this.metaToken = process.env.WHATSAPP_API_TOKEN || '';
        this.metaPhoneId = process.env.WHATSAPP_PHONE_NUMBER_ID || '';
        
        // CONFIGURAÇÃO GERAL
        this.businessPhone = process.env.WHATSAPP_BUSINESS_PHONE || '5511967696744';
        
        // MODO DEMO (quando nenhuma API está configurada)
        this.demoMode = !this.evolutionKey && !this.metaToken;
        
        if (this.demoMode) {
            console.warn('⚠️  WhatsApp Service rodando em MODO DEMO');
            console.warn('📱 Para ativar WhatsApp real, configure:');
            console.warn('   - Evolution API: WHATSAPP_PROVIDER=evolution, EVOLUTION_API_KEY=...');
            console.warn('   - Meta API: WHATSAPP_PROVIDER=meta, WHATSAPP_API_TOKEN=...');
        } else if (this.useEvolution) {
            console.log('✅ WhatsApp conectado via Evolution API');
        } else if (this.useMeta) {
            console.log('✅ WhatsApp conectado via Meta Business API');
        }
    }

    /**
     * Envia mensagem via Evolution API
     */
    async enviarViaEvolution(telefone, mensagem) {
        try {
            const response = await axios.post(
                `${this.evolutionUrl}/message/sendText/${this.evolutionInstance}`,
                {
                    number: this.formatarTelefone(telefone),
                    text: mensagem
                },
                {
                    headers: {
                        'apikey': this.evolutionKey,
                        'Content-Type': 'application/json'
                    }
                }
            );

            return { success: true, data: response.data };
        } catch (error) {
            console.error('Erro Evolution API:', error.response?.data || error.message);
            throw new Error('Falha ao enviar via Evolution API');
        }
    }

    /**
     * Envia mensagem via Meta WhatsApp Business API
     */
    async enviarViaMeta(telefone, mensagem) {
        try {
            const response = await axios.post(
                `${this.metaUrl}/${this.metaPhoneId}/messages`,
                {
                    messaging_product: 'whatsapp',
                    to: this.formatarTelefone(telefone),
                    type: 'text',
                    text: { body: mensagem }
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.metaToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            return { success: true, data: response.data };
        } catch (error) {
            console.error('Erro Meta API:', error.response?.data || error.message);
            throw new Error('Falha ao enviar via Meta API');
        }
    }

    /**
     * Envia uma mensagem de texto via WhatsApp
     */
    async enviarMensagem(telefone, mensagem) {
        // MODO DEMO - apenas loga
        if (this.demoMode) {
            console.log(`📱 [DEMO] WhatsApp para ${telefone}:`);
            console.log(mensagem);
            console.log('---');
            return { success: true, demo: true };
        }

        // EVOLUTION API
        if (this.useEvolution) {
            return await this.enviarViaEvolution(telefone, mensagem);
        }

        // META API
        if (this.useMeta) {
            return await this.enviarViaMeta(telefone, mensagem);
        }

        throw new Error('Nenhum provedor WhatsApp configurado');
    }

    /**
     * Formata o telefone para o padrão internacional
     */
    formatarTelefone(telefone) {
        // Remove tudo que não é número
        const numero = telefone.replace(/\D/g, '');
        
        // Se já tem código do país, retorna
        if (numero.startsWith('55')) {
            return numero;
        }
        
        // Adiciona código do Brasil
        return `55${numero}`;
    }

    /**
     * Verifica se o número está no formato WhatsApp
     */
    validarNumero(telefone) {
        const numero = telefone.replace(/\D/g, '');
        // WhatsApp BR: 55 + DDD (2) + Número (8-9 dígitos) = 12-13 dígitos
        return numero.length >= 12 && numero.length <= 13;
    }

    /**
     * Retorna o número do WhatsApp Business configurado
     */
    getNumeroWhatsApp() {
        return this.businessPhone;
    }

    /**
     * Verifica se está em modo demo
     */
    isDemoMode() {
        return this.demoMode;
    }

    // =========================================================
    // NOTIFICAÇÕES ESPECÍFICAS DO SISTEMA
    // =========================================================

    /**
     * RF026: Notificação de pedido recebido
     */
    async notificarPedidoRecebido(pedido) {
        const mensagem = `🎉 *Pedido Confirmado!*\n\n` +
            `Olá *${pedido.cliente.nome}*!\n\n` +
            `Recebemos seu pedido *#${pedido.numero}* com sucesso!\n\n` +
            `📦 *Resumo do Pedido:*\n` +
            pedido.itens.map(item => `• ${item.quantidade}x ${item.nome}`).join('\n') +
            `\n\n💰 *Total:* R$ ${pedido.total.toFixed(2)}\n` +
            `💳 *Pagamento:* ${pedido.metodoPagamento}\n\n` +
            `Assim que confirmarmos seu pagamento, você receberá outra mensagem.\n\n` +
            `Dúvidas? Responda esta mensagem! 💜`;

        return await this.enviarMensagem(pedido.cliente.telefone, mensagem);
    }

    /**
     * RF027: Confirmação de pagamento
     */
    async notificarPagamentoConfirmado(pedido) {
        const mensagem = `✅ *Pagamento Confirmado!*\n\n` +
            `Olá *${pedido.cliente.nome}*!\n\n` +
            `Confirmamos o pagamento do seu pedido *#${pedido.numero}*!\n\n` +
            `Já iniciamos a preparação dos seus doces. Em breve você receberá uma notificação quando estiverem prontos! 🧁\n\n` +
            `Obrigado pela preferência! 💜`;

        return await this.enviarMensagem(pedido.cliente.telefone, mensagem);
    }

    /**
     * RF028: Pedido pronto para retirada
     */
    async notificarPedidoPronto(pedido) {
        const isEntrega = (pedido.tipoPedido && String(pedido.tipoPedido).toUpperCase() === 'ENTREGA') || !!pedido.enderecoEntrega;

        let mensagem = `🎊 *Pedido Pronto!*\n\n` +
            `Olá *${pedido.cliente.nome}*!\n\n` +
            `Seu pedido *#${pedido.numero}* `;

        if (isEntrega) {
            const endereco = pedido.enderecoEntrega || pedido.pontoEntrega || 'Endereço não informado';
            mensagem += `está a caminho e será entregue no endereço abaixo: 🛵\n\n` +
                `📍 *Endereço de Entrega:*\n${endereco}\n\n` +
                `Caso precise, responda esta mensagem para falar conosco.`;
        } else {
            mensagem += `está prontinho e esperando por você! 😍\n\n` +
                `📍 *Local de Retirada:*\n${pedido.pontoEntrega}\n\n` +
                `Estamos te esperando!`;
        }

        mensagem += `\n\n_Lembre-se de trazer este número do pedido: *#${pedido.numero}*_`;

        return await this.enviarMensagem(
            pedido.cliente.telefone,
            mensagem,
            pedido.idreserva || pedido.id || pedido.numero,
            'pedido_pronto'
        );
    }

    /**
     * RF029: Lembrete de retirada
     */
    async enviarLembreteRetirada(pedido) {
        const mensagem = `⏰ *Lembrete de Retirada*\n\n` +
            `Olá *${pedido.cliente.nome}*!\n\n` +
            `Lembramos que seu pedido *#${pedido.numero}* está pronto e aguardando retirada!\n\n` +
            `📍 *Local:* ${pedido.pontoEntrega}\n\n` +
            `Qualquer dúvida, estamos à disposição! 💜`;

        return await this.enviarMensagem(pedido.cliente.telefone, mensagem);
    }

    /**
     * Notificação de cancelamento
     */
    async notificarCancelamento(pedido, motivo) {
        const mensagem = `❌ *Pedido Cancelado*\n\n` +
            `Olá *${pedido.cliente.nome}*,\n\n` +
            `Informamos que seu pedido *#${pedido.numero}* foi cancelado.\n\n` +
            (motivo ? `*Motivo:* ${motivo}\n\n` : '') +
            `Se tiver dúvidas, entre em contato conosco.\n\n` +
            `Esperamos vê-lo novamente em breve! 💜`;

        return await this.enviarMensagem(pedido.cliente.telefone, mensagem);
    }
}

export default new WhatsAppService();
