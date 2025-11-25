import * as reservaService from '../services/reservaService.js';
import { Router } from "express";

const endpoints = Router();

endpoints.get('/reserva/listar', async (req, resp) => {
    try {
        let registros = await reservaService.listarReservas();
        resp.send(registros);
    } catch (err) {
        resp.status(500).send({ erro: err.message });
    }
});

endpoints.post("/reserva/inserir", async (req, resp) => {
    try {
        const reserva = req.body;
        let id = await reservaService.inserirReserva(reserva);
        resp.status(201).send({ id });
    } catch (err) {
        resp.status(400).send({ erro: err.message });
    }
});

endpoints.put("/reserva/:id", async (req, resp) => {
    try {
        let id = req.params.id;
        const reserva = req.body;
        await reservaService.alterarReserva(id, reserva);
        resp.send({ mensagem: 'Reserva atualizada com sucesso!' });
    } catch (err) {
        const statusCode = err.message.includes('não encontrada') ? 404 : 400;
        resp.status(statusCode).send({ erro: err.message });
    }
});

endpoints.delete("/reserva/:id", async (req, resp) => {
    try {
        let id = req.params.id;
        await reservaService.removerReserva(id);
        resp.send({ mensagem: 'Reserva removida com sucesso!' });
    } catch (err) {
        const statusCode = err.message.includes('não encontrada') ? 404 : 500;
        resp.status(statusCode).send({ erro: err.message });
    }
});

endpoints.get('/reserva/pendente', async (req, resp) => {
    try {
        let reservasPendentes = await reservaService.listarReservasPendentes();
        resp.send(reservasPendentes);
    } catch (err) {
        resp.status(500).send({ erro: err.message });
    }
});

// Listar reservas por status
endpoints.get('/reserva/status/:status', async (req, resp) => {
    try {
        const status = req.params.status;
        let reservas = await reservaService.listarReservasPorStatus(status);
        resp.send(reservas);
    } catch (err) {
        const statusCode = err.message.includes('inválido') ? 400 : 500;
        resp.status(statusCode).send({ erro: err.message });
    }
});

// Listar todas as reservas ativas
endpoints.get('/reserva/todas', async (req, resp) => {
    try {
        let reservas = await reservaService.listarTodasReservasComCliente();
        resp.send(reservas);
    } catch (err) {
        resp.status(500).send({ erro: err.message });
    }
});

endpoints.put('/reserva/:id/confirmar', async (req, resp) => {
    try {
        const id = req.params.id;
        await reservaService.confirmarReserva(id);
        resp.status(200).send({ mensagem: "Reserva confirmada com sucesso!" });
    } catch (err) {
        const statusCode = err.message.includes('não encontrada') ? 404 : 500;
        resp.status(statusCode).send({ erro: err.message });
    }
});

endpoints.put('/reserva/:id/cancelar', async (req, resp) => {
    try {
        const id = req.params.id;
        const { produtos } = req.body;
        
        await reservaService.cancelarReserva(id, produtos);
        resp.status(200).send({ mensagem: "Reserva cancelada e produtos devolvidos ao estoque com sucesso!" });
    } catch (err) {
        const statusCode = err.message.includes('inválida') ? 400 : 500;
        resp.status(statusCode).send({ erro: err.message });
    }
});

// Atualizar status do pedido (Pendente -> Confirmado -> Preparando -> Pronto -> Entregue)
endpoints.put('/reserva/:id/status', async (req, resp) => {
    try {
        const id = req.params.id;
        const { status } = req.body;
        
        const statusValidos = ['Pendente', 'Confirmado', 'Preparando', 'Pronto', 'Entregue', 'Cancelado'];
        if (!statusValidos.includes(status)) {
            return resp.status(400).send({ erro: 'Status inválido' });
        }
        
        await reservaService.atualizarStatusPedido(id, status);
        resp.status(200).send({ 
            mensagem: `Status atualizado para ${status} com sucesso!`,
            status: status
        });
    } catch (err) {
        const statusCode = err.message.includes('não encontrada') ? 404 : 500;
        resp.status(statusCode).send({ erro: err.message });
    }
});

// Buscar pedidos por telefone do cliente
endpoints.get('/pedidos/cliente/:telefone', async (req, resp) => {
    try {
        const telefone = req.params.telefone;
        const pedidos = await reservaService.buscarPedidosPorTelefone(telefone);
        resp.send(pedidos);
    } catch (err) {
        resp.status(500).send({ erro: err.message });
    }
});

// Buscar detalhes completos de um pedido
endpoints.get('/pedido/:id/detalhes', async (req, resp) => {
    try {
        const id = req.params.id;
        const pedido = await reservaService.buscarDetalhePedidoCompleto(id);
        
        if (!pedido) {
            return resp.status(404).send({ erro: 'Pedido não encontrado' });
        }
        
        resp.send(pedido);
    } catch (err) {
        resp.status(500).send({ erro: err.message });
    }
});

export default endpoints;

