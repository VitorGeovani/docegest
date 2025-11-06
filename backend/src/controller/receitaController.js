import { Router } from 'express';
import * as receitaService from '../services/receitaService.js';

const endpoints = Router();

/**
 * Salvar receita de um produto
 * POST /receita/:idproduto
 */
endpoints.post('/receita/:idproduto', async (req, res) => {
    try {
        const { idproduto } = req.params;
        const { ingredientes } = req.body;

        console.log('📝 Salvando receita para produto:', idproduto);
        console.log('📦 Ingredientes recebidos:', JSON.stringify(ingredientes, null, 2));

        if (!ingredientes || !Array.isArray(ingredientes)) {
            return res.status(400).send({ 
                erro: 'Ingredientes devem ser um array válido',
                recebido: typeof ingredientes
            });
        }

        const resultado = await receitaService.salvarReceitaProduto(
            parseInt(idproduto),
            ingredientes
        );

        console.log('✅ Receita salva com sucesso!');
        res.status(200).send(resultado);
    } catch (error) {
        console.error('❌ Erro ao salvar receita:', error.message);
        res.status(400).send({ erro: error.message });
    }
});

/**
 * Buscar receita de um produto
 * GET /receita/:idproduto
 */
endpoints.get('/receita/:idproduto', async (req, res) => {
    try {
        const { idproduto } = req.params;
        const receita = await receitaService.buscarReceitaProduto(parseInt(idproduto));
        res.status(200).send(receita);
    } catch (error) {
        console.error('Erro ao buscar receita:', error);
        res.status(500).send({ erro: error.message });
    }
});

/**
 * Produzir produto e dar baixa nos ingredientes
 * POST /receita/:idproduto/produzir
 */
endpoints.post('/receita/:idproduto/produzir', async (req, res) => {
    try {
        const { idproduto } = req.params;
        const { quantidade } = req.body;

        const resultado = await receitaService.produzirProduto(
            parseInt(idproduto),
            parseInt(quantidade || 1)
        );

        res.status(200).send(resultado);
    } catch (error) {
        console.error('Erro ao produzir produto:', error);
        res.status(400).send({ erro: error.message });
    }
});

/**
 * Calcular custo de produção
 * GET /receita/:idproduto/custo
 */
endpoints.get('/receita/:idproduto/custo', async (req, res) => {
    try {
        const { idproduto } = req.params;
        const custo = await receitaService.calcularCusto(parseInt(idproduto));
        res.status(200).send({ custo });
    } catch (error) {
        console.error('Erro ao calcular custo:', error);
        res.status(500).send({ erro: error.message });
    }
});

/**
 * Verificar estoque de ingredientes
 * GET /receita/:idproduto/verificar-estoque
 */
endpoints.get('/receita/:idproduto/verificar-estoque', async (req, res) => {
    try {
        const { idproduto } = req.params;
        const { quantidade } = req.query;

        const resultado = await receitaService.verificarEstoque(
            parseInt(idproduto),
            parseInt(quantidade || 1)
        );

        res.status(200).send(resultado);
    } catch (error) {
        console.error('Erro ao verificar estoque:', error);
        res.status(500).send({ erro: error.message });
    }
});

export default endpoints;
