import connection from '../repository/connection.js';

/**
 * RF020: Simulação de Custos de Produção
 * Permite simular o custo de um produto alterando a receita sem salvar no banco
 */

class SimulacaoService {
    /**
     * Simula o custo de produção de um produto com receita personalizada
     * @param {number} idproduto - ID do produto
     * @param {Array} receitaSimulada - Array com {idingrediente, quantidade}
     * @returns {Object} - Custo simulado, margem de lucro e comparação
     */
    async simularCustoProduto(idproduto, receitaSimulada) {
        try {
            // 1. Buscar dados atuais do produto
            const [produtoAtual] = await connection.query(
                `SELECT 
                    p.idproduto,
                    p.nome,
                    p.preco as preco_venda,
                    p.custo_producao as custo_atual,
                    ROUND(((p.preco - p.custo_producao) / p.custo_producao * 100), 2) as margem_atual
                FROM produto p
                WHERE p.idproduto = ?`,
                [idproduto]
            );

            if (!produtoAtual || produtoAtual.length === 0) {
                throw new Error('Produto não encontrado');
            }

            const produto = produtoAtual[0];

            // 2. Calcular custo da receita simulada
            let custoSimulado = 0;
            const ingredientesSimulados = [];

            for (const item of receitaSimulada) {
                const [ingrediente] = await connection.query(
                    `SELECT 
                        i.idingrediente,
                        i.nome,
                        i.preco_unitario,
                        i.unidade_medida
                    FROM ingrediente i
                    WHERE i.idingrediente = ?`,
                    [item.idingrediente]
                );

                if (ingrediente && ingrediente.length > 0) {
                    const ing = ingrediente[0];
                    const custoItem = item.quantidade * ing.preco_unitario;
                    custoSimulado += custoItem;

                    ingredientesSimulados.push({
                        idingrediente: ing.idingrediente,
                        nome: ing.nome,
                        quantidade: item.quantidade,
                        unidade: ing.unidade_medida,
                        preco_unitario: ing.preco_unitario,
                        custo_total: custoItem
                    });
                }
            }

            // 3. Calcular margem de lucro simulada
            const margemSimulada = custoSimulado > 0 
                ? ((produto.preco_venda - custoSimulado) / custoSimulado * 100).toFixed(2)
                : 0;

            const lucroSimulado = (produto.preco_venda - custoSimulado).toFixed(2);

            // 4. Comparar com custo atual
            const diferencaCusto = (custoSimulado - produto.custo_atual).toFixed(2);
            const diferencaMargem = (margemSimulada - produto.margem_atual).toFixed(2);

            // 5. Sugerir preço baseado em margem desejada (ex: 100%)
            const margemDesejada = 100; // 100% de lucro
            const precoSugerido = (custoSimulado * (1 + margemDesejada / 100)).toFixed(2);

            return {
                produto: {
                    id: produto.idproduto,
                    nome: produto.nome,
                    preco_venda: produto.preco_venda
                },
                custo_atual: parseFloat(produto.custo_atual),
                custo_simulado: parseFloat(custoSimulado.toFixed(2)),
                diferenca_custo: parseFloat(diferencaCusto),
                margem_atual: parseFloat(produto.margem_atual),
                margem_simulada: parseFloat(margemSimulada),
                diferenca_margem: parseFloat(diferencaMargem),
                lucro_simulado: parseFloat(lucroSimulado),
                preco_sugerido: parseFloat(precoSugerido),
                ingredientes_simulados: ingredientesSimulados,
                recomendacao: this.gerarRecomendacao(custoSimulado, produto.preco_venda, margemSimulada)
            };

        } catch (error) {
            console.error('Erro ao simular custo:', error);
            throw error;
        }
    }

    /**
     * Simula diferentes cenários de preço para um produto
     * @param {number} idproduto - ID do produto
     * @param {Array} precos - Array de preços para simular
     * @returns {Array} - Cenários simulados
     */
    async simularCenarios(idproduto, precos) {
        try {
            const [produto] = await connection.query(
                `SELECT p.*, 
                    p.custo_producao as custo
                FROM produto p
                WHERE p.idproduto = ?`,
                [idproduto]
            );

            if (!produto || produto.length === 0) {
                throw new Error('Produto não encontrado');
            }

            const prod = produto[0];
            const cenarios = precos.map(preco => {
                const margem = prod.custo > 0 
                    ? ((preco - prod.custo) / prod.custo * 100).toFixed(2)
                    : 0;
                const lucro = (preco - prod.custo).toFixed(2);

                return {
                    preco_venda: parseFloat(preco),
                    custo_producao: parseFloat(prod.custo),
                    margem_lucro: parseFloat(margem),
                    lucro_unitario: parseFloat(lucro),
                    viabilidade: this.avaliarViabilidade(margem)
                };
            });

            return {
                produto: {
                    id: prod.idproduto,
                    nome: prod.nome,
                    preco_atual: prod.preco
                },
                cenarios
            };

        } catch (error) {
            console.error('Erro ao simular cenários:', error);
            throw error;
        }
    }

    /**
     * Gera recomendação baseada no custo e margem
     */
    gerarRecomendacao(custo, preco, margem) {
        if (margem < 30) {
            return {
                tipo: 'ALERTA',
                mensagem: 'Margem muito baixa! Considere aumentar o preço ou reduzir custos.',
                cor: 'red'
            };
        } else if (margem >= 30 && margem < 60) {
            return {
                tipo: 'ATENÇÃO',
                mensagem: 'Margem aceitável, mas pode ser melhorada.',
                cor: 'orange'
            };
        } else if (margem >= 60 && margem < 100) {
            return {
                tipo: 'BOM',
                mensagem: 'Margem saudável para o negócio.',
                cor: 'green'
            };
        } else {
            return {
                tipo: 'EXCELENTE',
                mensagem: 'Margem excelente! Produto muito rentável.',
                cor: 'blue'
            };
        }
    }

    /**
     * Avalia viabilidade de um cenário
     */
    avaliarViabilidade(margem) {
        if (margem < 30) return 'BAIXA';
        if (margem < 60) return 'MÉDIA';
        if (margem < 100) return 'BOA';
        return 'EXCELENTE';
    }
}

export default new SimulacaoService();
