import * as clienteService from '../services/clienteService.js';
import { Router } from "express";

const endpoints = Router();

endpoints.get('/cliente/listar', async (req, resp) => {
    try {
        let registros = await clienteService.listarClientes();
        resp.send(registros);
    } catch (err) {
        resp.status(500).send({ erro: err.message });
    }
});

endpoints.post("/cliente/inserir", async (req, resp) => {
    try {
        const cliente = req.body;
        let id = await clienteService.inserirCliente(cliente);
        resp.status(201).send({ id });
    } catch (err) {
        resp.status(400).send({ erro: err.message });
    }
});

endpoints.put("/cliente/:id", async (req, resp) => {
    try {
        let id = req.params.id;
        const cliente = req.body;
        await clienteService.alterarCliente(id, cliente);
        resp.send({ mensagem: 'Cliente atualizado com sucesso!' });
    } catch (err) {
        const statusCode = err.message.includes('não encontrado') ? 404 : 400;
        resp.status(statusCode).send({ erro: err.message });
    }
});

endpoints.delete("/cliente/:id", async (req, resp) => {
    try {
        let id = req.params.id;
        await clienteService.removerCliente(id);
        resp.send({ mensagem: 'Cliente removido com sucesso!' });
    } catch (err) {
        const statusCode = err.message.includes('não encontrado') ? 404 : 500;
        resp.status(statusCode).send({ erro: err.message });
    }
});

endpoints.post('/cliente/verificar', async (req, resp) => {
    try {
        const { nome, email, telefone } = req.body;
        let cliente = await clienteService.verificarOuCriarCliente(nome, email, telefone);
        resp.send(cliente);
    } catch (err) {
        resp.status(400).send({ erro: err.message });
    }
});


export default endpoints;






