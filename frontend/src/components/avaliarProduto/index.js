import React, { useState } from 'react';
import { FaStar, FaTimes, FaThumbsUp } from 'react-icons/fa';
import { toast } from 'react-toastify';
import './index.scss';

/**
 * Componente de Avaliação de Produto
 * Modal para clientes avaliarem produtos após compra
 */
const AvaliarProduto = ({ produto, onClose, onAvaliar, isOpen }) => {
    const [nota, setNota] = useState(0);
    const [notaHover, setNotaHover] = useState(0);
    const [comentario, setComentario] = useState('');
    const [nome, setNome] = useState('');
    const [recomenda, setRecomenda] = useState(true);
    const [enviando, setEnviando] = useState(false);

    if (!isOpen || !produto) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (nota === 0) {
            toast.warning('Por favor, selecione uma nota de 1 a 5 estrelas');
            return;
        }

        if (!nome.trim()) {
            toast.warning('Por favor, informe seu nome');
            return;
        }

        setEnviando(true);

        try {
            // Simular envio (em produção seria uma chamada à API)
            await new Promise(resolve => setTimeout(resolve, 1000));

            const avaliacao = {
                produtoId: produto.id,
                produtoNome: produto.nome,
                nota,
                comentario: comentario.trim(),
                nome: nome.trim(),
                recomenda,
                data: new Date().toISOString()
            };

            // Salvar no localStorage (em produção salvaria no backend)
            const avaliacoesSalvas = JSON.parse(localStorage.getItem('avaliacoes') || '[]');
            avaliacoesSalvas.push(avaliacao);
            localStorage.setItem('avaliacoes', JSON.stringify(avaliacoesSalvas));

            if (onAvaliar) {
                onAvaliar(avaliacao);
            }

            toast.success('🌟 Avaliação enviada com sucesso! Obrigado pelo feedback!');
            onClose();
        } catch (error) {
            console.error('Erro ao enviar avaliação:', error);
            toast.error('Erro ao enviar avaliação. Tente novamente.');
        } finally {
            setEnviando(false);
        }
    };

    const handleOverlayClick = (e) => {
        if (e.target.classList.contains('avaliar-overlay')) {
            onClose();
        }
    };

    const getNotaTexto = (n) => {
        const textos = {
            1: 'Ruim 😞',
            2: 'Regular 😐',
            3: 'Bom 🙂',
            4: 'Muito Bom 😊',
            5: 'Excelente! 🤩'
        };
        return textos[n] || '';
    };

    return (
        <div className="avaliar-overlay" onClick={handleOverlayClick}>
            <div className="avaliar-modal" role="dialog" aria-modal="true" aria-labelledby="modal-titulo">
                {/* Header */}
                <div className="modal-header">
                    <h2 id="modal-titulo">
                        <FaStar /> Avaliar Produto
                    </h2>
                    <button className="btn-fechar" onClick={onClose} aria-label="Fechar modal">
                        <FaTimes />
                    </button>
                </div>

                {/* Preview do produto */}
                <div className="produto-avaliar">
                    <img 
                        src={`http://localhost:5000/storage/${produto.caminhoImagem}`}
                        alt={produto.nome}
                        onError={(e) => e.target.src = '/imgs/placeholder-produto.png'}
                    />
                    <div className="produto-info">
                        <h3>{produto.nome}</h3>
                        <span>Compartilhe sua experiência com este produto</span>
                    </div>
                </div>

                {/* Formulário */}
                <form onSubmit={handleSubmit}>
                    {/* Estrelas */}
                    <div className="avaliacao-estrelas">
                        <label>Qual sua nota?</label>
                        <div className="estrelas-container">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    className={`estrela ${star <= (notaHover || nota) ? 'ativa' : ''}`}
                                    onClick={() => setNota(star)}
                                    onMouseEnter={() => setNotaHover(star)}
                                    onMouseLeave={() => setNotaHover(0)}
                                    aria-label={`${star} estrela${star > 1 ? 's' : ''}`}
                                >
                                    <FaStar />
                                </button>
                            ))}
                        </div>
                        {(notaHover || nota) > 0 && (
                            <span className="nota-texto">{getNotaTexto(notaHover || nota)}</span>
                        )}
                    </div>

                    {/* Nome */}
                    <div className="form-group">
                        <label htmlFor="nome-avaliacao">Seu nome *</label>
                        <input
                            id="nome-avaliacao"
                            type="text"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            placeholder="Como você gostaria de ser identificado"
                            maxLength={50}
                            required
                        />
                    </div>

                    {/* Comentário */}
                    <div className="form-group">
                        <label htmlFor="comentario-avaliacao">
                            Seu comentário <span className="opcional">(opcional)</span>
                        </label>
                        <textarea
                            id="comentario-avaliacao"
                            value={comentario}
                            onChange={(e) => setComentario(e.target.value)}
                            placeholder="Conte sua experiência com este produto..."
                            maxLength={500}
                            rows={4}
                        />
                        <span className="contador">{comentario.length}/500</span>
                    </div>

                    {/* Recomenda? */}
                    <div className="form-group recomenda-group">
                        <label>Você recomenda este produto?</label>
                        <div className="recomenda-opcoes">
                            <button
                                type="button"
                                className={`btn-recomenda ${recomenda ? 'ativo' : ''}`}
                                onClick={() => setRecomenda(true)}
                            >
                                <FaThumbsUp /> Sim, recomendo!
                            </button>
                            <button
                                type="button"
                                className={`btn-recomenda nao ${!recomenda ? 'ativo' : ''}`}
                                onClick={() => setRecomenda(false)}
                            >
                                <FaThumbsUp className="invertido" /> Não recomendo
                            </button>
                        </div>
                    </div>

                    {/* Botão enviar */}
                    <button type="submit" className="btn-enviar" disabled={enviando}>
                        {enviando ? (
                            <span className="loading">Enviando...</span>
                        ) : (
                            <>
                                <FaStar /> Enviar Avaliação
                            </>
                        )}
                    </button>
                </form>

                {/* Info adicional */}
                <p className="info-privacidade">
                    Sua avaliação nos ajuda a melhorar continuamente. Obrigado pelo feedback! 💜
                </p>
            </div>
        </div>
    );
};

export default AvaliarProduto;
