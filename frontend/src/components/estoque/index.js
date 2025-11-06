import React, { useState, useEffect } from "react";
import './index.scss';
import CardEstoque from "../cardEstoque";
import NovoProduto from "../novoProduto";
import { FaPlus, FaSearch, FaFilter, FaExclamationTriangle } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";

function Estoque() {
    const [listaProdutos, setListaProdutos] = useState([]);
    const [produtosFiltrados, setProdutosFiltrados] = useState([]);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [produtoEditando, setProdutoEditando] = useState(null);
    const [filtroCategoria, setFiltroCategoria] = useState("");
    const [categorias, setCategorias] = useState([]);
    const [busca, setBusca] = useState("");
    const [loading, setLoading] = useState(true);
    const [modalExcluir, setModalExcluir] = useState({ show: false, produto: null });

    useEffect(() => {
        carregarDados();
    }, []);

    useEffect(() => {
        aplicarFiltros();
    }, [listaProdutos, busca, filtroCategoria]);

    const carregarDados = async () => {
        await Promise.all([carregarProdutos(), carregarCategorias()]);
    };

    const carregarProdutos = async () => {
        try {
            setLoading(true);
            // Admin deve ver TODOS os produtos, incluindo esgotados
            const response = await axios.get('http://localhost:5000/produto/admin/listar');
            setListaProdutos(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Erro ao carregar produtos:", error);
            toast.error("Erro ao carregar produtos");
            setLoading(false);
        }
    };

    const carregarCategorias = async () => {
        try {
            const response = await axios.get('http://localhost:5000/categorias/ativas');
            setCategorias(response.data);
        } catch (error) {
            console.error("Erro ao carregar categorias:", error);
        }
    };

    const aplicarFiltros = () => {
        let filtered = [...listaProdutos];

        if (busca) {
            filtered = filtered.filter(produto =>
                produto.nome.toLowerCase().includes(busca.toLowerCase())
            );
        }

        // Filtro de categoria removido temporariamente (coluna não existe na tabela)
        // if (filtroCategoria) {
        //     filtered = filtered.filter(
        //         produto => produto.id_categoria === parseInt(filtroCategoria)
        //     );
        // }

        setProdutosFiltrados(filtered);
    };

    const abrirFormulario = (produto = null) => {
        setProdutoEditando(produto);
        setMostrarFormulario(true);
    };

    const fecharFormulario = () => {
        setMostrarFormulario(false);
        setProdutoEditando(null);
    };

    const handleSucesso = () => {
        carregarProdutos();
        fecharFormulario();
    };

    const abrirModalExcluir = (produto) => {
        setModalExcluir({ show: true, produto });
    };

    const fecharModalExcluir = () => {
        setModalExcluir({ show: false, produto: null });
    };

    const confirmarExclusao = async () => {
        if (!modalExcluir.produto) return;

        try {
            const token = localStorage.getItem('accessToken');
            const response = await axios.delete(`http://localhost:5000/produto/${modalExcluir.produto.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            console.log("Produto deletado com sucesso!", response.data);
            toast.success("Produto excluído com sucesso!");
            fecharModalExcluir();
            await carregarProdutos(); // Aguardar recarregar lista
        } catch (error) {
            console.error("Erro ao deletar produto:", error);
            
            if (error.response?.status === 404) {
                toast.error("Produto não encontrado ou já foi excluído");
            } else if (error.response?.status === 401) {
                toast.error("Você não tem permissão para excluir produtos");
            } else {
                toast.error(error.response?.data?.erro || "Erro ao excluir produto");
            }
            
            fecharModalExcluir();
            await carregarProdutos(); // Aguardar recarregar lista
        }
    };

    const deletarProduto = (id) => {
        const produto = listaProdutos.find(p => p.id === id);
        if (produto) {
            abrirModalExcluir(produto);
        }
    };

    const limparFiltros = () => {
        setBusca("");
        setFiltroCategoria("");
    };

    const totalProdutos = listaProdutos.length;
    const produtosAtivos = listaProdutos.filter(p => p.quantidade > 0).length;
    const valorEstoque = listaProdutos.reduce((acc, p) => {
        const valor = (parseFloat(p.preco) || 0) * (parseInt(p.quantidade) || 0);
        return acc + valor;
    }, 0);

    return (
        <div className="estoque-moderno">
            {/* Barra de Filtros */}
            <div className="filtros-topo">
                <div className="busca-container">
                    <FaSearch className="icon-busca" />
                    <input
                        type="text"
                        placeholder="Buscar produto por nome..."
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        className="input-busca"
                    />
                </div>

                <div className="filtros-actions">
                    {/* Filtro de categoria removido temporariamente (coluna não existe na tabela)
                    <div className="filtro-categoria">
                        <FaFilter className="icon-filtro" />
                        <select
                            value={filtroCategoria}
                            onChange={(e) => setFiltroCategoria(e.target.value)}
                            className="select-categoria"
                        >
                            <option value="">Todas as Categorias</option>
                            {categorias.map(cat => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.nome}
                                </option>
                            ))}
                        </select>
                    </div>
                    */}

                    <button onClick={limparFiltros} className="btn-limpar">
                        Limpar Filtros
                    </button>

                    <button onClick={() => abrirFormulario()} className="btn-novo-produto">
                        <FaPlus /> Novo Produto
                    </button>
                </div>
            </div>

            {/* Cards de Estatísticas */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon produtos">📦</div>
                    <div className="stat-info">
                        <span className="stat-label">Total de Produtos</span>
                        <span className="stat-value">{totalProdutos}</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon ativos">✅</div>
                    <div className="stat-info">
                        <span className="stat-label">Produtos Ativos</span>
                        <span className="stat-value">{produtosAtivos}</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon valor">💰</div>
                    <div className="stat-info">
                        <span className="stat-label">Valor do Estoque</span>
                        <span className="stat-value">
                            R$ {valorEstoque.toFixed(2)}
                        </span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon filtrados">🔍</div>
                    <div className="stat-info">
                        <span className="stat-label">Filtrados</span>
                        <span className="stat-value">{produtosFiltrados.length}</span>
                    </div>
                </div>
            </div>

            {/* Lista de Produtos */}
            {loading ? (
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Carregando produtos...</p>
                </div>
            ) : produtosFiltrados.length === 0 ? (
                <div className="empty-state">
                    <p>Nenhum produto encontrado</p>
                    <button onClick={() => abrirFormulario()} className="btn-criar-primeiro">
                        <FaPlus /> Criar Primeiro Produto
                    </button>
                </div>
            ) : (
                <section className="produtos-grid">
                    {produtosFiltrados.map((produto) => (
                        <CardEstoque
                            key={produto.id}
                            produto={produto}
                            atualizar={() => carregarProdutos()}
                            editar={() => abrirFormulario(produto)}
                            deletar={() => deletarProduto(produto.id)}
                        />
                    ))}
                </section>
            )}

            {/* Modal de Cadastro/Edição */}
            {mostrarFormulario && (
                <NovoProduto
                    produtoEditando={produtoEditando}
                    fecharModal={fecharFormulario}
                    onSucesso={handleSucesso}
                />
            )}

            {/* Modal de Confirmação de Exclusão */}
            {modalExcluir.show && (
                <div className="modal-overlay-excluir" onClick={fecharModalExcluir}>
                    <div className="modal-excluir" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-excluir-header">
                            <div className="icon-warning">
                                <FaExclamationTriangle />
                            </div>
                            <h2>Confirmar Exclusão</h2>
                        </div>

                        <div className="modal-excluir-body">
                            <p className="texto-principal">
                                Tem certeza que deseja excluir este produto?
                            </p>
                            
                            {modalExcluir.produto && (
                                <div className="produto-info-modal">
                                    <img 
                                        src={modalExcluir.produto.caminhoImagem 
                                            ? `http://localhost:5000/storage/${modalExcluir.produto.caminhoImagem}` 
                                            : '/imgs/placeholder.png'
                                        } 
                                        alt={modalExcluir.produto.nome}
                                        onError={(e) => { e.target.src = '/imgs/placeholder.png'; }}
                                    />
                                    <div className="info-texto">
                                        <strong>{modalExcluir.produto.nome}</strong>
                                        <span className="descricao-mini">
                                            {modalExcluir.produto.descricao || 'Sem descrição'}
                                        </span>
                                        <div className="detalhes-mini">
                                            <span>Quantidade: {modalExcluir.produto.quantidade} un</span>
                                            <span>Preço: R$ {parseFloat(modalExcluir.produto.preco || 0).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <p className="texto-aviso">
                                ⚠️ Esta ação não pode ser desfeita!
                            </p>
                        </div>

                        <div className="modal-excluir-footer">
                            <button 
                                className="btn-cancelar-exclusao" 
                                onClick={fecharModalExcluir}
                            >
                                Cancelar
                            </button>
                            <button 
                                className="btn-confirmar-exclusao" 
                                onClick={confirmarExclusao}
                            >
                                Sim, Excluir
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Estoque;
