import connection from './connection.js';

/**
 * Repository para gerenciar mensagens WhatsApp
 * RF027, RF029, RF065
 */

class MensagemWhatsAppRepository {
    
    /**
     * RF029: Registrar mensagem enviada
     */
    async registrarMensagemEnviada(dados) {
        const { idReserva, telefone, conteudo, tipoNotificacao, whatsappMessageId } = dados;
        
        const [resultado] = await connection.query(
            `CALL sp_registrar_mensagem_enviada(?, ?, ?, ?, ?)`,
            [idReserva, telefone, conteudo, tipoNotificacao, whatsappMessageId]
        );
        
        return resultado[0];
    }

    /**
     * RF027: Registrar mensagem recebida
     */
    async registrarMensagemRecebida(telefone, conteudo, whatsappMessageId) {
        const [resultado] = await connection.query(
            `CALL sp_registrar_mensagem_recebida(?, ?, ?)`,
            [telefone, conteudo, whatsappMessageId]
        );
        
        return resultado[0][0];
    }

    /**
     * RF029: Buscar histórico de mensagens de um telefone
     */
    async buscarHistorico(telefone, limite = 50) {
        const [mensagens] = await connection.query(
            `CALL sp_buscar_historico_mensagens(?, ?)`,
            [telefone, limite]
        );
        
        return mensagens[0];
    }

    /**
     * Atualizar status de mensagem (entregue, lido)
     */
    async atualizarStatus(whatsappMessageId, novoStatus) {
        const [resultado] = await connection.query(
            `CALL sp_atualizar_status_mensagem(?, ?)`,
            [whatsappMessageId, novoStatus]
        );
        
        return resultado[0][0];
    }

    /**
     * Atualizar status com erro
     */
    async registrarErro(idMensagem, erroMensagem) {
        await connection.query(
            `UPDATE tb_mensagens_whatsapp 
             SET status_envio = 'falha', erro_mensagem = ?
             WHERE id_mensagem = ?`,
            [erroMensagem, idMensagem]
        );
    }

    /**
     * RF065: Buscar estatísticas de mensagens
     */
    async buscarEstatisticas(dataInicio, dataFim) {
        const [stats] = await connection.query(
            `SELECT 
                DATE(data_hora_envio) as data,
                COUNT(*) as total_mensagens,
                SUM(CASE WHEN tipo_mensagem = 'enviada' THEN 1 ELSE 0 END) as enviadas,
                SUM(CASE WHEN tipo_mensagem = 'recebida' THEN 1 ELSE 0 END) as recebidas,
                SUM(CASE WHEN status_envio = 'lido' THEN 1 ELSE 0 END) as lidas,
                SUM(CASE WHEN status_envio = 'falha' THEN 1 ELSE 0 END) as falhas
             FROM tb_mensagens_whatsapp
             WHERE DATE(data_hora_envio) BETWEEN ? AND ?
             GROUP BY DATE(data_hora_envio)
             ORDER BY data DESC`,
            [dataInicio, dataFim]
        );
        
        return stats;
    }

    /**
     * RF065: Status em tempo real do bot
     */
    async buscarStatusBot() {
        const [status] = await connection.query(
            `SELECT * FROM vw_whatsapp_status`
        );
        
        return status[0];
    }

    /**
     * Buscar mensagens por pedido
     */
    async buscarPorPedido(idReserva) {
        const [mensagens] = await connection.query(
            `SELECT * FROM tb_mensagens_whatsapp
             WHERE id_reserva = ?
             ORDER BY data_hora_envio DESC`,
            [idReserva]
        );
        
        return mensagens;
    }

    /**
     * RF027: Registrar webhook recebido
     */
    async registrarWebhook(eventoTipo, eventoJson, telefoneOrigem) {
        const [resultado] = await connection.query(
            `INSERT INTO tb_whatsapp_webhooks (evento_tipo, evento_json, telefone_origem)
             VALUES (?, ?, ?)`,
            [eventoTipo, JSON.stringify(eventoJson), telefoneOrigem]
        );
        
        return resultado.insertId;
    }

    /**
     * Marcar webhook como processado
     */
    async marcarWebhookProcessado(idWebhook, idMensagem = null) {
        await connection.query(
            `UPDATE tb_whatsapp_webhooks
             SET processado = TRUE, 
                 id_mensagem = ?,
                 data_processamento = NOW()
             WHERE id_webhook = ?`,
            [idMensagem, idWebhook]
        );
    }

    /**
     * Registrar erro no processamento do webhook
     */
    async registrarErroWebhook(idWebhook, erro) {
        await connection.query(
            `UPDATE tb_whatsapp_webhooks
             SET erro_processamento = ?
             WHERE id_webhook = ?`,
            [erro, idWebhook]
        );
    }

    /**
     * RF027: Buscar comandos do bot
     */
    async buscarComandos() {
        const [comandos] = await connection.query(
            `SELECT * FROM tb_whatsapp_comandos
             WHERE ativo = TRUE
             ORDER BY ordem_exibicao`
        );
        
        return comandos;
    }

    /**
     * Buscar comando por palavra-chave
     */
    async buscarComandoPorPalavra(palavraChave) {
        const [comandos] = await connection.query(
            `SELECT * FROM tb_whatsapp_comandos
             WHERE palavra_chave = ? AND ativo = TRUE
             LIMIT 1`,
            [palavraChave.toLowerCase()]
        );
        
        return comandos[0];
    }

    /**
     * RF065: Buscar configuração do bot
     */
    async buscarConfigBot() {
        const [config] = await connection.query(
            `SELECT * FROM tb_whatsapp_bot_config
             ORDER BY id_config DESC
             LIMIT 1`
        );
        
        return config[0];
    }

    /**
     * Atualizar configuração do bot
     */
    async atualizarConfigBot(dados) {
        const { statusBot, mensagemBoasVindas, mensagemAusente, respostaAutomaticaAtiva } = dados;
        
        await connection.query(
            `UPDATE tb_whatsapp_bot_config
             SET status_bot = ?,
                 mensagem_boas_vindas = ?,
                 mensagem_ausente = ?,
                 resposta_automatica_ativa = ?
             ORDER BY id_config DESC
             LIMIT 1`,
            [statusBot, mensagemBoasVindas, mensagemAusente, respostaAutomaticaAtiva]
        );
    }

    /**
     * Atualizar estatísticas diárias
     */
    async atualizarEstatisticas() {
        await connection.query(`CALL sp_atualizar_estatisticas_whatsapp()`);
    }

    /**
     * Buscar mensagens não lidas
     */
    async buscarMensagensNaoLidas() {
        const [mensagens] = await connection.query(
            `SELECT * FROM tb_mensagens_whatsapp
             WHERE tipo_mensagem = 'recebida' 
             AND status_envio != 'lido'
             ORDER BY data_hora_envio DESC
             LIMIT 100`
        );
        
        return mensagens;
    }

    /**
     * Buscar webhooks pendentes
     */
    async buscarWebhooksPendentes() {
        const [webhooks] = await connection.query(
            `SELECT * FROM tb_whatsapp_webhooks
             WHERE processado = FALSE
             ORDER BY data_recebimento ASC
             LIMIT 50`
        );
        
        return webhooks;
    }
}

export default new MensagemWhatsAppRepository();
