import React from "react";
import "./index.scss";
import CardPendente from "../cardPedente";
import axios from "axios";
import { useEffect, useState, useCallback } from "react";



function Reservas() {
  const [todasReservas, setTodasReservas] = useState([]); // Todas as reservas
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroStatus, setFiltroStatus] = useState('Pendente'); // Filtro ativo
  const [modalState, setModalState] = useState({
    show: false,
    type: '', // 'success', 'error', 'confirm'
    title: '',
    message: '',
    onConfirm: null
  });

  const buscarReservas = useCallback(async () => {
    try {
      setLoading(true);
      // Buscar TODAS as reservas ativas de uma vez
      const response = await axios.get(`/api/reserva/todas`);
      
      // Parse dos campos JSON com tratamento de erro robusto
      const reservasFormatadas = response.data.map(reserva => {
        let produtos = reserva.produtos;
        let qtdReserva = reserva.qtdReserva;
        
        // Parse de produtos com validação
        if (typeof produtos === 'string') {
          try {
            produtos = JSON.parse(produtos);
          } catch (e) {
            console.error(`Erro ao parsear produtos da reserva ${reserva.id}:`, e);
            produtos = [];
          }
        }
        
        // Se produtos não é array, converter para array vazio
        if (!Array.isArray(produtos)) {
          console.warn(`Produtos da reserva ${reserva.id} não é array:`, produtos);
          produtos = [];
        }

        // Parse de personalizações dentro de cada produto
        if (Array.isArray(produtos)) {
          produtos = produtos.map(produto => {
            if (produto.personalizacoes) {
              // Se personalizacoes é string, fazer parse
              if (typeof produto.personalizacoes === 'string') {
                try {
                  produto.personalizacoes = JSON.parse(produto.personalizacoes);
                  console.log(`✨ Personalizações parseadas do produto ${produto.nome}:`, produto.personalizacoes);
                } catch (e) {
                  console.error(`Erro ao parsear personalizacoes do produto ${produto.id}:`, e);
                  produto.personalizacoes = [];
                }
              } else {
                console.log(`✨ Personalizações já em objeto do produto ${produto.nome}:`, produto.personalizacoes);
              }
            } else {
              console.log(`ℹ️ Produto ${produto.nome} não tem personalizações`);
            }
            return produto;
          });
        }
        
        // Parse de qtdReserva com validação
        if (typeof qtdReserva === 'string') {
          try {
            qtdReserva = JSON.parse(qtdReserva);
          } catch (e) {
            console.error(`Erro ao parsear qtdReserva da reserva ${reserva.id}:`, e);
            qtdReserva = [];
          }
        }
        
        // Se qtdReserva não é array, converter para array vazio
        if (!Array.isArray(qtdReserva)) {
          console.warn(`qtdReserva da reserva ${reserva.id} não é array:`, qtdReserva);
          qtdReserva = [];
        }
        
        return {
          ...reserva,
          produtos,
          qtdReserva
        };
      });
      
      setTodasReservas(reservasFormatadas);
      setLoading(false);
      console.log("Todas as reservas carregadas:", reservasFormatadas);
    } catch (err) {
      console.error("Erro ao buscar reservas:", err);
      setError("Erro ao buscar reservas: " + (err.response?.data?.erro || err.message));
      setLoading(false);
    }
  }, []); // Removido filtroStatus da dependência

  useEffect(() => {
    buscarReservas();
  }, [buscarReservas]);

  // Filtrar reservas localmente
  const reservasFiltradas = todasReservas.filter(r => r.status === filtroStatus);

  // Contadores por status
  const contadores = {
    Pendente: todasReservas.filter(r => r.status === 'Pendente').length,
    Confirmado: todasReservas.filter(r => r.status === 'Confirmado').length,
    Preparando: todasReservas.filter(r => r.status === 'Preparando').length,
    Pronto: todasReservas.filter(r => r.status === 'Pronto').length,
    Entregue: todasReservas.filter(r => r.status === 'Entregue').length
  };

  const cancelarReserva = async (id, produtos) => {
    // Modal de confirmação
    setModalState({
      show: true,
      type: 'confirm',
      title: '⚠️ Cancelar Reserva',
      message: 'Tem certeza que deseja cancelar esta reserva? Esta ação não poderá ser desfeita e o estoque será restaurado.',
      onConfirm: async () => {
        try {
          await axios.put(`/api/reserva/${id}/cancelar`, { produtos });
          
          // Modal de sucesso
          setModalState({
            show: true,
            type: 'success',
            title: '✅ Reserva Cancelada!',
            message: 'A reserva foi cancelada com sucesso! O estoque foi restaurado.',
            onConfirm: null
          });

          // Recarregar reservas usando o filtro ativo
          buscarReservas();
        } catch (err) {
          console.error("Erro ao cancelar reserva:", err);
          
          // Modal de erro
          setModalState({
            show: true,
            type: 'error',
            title: '❌ Erro ao Cancelar',
            message: 'Não foi possível cancelar a reserva. Por favor, tente novamente.',
            onConfirm: null
          });
        }
      }
    });
  };

  const atualizarStatus = async (id, novoStatus) => {
    const statusLabels = {
      'Confirmado': 'Confirmar Pagamento',
      'Preparando': 'Iniciar Preparação',
      'Pronto': 'Marcar como Pronto',
      'Entregue': 'Marcar como Entregue'
    };

    // Modal de confirmação
    setModalState({
      show: true,
      type: 'confirm',
      title: `🔄 ${statusLabels[novoStatus] || 'Atualizar Status'}`,
      message: `Tem certeza que deseja atualizar o status para "${novoStatus}"?`,
      onConfirm: async () => {
        try {
          await axios.put(`/api/reserva/${id}/status`, {
            status: novoStatus
          });
          
          // Modal de sucesso
          setModalState({
            show: true,
            type: 'success',
            title: '✅ Status Atualizado!',
            message: `O status foi atualizado para "${novoStatus}" com sucesso!`,
            onConfirm: null
          });

          // Recarregar reservas usando o filtro ativo
          buscarReservas();
        } catch (err) {
          console.error("Erro ao atualizar status:", err);
          
          // Modal de erro
          setModalState({
            show: true,
            type: 'error',
            title: '❌ Erro ao Atualizar',
            message: 'Não foi possível atualizar o status. Por favor, tente novamente.',
            onConfirm: null
          });
        }
      }
    });
  };

  const closeModal = () => {
    setModalState({
      show: false,
      type: '',
      title: '',
      message: '',
      onConfirm: null
    });
  };

  const handleModalConfirm = () => {
    if (modalState.onConfirm) {
      modalState.onConfirm();
    } else {
      closeModal();
    }
  };
  

  if (loading) {
    return (
      <div className="main-container">
        <div className="loading-container">
          <div className="icon">⏳</div>
          <p>Carregando reservas...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="main-container">
        <div className="error-container">
          <div className="icon">⚠️</div>
          <p>{error}</p>
        </div>
      </div>
    );
  }



  return (
    <div className="main-container">
      {/* Header Profissional */}
      <div className="reservas-header">
        <h1 className="reservas-1">Gerenciamento de Reservas</h1>
      </div>

      {/* Abas de Filtro */}
      <div className="filtros-tabs">
        <button 
          className={filtroStatus === 'Pendente' ? 'tab-ativo' : 'tab-inativo'}
          onClick={() => setFiltroStatus('Pendente')}
        >
          📋 Pendentes
          <span className="count-badge">
            {contadores.Pendente}
          </span>
        </button>
        
        <button 
          className={filtroStatus === 'Confirmado' ? 'tab-ativo' : 'tab-inativo'}
          onClick={() => setFiltroStatus('Confirmado')}
        >
          ✅ Confirmados
          <span className="count-badge">
            {contadores.Confirmado}
          </span>
        </button>
        
        <button 
          className={filtroStatus === 'Preparando' ? 'tab-ativo' : 'tab-inativo'}
          onClick={() => setFiltroStatus('Preparando')}
        >
          👨‍🍳 Em Preparação
          <span className="count-badge">
            {contadores.Preparando}
          </span>
        </button>
        
        <button 
          className={filtroStatus === 'Pronto' ? 'tab-ativo' : 'tab-inativo'}
          onClick={() => setFiltroStatus('Pronto')}
        >
          🎁 Prontos
          <span className="count-badge">
            {contadores.Pronto}
          </span>
        </button>
        
        <button 
          className={filtroStatus === 'Entregue' ? 'tab-ativo' : 'tab-inativo'}
          onClick={() => setFiltroStatus('Entregue')}
        >
          🚚 Entregues
          <span className="count-badge">
            {contadores.Entregue}
          </span>
        </button>
      </div>

      {/* Barra de Informações */}
      <div className="flex-row-b">
        <div className="reservas-info-group">
          <div className="tabler-bell-heart" />
          <h2 className="reservas-em-andamento">
            {filtroStatus === 'Pendente' && 'Reservas Pendentes'}
            {filtroStatus === 'Confirmado' && 'Reservas Confirmadas'}
            {filtroStatus === 'Preparando' && 'Em Preparação'}
            {filtroStatus === 'Pronto' && 'Prontos para Entrega'}
            {filtroStatus === 'Entregue' && 'Pedidos Entregues'}
            <span className="count">{reservasFiltradas.length}</span>
          </h2>
        </div>
      </div>

      {/* Grid de Reservas */}
      {reservasFiltradas.length === 0 ? (
        <div className="empty-container">
          <div className="icon">📭</div>
          <p>Nenhuma reserva {filtroStatus.toLowerCase()} no momento.</p>
        </div>
      ) : (
        <div className="reservas-grid">
          {reservasFiltradas.map((reserva) => {
            // Formata a data para o formato brasileiro (DD/MM/AAAA) - usa data do pedido (compra), não data de entrega
            const dataFormatada = new Date(reserva.dataPedido).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            });

            // Garantir que produtos e qtdReserva são arrays
            const produtosArray = Array.isArray(reserva.produtos) ? reserva.produtos : [];
            const qtdReservaArray = Array.isArray(reserva.qtdReserva) ? reserva.qtdReserva : [];

            // Combina os dados de produtos com qtdReserva
            const produtosComQuantidade = produtosArray.map((produto) => {
              const quantidadeInfo = qtdReservaArray.find((qtd) => qtd.id === produto.id);
              return { 
                ...produto, 
                quantidadeReservados: quantidadeInfo?.quantidade || 0 
              };
            });

            return (
              <CardPendente
                key={reserva.id}
                produtos={produtosComQuantidade}
                local={reserva.pontoEntrega || "Local não especificado"}
                data={dataFormatada || "Data não especificada"}
                hora={reserva.horaEntrega || "Hora não especificada"}
                formaPagamento={reserva.pagamento || "Forma de pagamento não especificada"}
                total={reserva.valorTotal || 0}
                nomeCliente={reserva.nomeCliente || "Cliente não especificado"}
                telefoneCliente={reserva.telefoneCliente || "Telefone não especificado"}
                emailCliente={reserva.emailCliente}
                status={reserva.status || 'Pendente'}
                numeroPedido={reserva.numero}
                tipoPedido={reserva.tipoPedido || 'RETIRADA'}
                enderecoEntrega={reserva.enderecoEntrega}
                observacoes={reserva.observacoes}
                onCancelar={() => cancelarReserva(reserva.id, produtosComQuantidade)}
                onAtualizarStatus={(novoStatus) => atualizarStatus(reserva.id, novoStatus)}
              />
            );
          })}
        </div>
      )}

      {/* Modal Profissional */}
      {modalState.show && (
        <div className="modal-overlay" onClick={closeModal}>
          <div 
            className={`modal-content modal-${modalState.type}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2 className="modal-title">{modalState.title}</h2>
            </div>
            
            <div className="modal-body">
              <p className="modal-message">{modalState.message}</p>
            </div>
            
            <div className="modal-footer">
              {modalState.type === 'confirm' ? (
                <>
                  <button 
                    className="modal-btn modal-btn-secondary"
                    onClick={closeModal}
                  >
                    Cancelar
                  </button>
                  <button 
                    className="modal-btn modal-btn-primary"
                    onClick={handleModalConfirm}
                  >
                    Confirmar
                  </button>
                </>
              ) : (
                <button 
                  className="modal-btn modal-btn-primary"
                  onClick={closeModal}
                >
                  OK
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Reservas;
