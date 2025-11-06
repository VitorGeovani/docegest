import { Router } from 'express';
import * as reservaService from '../services/reservaService.js';
import whatsappService from '../services/whatsappService.js';

const endpoints = Router();

/**
 * RF049: Reenviar confirmação de pedido
 * POST /reserva/:id/reenviar-confirmacao
 * 
 * Permite que o cliente solicite reenvio da confirmação do pedido
 */
endpoints.post('/reserva/:id/reenviar-confirmacao', async (req, resp) => {
    try {
        const { id } = req.params;
        
        // Buscar dados completos do pedido
        const pedido = await reservaService.buscarReservaPorId(id);
        
        if (!pedido) {
            return resp.status(404).send({ 
                erro: 'Pedido não encontrado' 
            });
        }
        
        // Buscar dados do cliente
        const cliente = await reservaService.buscarClienteDoPedido(id);
        
        if (!cliente || !cliente.telefone) {
            return resp.status(400).send({ 
                erro: 'Cliente não possui telefone cadastrado' 
            });
        }
        
        // Formatar mensagem de confirmação
        const mensagem = 
            `✅ *CONFIRMAÇÃO DE PEDIDO* (Reenviado)\n\n` +
            `📋 *Número:* #${pedido.codigo_pedido}\n` +
            `💰 *Valor Total:* R$ ${parseFloat(pedido.valor_total).toFixed(2)}\n` +
            `📅 *Data:* ${formatarData(pedido.data_entrega)}\n` +
            `⏰ *Horário:* ${pedido.hora_entrega}\n` +
            `🚚 *Tipo:* ${pedido.tipo_pedido}\n` +
            `💳 *Pagamento:* ${pedido.pagamento}\n` +
            `📊 *Status:* ${pedido.status}\n\n` +
            `📍 *Segredo do Sabor*\n` +
            `Obrigado pela preferência! 🍰`;
        
        // Enviar mensagem WhatsApp
        await whatsappService.enviarMensagem(cliente.telefone, mensagem);
        
        // Registrar reenvio no banco
        await reservaService.registrarReenvioConfirmacao(id);
        
        resp.status(200).send({ 
            sucesso: true,
            mensagem: 'Confirmação reenviada com sucesso!',
            telefone: cliente.telefone,
            codigo_pedido: pedido.codigo_pedido
        });
        
    } catch (err) {
        console.error('Erro ao reenviar confirmação:', err);
        resp.status(500).send({ 
            erro: 'Erro ao reenviar confirmação: ' + err.message 
        });
    }
});

/**
 * Função auxiliar para formatar data
 */
function formatarData(data) {
    const d = new Date(data);
    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const ano = d.getFullYear();
    return `${dia}/${mes}/${ano}`;
}

export default endpoints;
