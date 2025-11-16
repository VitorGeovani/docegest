import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { FaChartLine, FaDollarSign, FaShoppingCart, FaPercentage } from 'react-icons/fa';
import { toast } from 'react-toastify';
import "./index.scss";

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    receitaTotal: 0,
    custoTotal: 0,
    lucroLiquido: 0,
    totalPedidos: 0,
    ticketMedio: 0,
    produtosMaisVendidos: [],
    vendasPorPeriodo: [],
    tiposPagamento: [],
    vendasDiarias: []
  });

  useEffect(() => {
    carregarDados();
  }, []);

  // Função para formatar datas de forma legível
  const formatarData = (dataISO) => {
    if (!dataISO) return 'N/A';
    
    const data = new Date(dataISO);
    
    // Verificar se é data válida
    if (isNaN(data.getTime())) return 'Data inválida';
    
    const hoje = new Date();
    const ontem = new Date(hoje);
    ontem.setDate(ontem.getDate() - 1);
    
    // Comparar apenas as datas (sem hora)
    const dataStr = data.toDateString();
    const hojeStr = hoje.toDateString();
    const ontemStr = ontem.toDateString();
    
    if (dataStr === hojeStr) {
      return 'Hoje';
    } else if (dataStr === ontemStr) {
      return 'Ontem';
    } else {
      // Formato: 15/Nov ou 15 de Nov
      const dia = data.getDate();
      const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      const mes = meses[data.getMonth()];
      return `${dia}/${mes}`;
    }
  };

  // Função para formatar valores monetários
  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(valor);
  };

  const carregarDados = async () => {
    try {
      setLoading(true);

      // Buscar todos os dados em paralelo
      const [
        receitaRes,
        pedidosRes,
        produtosRes,
        periodosRes,
        pagamentosRes,
        vendasDiariasRes
      ] = await Promise.all([
        axios.get("http://localhost:5000/relatorio/receita-total"),
        axios.get("http://localhost:5000/relatorio/total-pedidos"),
        axios.get("http://localhost:5000/relatorio/produtos-mais-vendidos"),
        axios.get("http://localhost:5000/relatorio/vendas-por-periodo"),
        axios.get("http://localhost:5000/relatorio/tipos-pagamento"),
        axios.get("http://localhost:5000/relatorio/vendas-diarias") // Novo endpoint para gráfico
      ]);

      const receitaTotal = receitaRes.data.receitaTotal || 0;
      const totalPedidos = pedidosRes.data.totalPedidos || 0;
      const custoTotal = receitaTotal * 0.35; // 35% de custo aproximado
      const lucroLiquido = receitaTotal - custoTotal;
      const ticketMedio = totalPedidos > 0 ? receitaTotal / totalPedidos : 0;

      setDashboardData({
        receitaTotal,
        custoTotal,
        lucroLiquido,
        totalPedidos,
        ticketMedio,
        produtosMaisVendidos: produtosRes.data.slice(0, 5), // Top 5
        vendasPorPeriodo: periodosRes.data,
        tiposPagamento: pagamentosRes.data,
        vendasDiarias: vendasDiariasRes.data || []
      });

      setLoading(false);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast.error("Erro ao carregar dados do dashboard");
      setLoading(false);
    }
  };

  // Configuração do gráfico de linha (Vendas Diárias)
  const vendasDiariasChart = {
    labels: dashboardData.vendasDiarias.map(v => formatarData(v.data)),
    datasets: [
      {
        label: 'Receita Diária',
        data: dashboardData.vendasDiarias.map(v => v.receita),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  // Configuração do gráfico de barras (Produtos Mais Vendidos)
  const produtosChart = {
    labels: dashboardData.produtosMaisVendidos.map(p => p.produto),
    datasets: [
      {
        label: 'Quantidade Vendida',
        data: dashboardData.produtosMaisVendidos.map(p => p.quantidadeVendida),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)'
        ],
        borderWidth: 0
      }
    ]
  };

  // Configuração do gráfico de rosca (Formas de Pagamento)
  const pagamentosChart = {
    labels: dashboardData.tiposPagamento.map(p => p.pagamento),
    datasets: [
      {
        data: dashboardData.tiposPagamento.map(p => parseFloat(p.porcentagem)),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF'
        ],
        borderWidth: 2,
        borderColor: '#fff'
      }
    ]
  };

  // Configuração do gráfico de barras (Vendas por Período)
  const periodosChart = {
    labels: dashboardData.vendasPorPeriodo.map(p => formatarData(p.periodo)),
    datasets: [
      {
        label: 'Vendas por Período',
        data: dashboardData.vendasPorPeriodo.map(p => p.totalVendas),
        backgroundColor: 'rgba(153, 102, 255, 0.8)',
        borderWidth: 0
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            
            // Formatar valores monetários nos tooltips dos gráficos de vendas
            if (context.dataset.label && context.dataset.label.includes('Receita')) {
              label += formatarMoeda(context.parsed.y);
            } else if (context.dataset.label && context.dataset.label.includes('Vendas')) {
              label += context.parsed.y + ' pedidos';
            } else if (context.dataset.label && context.dataset.label.includes('Quantidade')) {
              label += context.parsed.y + ' unidades';
            } else {
              label += context.parsed.y;
            }
            
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            // Formatar eixo Y para valores monetários quando apropriado
            if (this.chart?.config?._config?.data?.datasets?.[0]?.label?.includes('Receita')) {
              return formatarMoeda(value);
            }
            return value;
          }
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Carregando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>
          <FaChartLine /> Dashboard de Vendas
        </h1>
        <button className="btn-refresh" onClick={carregarDados}>
          Atualizar Dados
        </button>
      </div>

      {/* Cards de Métricas */}
      <div className="metrics-grid">
        <div className="metric-card receita">
          <div className="metric-icon">
            <FaDollarSign />
          </div>
          <div className="metric-content">
            <h3>Receita Total</h3>
            <p className="metric-value">{formatarMoeda(dashboardData.receitaTotal)}</p>
          </div>
        </div>

        <div className="metric-card lucro">
          <div className="metric-icon">
            <FaDollarSign />
          </div>
          <div className="metric-content">
            <h3>Lucro Líquido</h3>
            <p className="metric-value">{formatarMoeda(dashboardData.lucroLiquido)}</p>
            <span className="metric-subtitle">~{((dashboardData.lucroLiquido / dashboardData.receitaTotal) * 100 || 0).toFixed(1)}% de margem</span>
          </div>
        </div>

        <div className="metric-card pedidos">
          <div className="metric-icon">
            <FaShoppingCart />
          </div>
          <div className="metric-content">
            <h3>Total de Pedidos</h3>
            <p className="metric-value">{dashboardData.totalPedidos}</p>
            <span className="metric-subtitle">{dashboardData.totalPedidos === 1 ? 'pedido' : 'pedidos'} confirmados</span>
          </div>
        </div>

        <div className="metric-card ticket">
          <div className="metric-icon">
            <FaPercentage />
          </div>
          <div className="metric-content">
            <h3>Ticket Médio</h3>
            <p className="metric-value">{formatarMoeda(dashboardData.ticketMedio)}</p>
            <span className="metric-subtitle">por pedido</span>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="charts-grid">
        <div className="chart-card">
          <h2>Vendas Diárias</h2>
          <div className="chart-wrapper">
            <Line data={vendasDiariasChart} options={chartOptions} />
          </div>
        </div>

        <div className="chart-card">
          <h2>Produtos Mais Vendidos</h2>
          <div className="chart-wrapper">
            <Bar data={produtosChart} options={chartOptions} />
          </div>
        </div>

        <div className="chart-card">
          <h2>Formas de Pagamento</h2>
          <div className="chart-wrapper">
            <Doughnut data={pagamentosChart} options={chartOptions} />
          </div>
        </div>

        <div className="chart-card">
          <h2>Vendas por Período</h2>
          <div className="chart-wrapper">
            <Bar data={periodosChart} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
