import React, { useState } from 'react';
import { FaTag, FaTimes, FaCheckCircle, FaPercent, FaGift } from 'react-icons/fa';
import { toast } from 'react-toastify';
import './index.scss';

/**
 * Componente de Cupom de Desconto
 * Permite aplicar cupons promocionais no checkout
 */
const CupomDesconto = ({ subtotal, onAplicarDesconto, descontoAtual }) => {
    const [codigoCupom, setCodigoCupom] = useState('');
    const [loading, setLoading] = useState(false);
    const [cupomAplicado, setCupomAplicado] = useState(null);

    // Cupons válidos (em produção, isso viria do backend)
    const cuponsValidos = {
        'BEMVINDO10': { tipo: 'percentual', valor: 10, descricao: '10% de desconto para novos clientes', minimo: 0 },
        'DOCE20': { tipo: 'percentual', valor: 20, descricao: '20% OFF em todo o pedido', minimo: 50 },
        'FRETE': { tipo: 'fixo', valor: 15, descricao: 'R$ 15 de desconto no frete', minimo: 30 },
        'ANIVERSARIO': { tipo: 'percentual', valor: 15, descricao: '15% OFF - Mês de aniversário', minimo: 0 },
        'NATAL2025': { tipo: 'percentual', valor: 25, descricao: '25% OFF especial de Natal', minimo: 100 },
        'PRIMEIRACOMPRA': { tipo: 'fixo', valor: 20, descricao: 'R$ 20 de desconto na primeira compra', minimo: 40 },
    };

    const validarCupom = () => {
        const codigo = codigoCupom.toUpperCase().trim();
        
        if (!codigo) {
            toast.warning('Digite um código de cupom');
            return;
        }

        setLoading(true);

        // Simular delay de validação (em produção seria uma chamada à API)
        setTimeout(() => {
            const cupom = cuponsValidos[codigo];

            if (!cupom) {
                toast.error('Cupom inválido ou expirado');
                setLoading(false);
                return;
            }

            // Verificar valor mínimo
            if (subtotal < cupom.minimo) {
                toast.warning(`Este cupom requer um pedido mínimo de R$ ${cupom.minimo.toFixed(2)}`);
                setLoading(false);
                return;
            }

            // Calcular desconto
            let valorDesconto = 0;
            if (cupom.tipo === 'percentual') {
                valorDesconto = (subtotal * cupom.valor) / 100;
            } else {
                valorDesconto = cupom.valor;
            }

            // Garantir que desconto não seja maior que o subtotal
            valorDesconto = Math.min(valorDesconto, subtotal);

            setCupomAplicado({
                codigo: codigo,
                ...cupom,
                valorDesconto: valorDesconto
            });

            onAplicarDesconto(valorDesconto, codigo);
            
            toast.success(`🎉 Cupom aplicado! Você economizou R$ ${valorDesconto.toFixed(2)}`, {
                icon: '🎁'
            });

            setLoading(false);
        }, 800);
    };

    const removerCupom = () => {
        setCupomAplicado(null);
        setCodigoCupom('');
        onAplicarDesconto(0, null);
        toast.info('Cupom removido');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            validarCupom();
        }
    };

    return (
        <div className="cupom-desconto-container">
            <div className="cupom-header">
                <FaTag className="cupom-icon" />
                <span>Cupom de Desconto</span>
            </div>

            {!cupomAplicado ? (
                <div className="cupom-form">
                    <div className="input-group">
                        <input
                            type="text"
                            value={codigoCupom}
                            onChange={(e) => setCodigoCupom(e.target.value.toUpperCase())}
                            onKeyPress={handleKeyPress}
                            placeholder="Digite seu cupom"
                            maxLength={20}
                            disabled={loading}
                        />
                        <button 
                            onClick={validarCupom} 
                            disabled={loading || !codigoCupom.trim()}
                            className="btn-aplicar"
                        >
                            {loading ? (
                                <span className="loading-dots">
                                    <span>.</span><span>.</span><span>.</span>
                                </span>
                            ) : (
                                'Aplicar'
                            )}
                        </button>
                    </div>
                    
                    {/* Dica de cupom */}
                    <div className="cupom-dica">
                        <FaGift />
                        <span>Dica: Use <strong>BEMVINDO10</strong> para 10% OFF!</span>
                    </div>
                </div>
            ) : (
                <div className="cupom-aplicado">
                    <div className="cupom-info">
                        <FaCheckCircle className="check-icon" />
                        <div className="cupom-detalhes">
                            <span className="cupom-codigo">{cupomAplicado.codigo}</span>
                            <span className="cupom-descricao">{cupomAplicado.descricao}</span>
                        </div>
                    </div>
                    <div className="cupom-valor">
                        <span className="valor-desconto">
                            {cupomAplicado.tipo === 'percentual' ? (
                                <>
                                    <FaPercent />
                                    {cupomAplicado.valor}%
                                </>
                            ) : (
                                `-R$ ${cupomAplicado.valorDesconto.toFixed(2)}`
                            )}
                        </span>
                        <button 
                            onClick={removerCupom}
                            className="btn-remover"
                            aria-label="Remover cupom"
                        >
                            <FaTimes />
                        </button>
                    </div>
                </div>
            )}

            {/* Cupons disponíveis (expandível) */}
            <details className="cupons-disponiveis">
                <summary>Ver cupons disponíveis</summary>
                <div className="lista-cupons">
                    {Object.entries(cuponsValidos).map(([codigo, cupom]) => (
                        <div 
                            key={codigo} 
                            className="cupom-item"
                            onClick={() => {
                                if (!cupomAplicado) {
                                    setCodigoCupom(codigo);
                                }
                            }}
                        >
                            <div className="cupom-item-info">
                                <strong>{codigo}</strong>
                                <span>{cupom.descricao}</span>
                                {cupom.minimo > 0 && (
                                    <small>Pedido mínimo: R$ {cupom.minimo.toFixed(2)}</small>
                                )}
                            </div>
                            <div className="cupom-item-valor">
                                {cupom.tipo === 'percentual' ? `${cupom.valor}%` : `R$ ${cupom.valor}`}
                            </div>
                        </div>
                    ))}
                </div>
            </details>
        </div>
    );
};

export default CupomDesconto;
