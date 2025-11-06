import { Router } from "express";
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { 
    obterDadosRelatorio, 
    obterResumoRelatorio,
    obterProdutosMaisVendidos,
    obterVendasDiarias
} from "../repository/relatorioRepository.js";
import { 
    listarTodosProdutos,
    obterAnaliseEstoque 
} from "../repository/produtoRepository.js";
import { 
    listarIngredientes 
} from "../repository/ingredienteRepository.js";

const endpoints = Router();

// =========================================================
// HELPER: Formatar moeda
// =========================================================
function formatarMoeda(valor) {
    return `R$ ${parseFloat(valor || 0).toFixed(2).replace('.', ',')}`;
}

// =========================================================
// HELPER: Formatar data BR
// =========================================================
function formatarDataBR(data) {
    if (!data) return 'N/A';
    const d = new Date(data);
    return d.toLocaleDateString('pt-BR');
}

// =========================================================
// EXPORTAR EXCEL
// =========================================================
endpoints.get('/relatorio/exportar-excel', async (req, resp) => {
    try {
        const { tipo, dataInicio, dataFim } = req.query;

        if (!dataInicio || !dataFim) {
            return resp.status(400).send({ erro: "Parâmetros dataInicio e dataFim são obrigatórios" });
        }

        const wb = XLSX.utils.book_new();

        if (tipo === 'vendas' || tipo === 'financeiro') {
            // Buscar dados do banco
            const dados = await obterDadosRelatorio(dataInicio, dataFim);
            const resumo = await obterResumoRelatorio(dataInicio, dataFim);

            // Formatar dados para Excel
            const dadosFormatados = dados.map(pedido => {
                let produtosTexto = '';
                try {
                    const produtos = JSON.parse(pedido.produtos);
                    produtosTexto = produtos.map(p => `${p.nome || 'Produto'} (${p.quantidade}x)`).join(', ');
                } catch {
                    produtosTexto = 'N/A';
                }

                return {
                    'ID': pedido.id,
                    'Data': pedido.data,
                    'Cliente': pedido.cliente || 'N/A',
                    'Email': pedido.email || 'N/A',
                    'Telefone': pedido.telefone || 'N/A',
                    'Valor Total': parseFloat(pedido.valor_total || 0).toFixed(2),
                    'Pagamento': pedido.pagamento,
                    'Status': pedido.status,
                    'Produtos': produtosTexto
                };
            });

            // Adicionar resumo
            const resumoSheet = [
                ['RELATÓRIO DE VENDAS'],
                ['Período:', `${dataInicio} até ${dataFim}`],
                [''],
                ['Total de Pedidos:', resumo.totalPedidos],
                ['Receita Total:', `R$ ${parseFloat(resumo.receitaTotal || 0).toFixed(2)}`],
                ['Ticket Médio:', `R$ ${parseFloat(resumo.ticketMedio || 0).toFixed(2)}`],
                ['Pedidos Confirmados:', resumo.pedidosConfirmados],
                ['Pedidos Cancelados:', resumo.pedidosCancelados]
            ];
            const wsResumo = XLSX.utils.aoa_to_sheet(resumoSheet);
            XLSX.utils.book_append_sheet(wb, wsResumo, 'Resumo');

            // Adicionar dados detalhados
            const wsDados = XLSX.utils.json_to_sheet(dadosFormatados);
            XLSX.utils.book_append_sheet(wb, wsDados, 'Pedidos');

        } else if (tipo === 'produtos') {
            // Produtos mais vendidos
            const produtos = await obterProdutosMaisVendidos();
            const produtosFormatados = produtos.map(p => ({
                'Produto': p.produto,
                'Quantidade Vendida': p.quantidadeVendida,
                'Ranking': produtos.indexOf(p) + 1
            }));

            const wsProdutos = XLSX.utils.json_to_sheet(produtosFormatados);
            XLSX.utils.book_append_sheet(wb, wsProdutos, 'Produtos Mais Vendidos');

        } else if (tipo === 'estoque') {
            // Estoque de produtos
            const produtos = await listarTodosProdutos();
            const produtosFormatados = produtos.map(p => ({
                'ID': p.idproduto,
                'Nome': p.nome,
                'Quantidade': p.quantidade,
                'Preço': parseFloat(p.preco || 0).toFixed(2),
                'Categoria': p.categoria || 'N/A',
                'Status': p.ativo ? 'Ativo' : 'Inativo'
            }));

            const wsProdutos = XLSX.utils.json_to_sheet(produtosFormatados);
            XLSX.utils.book_append_sheet(wb, wsProdutos, 'Estoque Produtos');

            // Estoque de ingredientes
            const ingredientes = await listarIngredientes();
            const ingredientesFormatados = ingredientes.map(i => ({
                'ID': i.idingrediente,
                'Nome': i.nome,
                'Quantidade': i.quantidade_estoque,
                'Unidade': i.unidade_medida,
                'Estoque Mínimo': i.estoque_minimo,
                'Preço Unitário': parseFloat(i.preco_unitario || 0).toFixed(2),
                'Fornecedor': i.fornecedor || 'N/A',
                'Status': i.ativo ? 'Ativo' : 'Inativo'
            }));

            const wsIngredientes = XLSX.utils.json_to_sheet(ingredientesFormatados);
            XLSX.utils.book_append_sheet(wb, wsIngredientes, 'Estoque Ingredientes');

        } else if (tipo === 'custos') {
            // Análise de custos
            const produtos = await listarTodosProdutos();
            const custosFormatados = produtos.map(p => ({
                'ID': p.idproduto,
                'Produto': p.nome,
                'Preço Venda': parseFloat(p.preco || 0).toFixed(2),
                'Custo Produção': parseFloat(p.custo_producao || 0).toFixed(2),
                'Lucro': (parseFloat(p.preco || 0) - parseFloat(p.custo_producao || 0)).toFixed(2),
                'Margem %': ((parseFloat(p.preco || 0) - parseFloat(p.custo_producao || 0)) / parseFloat(p.preco || 1) * 100).toFixed(2)
            }));

            const wsCustos = XLSX.utils.json_to_sheet(custosFormatados);
            XLSX.utils.book_append_sheet(wb, wsCustos, 'Análise de Custos');
        }

        // Gerar buffer
        const excelBuffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

        // Configurar headers para download
        resp.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        resp.setHeader('Content-Disposition', `attachment; filename=relatorio_${tipo}_${dataInicio}_${dataFim}.xlsx`);

        resp.send(excelBuffer);

    } catch (err) {
        console.error("Erro ao exportar Excel:", err);
        resp.status(500).send({ erro: "Erro ao gerar relatório Excel", detalhes: err.message });
    }
});

