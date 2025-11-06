import { Router } from 'express';
import * as personalizacaoService from '../services/personalizacaoService.js';

const endpoints = Router();

/**
 * RF052 + RF053: Controller para Personalização de Produtos
 * Endpoints REST para gerenciar personalizações e calcular acréscimos
 */

// ==================== OPÇÕES DE PERSONALIZAÇÃO ====================

/**
 * GET /personalizacao/opcoes
 * Listar todas as opções de personalização
 */
endpoints.get('/personalizacao/opcoes', async (req, resp) => {
    try {
        const opcoes = await personalizacaoService.listarOpcoes();
        resp.status(200).send(opcoes);
    } catch (error) {
        resp.status(500).send({ erro: error.message });
    }
});

/**
 * GET /personalizacao/opcoes/completas
 * Listar opções completas com seus valores (para admin)
 */
endpoints.get('/personalizacao/opcoes/completas', async (req, resp) => {
    try {
        const opcoes = await personalizacaoService.listarOpcoesCompletas();
        resp.status(200).send(opcoes);
    } catch (error) {
        resp.status(500).send({ erro: error.message });
    }
});

/**
 * GET /personalizacao/opcoes/:id
 * Buscar opção por ID
 */
endpoints.get('/personalizacao/opcoes/:id', async (req, resp) => {
    try {
        const { id } = req.params;
        const opcao = await personalizacaoService.buscarOpcaoPorId(parseInt(id));
        resp.status(200).send(opcao);
    } catch (error) {
        resp.status(error.message.includes('não encontrada') ? 404 : 500)
            .send({ erro: error.message });
    }
});

/**
 * POST /personalizacao/opcoes
 * Criar nova opção de personalização (RF052)
 */
endpoints.post('/personalizacao/opcoes', async (req, resp) => {
    try {
        const opcaoData = {
            nome_opcao: req.body.nome_opcao,
            descricao: req.body.descricao,
            tipo_selecao: req.body.tipo_selecao || 'radio',
            obrigatorio: req.body.obrigatorio || false,
            ordem_exibicao: req.body.ordem_exibicao || 0
        };
        
        const resultado = await personalizacaoService.criarOpcao(opcaoData);
        resp.status(201).send(resultado);
    } catch (error) {
        resp.status(400).send({ erro: error.message });
    }
});

/**
 * PUT /personalizacao/opcoes/:id
 * Atualizar opção
 */
endpoints.put('/personalizacao/opcoes/:id', async (req, resp) => {
    try {
        const { id } = req.params;
        const opcaoData = {
            nome_opcao: req.body.nome_opcao,
            descricao: req.body.descricao,
            tipo_selecao: req.body.tipo_selecao,
            obrigatorio: req.body.obrigatorio,
            ordem_exibicao: req.body.ordem_exibicao
        };
        
        const resultado = await personalizacaoService.atualizarOpcao(parseInt(id), opcaoData);
        resp.status(200).send(resultado);
    } catch (error) {
        resp.status(400).send({ erro: error.message });
    }
});

/**
 * DELETE /personalizacao/opcoes/:id
 * Deletar opção (soft delete)
 */
endpoints.delete('/personalizacao/opcoes/:id', async (req, resp) => {
    try {
        const { id } = req.params;
        const resultado = await personalizacaoService.deletarOpcao(parseInt(id));
        resp.status(200).send(resultado);
    } catch (error) {
        resp.status(400).send({ erro: error.message });
    }
});

// ==================== VALORES DAS OPÇÕES ====================

/**
 * GET /personalizacao/opcoes/:id/valores
 * Buscar todos os valores de uma opção
 */
endpoints.get('/personalizacao/opcoes/:id/valores', async (req, resp) => {
    try {
        const { id } = req.params;
        const valores = await personalizacaoService.listarValoresOpcao(parseInt(id));
        resp.status(200).send(valores);
    } catch (error) {
        resp.status(500).send({ erro: error.message });
    }
});

/**
 * POST /personalizacao/opcoes/:id/valores
 * Adicionar valor a opção (RF053 - com preço adicional)
 */
endpoints.post('/personalizacao/opcoes/:id/valores', async (req, resp) => {
    try {
        const { id } = req.params;
        const valorData = {
            idopcao_fk: parseInt(id),
            nome_valor: req.body.nome_valor,
            preco_adicional: parseFloat(req.body.preco_adicional) || 0.00,
            ordem_exibicao: req.body.ordem_exibicao || 0
        };
        
        const resultado = await personalizacaoService.adicionarValorOpcao(valorData);
        resp.status(201).send(resultado);
    } catch (error) {
        resp.status(400).send({ erro: error.message });
    }
});

/**
 * PUT /personalizacao/valores/:id
 * Atualizar valor de opção
 */
endpoints.put('/personalizacao/valores/:id', async (req, resp) => {
    try {
        const { id } = req.params;
        const valorData = {
            nome_valor: req.body.nome_valor,
            preco_adicional: req.body.preco_adicional ? parseFloat(req.body.preco_adicional) : undefined,
            ordem_exibicao: req.body.ordem_exibicao
        };
        
        const resultado = await personalizacaoService.atualizarValorOpcao(parseInt(id), valorData);
        resp.status(200).send(resultado);
    } catch (error) {
        resp.status(400).send({ erro: error.message });
    }
});

