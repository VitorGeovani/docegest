import React, { useState } from "react";
import './index.scss';
import { FaShoppingCart, FaHeart, FaRegHeart, FaStar } from "react-icons/fa";
import { toast } from "react-toastify";
import { useFavoritosContext } from '../../context/FavoritosContext';

function CardProdutoCatalogo({ produto, onAdicionarCarrinho }) {
    const [quantidade, setQuantidade] = useState(1);
    const { isFavorito, toggleFavorito: toggleFavoritoContext } = useFavoritosContext();
    
    const favorito = isFavorito(produto.id);

    const handleAdicionarCarrinho = () => {
        if (!produto.ativo) {
            toast.warning("Este produto está temporariamente indisponível");
            return;
        }

        if (!produto.quantidade || produto.quantidade <= 0) {
            toast.error("Produto esgotado!");
            return;
        }

        if (quantidade > produto.quantidade) {
            toast.warning(`Apenas ${produto.quantidade} unidade(s) disponível(is) em estoque`);
            return;
        }

        // Adicionar direto ao carrinho
        onAdicionarCarrinho({ ...produto, quantidade });
        toast.success(`${produto.nome} adicionado ao carrinho!`);
        setQuantidade(1);
    };

    const toggleFavorito = () => {
        toggleFavoritoContext(produto.id);
        if (!favorito) {
            toast.success(`❤️ ${produto.nome} adicionado aos favoritos!`);
        } else {
            toast.info(`${produto.nome} removido dos favoritos`);
        }
    };

    return (
        <div className={`card-produto-catalogo ${!produto.ativo ? 'indisponivel' : ''}`}>
            {/* Badge de Categoria */}
            {produto.categoria && (
                <div className="badge-categoria">{produto.categoria}</div>
            )}

            {/* Badge Indisponível */}
            {!produto.ativo && (
                <div className="badge-indisponivel">Indisponível</div>
            )}
            
            {/* Badge Estoque Baixo */}
            {produto.ativo && produto.quantidade > 0 && produto.quantidade <= 5 && (
                <div className="badge-estoque-baixo">Últimas {produto.quantidade} unidades!</div>
            )}

            {/* Botão Favorito */}
            <button 
                className="btn-favorito" 
                onClick={toggleFavorito}
                aria-label={favorito ? `Remover ${produto.nome} dos favoritos` : `Adicionar ${produto.nome} aos favoritos`}
                aria-pressed={favorito}
            >
                {favorito ? <FaHeart className="favorito-ativo" aria-hidden="true" /> : <FaRegHeart aria-hidden="true" />}
            </button>

            {/* Imagem */}
            <div className="produto-imagem">
                <img 
                    src={produto.imagem ? `http://localhost:5000/storage/${produto.imagem}` : '/imgs/placeholder.png'}
                    alt={`Foto do produto ${produto.nome}. ${produto.descricao || 'Delicioso produto artesanal'}`}
                    title={`${produto.nome} - ${produto.descricao || 'Delicioso produto artesanal'}`}
                    loading="lazy"
                    width="300"
                    height="auto"
                />
            </div>

            {/* Informações */}
            <div className="produto-info">
                <h3 className="produto-nome">{produto.nome}</h3>
                <p className="produto-descricao">{produto.descricao || 'Delicioso produto artesanal'}</p>

                {/* Avaliação (mock) */}
                <div className="produto-avaliacao" role="img" aria-label="Avaliação: 4 de 5 estrelas">
                    <FaStar className="star" aria-hidden="true" />
                    <FaStar className="star" aria-hidden="true" />
                    <FaStar className="star" aria-hidden="true" />
                    <FaStar className="star" aria-hidden="true" />
                    <FaStar className="star-empty" aria-hidden="true" />
                    <span aria-hidden="true">(4.0)</span>
                </div>

                {/* Preço e Ações */}
                <div className="produto-footer">
                    <div className="preco-container">
                        <span className="preco-label">Preço:</span>
                        <span className="preco-valor">R$ {produto.valor?.toFixed(2)}</span>
                    </div>

                    <div className="acoes-container">
                        <div className="quantidade-selector">
                            <button 
                                onClick={() => setQuantidade(Math.max(1, quantidade - 1))}
                                disabled={!produto.ativo || !produto.quantidade}
                            >
                                -
                            </button>
                            <span>{quantidade}</span>
                            <button 
                                onClick={() => setQuantidade(Math.min(produto.quantidade || 1, quantidade + 1))}
                                disabled={!produto.ativo || !produto.quantidade || quantidade >= produto.quantidade}
                            >
                                +
                            </button>
                        </div>

                        <button 
                            className="btn-adicionar"
                            onClick={handleAdicionarCarrinho}
                            disabled={!produto.ativo || !produto.quantidade || produto.quantidade <= 0}
                            title="Adicionar ao carrinho"
                        >
                            <FaShoppingCart />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CardProdutoCatalogo;
