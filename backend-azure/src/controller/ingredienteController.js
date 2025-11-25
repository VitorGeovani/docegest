import * as ingredienteService from '../services/ingredienteService.js';
import { Router } from "express";

const endpoints = Router();

// Listar todos os ingredientes
endpoints.get('/ingrediente/listar', async (req, resp) => {
    try {
        const registros = await ingredienteService.listarIngredientes();
        resp.send(registros);
    } catch (err) {
        resp.status(500).send({ erro: err.message });
    }
});

// Listar ingredientes com estoque baixo (DEVE VIR ANTES DO /:id)
endpoints.get('/ingrediente/estoque/baixo', async (req, resp) => {
    try {
        const ingredientes = await ingredienteService.listarIngredientesEstoqueBaixo();
        resp.send(ingredientes);
    } catch (err) {
        resp.status(500).send({ erro: err.message });
    }
});

// Gerar lista de compras (DEVE VIR ANTES DO /:id)
endpoints.get('/ingrediente/lista-compras', async (req, resp) => {
    try {
        const lista = await ingredienteService.gerarListaCompras();
        resp.send(lista);
    } catch (err) {
        resp.status(500).send({ erro: err.message });
    }
});

// Listar histórico de movimentações (DEVE VIR ANTES DO /:id)
endpoints.get('/ingrediente/movimentacao/listar', async (req, resp) => {
    try {
        const filtros = {
            idIngrediente: req.query.idIngrediente,
            tipo: req.query.tipo,
            dataInicio: req.query.dataInicio,
            dataFim: req.query.dataFim
        };
        
        const movimentacoes = await ingredienteService.listarMovimentacoes(filtros);
        resp.send(movimentacoes);
    } catch (err) {
        resp.status(500).send({ erro: err.message });
    }
});

// Buscar ingrediente por ID (DEVE VIR DEPOIS DAS ROTAS ESPECÍFICAS)
endpoints.get('/ingrediente/:id', async (req, resp) => {
    try {
        const id = req.params.id;
        const ingrediente = await ingredienteService.buscarIngredientePorId(id);
        resp.send(ingrediente);
    } catch (err) {
        const statusCode = err.message.includes('não encontrado') ? 404 : 500;
        resp.status(statusCode).send({ erro: err.message });
    }
});

// Inserir novo ingrediente
endpoints.post('/ingrediente/inserir', async (req, resp) => {
    try {
        const ingrediente = req.body;
        const id = await ingredienteService.inserirIngrediente(ingrediente);
        resp.status(201).send({ id });
    } catch (err) {
        resp.status(400).send({ erro: err.message });
    }
});

// Atualizar ingrediente
endpoints.put('/ingrediente/:id', async (req, resp) => {
    try {
        const id = req.params.id;
        const ingrediente = req.body;
        await ingredienteService.alterarIngrediente(id, ingrediente);
        resp.send({ mensagem: 'Ingrediente atualizado com sucesso!' });
    } catch (err) {
        const statusCode = err.message.includes('não encontrado') ? 404 : 400;
        resp.status(statusCode).send({ erro: err.message });
    }
});

// Remover ingrediente
endpoints.delete('/ingrediente/:id', async (req, resp) => {
    try {
        const id = req.params.id;
        await ingredienteService.removerIngrediente(id);
        resp.send({ mensagem: 'Ingrediente removido com sucesso!' });
    } catch (err) {
        const statusCode = err.message.includes('não encontrado') ? 404 : 500;
        resp.status(statusCode).send({ erro: err.message });
    }
});

// Registrar movimentação de estoque
endpoints.post('/ingrediente/movimentacao', async (req, resp) => {
    try {
        const movimentacao = req.body;
        const id = await ingredienteService.registrarMovimentacao(movimentacao);
        resp.status(201).send({ 
            id,
            mensagem: 'Movimentação registrada com sucesso!' 
        });
    } catch (err) {
        resp.status(400).send({ erro: err.message });
    }
});

export default endpoints;
