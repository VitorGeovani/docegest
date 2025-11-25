import React, { useState, useEffect } from "react";
import './index.scss';
import HeaderCatalogo from "../../components/headerCatalogo";
import BotaoVoltarTopo from "../../components/botaoVoltarTopo";
import Footer from "../../components/footer";
import CardProdutoCatalogo from "../../components/cardProdutoCatalogo";
import Carrinho from "../../components/carrinho";
import { FaShoppingCart, FaSearch, FaFilter } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

function Catalogo() {
    const navigate = useNavigate();
    const location = useLocation();
    const [produtos, setProdutos] = useState([]);
    const [produtosFiltrados, setProdutosFiltrados] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [carrinho, setCarrinho] = useState([]);
    const [carrinhoAberto, setCarrinhoAberto] = useState(false);
    
    // Filtros
    const [busca, setBusca] = useState("");
    const [categoriaFiltro, setCategoriaFiltro] = useState("");
    const [ordenacao, setOrdenacao] = useState("nome");
    
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        carregarDados();
        carregarCarrinhoSalvo();
    }, []);

    useEffect(() => {
        aplicarFiltros();
    }, [produtos, busca, categoriaFiltro, ordenacao]);

    // Salvar carrinho no localStorage sempre que mudar
    useEffect(() => {
        if (carrinho.length > 0) {
            localStorage.setItem('carrinho', JSON.stringify({ itens: carrinho }));
            console.log('💾 Carrinho salvo no localStorage:', carrinho);
        }
    }, [carrinho]);

    // Abrir carrinho automaticamente se vier do checkout
    useEffect(() => {
        if (location.state?.abrirCarrinho) {
            setCarrinhoAberto(true);
        }
    }, [location]);

    const carregarCarrinhoSalvo = () => {
        const carrinhoSalvo = localStorage.getItem('carrinho');
        if (carrinhoSalvo) {
            try {
                const dados = JSON.parse(carrinhoSalvo);
                if (dados.itens && Array.isArray(dados.itens)) {
                    setCarrinho(dados.itens);
                    console.log('🛒 Carrinho carregado do localStorage:', dados.itens);
                }
            } catch (error) {
                console.error('❌ Erro ao carregar carrinho:', error);
            }
        }
    };

    const carregarDados = async () => {
        try {
            setLoading(true);
            console.log('🔄 Iniciando carregamento de dados...');
            
            const [produtosRes, categoriasRes] = await Promise.all([
                axios.get('http://localhost:5000/produto/listar'),
                axios.get('http://localhost:5000/categorias/ativas')
            ]);

            console.log('📦 Resposta produtos:', produtosRes.data);
            console.log('📂 Resposta categorias:', categoriasRes.data);

            // Garantir que sempre temos um array
            const produtosData = Array.isArray(produtosRes.data) ? produtosRes.data : [];
            const categoriasData = Array.isArray(categoriasRes.data) ? categoriasRes.data : [];

            console.log(`✅ ${produtosData.length} produtos carregados`);
            console.log(`✅ ${categoriasData.length} categorias carregadas`);

            // Filtrar produtos ativos E com estoque disponível
            const produtosAtivos = produtosData.filter(p => p.ativo !== false && (p.quantidade > 0));
            console.log(`🎯 ${produtosAtivos.length} produtos ativos com estoque`);

            setProdutos(produtosAtivos); // Apenas produtos ativos com estoque
            setCategorias(categoriasData);
            setLoading(false);
        } catch (error) {
            console.error("❌ Erro ao carregar dados:", error);
            console.error("📊 Error details:", error.response || error.message);
            toast.error("Erro ao carregar produtos. Verifique se o backend está rodando.");
            setProdutos([]); // Garantir que sempre há um array
            setCategorias([]);
            setLoading(false);
        }
    };

    const aplicarFiltros = () => {
        console.log('🔍 Aplicando filtros...', { 
            totalProdutos: produtos?.length, 
            busca, 
            categoriaFiltro, 
            ordenacao 
        });

        // Garantir que produtos é sempre um array
        if (!Array.isArray(produtos)) {
            console.warn('⚠️ produtos não é um array:', produtos);
            setProdutosFiltrados([]);
            return;
        }

        let filtered = [...produtos];
        console.log(`📊 Produtos antes dos filtros: ${filtered.length}`);

        // Filtro de busca
        if (busca) {
            filtered = filtered.filter(p =>
                p.nome.toLowerCase().includes(busca.toLowerCase()) ||
                (p.descricao && p.descricao.toLowerCase().includes(busca.toLowerCase()))
            );
            console.log(`📊 Após filtro de busca: ${filtered.length}`);
        }

        // Filtro de categoria
        if (categoriaFiltro) {
            filtered = filtered.filter(p => 
                p.id_categoria === parseInt(categoriaFiltro) || 
                p.idcategoria === parseInt(categoriaFiltro)
            );
            console.log(`📊 Após filtro de categoria: ${filtered.length}`);
        }

        // Ordenação
        switch (ordenacao) {
            case 'nome':
                filtered.sort((a, b) => a.nome.localeCompare(b.nome));
                break;
            case 'preco-menor':
                filtered.sort((a, b) => (a.valor || a.preco || 0) - (b.valor || b.preco || 0));
                break;
            case 'preco-maior':
                filtered.sort((a, b) => (b.valor || b.preco || 0) - (a.valor || a.preco || 0));
                break;
            default:
                break;
        }

        console.log(`✅ Produtos filtrados finais: ${filtered.length}`);
        setProdutosFiltrados(filtered);
    };

    const adicionarAoCarrinho = (produto) => {
        const itemExistente = carrinho.find(item => item.id === produto.id);

        if (itemExistente) {
            // Se o item já existe, apenas aumenta a quantidade mas PRESERVA as personalizações
            setCarrinho(carrinho.map(item =>
                item.id === produto.id
                    ? { 
                        ...item, 
                        quantidade: item.quantidade + produto.quantidade
                        // NÃO sobrescrever personalizacoes e valor_acrescimo
                    }
                    : item
            ));
        } else {
            // Novo item - garantir que tem as propriedades de personalização
            setCarrinho([...carrinho, {
                ...produto,
                personalizacoes: produto.personalizacoes || [],
                valor_acrescimo: produto.valor_acrescimo || 0
            }]);
        }
    };

    const atualizarQuantidade = (produtoId, novaQuantidade) => {
        if (novaQuantidade < 1) return;

        setCarrinho(carrinho.map(item =>
            item.id === produtoId
                ? { ...item, quantidade: novaQuantidade }
                : item
        ));
    };

    const removerDoCarrinho = (produtoId) => {
        setCarrinho(carrinho.filter(item => item.id !== produtoId));
        toast.success("Item removido do carrinho");
    };

    const personalizarItem = (produtoId, personalizacoes, valorAcrescimo) => {
        console.log('📝 Atualizando item no carrinho:', {
            produtoId,
            qtdPersonalizacoes: personalizacoes.length,
            valorAcrescimo
        });

        setCarrinho(prevCarrinho => {
            const novoCarrinho = prevCarrinho.map(item => {
                if (item.id === produtoId) {
                    const itemAtualizado = {
                        ...item,
                        personalizacoes: personalizacoes,
                        valor_acrescimo: valorAcrescimo || 0
                    };
                    console.log('✅ Item atualizado:', itemAtualizado);
                    return itemAtualizado;
                }
                return item;
            });
            
            console.log('🛒 Novo carrinho completo:', novoCarrinho);
            return novoCarrinho;
        });
    };

    const finalizarPedido = (dadosPedido) => {
        // Salvar carrinho no localStorage ou state global
        localStorage.setItem('carrinho', JSON.stringify(dadosPedido));
        navigate('/checkout');
    };

    const totalItensCarrinho = carrinho.reduce((total, item) => total + item.quantidade, 0);

    return (
        <div className="pagina-catalogo">
            <HeaderCatalogo />
            <BotaoVoltarTopo />

            {/* Botão Flutuante do Carrinho */}
            <button 
                className="btn-carrinho-flutuante"
                onClick={() => setCarrinhoAberto(true)}
            >
                <FaShoppingCart />
                {totalItensCarrinho > 0 && (
                    <span className="badge-carrinho">{totalItensCarrinho}</span>
                )}
            </button>

            <div className="catalogo-container">
                {/* Header do Catálogo */}
                <div className="catalogo-header">
                    <h1>Nossos Produtos</h1>
                    <p>Confira nossa seleção de doces artesanais</p>
                </div>

                {/* Filtros */}
                <div className="catalogo-filtros">
                    <div className="filtro-busca">
                        <FaSearch className="icon-busca" />
                        <input
                            type="text"
                            placeholder="Buscar produto..."
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                        />
                    </div>

                    <div className="filtro-categoria">
                        <FaFilter className="icon-filtro" />
                        <select
                            value={categoriaFiltro}
                            onChange={(e) => setCategoriaFiltro(e.target.value)}
                        >
                            <option value="">Todas as Categorias</option>
                            {categorias.map(cat => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.nome}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="filtro-ordenacao">
                        <select
                            value={ordenacao}
                            onChange={(e) => setOrdenacao(e.target.value)}
                        >
                            <option value="nome">Ordenar por Nome</option>
                            <option value="preco-menor">Menor Preço</option>
                            <option value="preco-maior">Maior Preço</option>
                        </select>
                    </div>

                    <div className="resultado-info">
                        {produtosFiltrados.length} produto(s) encontrado(s)
                    </div>
                </div>

                {/* Grid de Produtos */}
                {loading ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Carregando produtos...</p>
                    </div>
                ) : produtosFiltrados.length === 0 ? (
                    <div className="empty-state">
                        <p>Nenhum produto encontrado</p>
                    </div>
                ) : (
                    <div className="produtos-grid">
                        {produtosFiltrados.map(produto => (
                            <CardProdutoCatalogo
                                key={produto.id}
                                produto={produto}
                                onAdicionarCarrinho={adicionarAoCarrinho}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Carrinho Lateral */}
            <Carrinho
                isOpen={carrinhoAberto}
                onClose={() => setCarrinhoAberto(false)}
                itens={carrinho}
                onUpdateQuantidade={atualizarQuantidade}
                onRemoverItem={removerDoCarrinho}
                onFinalizarPedido={finalizarPedido}
                onPersonalizarItem={personalizarItem}
            />

            <Footer />
        </div>
    );
}

export default Catalogo;
