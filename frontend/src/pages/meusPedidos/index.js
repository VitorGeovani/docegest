import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShoppingBag, FaClock, FaCheckCircle, FaTruck, FaTimesCircle, FaReceipt, FaWhatsapp, FaArrowLeft, FaTimes, FaMapMarkerAlt, FaCalendarAlt, FaCreditCard, FaBox } from 'react-icons/fa';
import axios from 'axios';
import './index.scss';

const MeusPedidos = () => {
    const navigate = useNavigate();
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtroStatus, setFiltroStatus] = useState('todos');
    const [pedidoDetalhe, setPedidoDetalhe] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        carregarPedidos();
        // Atualizar a cada 30 segundos para ver mudanças de status em tempo real
        const interval = setInterval(carregarPedidos, 30000);
        return () => clearInterval(interval);
    }, []);

    const carregarPedidos = async () => {
        try {
            // Buscar telefone do cliente (pode vir do localStorage ou contexto)
            const clienteInfo = localStorage.getItem('clienteInfo');
            if (!clienteInfo) {
                // Se não tiver info do cliente, tentar buscar do último pedido
                const ultimoPedido = localStorage.getItem('ultimoPedido');
                if (ultimoPedido) {
                    const pedido = JSON.parse(ultimoPedido);
                    
                    // Garantir que produtos é um array
                    if (typeof pedido.produtos === 'string') {
                        pedido.produtos = JSON.parse(pedido.produtos);
                    }
                    if (typeof pedido.qtdReserva === 'string') {
                        pedido.qtdReserva = JSON.parse(pedido.qtdReserva);
                    }
                    
                    // Adicionar apenas o último pedido do localStorage
                    setPedidos([{
                        ...pedido,
                        status: pedido.status || 'pendente',
                        dataPedido: pedido.dataPedido || new Date().toISOString(),
                        produtos: pedido.produtos || [],
                        qtdReserva: pedido.qtdReserva || []
                    }]);
                }
                setLoading(false);
                return;
            }

            const cliente = JSON.parse(clienteInfo);
            const telefone = cliente.telefone;

            // Buscar pedidos da API
            console.log('🔍 Buscando pedidos para telefone:', telefone);
            const response = await axios.get(`http://localhost:5000/pedidos/cliente/${telefone}`);
            
            console.log('📦 Pedidos recebidos da API:', response.data);
            console.log('📊 Quantidade de pedidos:', response.data.length);
            
            // Garantir que todos os pedidos têm produtos parseados corretamente
            const pedidosProcessados = response.data.map(pedido => {
                // Parse de produtos se for string
                if (typeof pedido.produtos === 'string') {
                    try {
                        pedido.produtos = JSON.parse(pedido.produtos);
                    } catch (e) {
                        console.error('Erro ao parsear produtos:', e);
                        pedido.produtos = [];
                    }
                }
                
                // Parse de qtdReserva se for string
                if (typeof pedido.qtdReserva === 'string') {
                    try {
                        pedido.qtdReserva = JSON.parse(pedido.qtdReserva);
                    } catch (e) {
                        console.error('Erro ao parsear qtdReserva:', e);
                        pedido.qtdReserva = [];
                    }
                }

                // Garantir que são arrays
                pedido.produtos = Array.isArray(pedido.produtos) ? pedido.produtos : [];
                pedido.qtdReserva = Array.isArray(pedido.qtdReserva) ? pedido.qtdReserva : [];
                
                // Parse de personalizações dentro de cada produto
                if (Array.isArray(pedido.produtos)) {
                    pedido.produtos = pedido.produtos.map(produto => {
                        if (produto.personalizacoes) {
                            if (typeof produto.personalizacoes === 'string') {
                                try {
                                    produto.personalizacoes = JSON.parse(produto.personalizacoes);
                                } catch (e) {
                                    console.error('Erro ao parsear personalizacoes:', e);
                                    produto.personalizacoes = [];
                                }
                            }
                        }
                        return produto;
                    });
                }
                
                return pedido;
            });
            
            setPedidos(pedidosProcessados);
            setLoading(false);
        } catch (error) {
            console.error('Erro ao carregar pedidos:', error);
            // Fallback para localStorage se API falhar
            const ultimoPedido = localStorage.getItem('ultimoPedido');
            if (ultimoPedido) {
                const pedido = JSON.parse(ultimoPedido);
                
                // Garantir que produtos é um array
                if (typeof pedido.produtos === 'string') {
                    pedido.produtos = JSON.parse(pedido.produtos);
                }
                if (typeof pedido.qtdReserva === 'string') {
                    pedido.qtdReserva = JSON.parse(pedido.qtdReserva);
                }
                
                setPedidos([{
                    ...pedido,
                    status: pedido.status || 'pendente',
                    dataPedido: pedido.dataPedido || new Date().toISOString(),
                    produtos: pedido.produtos || [],
                    qtdReserva: pedido.qtdReserva || []
                }]);
            }
            setLoading(false);
        }
    };

    const verDetalhes = async (pedidoId) => {
        try {
            const response = await axios.get(`http://localhost:5000/pedido/${pedidoId}/detalhes`);
            
            const pedidoDetalhes = response.data;
            
            // Parse de produtos se for string
            if (typeof pedidoDetalhes.produtos === 'string') {
                try {
                    pedidoDetalhes.produtos = JSON.parse(pedidoDetalhes.produtos);
                } catch (e) {
                    console.error('Erro ao parsear produtos:', e);
                    pedidoDetalhes.produtos = [];
                }
            }
            
            // Parse de qtdReserva se for string
            if (typeof pedidoDetalhes.qtdReserva === 'string') {
                try {
                    pedidoDetalhes.qtdReserva = JSON.parse(pedidoDetalhes.qtdReserva);
                } catch (e) {
                    console.error('Erro ao parsear qtdReserva:', e);
                    pedidoDetalhes.qtdReserva = [];
                }
            }

            // Parse de historicoStatus se for string
            if (typeof pedidoDetalhes.historicoStatus === 'string') {
                try {
                    pedidoDetalhes.historicoStatus = JSON.parse(pedidoDetalhes.historicoStatus);
                } catch (e) {
                    console.error('Erro ao parsear historicoStatus:', e);
                    pedidoDetalhes.historicoStatus = [];
                }
            }

            // Garantir que são arrays
            pedidoDetalhes.produtos = Array.isArray(pedidoDetalhes.produtos) ? pedidoDetalhes.produtos : [];
            pedidoDetalhes.qtdReserva = Array.isArray(pedidoDetalhes.qtdReserva) ? pedidoDetalhes.qtdReserva : [];
            pedidoDetalhes.historicoStatus = Array.isArray(pedidoDetalhes.historicoStatus) ? pedidoDetalhes.historicoStatus : [];
            
            console.log('Detalhes do pedido processados:', pedidoDetalhes);
            
            setPedidoDetalhe(pedidoDetalhes);
            setShowModal(true);
        } catch (error) {
            console.error('Erro ao carregar detalhes:', error);
            // Fallback: usar dados do pedido da lista
            const pedido = pedidos.find(p => p.id === pedidoId);
            if (pedido) {
                // Garantir que produtos é um array
                const pedidoProcessado = {
                    ...pedido,
                    produtos: Array.isArray(pedido.produtos) ? pedido.produtos : [],
                    qtdReserva: Array.isArray(pedido.qtdReserva) ? pedido.qtdReserva : [],
                    historicoStatus: Array.isArray(pedido.historicoStatus) ? pedido.historicoStatus : []
                };
                
                setPedidoDetalhe(pedidoProcessado);
                setShowModal(true);
            } else {
                alert('Não foi possível carregar os detalhes do pedido.');
            }
        }
    };

    const repetirPedido = (pedido) => {
        try {
            // Validar se o pedido tem produtos
            if (!pedido || !pedido.produtos || !Array.isArray(pedido.produtos) || pedido.produtos.length === 0) {
                console.error('Pedido não tem produtos válidos:', pedido);
                alert('Não foi possível carregar os produtos deste pedido. Tente novamente.');
                return;
            }

            // Carregar produtos do pedido no carrinho
            const produtosParaCarrinho = pedido.produtos.map((produto) => {
                const quantidade = pedido.qtdReserva?.find(q => q.id === produto.id)?.quantidade || 1;
                return {
                    id: produto.id,
                    nome: produto.nome,
                    valor: produto.valor || produto.preco || 0,  // Corrigido: usar 'valor' ao invés de 'preco'
                    imagem: produto.caminhoImagem,
                    quantidade: quantidade,
                    personalizacoes: produto.personalizacoes || [],  // Incluir personalizações
                    valor_acrescimo: produto.valor_acrescimo || 0    // Incluir acréscimo
                };
            });

            console.log('Produtos carregados no carrinho:', produtosParaCarrinho);

            // Calcular total
            const total = produtosParaCarrinho.reduce((sum, item) => {
                return sum + ((item.valor + item.valor_acrescimo) * item.quantidade);
            }, 0);

            // Salvar no localStorage no formato correto
            const carrinhoData = {
                itens: produtosParaCarrinho,
                total: total,
                observacoes: pedido.observacoes || ''
            };
            
            localStorage.setItem('carrinho', JSON.stringify(carrinhoData));
            
            // Navegar para o catálogo
            navigate('/catalogo');
        } catch (error) {
            console.error('Erro ao repetir pedido:', error);
            alert('Erro ao carregar o pedido. Por favor, tente novamente.');
        }
    };

    const getStatusInfo = (status) => {
        // Normalizar status para minúsculo para comparação
        const statusNormalizado = status ? status.toLowerCase() : 'pendente';
        
        const statusMap = {
            'pendente': { icon: FaClock, label: 'Aguardando Pagamento', color: '#ffc107', bg: '#fff9e6' },
            'confirmado': { icon: FaCheckCircle, label: 'Pagamento Confirmado', color: '#27ae60', bg: '#e8f5e9' },
            'preparando': { icon: FaShoppingBag, label: 'Em Preparação', color: '#3498db', bg: '#e3f2fd' },
            'pronto': { icon: FaTruck, label: 'Pronto para Retirada', color: '#9b59b6', bg: '#f3e5f5' },
            'entregue': { icon: FaCheckCircle, label: 'Entregue', color: '#27ae60', bg: '#e8f5e9' },
            'cancelado': { icon: FaTimesCircle, label: 'Cancelado', color: '#e74c3c', bg: '#ffebee' }
        };
        return statusMap[statusNormalizado] || statusMap['pendente'];
    };

    const formatarData = (data) => {
        if (!data) return 'Data não disponível';
        const date = new Date(data);
        return date.toLocaleDateString('pt-BR', { 
            day: '2-digit', 
            month: 'long', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatarValor = (valor) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    };

    // Normalizar status para filtros (converter para minúsculo)
    const pedidosFiltrados = filtroStatus === 'todos' 
        ? (Array.isArray(pedidos) ? pedidos : [])
        : (Array.isArray(pedidos) ? pedidos.filter(p => p.status && p.status.toLowerCase() === filtroStatus) : []);

    const contatarWhatsApp = (pedido) => {
        const mensagem = `Olá! Gostaria de obter informações sobre meu pedido #${pedido.numero || pedido.id}.`;
        const telefone = '5511999999999'; // TODO: Obter do backend
        window.open(`https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`, '_blank');
    };

    if (loading) {
        return (
            <div className="pagina-meus-pedidos loading">
                <div className="loading-spinner">Carregando pedidos...</div>
            </div>
        );
    }

    return (
        <div className="pagina-meus-pedidos">
            <div className="pedidos-container">
                <div className="pedidos-header">
                    <button className="btn-voltar" onClick={() => navigate('/catalogo')}>
                        <FaArrowLeft /> Voltar ao Catálogo
                    </button>
                    <h1>
                        <FaShoppingBag /> Meus Pedidos
                    </h1>
                    <p>Acompanhe o status dos seus pedidos</p>
                </div>

                <div className="filtros">
                    <button 
                        className={filtroStatus === 'todos' ? 'active' : ''} 
                        onClick={() => setFiltroStatus('todos')}
                    >
                        Todos ({pedidos.length})
                    </button>
                    <button 
                        className={filtroStatus === 'pendente' ? 'active' : ''} 
                        onClick={() => setFiltroStatus('pendente')}
                    >
                        Pendentes ({pedidos.filter(p => p.status && p.status.toLowerCase() === 'pendente').length})
                    </button>
                    <button 
                        className={filtroStatus === 'confirmado' ? 'active' : ''} 
                        onClick={() => setFiltroStatus('confirmado')}
                    >
                        Confirmados ({pedidos.filter(p => p.status && p.status.toLowerCase() === 'confirmado').length})
                    </button>
                    <button 
                        className={filtroStatus === 'entregue' ? 'active' : ''} 
                        onClick={() => setFiltroStatus('entregue')}
                    >
                        Entregues ({pedidos.filter(p => p.status && p.status.toLowerCase() === 'entregue').length})
                    </button>
                </div>

                {pedidosFiltrados.length === 0 ? (
                    <div className="sem-pedidos">
                        <FaShoppingBag />
                        <h2>Nenhum pedido encontrado</h2>
                        <p>Você ainda não realizou nenhum pedido.</p>
                        <button className="btn-catalogo" onClick={() => navigate('/catalogo')}>
                            Explorar Catálogo
                        </button>
                    </div>
                ) : (
                    <div className="pedidos-lista">
                        {pedidosFiltrados.map((pedido) => {
                            const statusInfo = getStatusInfo(pedido.status || 'pendente');
                            const StatusIcon = statusInfo.icon;

                            return (
                                <div key={pedido.id || pedido.numero} className="pedido-card">
                                    <div className="pedido-header">
                                        <div className="pedido-numero">
                                            <FaReceipt />
                                            <span>Pedido #{pedido.numero || pedido.id}</span>
                                        </div>
                                        <div 
                                            className="pedido-status" 
                                            style={{ 
                                                background: statusInfo.bg, 
                                                color: statusInfo.color 
                                            }}
                                        >
                                            <StatusIcon />
                                            {statusInfo.label}
                                        </div>
                                    </div>

                                    <div className="pedido-info">
                                        <div className="info-item">
                                            <span className="label">Data do Pedido:</span>
                                            <span className="valor">{formatarData(pedido.dataPedido || pedido.data)}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="label">Forma de Pagamento:</span>
                                            <span className="valor">{pedido.pagamento || pedido.metodoPagamento || 'PIX'}</span>
                                        </div>
                                        {pedido.turno && (
                                            <div className="info-item">
                                                <span className="label">Turno de Retirada:</span>
                                                <span className="valor">{pedido.turno}</span>
                                            </div>
                                        )}
                                    </div>

                                    {pedido.itens && pedido.itens.length > 0 && (
                                        <div className="pedido-itens">
                                            <h3>Itens do Pedido:</h3>
                                            <ul>
                                                {pedido.itens.map((item, index) => (
                                                    <li key={index}>
                                                        <span>{item.quantidade}x {item.nome}</span>
                                                        <span>{formatarValor(item.preco * item.quantidade)}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    <div className="pedido-footer">
                                        <div className="pedido-total">
                                            <span>Total:</span>
                                            <strong>
                                                {(() => {
                                                    // Tentar diferentes campos possíveis
                                                    const valor = pedido.valorTotal || pedido.total || pedido.valor_total || 0;
                                                    
                                                    // Se valor é string (pode vir como "R$ 12.00")
                                                    if (typeof valor === 'string') {
                                                        // Se já está formatado, retornar direto
                                                        if (valor.includes('R$')) {
                                                            return valor;
                                                        }
                                                        // Senão, tentar converter removendo caracteres não numéricos
                                                        const valorLimpo = valor.replace(/[^\d.,]/g, '').replace(',', '.');
                                                        const valorNumerico = parseFloat(valorLimpo);
                                                        return formatarValor(isNaN(valorNumerico) ? 0 : valorNumerico);
                                                    }
                                                    
                                                    // Se é número, formatar
                                                    const valorNumerico = parseFloat(valor);
                                                    return formatarValor(isNaN(valorNumerico) ? 0 : valorNumerico);
                                                })()}
                                            </strong>
                                        </div>
                                        <div className="pedido-acoes">
                                            <button 
                                                className="btn-whatsapp"
                                                onClick={() => contatarWhatsApp(pedido)}
                                            >
                                                <FaWhatsapp /> Contatar
                                            </button>
                                            <button 
                                                className="btn-detalhes"
                                                onClick={() => verDetalhes(pedido.id)}
                                            >
                                                <FaReceipt /> Ver Detalhes
                                            </button>
                                            <button 
                                                className="btn-repetir"
                                                onClick={() => repetirPedido(pedido)}
                                            >
                                                <FaShoppingBag /> Pedir Novamente
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Modal de Detalhes do Pedido */}
            {showModal && pedidoDetalhe && (
                <div className="modal-detalhes-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-detalhes-content" onClick={(e) => e.stopPropagation()}>
                        {/* Header do Modal */}
                        <div className="modal-header">
                            <h2>
                                <FaReceipt /> Detalhes do Pedido #{pedidoDetalhe.numero || pedidoDetalhe.id}
                            </h2>
                            <button className="btn-fechar" onClick={() => setShowModal(false)}>
                                <FaTimes />
                            </button>
                        </div>

                        {/* Timeline de Status */}
                        {pedidoDetalhe.historicoStatus && pedidoDetalhe.historicoStatus.length > 0 && (
                            <div className="status-timeline">
                                <h3>Histórico do Pedido</h3>
                                <div className="timeline-items">
                                    {pedidoDetalhe.historicoStatus.map((item, index) => {
                                        const statusInfo = getStatusInfo(item.status.toLowerCase());
                                        const TimelineIcon = statusInfo.icon;
                                        return (
                                            <div 
                                                key={index} 
                                                className={`timeline-item ${index === pedidoDetalhe.historicoStatus.length - 1 ? 'active' : ''}`}
                                            >
                                                <div className="timeline-icon" style={{ background: statusInfo.color }}>
                                                    <TimelineIcon />
                                                </div>
                                                <div className="timeline-info">
                                                    <span className="timeline-status">{statusInfo.label}</span>
                                                    <span className="timeline-data">{formatarData(item.data)}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Informações do Pedido */}
                        <div className="detalhes-info">
                            <div className="info-section">
                                <FaCalendarAlt className="info-icon" />
                                <div>
                                    <span className="info-label">Data do Pedido</span>
                                    <span className="info-valor">{formatarData(pedidoDetalhe.dataPedido)}</span>
                                </div>
                            </div>
                            
                            {pedidoDetalhe.enderecoEntrega && (
                                <div className="info-section">
                                    <FaMapMarkerAlt className="info-icon" />
                                    <div>
                                        <span className="info-label">Endereço de Entrega</span>
                                        <span className="info-valor">{pedidoDetalhe.enderecoEntrega}</span>
                                    </div>
                                </div>
                            )}

                            {pedidoDetalhe.pontoEntrega && (
                                <div className="info-section">
                                    <FaMapMarkerAlt className="info-icon" />
                                    <div>
                                        <span className="info-label">Ponto de Entrega</span>
                                        <span className="info-valor">{pedidoDetalhe.pontoEntrega}</span>
                                    </div>
                                </div>
                            )}

                            <div className="info-section">
                                <FaCreditCard className="info-icon" />
                                <div>
                                    <span className="info-label">Forma de Pagamento</span>
                                    <span className="info-valor">{pedidoDetalhe.pagamento || pedidoDetalhe.metodoPagamento || 'PIX'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Lista de Produtos */}
                        <div className="produtos-lista">
                            <h3><FaBox /> Produtos do Pedido</h3>
                            {pedidoDetalhe.produtos && pedidoDetalhe.produtos.map((produto, index) => {
                                const qtd = pedidoDetalhe.qtdReserva?.find(q => q.id === produto.id)?.quantidade || 1;
                                // Usar produto.valor (não preco) + valor_acrescimo das personalizações
                                const valorBase = produto.valor || produto.preco || 0;
                                const valorAcrescimo = produto.valor_acrescimo || 0;
                                const valorTotal = valorBase + valorAcrescimo;
                                const subtotal = valorTotal * qtd;
                                
                                return (
                                    <div key={index} className="produto-item">
                                        <img 
                                            src={`http://localhost:5000/storage/${produto.caminhoImagem}`} 
                                            alt={produto.nome}
                                            onError={(e) => e.target.src = '/placeholder.png'}
                                        />
                                        <div className="produto-info">
                                            <span className="produto-nome">{produto.nome}</span>
                                            <span className="produto-quantidade">Quantidade: {qtd}</span>
                                            
                                            {/* Exibir Personalizações se houver */}
                                            {produto.personalizacoes && produto.personalizacoes.length > 0 && (
                                                <div className="produto-personalizacoes">
                                                    <span className="personalizacoes-titulo">✨ Personalizações:</span>
                                                    {produto.personalizacoes.map((p, idx) => (
                                                        <div key={idx} className="personalizacao-item">
                                                            • {p.nome_opcao}: {p.nome_valor}
                                                            {p.preco > 0 && (
                                                                <span className="personalizacao-preco"> (+{formatarValor(p.preco)})</span>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div className="produto-valores">
                                            <span className="produto-preco-unitario">
                                                {formatarValor(valorTotal)} un.
                                            </span>
                                            <span className="produto-subtotal">
                                                {formatarValor(subtotal)}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Observações */}
                        {pedidoDetalhe.observacoes && (
                            <div className="observacoes">
                                <h4>Observações:</h4>
                                <p>{pedidoDetalhe.observacoes}</p>
                            </div>
                        )}

                        {/* Total do Pedido */}
                        <div className="total-section">
                            <span className="total-label">Total do Pedido:</span>
                            <span className="total-valor">
                                {(() => {
                                    // Tentar diferentes campos possíveis
                                    const valor = pedidoDetalhe.valorTotal || pedidoDetalhe.total || pedidoDetalhe.valor_total || 0;
                                    
                                    // Se valor é string (pode vir como "R$ 12.00")
                                    if (typeof valor === 'string') {
                                        // Se já está formatado, retornar direto
                                        if (valor.includes('R$')) {
                                            return valor;
                                        }
                                        // Senão, tentar converter removendo caracteres não numéricos
                                        const valorLimpo = valor.replace(/[^\d.,]/g, '').replace(',', '.');
                                        const valorNumerico = parseFloat(valorLimpo);
                                        return formatarValor(isNaN(valorNumerico) ? 0 : valorNumerico);
                                    }
                                    
                                    // Se é número, formatar
                                    const valorNumerico = parseFloat(valor);
                                    return formatarValor(isNaN(valorNumerico) ? 0 : valorNumerico);
                                })()}
                            </span>
                        </div>

                        {/* Botões de Ação */}
                        <div className="modal-actions">
                            <button 
                                className="btn-modal-whatsapp"
                                onClick={() => contatarWhatsApp(pedidoDetalhe)}
                            >
                                <FaWhatsapp /> Contatar Loja
                            </button>
                            <button 
                                className="btn-modal-repetir"
                                onClick={() => {
                                    repetirPedido(pedidoDetalhe);
                                    setShowModal(false);
                                }}
                            >
                                <FaShoppingBag /> Pedir Novamente
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MeusPedidos;
