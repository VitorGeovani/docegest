import React, { useState } from "react";
import axios from "axios";
import { FaFilePdf, FaFileExcel, FaDownload, FaCalendar } from "react-icons/fa";
import { toast } from "react-toastify";
import "./index.scss";

function Relatorios() {
  const [filtros, setFiltros] = useState({
    dataInicio: "",
    dataFim: "",
    tipoRelatorio: "vendas"
  });
  const [gerando, setGerando] = useState(false);

  const tiposRelatorio = [
    { value: "vendas", label: "Relatório de Vendas" },
    { value: "produtos", label: "Produtos Mais Vendidos" },
    { value: "financeiro", label: "Relatório Financeiro" },
    { value: "estoque", label: "Relatório de Estoque" },
    { value: "custos", label: "Análise de Custos" }
  ];

  const handleExportarPDF = async () => {
    if (!filtros.dataInicio || !filtros.dataFim) {
      toast.warning("Selecione as datas de início e fim");
      return;
    }

    setGerando(true);
    try {
      const response = await axios.get(`http://localhost:5000/relatorio/exportar-pdf`, {
        params: {
          tipo: filtros.tipoRelatorio,
          dataInicio: filtros.dataInicio,
          dataFim: filtros.dataFim
        },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `relatorio_${filtros.tipoRelatorio}_${new Date().getTime()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("PDF gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast.error("Erro ao gerar PDF");
    } finally {
      setGerando(false);
    }
  };

  const handleExportarExcel = async () => {
    if (!filtros.dataInicio || !filtros.dataFim) {
      toast.warning("Selecione as datas de início e fim");
      return;
    }

    setGerando(true);
    try {
      const response = await axios.get(`http://localhost:5000/relatorio/exportar-excel`, {
        params: {
          tipo: filtros.tipoRelatorio,
          dataInicio: filtros.dataInicio,
          dataFim: filtros.dataFim
        },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `relatorio_${filtros.tipoRelatorio}_${new Date().getTime()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("Excel gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar Excel:", error);
      toast.error("Erro ao gerar Excel");
    } finally {
      setGerando(false);
    }
  };

  const definirPeriodoRapido = (dias) => {
    const dataFim = new Date();
    const dataInicio = new Date();
    dataInicio.setDate(dataInicio.getDate() - dias);

    setFiltros({
      ...filtros,
      dataInicio: dataInicio.toISOString().split('T')[0],
      dataFim: dataFim.toISOString().split('T')[0]
    });
  };

  return (
    <div className="relatorios-container">
      <div className="relatorios-header">
        <h1>
          <FaDownload /> Exportar Relatórios
        </h1>
        <p>Gere relatórios detalhados em PDF ou Excel</p>
      </div>

      <div className="relatorios-content">
        <div className="filtros-section">
          <h2>Configurações do Relatório</h2>

          <div className="form-group">
            <label htmlFor="tipoRelatorio">
              Tipo de Relatório
            </label>
            <select
              id="tipoRelatorio"
              value={filtros.tipoRelatorio}
              onChange={(e) => setFiltros({ ...filtros, tipoRelatorio: e.target.value })}
            >
              {tiposRelatorio.map((tipo) => (
                <option key={tipo.value} value={tipo.value}>
                  {tipo.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dataInicio">
                <FaCalendar /> Data Início
              </label>
              <input
                type="date"
                id="dataInicio"
                value={filtros.dataInicio}
                onChange={(e) => setFiltros({ ...filtros, dataInicio: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="dataFim">
                <FaCalendar /> Data Fim
              </label>
              <input
                type="date"
                id="dataFim"
                value={filtros.dataFim}
                onChange={(e) => setFiltros({ ...filtros, dataFim: e.target.value })}
              />
            </div>
          </div>

          <div className="periodo-rapido">
            <span>Período Rápido:</span>
            <button onClick={() => definirPeriodoRapido(7)}>Últimos 7 dias</button>
            <button onClick={() => definirPeriodoRapido(30)}>Últimos 30 dias</button>
            <button onClick={() => definirPeriodoRapido(90)}>Últimos 90 dias</button>
          </div>
        </div>

        <div className="export-section">
          <h2>Gerar Relatório</h2>

          <div className="export-cards">
            <div className="export-card pdf">
              <div className="card-icon">
                <FaFilePdf />
              </div>
              <h3>Exportar PDF</h3>
              <p>Documento formatado e pronto para impressão</p>
              <button
                onClick={handleExportarPDF}
                disabled={gerando}
                className="btn-export btn-pdf"
              >
                {gerando ? "Gerando..." : "Gerar PDF"}
              </button>
            </div>

            <div className="export-card excel">
              <div className="card-icon">
                <FaFileExcel />
              </div>
              <h3>Exportar Excel</h3>
              <p>Planilha editável para análises detalhadas</p>
              <button
                onClick={handleExportarExcel}
                disabled={gerando}
                className="btn-export btn-excel"
              >
                {gerando ? "Gerando..." : "Gerar Excel"}
              </button>
            </div>
          </div>
        </div>

        <div className="info-section">
          <h3>📋 Informações dos Relatórios</h3>
          <ul>
            <li><strong>Vendas:</strong> Total de vendas, produtos vendidos, formas de pagamento</li>
            <li><strong>Produtos:</strong> Ranking dos produtos mais vendidos com quantidades</li>
            <li><strong>Financeiro:</strong> Receita, custos, lucro líquido e margens</li>
            <li><strong>Estoque:</strong> Status atual do estoque e movimentações</li>
            <li><strong>Custos:</strong> Análise detalhada de custos e receitas por produto</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Relatorios;
