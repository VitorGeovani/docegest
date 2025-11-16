import { Router } from 'express';
import assistenteVirtualService from '../services/assistenteVirtualService.js';

const endpoints = Router();

/**
 * 🤖 CONTROLLER: ASSISTENTE VIRTUAL
 * API endpoints para o chatbot inteligente
 */

/**
 * POST /api/assistente/mensagem
 * Processar mensagem do usuário
 */
endpoints.post('/api/assistente/mensagem', async (req, res) => {
    try {
        const { mensagem, contexto } = req.body;

        if (!mensagem || mensagem.trim() === '') {
            return res.status(400).json({
                erro: 'Mensagem é obrigatória'
            });
        }

        // Adicionar IP ao contexto
        const contextoCompleto = {
            ...contexto,
            ip: req.ip,
            userAgent: req.get('user-agent')
        };

        // Processar com IA
        const resposta = await assistenteVirtualService.processarMensagem(
            mensagem,
            contextoCompleto
        );

        // Registrar interação
        await assistenteVirtualService.registrarInteracao(mensagem, resposta);

        return res.json({
            sucesso: true,
            resposta: resposta.resposta,
            categoria: resposta.categoria,
            confianca: resposta.confianca,
            sugestoes: resposta.sugestoes || [],
            aguardandoDados: resposta.aguardandoDados || false
        });

    } catch (error) {
        console.error('Erro ao processar mensagem:', error);
        return res.status(500).json({
            erro: 'Erro ao processar mensagem',
            mensagem: error.message
        });
    }
});

/**
 * POST /api/assistente/feedback
 * Registrar feedback do usuário (positivo/negativo)
 */
endpoints.post('/api/assistente/feedback', async (req, res) => {
    try {
        const { mensagem, feedback } = req.body;

        if (!mensagem || !feedback) {
            return res.status(400).json({
                erro: 'Mensagem e feedback são obrigatórios'
            });
        }

        if (!['positivo', 'negativo'].includes(feedback)) {
            return res.status(400).json({
                erro: 'Feedback deve ser "positivo" ou "negativo"'
            });
        }

        // Adicionar contexto com IP
        const contexto = {
            ip: req.ip,
            userAgent: req.get('user-agent')
        };

        // Atualizar feedback no banco
        await assistenteVirtualService.registrarFeedback(mensagem, feedback, contexto);

        return res.json({
            sucesso: true,
            mensagem: 'Feedback registrado com sucesso'
        });

    } catch (error) {
        console.error('Erro ao registrar feedback:', error);
        return res.status(500).json({
            erro: 'Erro ao registrar feedback',
            mensagem: error.message
        });
    }
});

/**
 * GET /api/assistente/saudacao
 * Obter mensagem de saudação inicial
 */
endpoints.get('/api/assistente/saudacao', async (req, res) => {
    try {
        const contexto = {
            ip: req.ip,
            userAgent: req.get('user-agent'),
            horario: new Date().getHours()
        };

        const saudacao = assistenteVirtualService.gerarSaudacao(contexto);

        return res.json({
            sucesso: true,
            saudacao: saudacao.resposta || saudacao
        });

    } catch (error) {
        console.error('Erro ao gerar saudação:', error);
        return res.status(500).json({
            erro: 'Erro ao gerar saudação',
            mensagem: error.message
        });
    }
});

/**
 * GET /api/assistente/menu
 * Obter menu principal com opções
 */
endpoints.get('/api/assistente/menu', async (req, res) => {
    try {
        const menu = assistenteVirtualService.gerarMenuPrincipal();

        // Extrair opções do texto do menu
        const opcoes = [
            'Fazer um pedido',
            'Consultar status',
            'Ver cardápio',
            'Formas de pagamento',
            'Entrega e retirada',
            'Acessibilidade',
            'Falar com atendente'
        ];

        return res.json({
            sucesso: true,
            menu: menu.resposta,
            opcoes: opcoes
        });

    } catch (error) {
        console.error('Erro ao gerar menu:', error);
        return res.status(500).json({
            erro: 'Erro ao gerar menu'
        });
    }
});

/**
 * GET /api/assistente/estatisticas
 * Obter estatísticas de uso (admin)
 */
endpoints.get('/api/assistente/estatisticas', async (req, res) => {
    try {
        const { periodo = 30 } = req.query;

        const estatisticas = await assistenteVirtualService.obterEstatisticas(parseInt(periodo));

        return res.json({
            sucesso: true,
            estatisticas
        });

    } catch (error) {
        console.error('Erro ao obter estatísticas:', error);
        return res.status(500).json({
            erro: 'Erro ao obter estatísticas'
        });
    }
});

/**
 * POST /api/assistente/admin/adicionar-intencao
 * Adicionar nova intenção personalizada (admin)
 */
endpoints.post('/api/assistente/admin/adicionar-intencao', async (req, res) => {
    try {
        const { categoria, pergunta, resposta } = req.body;

        if (!categoria || !pergunta || !resposta) {
            return res.status(400).json({
                erro: 'Categoria, pergunta e resposta são obrigatórios'
            });
        }

        await assistenteVirtualService.adicionarIntencao(categoria, pergunta, resposta);

        return res.json({
            sucesso: true,
            mensagem: 'Intenção adicionada com sucesso'
        });

    } catch (error) {
        console.error('Erro ao adicionar intenção:', error);
        return res.status(500).json({
            erro: 'Erro ao adicionar intenção'
        });
    }
});

/**
 * POST /api/assistente/buscar-pedido
 * Buscar informações de um pedido
 */
endpoints.post('/api/assistente/buscar-pedido', async (req, res) => {
    try {
        const { codigoPedido, telefone, email } = req.body;

        if (!codigoPedido && !telefone && !email) {
            return res.status(400).json({
                erro: 'Informe o código do pedido, telefone ou email'
            });
        }

        const pedido = await assistenteVirtualService.buscarUltimoPedido({
            codigoPedido,
            telefone,
            email
        });

        if (!pedido) {
            return res.status(404).json({
                sucesso: false,
                erro: 'Pedido não encontrado'
            });
        }

        return res.json({
            sucesso: true,
            pedido
        });

    } catch (error) {
        console.error('Erro ao buscar pedido:', error);
        return res.status(500).json({
            erro: 'Erro ao buscar pedido'
        });
    }
});

/**
 * GET /api/assistente/saudacao
 * Gerar saudação personalizada
 */
endpoints.get('/api/assistente/saudacao', async (req, res) => {
    try {
        const { nome } = req.query;

        const saudacao = assistenteVirtualService.gerarSaudacao({ nome });

        return res.json({
            sucesso: true,
            ...saudacao
        });

    } catch (error) {
        console.error('Erro ao gerar saudação:', error);
        return res.status(500).json({
            erro: 'Erro ao gerar saudação'
        });
    }
});

export default endpoints;
