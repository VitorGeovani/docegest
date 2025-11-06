import "./index.scss";
import React, { useState, useEffect } from "react";
import axios from "axios";



function Financas() {
  const [receitaTotal, setReceitaTotal] = useState(null); // Estado para armazenar a receita total
  const [totalPedidos, setTotalPedidos] = useState(null); // Estado para armazenar o total de pedidos
  const [vendasPorPeriodo, setVendasPorPeriodo] = useState({ manha: 0, tarde: 0, noite: 0 }); // Estado para armazenar vendas por período
  const [tiposPagamentos, setTiposPagamentos] = useState([]); // Estado para armazenar os tipos de pagamentos
  const [obterTotalPedidos, setObterTotalPedidos] = useState(null); // Estado para armazenar o total de pedidos
  const [produtosMaisVendidos, setProdutosMaisVendidos] = useState([]); // Estado para armazenar os produtos mais vendidos
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const custoPorProduto = 4; // Custo para produzir cada produto
  const precoVendaPorProduto = 12; // Preço de venda de cada produto

  // Calcula o custo total
  const custoTotal = obterTotalPedidos !== null ? obterTotalPedidos * custoPorProduto : 0;

  // Calcula o lucro líquido
  const lucroLiquido =
    obterTotalPedidos !== null ? obterTotalPedidos * precoVendaPorProduto - custoTotal : 0;



  useEffect(() => {
    const buscarDados = async () => {
      try {
        // Busca a receita total
        const receitaResponse = await axios.get("http://localhost:5015/relatorio/receita-total");
        setReceitaTotal(receitaResponse.data.receitaTotal); // Supondo que o backend retorna { receitaTotal: valor }

        // Busca o total de pedidos
        const pedidosResponse = await axios.get("http://localhost:5015/relatorio/total-pedidos");
        setTotalPedidos(pedidosResponse.data.totalPedidos); // Supondo que o backend retorna { totalPedidos: valor }

        // Busca vendas por período
        const vendasResponse = await axios.get("http://localhost:5015/relatorio/vendas-por-periodo");
        const vendas = vendasResponse.data;

        // Busca o total de pedidos
        const pedidosUnitariosResponse = await axios.get("http://localhost:5015/relatorio/total-vendidos");
        setObterTotalPedidos(pedidosUnitariosResponse.data.totalProdutosVendidos); // Supondo que o backend retorna { totalPedidos: valor }

        const vendasPorPeriodoFormatado = vendas.reduce((acc, venda) => {
          if (venda.periodo === "Manhã") acc.manha = venda.totalVendas;
          if (venda.periodo === "Tarde") acc.tarde = venda.totalVendas;
          if (venda.periodo === "Noite") acc.noite = venda.totalVendas;
          return acc;
        }, { manha: 0, tarde: 0, noite: 0 });

        setVendasPorPeriodo(vendasPorPeriodoFormatado);

        // Busca tipos de pagamentos
        const pagamentosResponse = await axios.get("http://localhost:5015/relatorio/tipos-pagamento");
        const pagamentos = pagamentosResponse.data.map((pagamento) => ({
          tipo: pagamento.pagamento,
          porcentagem: parseFloat(pagamento.porcentagem).toFixed(0), // Converte para número e formata com 2 casas decimais
        }));


        // Busca produtos mais vendidos
        const produtosResponse = await axios.get("http://localhost:5015/relatorio/produtos-mais-vendidos");
        setProdutosMaisVendidos(produtosResponse.data);

        console.log(pagamentos);
        setTiposPagamentos(pagamentos);

        setLoading(false);
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
        setError("Erro ao carregar os dados.");
        setLoading(false);
      }
    };

    buscarDados();
  }, []);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="Financas">


      <div className="flex-row-c">
        <span className="financeiro-1">Financeiro</span>
      </div>


      <button className="rectangle3">
        <span className="detalhamento-financeiro">
          Detalhamento Financeiro
        </span>
      </button>


      <div className="flex-row-ae">
        <div className="rectangle-a">
          <div className="flex-row-fde">
            <div className="cash-register" />
            <span className="text-receita-total">Receita Total </span>
          </div>
          <span className="text-r-4-464-00">{receitaTotal !== null ? `R$ ${receitaTotal.toFixed(2)}` : "Carregando..."}</span>
        </div>
        <div className="rectangle-b">
          <div className="cash-remove" />
          <div className="flex-column-cab">
            <span className="text-custo-total">Custo Total </span>
            <span className="text-r-1-216-44"> {custoTotal !== null ? `R$ ${custoTotal.toFixed(2)}` : "Carregando..."}</span>
          </div>
        </div>
        <div className="rectangle-c">
          <div className="flex-row-ca">
            <div className="tabler-cash-plus" />
            <span className="lucro-liquido">Lucro Liquido</span>
          </div>
          <span className="r-3-247-56">{lucroLiquido !== null ? `R$ ${lucroLiquido.toFixed(2)}` : "Carregando..."}</span>
        </div>
        <div className="rectangle-d">
          <div className="flex-row-e">
            <div className="tabler-paper-bag-f" />
            <span className="total-pedidos">Total Pedidos</span>
          </div>
          <span className="text-11">
            {totalPedidos !== null ? totalPedidos : "Carregando..."}
          </span>
        </div>
      </div>
      <div className="flex-row-10">
        <div className="rectangle-11">
          <div className="flex-column-ec">
            <div className="mdi-podium" />
            <span className="produtos-mais-vendidos">Produtos Mais Vendidos</span>
          </div>
          {produtosMaisVendidos.map((produto, index) => (
            <div key={index} className="produto-item">
              <span className="produto-nome">{produto.produto}</span>
              <span className="produto-quantidade">{produto.quantidadeVendida} </span>
            </div>
          ))}

        </div>
        <div className="rectangle-12">
          <div className="sun-moon-stars" />
          <span className="vendas-por-periodo">Vendas por Periodo</span>
          <div className="flex-column-e">
            <span className="manha">Manhã</span>
            <span className="tarde">Tarde</span>
            <span className="noite">Noite</span>
          </div>
          <div className="flex-column-aa">
            <span className="empty">{vendasPorPeriodo.manha}</span>
            <span className="empty-13">{vendasPorPeriodo.tarde}</span>
            <span className="empty-14">{vendasPorPeriodo.noite}</span>
          </div>
        </div>
      </div>
      <div className="rectangle-15">
        <span className="tipos-de-pagamentos">Tipos De Pagamentos </span>
        {tiposPagamentos.map((pagamento, index) => (
          <span key={index} className="pagamento-item">
            {pagamento.tipo}: {pagamento.porcentagem}%
          </span>
        ))}

      </div>
    </div >
  );
}

export default Financas;