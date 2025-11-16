import React from "react";
import { FaCheckCircle, FaUtensils, FaBox, FaTruck, FaTimes, FaStore, FaMapMarkerAlt } from "react-icons/fa";
import "./index.scss";

const ReservaCard = ({ 
    produtos, 
    local, 
    data, 
    hora, 
    formaPagamento, 
    total, 
    nomeCliente, 
    telefoneCliente,
    emailCliente,
    status, 
    numeroPedido,
    tipoPedido,
    enderecoEntrega,
    observacoes,
    onCancelar,
    onAtualizarStatus 
}) => {
    
    const getStatusInfo = (status) => {
        // Determinar se é entrega ou retirada
        const isEntrega = tipoPedido === 'ENTREGA' || tipoPedido === 'Entrega';
        
        const statusMap = {
            'Pendente': { 
                label: 'Aguardando Pagamento', 
                color: '#ffc107', 
                proximoStatus: 'Confirmado',
                proximoLabel: 'Confirmar Pagamento',
                icon: FaCheckCircle
            },
            'Confirmado': { 
                label: 'Pagamento Confirmado', 
                color: '#27ae60', 
                proximoStatus: 'Preparando',
                proximoLabel: 'Iniciar Preparação',
                icon: FaUtensils
            },
            'Preparando': { 
                label: 'Em Preparação', 
                color: '#3498db', 
                proximoStatus: 'Pronto',
                proximoLabel: 'Marcar como Pronto',
                icon: FaBox
            },
            'Pronto': { 
                label: isEntrega ? 'Pronto para Envio' : 'Pronto para Retirada', 
                color: '#9b59b6', 
                proximoStatus: 'Entregue',
                proximoLabel: isEntrega ? 'Marcar como Entregue' : 'Marcar como Retirado',
                icon: FaTruck
            },
            'Entregue': { 
                label: isEntrega ? 'Entregue' : 'Retirado', 
                color: '#27ae60',
                proximoStatus: null,
                proximoLabel: null,
                icon: FaCheckCircle
            },
            'Cancelado': { 
                label: 'Cancelado', 
                color: '#e74c3c',
                proximoStatus: null,
                proximoLabel: null,
                icon: FaTimes
            }
        };
        return statusMap[status] || statusMap['Pendente'];
    };

    const statusInfo = getStatusInfo(status || 'Pendente');
    const StatusIcon = statusInfo.icon;

    return (
        <div className="rectangle">
            {/* Header com Número do Pedido e Status */}
            <div className="pedido-header-card">
                {numeroPedido && (
                    <div className="numero-pedido">
                        <FaBox />
                        <span>Pedido #{numeroPedido}</span>
                    </div>
                )}
                <div 
                    className="status-badge" 
                    style={{ 
                        background: statusInfo.color,
                        color: '#ffffff'
                    }}
                >
                    <StatusIcon />
                    <span>{statusInfo.label}</span>
                </div>
            </div>

            {/* Seção de Produtos */}
            <div className="produtos">
                {produtos.map((produto, index) => (
                    <div key={index} className="produtoItem">
                        <img
                            className="imgProduto"
                            src={produto.caminhoImagem ? `http://localhost:5000/storage/${produto.caminhoImagem}` : "/imgs/placeholder.png"}
                            alt={produto.nome || "Produto"}
                        />
                        <div className="produto-info">
                            <span className="nomeProduto">{produto.nome || "Produto"}</span>
                            <span className="quantidade">x{produto.quantidadeReservados || 0}</span>
                            
                            {/* Exibir Personalizações se houver */}
                            {produto.personalizacoes && produto.personalizacoes.length > 0 && (
                                <div className="produto-personalizacoes">
                                    <span className="personalizacoes-titulo">✨ Personalizações:</span>
                                    {produto.personalizacoes.map((p, idx) => (
                                        <div key={idx} className="personalizacao-item">
                                            • {p.nome_opcao}: {p.nome_valor}
                                            {p.preco > 0 && (
                                                <span className="personalizacao-preco"> (+R$ {p.preco.toFixed(2)})</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Seção de Dados da Reserva */}
            <div className="dadoReserva">
                <div className="info-row">
                    <span className="local">{local}</span>
                    <span className="data">{data}</span>
                    <span className="hora">{hora}</span>
                </div>
                <div className="info-row">
                    <span className="formaPagamento">{formaPagamento}</span>
                    <span className="total">
                        {typeof total === 'string' && total.includes('R$') 
                            ? total 
                            : `${Number(total).toFixed(2)}`
                        }
                    </span>
                </div>
                
                {/* Tipo de Pedido: Entrega ou Retirada */}
                <div className="info-row tipo-pedido-row">
                    {tipoPedido === 'ENTREGA' || tipoPedido === 'Entrega' ? (
                        <>
                            <FaTruck className="tipo-icon" />
                            <span className="tipo-pedido entrega">
                                Entrega em Domicílio
                            </span>
                        </>
                    ) : (
                        <>
                            <FaStore className="tipo-icon" />
                            <span className="tipo-pedido retirada">
                                Retirada na Loja
                            </span>
                        </>
                    )}
                </div>
                
                {/* Endereço de Entrega (se for entrega) */}
                {(tipoPedido === 'ENTREGA' || tipoPedido === 'Entrega') && enderecoEntrega && (
                    <div className="info-row endereco-row">
                        <FaMapMarkerAlt className="endereco-icon" />
                        <span className="endereco-entrega">
                            <strong>Endereço:</strong> {enderecoEntrega}
                        </span>
                    </div>
                )}
                
                {/* Observações */}
                {observacoes && observacoes.trim() !== '' && (
                    <div className="info-row observacoes-row">
                        <span className="observacoes">
                            <strong>Obs:</strong> {observacoes}
                        </span>
                    </div>
                )}
            </div>

            {/* Seção de Dados do Cliente */}
            <div className="dadosCliente">
                <h3>Informações do Cliente</h3>
                <span className="nomeCliente">{nomeCliente}</span>
                <span className="telefoneCliente">{telefoneCliente}</span>
                {emailCliente && <span className="emailCliente">📧 {emailCliente}</span>}
            </div>

            {/* Seção de Ações */}
            <div className="flex-row-f">
                {/* Botão de Progressão de Status */}
                {statusInfo.proximoStatus && onAtualizarStatus && (
                    <button 
                        className="atualizar-status"
                        onClick={() => onAtualizarStatus(statusInfo.proximoStatus)}
                        style={{ background: statusInfo.color }}
                    >
                        <StatusIcon />
                        {statusInfo.proximoLabel}
                    </button>
                )}

                {/* Botão de Cancelar (disponível para todos os status exceto Entregue e Cancelado) */}
                {status !== 'Entregue' && status !== 'Cancelado' && (
                    <button className="cancelar" onClick={onCancelar}>
                        <FaTimes /> Cancelar Pedido
                    </button>
                )}
            </div>
        </div>
    );
};

export default ReservaCard;