/**
 * DELETE /personalizacao/valores/:id
 * Deletar valor de opção
 */
endpoints.delete('/personalizacao/valores/:id', async (req, resp) => {
    try {
        const { id } = req.params;
        const resultado = await personalizacaoService.deletarValorOpcao(parseInt(id));
        resp.status(200).send(resultado);
    } catch (error) {
        resp.status(400).send({ erro: error.message });
    }
});

// ==================== ASSOCIAÇÃO PRODUTO-OPÇÃO ====================

/**
 * GET /personalizacao/produtos/:id/opcoes
 * Buscar opções disponíveis para um produto (RF052)
 * Usado pelo cliente no catálogo para ver as personalizações disponíveis
 */
endpoints.get('/personalizacao/produtos/:id/opcoes', async (req, resp) => {
    try {
        const { id } = req.params;
        const opcoes = await personalizacaoService.buscarOpcoesProduto(parseInt(id));
        resp.status(200).send(opcoes);
    } catch (error) {
        resp.status(500).send({ erro: error.message });
    }
});

/**
 * POST /personalizacao/produtos/:id/opcoes
 * Associar opção a produto (admin)
 */
endpoints.post('/personalizacao/produtos/:id/opcoes', async (req, resp) => {
    try {
        const { id } = req.params;
        const { idopcao, obrigatorio } = req.body;
        
        const resultado = await personalizacaoService.associarOpcaoProduto(
            parseInt(id),
            parseInt(idopcao),
            obrigatorio || false
        );
        
        resp.status(201).send(resultado);
    } catch (error) {
        resp.status(400).send({ erro: error.message });
    }
});

/**
 * DELETE /personalizacao/produtos/:idproduto/opcoes/:idopcao
 * Remover associação produto-opção
 */
endpoints.delete('/personalizacao/produtos/:idproduto/opcoes/:idopcao', async (req, resp) => {
    try {
        const { idproduto, idopcao } = req.params;
        
        const resultado = await personalizacaoService.removerAssociacaoProdutoOpcao(
            parseInt(idproduto),
            parseInt(idopcao)
        );
        
        resp.status(200).send(resultado);
    } catch (error) {
        resp.status(400).send({ erro: error.message });
    }
});

/**
 * GET /personalizacao/produtos-com-opcoes
 * Listar todos os produtos que têm opções de personalização
 */
endpoints.get('/personalizacao/produtos-com-opcoes', async (req, resp) => {
    try {
        const produtos = await personalizacaoService.listarProdutosComOpcoes();
        resp.status(200).send(produtos);
    } catch (error) {
        resp.status(500).send({ erro: error.message });
    }
});

// ==================== PERSONALIZAÇÃO DE PEDIDOS ====================

/**
 * POST /personalizacao/calcular-acrescimo
 * Calcular valor de acréscimo das personalizações (RF053)
 * Usado no carrinho para calcular o valor adicional em tempo real
 */
endpoints.post('/personalizacao/calcular-acrescimo', async (req, resp) => {
    try {
        const { personalizacoes } = req.body;
        
        if (!personalizacoes || !Array.isArray(personalizacoes)) {
            return resp.status(400).send({ 
                erro: 'Personalizações devem ser um array' 
            });
        }
        
        const valorAcrescimo = await personalizacaoService.calcularAcrescimo(personalizacoes);
        
        resp.status(200).send({ 
            valor_acrescimo: valorAcrescimo,
            formatado: `R$ ${valorAcrescimo.toFixed(2)}`
        });
    } catch (error) {
        resp.status(400).send({ erro: error.message });
    }
});

/**
 * POST /personalizacao/pedidos/:id/salvar
 * Salvar personalizações do pedido (RF052 + RF053)
 * Chamado ao finalizar pedido com personalizações
 */
endpoints.post('/personalizacao/pedidos/:id/salvar', async (req, resp) => {
    try {
        const { id } = req.params;
        const { idproduto, personalizacoes } = req.body;
        
        if (!idproduto) {
            return resp.status(400).send({ erro: 'ID do produto é obrigatório' });
        }
        
        if (!personalizacoes || !Array.isArray(personalizacoes)) {
            return resp.status(400).send({ erro: 'Personalizações são obrigatórias' });
        }
        
        const resultado = await personalizacaoService.salvarPersonalizacaoPedido(
            parseInt(id),
            parseInt(idproduto),
            personalizacoes
        );
        
        resp.status(201).send(resultado);
    } catch (error) {
        resp.status(400).send({ erro: error.message });
    }
});

/**
 * GET /personalizacao/pedidos/:id
 * Buscar personalizações de um pedido
 */
endpoints.get('/personalizacao/pedidos/:id', async (req, resp) => {
    try {
        const { id } = req.params;
        const personalizacoes = await personalizacaoService.buscarPersonalizacoesPedido(parseInt(id));
        resp.status(200).send(personalizacoes);
    } catch (error) {
        resp.status(500).send({ erro: error.message });
    }
});

