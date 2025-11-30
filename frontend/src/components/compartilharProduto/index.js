import React, { useState } from 'react';
import { FaShare, FaWhatsapp, FaFacebook, FaTwitter, FaCopy, FaTimes, FaTelegram, FaEnvelope } from 'react-icons/fa';
import { toast } from 'react-toastify';
import './index.scss';

/**
 * Componente de Compartilhamento de Produto
 * Modal com opções de compartilhamento em redes sociais
 */
const CompartilharProduto = ({ produto, onClose, isOpen }) => {
    const [copiado, setCopiado] = useState(false);

    if (!isOpen || !produto) return null;

    const urlProduto = `${window.location.origin}/catalogo?produto=${produto.id}`;
    const nomeProduto = produto.nome;
    const precoProduto = (produto.valor || produto.preco || 0).toFixed(2);
    const descricao = produto.descricao || 'Delicioso doce artesanal';

    const textoCompartilhamento = `🍰 ${nomeProduto}\n💰 R$ ${precoProduto}\n\n${descricao}\n\n🔗 Confira: ${urlProduto}`;
    const textoSimples = `Olha esse doce incrível: ${nomeProduto} - R$ ${precoProduto}`;

    const compartilharWhatsApp = () => {
        const url = `https://wa.me/?text=${encodeURIComponent(textoCompartilhamento)}`;
        window.open(url, '_blank');
        toast.success('Abrindo WhatsApp...');
    };

    const compartilharFacebook = () => {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(urlProduto)}&quote=${encodeURIComponent(textoSimples)}`;
        window.open(url, '_blank', 'width=600,height=400');
        toast.success('Abrindo Facebook...');
    };

    const compartilharTwitter = () => {
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(textoSimples)}&url=${encodeURIComponent(urlProduto)}`;
        window.open(url, '_blank', 'width=600,height=400');
        toast.success('Abrindo Twitter...');
    };

    const compartilharTelegram = () => {
        const url = `https://t.me/share/url?url=${encodeURIComponent(urlProduto)}&text=${encodeURIComponent(textoSimples)}`;
        window.open(url, '_blank');
        toast.success('Abrindo Telegram...');
    };

    const compartilharEmail = () => {
        const assunto = `Confira esse doce incrível: ${nomeProduto}`;
        const corpo = textoCompartilhamento;
        const url = `mailto:?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`;
        window.location.href = url;
        toast.success('Abrindo email...');
    };

    const copiarLink = async () => {
        try {
            await navigator.clipboard.writeText(urlProduto);
            setCopiado(true);
            toast.success('Link copiado! 📋');
            setTimeout(() => setCopiado(false), 3000);
        } catch (error) {
            // Fallback para navegadores antigos
            const textarea = document.createElement('textarea');
            textarea.value = urlProduto;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            setCopiado(true);
            toast.success('Link copiado! 📋');
            setTimeout(() => setCopiado(false), 3000);
        }
    };

    const compartilharNativo = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: nomeProduto,
                    text: textoSimples,
                    url: urlProduto
                });
                toast.success('Compartilhado com sucesso!');
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error('Erro ao compartilhar:', error);
                }
            }
        } else {
            copiarLink();
        }
    };

    const handleOverlayClick = (e) => {
        if (e.target.classList.contains('compartilhar-overlay')) {
            onClose();
        }
    };

    return (
        <div className="compartilhar-overlay" onClick={handleOverlayClick}>
            <div className="compartilhar-modal" role="dialog" aria-modal="true" aria-labelledby="modal-titulo">
                {/* Header */}
                <div className="modal-header">
                    <h2 id="modal-titulo">
                        <FaShare /> Compartilhar Produto
                    </h2>
                    <button className="btn-fechar" onClick={onClose} aria-label="Fechar modal">
                        <FaTimes />
                    </button>
                </div>

                {/* Preview do produto */}
                <div className="produto-preview">
                    <img 
                        src={`http://localhost:5000/storage/${produto.caminhoImagem}`}
                        alt={produto.nome}
                        onError={(e) => e.target.src = '/imgs/placeholder-produto.png'}
                    />
                    <div className="produto-info">
                        <h3>{nomeProduto}</h3>
                        <span className="produto-preco">R$ {precoProduto}</span>
                    </div>
                </div>

                {/* Opções de compartilhamento */}
                <div className="opcoes-compartilhamento">
                    <button className="btn-share whatsapp" onClick={compartilharWhatsApp}>
                        <FaWhatsapp />
                        <span>WhatsApp</span>
                    </button>

                    <button className="btn-share facebook" onClick={compartilharFacebook}>
                        <FaFacebook />
                        <span>Facebook</span>
                    </button>

                    <button className="btn-share twitter" onClick={compartilharTwitter}>
                        <FaTwitter />
                        <span>Twitter</span>
                    </button>

                    <button className="btn-share telegram" onClick={compartilharTelegram}>
                        <FaTelegram />
                        <span>Telegram</span>
                    </button>

                    <button className="btn-share email" onClick={compartilharEmail}>
                        <FaEnvelope />
                        <span>Email</span>
                    </button>

                    <button className="btn-share copiar" onClick={copiarLink}>
                        <FaCopy />
                        <span>{copiado ? 'Copiado!' : 'Copiar Link'}</span>
                    </button>
                </div>

                {/* Link para copiar */}
                <div className="link-container">
                    <input 
                        type="text" 
                        value={urlProduto} 
                        readOnly 
                        onClick={(e) => e.target.select()}
                    />
                    <button onClick={copiarLink} className={copiado ? 'copiado' : ''}>
                        {copiado ? '✓' : <FaCopy />}
                    </button>
                </div>

                {/* Botão nativo (mobile) */}
                {navigator.share && (
                    <button className="btn-compartilhar-nativo" onClick={compartilharNativo}>
                        <FaShare /> Mais opções de compartilhamento
                    </button>
                )}
            </div>
        </div>
    );
};

export default CompartilharProduto;
