import { Router } from "express";
import {
    listarCategorias,
    buscarCategoriaPorId,
    criarCategoria,
    atualizarCategoria,
    excluirCategoria,
    listarCategoriasAtivas
} from "../repository/categoriaRepository.js";

const endpoints = Router();

// Listar todas as categorias
endpoints.get('/categorias', async (req, resp) => {
    try {
        const categorias = await listarCategorias();
        resp.send(categorias);
    } catch (err) {
        console.error("Erro ao listar categorias:", err);
        resp.status(500).send({ erro: "Erro ao listar categorias." });
    }
});

// Listar apenas categorias ativas
endpoints.get('/categorias/ativas', async (req, resp) => {
    try {
        const categorias = await listarCategoriasAtivas();
        resp.send(categorias);
    } catch (err) {
        console.error("Erro ao listar categorias ativas:", err);
        resp.status(500).send({ erro: "Erro ao listar categorias ativas." });
    }
});

// Buscar categoria por ID
endpoints.get('/categorias/:id', async (req, resp) => {
    try {
        const { id } = req.params;
        const categoria = await buscarCategoriaPorId(id);
        
        if (!categoria) {
            return resp.status(404).send({ erro: "Categoria não encontrada." });
        }
        
        resp.send(categoria);
    } catch (err) {
        console.error("Erro ao buscar categoria:", err);
        resp.status(500).send({ erro: "Erro ao buscar categoria." });
    }
});

// Criar nova categoria
endpoints.post('/categorias', async (req, resp) => {
    try {
        const { nome, descricao, ativo } = req.body;

        if (!nome || nome.trim() === '') {
            return resp.status(400).send({ erro: "Nome da categoria é obrigatório." });
        }

        const novaCategoria = {
            nome: nome.trim(),
            descricao: descricao ? descricao.trim() : null,
            ativo: ativo !== undefined ? ativo : true
        };

        const id = await criarCategoria(novaCategoria);
        resp.status(201).send({ id, mensagem: "Categoria criada com sucesso!" });
    } catch (err) {
        console.error("Erro ao criar categoria:", err);
        resp.status(500).send({ erro: "Erro ao criar categoria." });
    }
});

// Atualizar categoria
endpoints.put('/categorias/:id', async (req, resp) => {
    try {
        const { id } = req.params;
        const { nome, descricao, ativo } = req.body;

        const categoriaExistente = await buscarCategoriaPorId(id);
        if (!categoriaExistente) {
            return resp.status(404).send({ erro: "Categoria não encontrada." });
        }

        if (!nome || nome.trim() === '') {
            return resp.status(400).send({ erro: "Nome da categoria é obrigatório." });
        }

        const categoriaAtualizada = {
            nome: nome.trim(),
            descricao: descricao ? descricao.trim() : null,
            ativo: ativo !== undefined ? ativo : categoriaExistente.ativo
        };

        await atualizarCategoria(id, categoriaAtualizada);
        resp.send({ mensagem: "Categoria atualizada com sucesso!" });
    } catch (err) {
        console.error("Erro ao atualizar categoria:", err);
        resp.status(500).send({ erro: "Erro ao atualizar categoria." });
    }
});

// Excluir categoria
endpoints.delete('/categorias/:id', async (req, resp) => {
    try {
        const { id } = req.params;

        const categoriaExistente = await buscarCategoriaPorId(id);
        if (!categoriaExistente) {
            return resp.status(404).send({ erro: "Categoria não encontrada." });
        }

        await excluirCategoria(id);
        resp.send({ mensagem: "Categoria excluída com sucesso!" });
    } catch (err) {
        console.error("Erro ao excluir categoria:", err);
        
        // Verifica se é erro de chave estrangeira (produtos vinculados)
        if (err.code === 'ER_ROW_IS_REFERENCED_2') {
            return resp.status(400).send({ 
                erro: "Não é possível excluir a categoria pois existem produtos vinculados a ela." 
            });
        }
        
        resp.status(500).send({ erro: "Erro ao excluir categoria." });
    }
});

export default endpoints;
