import { Router } from "express";
import {
    obterReceitaTotal,
    obterCustoTotal,
    obterLucroLiquido,
    obterTotalPedidos,
    obterVendasPorPeriodo,
    obterProdutosMaisVendidos,
    obterTiposPagamento,
    obterTotalProdutosVendidos,
    obterVendasDiarias
} from "../repository/relatorioRepository.js";

const endpoints = Router();

// Receita Total
endpoints.get('/relatorio/receita-total', async (req, resp) => {
    try {
        const receitaTotal = await obterReceitaTotal();
        resp.send({ receitaTotal });
    } catch (err) {
        console.error("Erro ao obter receita total:", err);
        resp.status(500).send({ erro: "Erro ao obter receita total." });
    }
});

// Custo Total
endpoints.get('/relatorio/custo-total', async (req, resp) => {
    try {
        const custoTotal = await obterCustoTotal();
        resp.send({ custoTotal });
    } catch (err) {
        console.error("Erro ao obter custo total:", err);
        resp.status(500).send({ erro: "Erro ao obter custo total." });
    }
});

// Lucro Líquido
endpoints.get('/relatorio/lucro-liquido', async (req, resp) => {
    try {
        const lucroLiquido = await obterLucroLiquido();
        resp.send({ lucroLiquido });
    } catch (err) {
        console.error("Erro ao obter lucro líquido:", err);
        resp.status(500).send({ erro: "Erro ao obter lucro líquido." });
    }
});

// Total de Pedidos
endpoints.get('/relatorio/total-pedidos', async (req, resp) => {
    try {
        const totalPedidos = await obterTotalPedidos();
        resp.send({ totalPedidos });
    } catch (err) {
        console.error("Erro ao obter total de pedidos:", err);
        resp.status(500).send({ erro: "Erro ao obter total de pedidos." });
    }
});

// Vendas por Período
endpoints.get('/relatorio/vendas-por-periodo', async (req, resp) => {
    try {
        const vendasPorPeriodo = await obterVendasPorPeriodo();
        resp.send(vendasPorPeriodo);
    } catch (err) {
        console.error("Erro ao obter vendas por período:", err);
        resp.status(500).send({ erro: "Erro ao obter vendas por período." });
    }
});

// Três Produtos Mais Vendidos
endpoints.get('/relatorio/produtos-mais-vendidos', async (req, resp) => {
    try {
        const produtos = await obterProdutosMaisVendidos();
        resp.send(produtos);
    } catch (err) {
        console.error("Erro ao obter produtos mais vendidos:", err);
        resp.status(500).send({ erro: "Erro ao obter produtos mais vendidos." });
    }
});

// Tipos de Pagamento Mais Utilizados
endpoints.get('/relatorio/tipos-pagamento', async (req, resp) => {
    try {
        const tiposPagamento = await obterTiposPagamento();
        resp.send(tiposPagamento);
    } catch (err) {
        console.error("Erro ao obter tipos de pagamento:", err);
        resp.status(500).send({ erro: "Erro ao obter tipos de pagamento." });
    }
});

// Total de Produtos Vendidos
endpoints.get('/relatorio/total-vendidos', async (req, resp) => {
    try {
        const totalProdutosVendidos = await obterTotalProdutosVendidos();
        resp.send({ totalProdutosVendidos });
    } catch (err) {
        console.error("Erro ao obter total de produtos vendidos:", err);
        resp.status(500).send({ erro: "Erro ao obter total de produtos vendidos." });
    }
});

// Vendas Diárias (últimos 7 dias)
endpoints.get('/relatorio/vendas-diarias', async (req, resp) => {
    try {
        const dias = parseInt(req.query.dias) || 7;
        const vendasDiarias = await obterVendasDiarias(dias);
        resp.send(vendasDiarias);
    } catch (err) {
        console.error("Erro ao obter vendas diárias:", err);
        resp.status(500).send({ erro: "Erro ao obter vendas diárias." });
    }
});

export default endpoints;