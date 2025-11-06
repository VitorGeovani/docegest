import React, { useState } from "react";
import './index.scss';
import { FaShoppingCart, FaTimes, FaPlus, FaMinus, FaTrash, FaPalette } from "react-icons/fa";
import { toast } from "react-toastify";
import PersonalizacaoProduto from '../personalizacao';

function Carrinho({ isOpen, onClose, itens, onUpdateQuantidade, onRemoverItem, onFinalizarPedido, onPersonalizarItem }) {
    const [observacoes, setObservacoes] = useState("");
    const [produtoPersonalizar, setProdutoPersonalizar] = useState(null);

    const calcularSubtotal = () => {
        return itens.reduce((total, item) => {
            const valorBase = item.valor * item.quantidade;
            const acrescimo = (item.valor_acrescimo || 0) * item.quantidade;
            return total + valorBase + acrescimo;
        }, 0);
    };

    const calcularTotal = () => {
        const subtotal = calcularSubtotal();
        // Aqui você pode adicionar taxas de entrega, descontos, etc.
        return subtotal;
    };

    const handleFinalizarPedido = () => {
        if (itens.length === 0) {
            toast.warning("Adicione produtos ao carrinho antes de finalizar!");
            return;
        }
        
        onFinalizarPedido({ itens, observacoes, total: calcularTotal() });
    };

    if (!isOpen) return null;

    return (
        <div className="carrinho-overlay" onClick={onClose}>
            <div className="carrinho-sidebar" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="carrinho-header">
                    <div className="header-title">
                        <FaShoppingCart />
                        <h2>Meu Carrinho</h2>
                        <span className="badge-quantidade">{itens.length}</span>
                    </div>
                    <button className="btn-fechar" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>

                {/* Lista de Itens */}
                <div className="carrinho-itens">
                    {itens.length === 0 ? (
                        <div className="carrinho-vazio">
                            <FaShoppingCart className="icon-vazio" />
                            <p>Seu carrinho está vazio</p>
                            <span>Adicione produtos deliciosos!</span>
                        </div>
                    ) : (
                        itens.map((item) => (
                            <div key={item.id} className="carrinho-item">
                                <div className="item-imagem">
                                    <img 
                                        src={item.imagem ? `http://localhost:5000/storage/${item.imagem}` : '/imgs/placeholder.png'} 
                                        alt={item.nome}
                                        title={item.nome}
                                    />
                                </div>
                                <div className="item-info">
                                    <h4>{item.nome}</h4>
                                    <p className="item-preco">R$ {item.valor.toFixed(2)}</p>
                                    
                                    {/* Personalizações */}
                                    {item.personalizacoes && item.personalizacoes.length > 0 && (
                                        <div className="item-personalizacoes">
                                            <span className="personalizacoes-titulo">✨ Personalizações:</span>
                                            {item.personalizacoes.map((p, idx) => (
                                                <div key={idx} className="personalizacao-item">
                                                    • {p.nome_opcao}: {p.nome_valor}
                                                </div>
                                            ))}
                                            {item.valor_acrescimo > 0 && (
                                                <div className="personalizacao-acrescimo">
                                                    + R$ {item.valor_acrescimo.toFixed(2)}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    
                                    <div className="item-quantidade">
                                        <button 
                                            onClick={() => onUpdateQuantidade(item.id, item.quantidade - 1)}
                                            disabled={item.quantidade <= 1}
                                            className="btn-quantidade"
                                        >
                                            <FaMinus />
                                        </button>
                                        <span className="quantidade-valor">{item.quantidade}</span>
                                        <button 
                                            onClick={() => onUpdateQuantidade(item.id, item.quantidade + 1)}
                                            className="btn-quantidade"
                                        >
                                            <FaPlus />
                                        </button>
                                    </div>
                                </div>
                                <div className="item-actions">
                                    <p className="item-subtotal">
                                        R$ {((item.valor + (item.valor_acrescimo || 0)) * item.quantidade).toFixed(2)}
                                    </p>
                                    <button 
                                        className="btn-personalizar"
                                        onClick={() => setProdutoPersonalizar(item)}
                                        title="Personalizar produto"
                                    >
                                        <FaPalette />
                                    </button>
                                    <button 
                                        className="btn-remover"
                                        onClick={() => onRemoverItem(item.id)}
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Observações */}
                {itens.length > 0 && (
                    <div className="carrinho-observacoes">
                        <label>Observações do Pedido:</label>
                        <textarea
                            placeholder="Ex: Sem lactose, entregar das 18h às 20h..."
                            value={observacoes}
                            onChange={(e) => setObservacoes(e.target.value)}
                            rows={3}
                        />
                    </div>
                )}

                {/* Footer com Total */}
                <div className="carrinho-footer">
                    <div className="total-info">
                        <div className="total-linha">
                            <span>Subtotal:</span>
                            <span>R$ {calcularSubtotal().toFixed(2)}</span>
                        </div>
                        <div className="total-linha total-final">
                            <span>Total:</span>
                            <span>R$ {calcularTotal().toFixed(2)}</span>
                        </div>
                    </div>
                    
                    <button 
                        className="btn-finalizar"
                        onClick={handleFinalizarPedido}
                        disabled={itens.length === 0}
                    >
                        Finalizar Pedido
                    </button>
                    
                    <button className="btn-continuar" onClick={onClose}>
                        Continuar Comprando
                    </button>
                </div>
            </div>

            {/* Modal de Personalização */}
            {produtoPersonalizar && (
                <PersonalizacaoProduto
                    produto={produtoPersonalizar}
                    onCancelar={() => setProdutoPersonalizar(null)}
                    onConfirmar={(personalizacoes, valorAcrescimo) => {
                        if (onPersonalizarItem) {
                            onPersonalizarItem(produtoPersonalizar.id, personalizacoes, valorAcrescimo);
                        }
                        setProdutoPersonalizar(null);
                        toast.success("Personalizações aplicadas!");
                    }}
                />
            )}
        </div>
    );
}

export default Carrinho;
