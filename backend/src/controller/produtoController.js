import * as produtoService from '../services/produtoService.js';
import { Router } from "express";
import multer from 'multer';
import path from 'path';

const endpoints = Router();

// Configuração do multer para salvar arquivos com a extensão correta
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './storage'); // Diretório onde os arquivos serão salvos
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname); // Obtém a extensão do arquivo original
        cb(null, `${uniqueSuffix}${ext}`); // Salva o arquivo com um nome único e a extensão
    }
});


const upload = multer({ storage });

endpoints.get('/produto/listar', async (req, resp) => {
    try {
        // Usar listarProdutos() para admin (estoque) ou listarProdutosDisponiveis() para catálogo
        // Como o catálogo usa esta rota, vamos filtrar produtos esgotados
        let registros = await produtoService.listarProdutos();
        
        // Mapear campos para o frontend
        const produtosFormatados = registros.map(produto => ({
            id: produto.id,
            nome: produto.nome,
            descricao: produto.descricao,
            valor: produto.preco, // Mapear preco -> valor
            preco: produto.preco, // Manter preco também
            quantidade: produto.quantidade,
            imagem: produto.caminhoImagem, // Mapear caminhoImagem -> imagem
            caminhoImagem: produto.caminhoImagem,
            id_categoria: produto.idcategoria,
            idcategoria: produto.idcategoria,
            categoria: produto.categoria,
            ativo: produto.ativo !== undefined ? produto.ativo : 1
        }));
        
        resp.send(produtosFormatados);
    } catch (err) {
        console.error('Erro ao listar produtos:', err);
        resp.status(500).send({ erro: err.message });
    }
});

endpoints.get('/produto/:id', async (req, resp) => {
    try {
        let id = req.params.id;
        let produto = await produtoService.buscarProdutoPorId(id);
        resp.send(produto);
    } catch (err) {
        resp.status(err.message.includes('não encontrado') ? 404 : 500)
            .send({ erro: err.message });
    }
});

endpoints.post("/produto/inserir", upload.single('imagem'), async (req, resp) => {
    try {
        const produto = req.body;
        
        // Imagem é opcional - se não tiver, usa uma imagem padrão
        if (req.file) {
            produto.caminhoImagem = req.file.filename;
        } else {
            produto.caminhoImagem = 'default-product.jpg'; // Imagem padrão
        }
        
        let id = await produtoService.inserirProduto(produto);
        resp.status(201).send({ id });
    } catch (err) {
        resp.status(400).send({ erro: err.message });
    }
});


endpoints.put('/produto/:id', upload.single('imagem'), async (req, res) => {
    try {
        const id = req.params.id;
        const produto = req.body;

        // Verifica se um novo arquivo foi enviado
        if (req.file) {
            produto.caminhoImagem = req.file.filename;
        } 
        // Se não tiver novo arquivo, mas tiver imagemAtual, manter a atual
        else if (req.body.imagemAtual) {
            produto.caminhoImagem = req.body.imagemAtual;
        }

        await produtoService.alterarProduto(id, produto);
        res.send({ mensagem: 'Produto atualizado com sucesso!' });
    } catch (err) {
        const statusCode = err.message.includes('não encontrado') ? 404 : 400;
        res.status(statusCode).send({ erro: err.message });
    }
});

endpoints.delete("/produto/:id", async (req, resp) => {
    try {
        let id = req.params.id;
        await produtoService.removerProduto(id);
        resp.send({ mensagem: 'Produto removido com sucesso!' });
    } catch (err) {
        const statusCode = err.message.includes('não encontrado') ? 404 : 500;
        resp.status(statusCode).send({ erro: err.message });
    }
});

endpoints.get('/produto', async (req, resp) => {
    try {
        let produtos = await produtoService.listarProdutosDisponiveis();
        
        // Mapear campos para o frontend
        const produtosFormatados = produtos.map(produto => ({
            id: produto.id,
            nome: produto.nome,
            descricao: produto.descricao,
            valor: produto.preco, // Mapear preco -> valor
            preco: produto.preco, // Manter preco também
            quantidade: produto.quantidade,
            imagem: produto.caminhoImagem, // Mapear caminhoImagem -> imagem
            caminhoImagem: produto.caminhoImagem,
            id_categoria: produto.idcategoria,
            idcategoria: produto.idcategoria,
            categoria: produto.categoria,
            ativo: produto.ativo !== undefined ? produto.ativo : 1
        }));
        
        resp.send(produtosFormatados);
    } catch (err) {
        console.error('Erro ao listar produtos disponíveis:', err);
        resp.status(500).send({ erro: err.message });
    }
});

// Análise de custos de produtos
endpoints.get('/produto/analise/custos', async (req, resp) => {
    try {
        const analise = await produtoService.analiseCustosProdutos();
        resp.send(analise);
    } catch (err) {
        resp.status(500).send({ erro: err.message });
    }
});

// Endpoint para admin listar TODOS os produtos (incluindo esgotados)
endpoints.get('/produto/admin/listar', async (req, resp) => {
    try {
        let registros = await produtoService.listarProdutos();
        
        // Mapear campos para o frontend
        const produtosFormatados = registros.map(produto => ({
            id: produto.id,
            nome: produto.nome,
            descricao: produto.descricao,
            valor: produto.preco,
            preco: produto.preco,
            quantidade: produto.quantidade,
            imagem: produto.caminhoImagem,
            caminhoImagem: produto.caminhoImagem,
            id_categoria: produto.idcategoria,
            idcategoria: produto.idcategoria,
            categoria: produto.categoria,
            ativo: produto.ativo !== undefined ? produto.ativo : 1
        }));
        
        resp.send(produtosFormatados);
    } catch (err) {
        console.error('Erro ao listar todos os produtos:', err);
        resp.status(500).send({ erro: err.message });
    }
});

export default endpoints;