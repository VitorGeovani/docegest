import React, { useState, useEffect } from 'react';
import './index.scss';
import axios from 'axios';

const API_URL = 'http://localhost:5000';

function CustosReceitas() {
    const [produtos, setProdutos] = useState([]);
    const [ingredientes, setIngredientes] = useState([]);
    const [listaCompras, setListaCompras] = useState([]);
    const [carregando, setCarregando] = useState(false);

    useEffect(() => {
        carregarDados();
    }, []);

    const carregarDados = async () => {
        try {
            setCarregando(true);
            
            // Carregar análise de custos de produtos
            const resProdutos = await axios.get(`${API_URL}/produto/analise/custos`);
            console.log('Análise de custos recebida:', resProdutos.data);
            const produtosArray = Array.isArray(resProdutos.data) ? resProdutos.data : [];
            setProdutos(produtosArray);
            
            // Carregar ingredientes com estoque baixo
            const resIngredientes = await axios.get(`${API_URL}/ingrediente/estoque/baixo`);
            console.log('Ingredientes baixo estoque:', resIngredientes.data);
            const ingredientesArray = Array.isArray(resIngredientes.data) ? resIngredientes.data : [];
            setIngredientes(ingredientesArray);
            
            // Carregar lista de compras
            const resCompras = await axios.get(`${API_URL}/ingrediente/lista-compras`);
            console.log('Lista de compras:', resCompras.data);
            const comprasArray = Array.isArray(resCompras.data) ? resCompras.data : [];
            setListaCompras(comprasArray);
            
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        } finally {
            setCarregando(false);
        }
    };

    const calcularTotalCompras = () => {
        return listaCompras.reduce((total, item) => {
            return total + parseFloat(item.valor_estimado || 0);
        }, 0);
    };

    return (
        <div className="custos-receitas-container">
            <h1>💰 Custos e Receitas</h1>

            {carregando ? (
                <div className="carregando">Carregando...</div>
            ) : (
                <>
                    {/* Alertas de Estoque */}
                    {ingredientes.length > 0 && (
                        <div className="alerta-section">
                            <h2>🚨 Alertas de Estoque Baixo ({ingredientes.length})</h2>
                            <div className="alertas-grid">
                                {ingredientes.map((ing) => (
                                    <div key={ing.idingrediente} className="alerta-card">
                                        <h3>{ing.nome}</h3>
                                        <p>
                                            <strong>Estoque Atual:</strong> {parseFloat(ing.quantidade_estoque || 0)} {ing.unidade_medida}
                                        </p>
                                        <p>
                                            <strong>Estoque Mínimo:</strong> {parseFloat(ing.estoque_minimo || 0)} {ing.unidade_medida}
                                        </p>
                                        <p className="faltando">
                                            <strong>Faltando:</strong> {parseFloat(ing.quantidade_necessaria || 0)} {ing.unidade_medida}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Lista de Compras */}
                    {listaCompras.length > 0 && (
                        <div className="compras-section">
                            <h2>🛒 Lista de Compras Sugerida</h2>
                            <div className="compras-table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Ingrediente</th>
                                            <th>Fornecedor</th>
                                            <th>Quantidade</th>
                                            <th>Preço Unit.</th>
                                            <th>Valor Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listaCompras.map((item) => (
                                            <tr key={item.idingrediente}>
                                                <td>{item.nome}</td>
                                                <td>{item.fornecedor || '-'}</td>
                                                <td>
                                                    {parseFloat(item.quantidade_comprar || 0).toFixed(3)} {item.unidade_medida}
                                                </td>
                                                <td>R$ {parseFloat(item.preco_unitario || 0).toFixed(2)}</td>
                                                <td className="valor">R$ {parseFloat(item.valor_estimado || 0).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td colSpan="4"><strong>Total Estimado:</strong></td>
                                            <td className="valor-total">
                                                <strong>R$ {calcularTotalCompras().toFixed(2)}</strong>
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Análise de Produtos */}
                    <div className="produtos-section">
                        <h2>📊 Análise de Custos por Produto</h2>
                        {produtos.length > 0 ? (
                            <div className="produtos-grid">
                                {produtos.map((produto) => {
                                    const custo = parseFloat(produto.custo_producao || 0);
                                    const preco = parseFloat(produto.preco || 0);
                                    const lucro = parseFloat(produto.lucro || 0);
                                    const margem = parseFloat(produto.margem_percentual || 0);
                                    const temReceita = parseInt(produto.tem_receita || 0) === 1;
                                    
                                    return (
                                        <div key={produto.idproduto} className={`produto-card ${!temReceita ? 'sem-receita' : ''}`}>
                                            <h3>{produto.nome}</h3>
                                            
                                            {!temReceita && (
                                                <div className="aviso-receita">
                                                    ⚠️ Cadastre a receita deste produto na aba Ingredientes
                                                </div>
                                            )}
                                            
                                            <div className="produto-valores">
                                                <div className="valor-item">
                                                    <span className="label">💵 Preço de Venda:</span>
                                                    <span className="valor preco">R$ {preco.toFixed(2)}</span>
                                                </div>
                                                
                                                <div className="valor-item">
                                                    <span className="label">🏭 Custo de Produção:</span>
                                                    <span className="valor custo">
                                                        {temReceita ? `R$ ${custo.toFixed(2)}` : '---'}
                                                    </span>
                                                </div>
                                                
                                                <div className="valor-item">
                                                    <span className="label">💰 Lucro Unitário:</span>
                                                    <span className={`valor lucro ${lucro > 0 ? 'positivo' : 'negativo'}`}>
                                                        {temReceita ? `R$ ${lucro.toFixed(2)}` : '---'}
                                                    </span>
                                                </div>
                                                
                                                <div className="valor-item">
                                                    <span className="label">📊 Margem de Lucro:</span>
                                                    <span className={`valor margem ${margem >= 50 ? 'boa' : margem >= 20 ? 'media' : 'baixa'}`}>
                                                        {temReceita ? `${margem.toFixed(1)}%` : '---'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <p>📝 Nenhum produto cadastrado no sistema.</p>
                                <p>Cadastre produtos para visualizar a análise de custos.</p>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

export default CustosReceitas;