/**
 * POST /personalizacao/validar-obrigatorias
 * Validar se todas as personalizações obrigatórias foram selecionadas
 * Usado antes de adicionar produto ao carrinho
 */
endpoints.post('/personalizacao/validar-obrigatorias', async (req, resp) => {
    try {
        const { idproduto, personalizacoes } = req.body;
        
        if (!idproduto) {
            return resp.status(400).send({ erro: 'ID do produto é obrigatório' });
        }
        
        if (!personalizacoes || !Array.isArray(personalizacoes)) {
            return resp.status(400).send({ erro: 'Personalizações são obrigatórias' });
        }
        
        const resultado = await personalizacaoService.validarPersonalizacoesObrigatorias(
            parseInt(idproduto),
            personalizacoes
        );
        
        resp.status(200).send(resultado);
    } catch (error) {
        resp.status(400).send({ erro: error.message });
    }
});

// ==================== RELATÓRIOS ====================

/**
 * GET /personalizacao/relatorio
 * Relatório de personalizações
 */
endpoints.get('/personalizacao/relatorio', async (req, resp) => {
    try {
        const filtros = {
            data_inicio: req.query.data_inicio,
            data_fim: req.query.data_fim,
            idproduto: req.query.idproduto,
            limit: req.query.limit
        };
        
        const relatorio = await personalizacaoService.relatorioPersonalizacoes(filtros);
        resp.status(200).send(relatorio);
    } catch (error) {
        resp.status(500).send({ erro: error.message });
    }
});

// ==================== VÍNCULO COM INGREDIENTES ====================

/**
 * POST /personalizacao/valores/:id/ingredientes
 * Vincular ingrediente a um valor de personalização
 */
endpoints.post('/personalizacao/valores/:id/ingredientes', async (req, resp) => {
    try {
        const { id } = req.params;
        const { idingrediente, quantidade_usada } = req.body;
        
        if (!idingrediente || !quantidade_usada) {
            return resp.status(400).send({ 
                erro: 'ID do ingrediente e quantidade usada são obrigatórios' 
            });
        }
        
        const resultado = await personalizacaoService.vincularValorIngrediente(
            parseInt(id),
            parseInt(idingrediente),
            parseFloat(quantidade_usada)
        );
        
        resp.status(201).send(resultado);
    } catch (error) {
        resp.status(400).send({ erro: error.message });
    }
});

/**
 * DELETE /personalizacao/valores/:idvalor/ingredientes/:idingrediente
 * Remover vínculo entre valor e ingrediente
 */
endpoints.delete('/personalizacao/valores/:idvalor/ingredientes/:idingrediente', async (req, resp) => {
    try {
        const { idvalor, idingrediente } = req.params;
        
        const resultado = await personalizacaoService.removerVinculoValorIngrediente(
            parseInt(idvalor),
            parseInt(idingrediente)
        );
        
        resp.status(200).send(resultado);
    } catch (error) {
        resp.status(400).send({ erro: error.message });
    }
});

/**
 * GET /personalizacao/valores/:id/ingredientes
 * Listar ingredientes vinculados a um valor de personalização
 */
endpoints.get('/personalizacao/valores/:id/ingredientes', async (req, resp) => {
    try {
        const { id } = req.params;
        const ingredientes = await personalizacaoService.listarIngredientesValor(parseInt(id));
        resp.status(200).send(ingredientes);
    } catch (error) {
        resp.status(500).send({ erro: error.message });
    }
});

/**
 * GET /personalizacao/valores/:id/disponibilidade
 * Verificar se personalização está disponível baseado no estoque
 */
endpoints.get('/personalizacao/valores/:id/disponibilidade', async (req, resp) => {
    try {
        const { id } = req.params;
        const disponibilidade = await personalizacaoService.verificarDisponibilidadePersonalizacao(parseInt(id));
        resp.status(200).send(disponibilidade);
    } catch (error) {
        resp.status(500).send({ erro: error.message });
    }
});

/**
 * POST /personalizacao/processar-estoque
 * Processar personalização e dar baixa no estoque dos ingredientes
 * Chamado quando o pedido é confirmado
 */
endpoints.post('/personalizacao/processar-estoque', async (req, resp) => {
    try {
        const { personalizacoes, idreserva, usuario } = req.body;
        
        if (!personalizacoes || !Array.isArray(personalizacoes)) {
            return resp.status(400).send({ 
                erro: 'Personalizações devem ser um array' 
            });
        }
        
        if (!idreserva) {
            return resp.status(400).send({ 
                erro: 'ID da reserva é obrigatório' 
            });
        }
        
        const resultado = await personalizacaoService.processarPersonalizacaoComEstoque(
            personalizacoes,
            parseInt(idreserva),
            usuario || 'Sistema'
        );
        
        resp.status(200).send(resultado);
    } catch (error) {
        resp.status(400).send({ erro: error.message });
    }
});

// ==================== EXPORT ====================

export function adicionarRotas(servidor) {
    servidor.use(endpoints);
}