// =========================================================
// EXPORTAR PDF
// =========================================================
endpoints.get('/relatorio/exportar-pdf', async (req, resp) => {
    try {
        const { tipo, dataInicio, dataFim } = req.query;

        if (!dataInicio || !dataFim) {
            return resp.status(400).send({ erro: "Parâmetros dataInicio e dataFim são obrigatórios" });
        }

        // Criar PDF
        const doc = new jsPDF();
        let yPos = 20;

        // Cabeçalho
        doc.setFontSize(18);
        doc.setFont(undefined, 'bold');
        doc.text('Segredo do Sabor', 105, yPos, { align: 'center' });
        yPos += 10;

        doc.setFontSize(14);
        const tipoTitulo = {
            'vendas': 'Relatório de Vendas',
            'produtos': 'Produtos Mais Vendidos',
            'financeiro': 'Relatório Financeiro',
            'estoque': 'Relatório de Estoque',
            'custos': 'Análise de Custos'
        };
        doc.text(tipoTitulo[tipo] || 'Relatório', 105, yPos, { align: 'center' });
        yPos += 7;

        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.text(`Período: ${formatarDataBR(dataInicio)} até ${formatarDataBR(dataFim)}`, 105, yPos, { align: 'center' });
        yPos += 10;

        // Linha separadora
        doc.line(15, yPos, 195, yPos);
        yPos += 10;

        if (tipo === 'vendas' || tipo === 'financeiro') {
            // Buscar dados
            const dados = await obterDadosRelatorio(dataInicio, dataFim);
            const resumo = await obterResumoRelatorio(dataInicio, dataFim);

            // Resumo
            doc.setFontSize(12);
            doc.setFont(undefined, 'bold');
            doc.text('Resumo', 15, yPos);
            yPos += 8;

            doc.setFontSize(10);
            doc.setFont(undefined, 'normal');
            doc.text(`Total de Pedidos: ${resumo.totalPedidos}`, 15, yPos);
            yPos += 6;
            doc.text(`Receita Total: ${formatarMoeda(resumo.receitaTotal)}`, 15, yPos);
            yPos += 6;
            doc.text(`Ticket Médio: ${formatarMoeda(resumo.ticketMedio)}`, 15, yPos);
            yPos += 6;
            doc.text(`Pedidos Confirmados: ${resumo.pedidosConfirmados}`, 15, yPos);
            yPos += 6;
            doc.text(`Pedidos Cancelados: ${resumo.pedidosCancelados}`, 15, yPos);
            yPos += 12;

            // Tabela de pedidos
            const dadosTabela = dados.slice(0, 20).map(p => [
                p.id,
                p.data,
                p.cliente || 'N/A',
                formatarMoeda(p.valor_total),
                p.pagamento,
                p.status
            ]);

            doc.autoTable({
                startY: yPos,
                head: [['ID', 'Data', 'Cliente', 'Valor', 'Pagamento', 'Status']],
                body: dadosTabela,
                theme: 'striped',
                headStyles: { fillColor: [255, 87, 87] },
                styles: { fontSize: 8 },
                margin: { left: 15, right: 15 }
            });

        } else if (tipo === 'produtos') {
            // Produtos mais vendidos
            const produtos = await obterProdutosMaisVendidos();

            const dadosTabela = produtos.map((p, index) => [
                index + 1,
                p.produto,
                p.quantidadeVendida
            ]);

            doc.autoTable({
                startY: yPos,
                head: [['Ranking', 'Produto', 'Quantidade Vendida']],
                body: dadosTabela,
                theme: 'striped',
                headStyles: { fillColor: [255, 87, 87] },
                styles: { fontSize: 10 },
                margin: { left: 15, right: 15 }
            });

        } else if (tipo === 'estoque') {
            // Estoque de produtos
            const produtos = await listarTodosProdutos();

            const dadosTabela = produtos.map(p => [
                p.idproduto,
                p.nome,
                p.quantidade,
                formatarMoeda(p.preco),
                p.ativo ? 'Ativo' : 'Inativo'
            ]);

            doc.autoTable({
                startY: yPos,
                head: [['ID', 'Produto', 'Quantidade', 'Preço', 'Status']],
                body: dadosTabela,
                theme: 'striped',
                headStyles: { fillColor: [255, 87, 87] },
                styles: { fontSize: 9 },
                margin: { left: 15, right: 15 }
            });

        } else if (tipo === 'custos') {
            // Análise de custos
            const produtos = await listarTodosProdutos();

            const dadosTabela = produtos.map(p => {
                const precoVenda = parseFloat(p.preco || 0);
                const custoProducao = parseFloat(p.custo_producao || 0);
                const lucro = precoVenda - custoProducao;
                const margem = precoVenda > 0 ? (lucro / precoVenda * 100).toFixed(2) : '0.00';

                return [
                    p.nome,
                    formatarMoeda(precoVenda),
                    formatarMoeda(custoProducao),
                    formatarMoeda(lucro),
                    `${margem}%`
                ];
            });

            doc.autoTable({
                startY: yPos,
                head: [['Produto', 'Preço Venda', 'Custo', 'Lucro', 'Margem']],
                body: dadosTabela,
                theme: 'striped',
                headStyles: { fillColor: [255, 87, 87] },
                styles: { fontSize: 8 },
                margin: { left: 15, right: 15 }
            });
        }

        // Rodapé
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.text(
                `Gerado em: ${new Date().toLocaleString('pt-BR')} - Página ${i} de ${pageCount}`,
                105,
                285,
                { align: 'center' }
            );
        }

        // Gerar PDF como buffer
        const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

        // Configurar headers para download
        resp.setHeader('Content-Type', 'application/pdf');
        resp.setHeader('Content-Disposition', `attachment; filename=relatorio_${tipo}_${dataInicio}_${dataFim}.pdf`);
        resp.setHeader('Content-Length', pdfBuffer.length);

        resp.send(pdfBuffer);

    } catch (err) {
        console.error("Erro ao exportar PDF:", err);
        resp.status(500).send({ erro: "Erro ao gerar relatório PDF", detalhes: err.message });
    }
});

export default endpoints;
