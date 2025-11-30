import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaHeart, FaShoppingCart, FaArrowLeft, FaTrash, FaShare, FaWhatsapp } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useFavoritosContext } from '../../context/FavoritosContext';
import HeaderCatalogo from '../../components/headerCatalogo';
import Footer from '../../components/footer';
import './index.scss';

const Favoritos = () => {
    const navigate = useNavigate();
    const { favoritos, removerFavorito, limparFavoritos, quantidadeFavoritos } = useFavoritosContext();
    const [produtos, setProdutos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const carregarProdutosFavoritos = async () => {
            if (favoritos.length === 0) {
                setProdutos([]);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                // Buscar todos os produtos
                const response = await axios.get('http://localhost:5000/produto/listar');
                console.log('Produtos da API:', response.data);
                console.log('IDs dos favoritos:', favoritos);
                
                // Filtrar apenas os favoritos
                const produtosFavoritos = response.data.filter(p => favoritos.includes(p.id));
                console.log('Produtos favoritos encontrados:', produtosFavoritos);
                setProdutos(produtosFavoritos);
            } catch (error) {
                console.error('Erro ao carregar produtos favoritos:', error);
                toast.error('Erro ao carregar seus favoritos. Verifique se o backend está rodando.');
            } finally {
                setLoading(false);
            }
        };

        carregarProdutosFavoritos();
    }, [favoritos]);

    const handleRemoverFavorito = (produtoId, nome) => {
        removerFavorito(produtoId);
        toast.info(`${nome} removido dos favoritos`, {
            icon: '💔'
        });
    };

    const handleLimparTodos = () => {
        if (window.confirm('Deseja remover todos os produtos dos favoritos?')) {
            limparFavoritos();
            toast.info('Todos os favoritos foram removidos');
        }
    };

    const handleAdicionarCarrinho = (produto) => {
        try {
            const carrinhoAtual = JSON.parse(localStorage.getItem('carrinho') || '{"itens":[],"total":0}');
            
            // Verificar se o produto já está no carrinho
            const itemExistente = carrinhoAtual.itens.find(item => item.id === produto.id);
            
            if (itemExistente) {
                itemExistente.quantidade += 1;
            } else {
                carrinhoAtual.itens.push({
                    id: produto.id,
                    nome: produto.nome,
                    valor: produto.valor || produto.preco,
                    imagem: produto.imagem,
                    quantidade: 1,
                    personalizacoes: [],
                    valor_acrescimo: 0
                });
            }
            
            // Recalcular total
            carrinhoAtual.total = carrinhoAtual.itens.reduce((sum, item) => {
                return sum + ((item.valor + (item.valor_acrescimo || 0)) * item.quantidade);
            }, 0);
            
            localStorage.setItem('carrinho', JSON.stringify(carrinhoAtual));
            
            toast.success(`${produto.nome} adicionado ao carrinho! 🛒`);
        } catch (error) {
            console.error('Erro ao adicionar ao carrinho:', error);
            toast.error('Erro ao adicionar ao carrinho');
        }
    };

    const handleCompartilhar = async (produto) => {
        const texto = `Olha esse produto incrível da Segredo do Sabor: ${produto.nome} - R$ ${(produto.valor || produto.preco).toFixed(2)}`;
        const url = `${window.location.origin}/catalogo?produto=${produto.id}`;
        
        // Tentar usar a API de compartilhamento nativa
        if (navigator.share) {
            try {
                await navigator.share({
                    title: produto.nome,
                    text: texto,
                    url: url
                });
            } catch (error) {
                if (error.name !== 'AbortError') {
                    compartilharWhatsApp(produto);
                }
            }
        } else {
            compartilharWhatsApp(produto);
        }
    };

    const compartilharWhatsApp = (produto) => {
        const texto = `🍰 *${produto.nome}*\n\n💰 R$ ${(produto.valor || produto.preco).toFixed(2)}\n\n${produto.descricao || ''}\n\n🔗 Veja mais em: ${window.location.origin}/catalogo`;
        const urlWhatsApp = `https://wa.me/?text=${encodeURIComponent(texto)}`;
        window.open(urlWhatsApp, '_blank');
    };

    const formatarValor = (valor) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    };

    if (loading) {
        return (
            <div className="pagina-favoritos">
                <HeaderCatalogo />
                <main className="favoritos-container">
                    <div className="loading-state">
                        <div className="loading-heart">❤️</div>
                        <p>Carregando seus favoritos...</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="pagina-favoritos">
            <HeaderCatalogo />
            
            <main className="favoritos-container">
                {/* Header da página */}
                <div className="favoritos-header">
                    <button className="btn-voltar" onClick={() => navigate('/catalogo')}>
                        <FaArrowLeft /> Voltar ao Catálogo
                    </button>
                    <div className="titulo-container">
                        <h1>
                            <FaHeart className="heart-icon" /> Meus Favoritos
                        </h1>
                        <p>{quantidadeFavoritos} {quantidadeFavoritos === 1 ? 'produto salvo' : 'produtos salvos'}</p>
                    </div>
                    {produtos.length > 0 && (
                        <button className="btn-limpar" onClick={handleLimparTodos}>
                            <FaTrash /> Limpar Todos
                        </button>
                    )}
                </div>

                {/* Lista de Favoritos */}
                {produtos.length === 0 ? (
                    <div className="favoritos-vazio">
                        <div className="empty-icon">💔</div>
                        <h2>Nenhum favorito ainda</h2>
                        <p>Explore nosso catálogo e salve seus produtos favoritos clicando no coração!</p>
                        <Link to="/catalogo" className="btn-explorar">
                            <FaShoppingCart /> Explorar Catálogo
                        </Link>
                    </div>
                ) : (
                    <div className="favoritos-grid">
                        {produtos.map((produto) => (
                            <div key={produto.id} className="favorito-card">
                                {/* Botão remover favorito */}
                                <button 
                                    className="btn-remover-favorito"
                                    onClick={() => handleRemoverFavorito(produto.id, produto.nome)}
                                    aria-label={`Remover ${produto.nome} dos favoritos`}
                                >
                                    <FaHeart />
                                </button>

                                {/* Imagem do produto */}
                                <div className="produto-imagem">
                                    <img 
                                        src={produto.imagem ? `http://localhost:5000/storage/${produto.imagem}` : '/imgs/placeholder.png'}
                                        alt={produto.nome}
                                        onError={(e) => {
                                            e.target.src = '/imgs/placeholder.png';
                                        }}
                                    />
                                    {produto.destaque && (
                                        <span className="tag-destaque">⭐ Destaque</span>
                                    )}
                                </div>

                                {/* Info do produto */}
                                <div className="produto-info">
                                    <h3>{produto.nome}</h3>
                                    {produto.descricao && (
                                        <p className="produto-descricao">
                                            {produto.descricao.length > 80 
                                                ? `${produto.descricao.substring(0, 80)}...` 
                                                : produto.descricao
                                            }
                                        </p>
                                    )}
                                    <div className="produto-preco">
                                        {formatarValor(produto.valor || produto.preco)}
                                    </div>
                                </div>

                                {/* Ações */}
                                <div className="produto-acoes">
                                    <button 
                                        className="btn-compartilhar"
                                        onClick={() => handleCompartilhar(produto)}
                                        aria-label={`Compartilhar ${produto.nome}`}
                                    >
                                        <FaShare />
                                    </button>
                                    <button 
                                        className="btn-whatsapp"
                                        onClick={() => compartilharWhatsApp(produto)}
                                        aria-label={`Compartilhar ${produto.nome} no WhatsApp`}
                                    >
                                        <FaWhatsapp />
                                    </button>
                                    <button 
                                        className="btn-adicionar-carrinho"
                                        onClick={() => handleAdicionarCarrinho(produto)}
                                    >
                                        <FaShoppingCart /> Adicionar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Sugestão */}
                {produtos.length > 0 && produtos.length < 5 && (
                    <div className="sugestao-container">
                        <p>💡 Dica: Adicione mais produtos aos favoritos para facilitar suas próximas compras!</p>
                        <Link to="/catalogo" className="btn-ver-mais">
                            Ver mais produtos
                        </Link>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default Favoritos;
