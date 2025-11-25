import simulacaoService from '../services/simulacaoService.js';
import { Router } from 'express';
import connection from '../repository/connection.js';

const endpoints = Router();

/**
 * RF020: Controller para Simulação de Custos
 * Permite simular custos sem alterar dados reais
 */

/**
 * POST /simulacao/custo
 * Simula o custo de um produto com receita alternativa
 */
endpoints.post('/simulacao/custo', async (req, resp) => {
        try {
            const { idproduto, receita_simulada } = req.body;

            // Validações
            if (!idproduto) {
                return resp.status(400).json({ 
                    erro: 'ID do produto é obrigatório' 
                });
            }

            if (!receita_simulada || !Array.isArray(receita_simulada) || receita_simulada.length === 0) {
                return resp.status(400).json({ 
                    erro: 'Receita simulada é obrigatória e deve conter ao menos um ingrediente' 
                });
            }

            // Validar formato da receita
            for (const item of receita_simulada) {
                if (!item.idingrediente || !item.quantidade || item.quantidade <= 0) {
                    return resp.status(400).json({ 
                        erro: 'Cada item da receita deve ter idingrediente e quantidade positiva' 
                    });
                }
            }

            const resultado = await simulacaoService.simularCustoProduto(
                idproduto, 
                receita_simulada
            );

            resp.status(200).json(resultado);

        } catch (error) {
            console.error('Erro ao simular custo:', error);
            resp.status(500).json({ 
                erro: 'Erro ao simular custo de produção',
                detalhes: error.message 
            });
        }
    });

    /**
     * POST /simulacao/cenarios
     * Simula diferentes cenários de preço para um produto
     */
    endpoints.post('/simulacao/cenarios', async (req, resp) => {
        try {
            const { idproduto, precos } = req.body;

            if (!idproduto) {
                return resp.status(400).json({ 
                    erro: 'ID do produto é obrigatório' 
                });
            }

            if (!precos || !Array.isArray(precos) || precos.length === 0) {
                return resp.status(400).json({ 
                    erro: 'Array de preços é obrigatório' 
                });
            }

            const resultado = await simulacaoService.simularCenarios(idproduto, precos);

            resp.status(200).json(resultado);

        } catch (error) {
            console.error('Erro ao simular cenários:', error);
            resp.status(500).json({ 
                erro: 'Erro ao simular cenários de preço',
                detalhes: error.message 
            });
        }
    });

    /**
     * GET /simulacao/produto/:id/receita-atual
     * Retorna a receita atual de um produto para usar como base na simulação
     */
    endpoints.get('/simulacao/produto/:id/receita-atual', async (req, resp) => {
        try {
            const { id } = req.params;

            const [receita] = await connection.query(
                `SELECT 
                    r.idingrediente,
                    i.nome as nome_ingrediente,
                    r.quantidade,
                    i.unidade_medida,
                    i.preco_unitario,
                    (r.quantidade * i.preco_unitario) as custo_total
                FROM receita r
                JOIN ingrediente i ON r.idingrediente = i.idingrediente
                WHERE r.idproduto = ?
                ORDER BY i.nome`,
                [id]
            );

            resp.status(200).json({
                idproduto: parseInt(id),
                receita_atual: receita
            });

        } catch (error) {
            console.error('Erro ao buscar receita:', error);
            resp.status(500).json({ 
                erro: 'Erro ao buscar receita atual',
                detalhes: error.message 
            });
        }
    });

export default endpoints;
