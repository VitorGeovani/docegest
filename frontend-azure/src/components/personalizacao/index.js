import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.scss';

export default function PersonalizacaoProduto({ produto, onConfirmar, onCancelar }) {
    const [opcoes, setOpcoes] = useState([]);
    const [personalizacoes, setPersonalizacoes] = useState({});
    const [valorAcrescimo, setValorAcrescimo] = useState(0);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState('');
    const [validando, setValidando] = useState(false);

    const idProduto = produto.idproduto || produto.id;

    useEffect(() => {
        carregarOpcoes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idProduto]);

    useEffect(() => {
        if (Object.keys(personalizacoes).length > 0) {
            calcularAcrescimo();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [personalizacoes]);

    async function carregarOpcoes() {
        try {
            setLoading(true);
            const resp = await axios.get(`http://localhost:5000/personalizacao/produtos/${idProduto}/opcoes`);
            setOpcoes(resp.data);
        } catch (error) {
            console.error('Erro ao carregar opções:', error);
            setErro('Erro ao carregar opções de personalização');
        } finally {
            setLoading(false);
        }
    }

    async function calcularAcrescimo() {
        try {
            const personalizacoesArray = Object.entries(personalizacoes)
                .filter(([_, valor]) => valor !== null && valor !== undefined)
                .map(([idopcao, valor]) => {
                    if (Array.isArray(valor)) {
                        return valor.map(idvalor => ({ idopcao: parseInt(idopcao), idvalor }));
                    }
                    return { idopcao: parseInt(idopcao), idvalor: valor };
                })
                .flat();

            if (personalizacoesArray.length === 0) {
                setValorAcrescimo(0);
                return;
            }

            const resp = await axios.post('http://localhost:5000/personalizacao/calcular-acrescimo', {
                personalizacoes: personalizacoesArray
            });

            setValorAcrescimo(resp.data.valor_acrescimo);
        } catch (error) {
            console.error('Erro ao calcular acréscimo:', error.response?.data || error.message);
            setErro('Erro ao calcular acréscimo: ' + (error.response?.data?.erro || error.message));
        }
    }

    async function validarEConfirmar() {
        try {
            setValidando(true);
            setErro('');

            const personalizacoesArray = Object.entries(personalizacoes)
                .filter(([_, valor]) => valor !== null && valor !== undefined)
                .map(([idopcao, valor]) => {
                    if (Array.isArray(valor)) {
                        return valor.map(idvalor => ({ idopcao: parseInt(idopcao), idvalor }));
                    }
                    return { idopcao: parseInt(idopcao), idvalor: valor };
                })
                .flat();

            // Enriquecer personalizações com nomes
            const personalizacoesCompletas = personalizacoesArray.map(p => {
                const opcao = opcoes.find(o => o.idopcao === p.idopcao);
                const valor = opcao?.valores.find(v => v.idvalor === p.idvalor);
                
                return {
                    ...p,
                    nome_opcao: opcao?.nome || 'Opção',
                    nome_valor: valor?.nome || 'Valor',
                    preco: valor?.preco || 0
                };
            });

            onConfirmar(personalizacoesCompletas, valorAcrescimo);

        } catch (error) {
            setErro(error.response?.data?.erro || 'Erro ao validar personalizações');
        } finally {
            setValidando(false);
        }
    }

    function handleSelecaoRadio(idopcao, idvalor) {
        setPersonalizacoes(prev => ({
            ...prev,
            [idopcao]: idvalor
        }));
    }

    function handleSelecaoCheckbox(idopcao, idvalor) {
        setPersonalizacoes(prev => {
            const atual = prev[idopcao] || [];
            const jaExiste = atual.includes(idvalor);

            if (jaExiste) {
                return {
                    ...prev,
                    [idopcao]: atual.filter(v => v !== idvalor)
                };
            } else {
                return {
                    ...prev,
                    [idopcao]: [...atual, idvalor]
                };
            }
        });
    }

    function renderOpcao(opcao) {
        const valorSelecionado = personalizacoes[opcao.idopcao];

        if (opcao.tipo === 'radio') {
            return (
                <div key={opcao.idopcao} className="opcao-personalizacao">
                    <div className="opcao-header">
                        <h4>{opcao.nome}</h4>
                        {opcao.obrigatorio && <span className="obrigatorio">*</span>}
                    </div>
                    {opcao.descricao && <p className="opcao-descricao">{opcao.descricao}</p>}
                    
                    <div className="valores-lista">
                        {opcao.valores.map(valor => (
                            <label key={valor.idvalor} className="valor-item radio">
                                <input
                                    type="radio"
                                    name={`opcao_${opcao.idopcao}`}
                                    checked={valorSelecionado === valor.idvalor}
                                    onChange={() => handleSelecaoRadio(opcao.idopcao, valor.idvalor)}
                                />
                                <span className="valor-nome">{valor.nome}</span>
                                {valor.preco > 0 && (
                                    <span className="valor-preco">
                                        + R$ {valor.preco.toFixed(2)}
                                    </span>
                                )}
                            </label>
                        ))}
                    </div>
                </div>
            );
        }

        if (opcao.tipo === 'checkbox') {
            return (
                <div key={opcao.idopcao} className="opcao-personalizacao">
                    <div className="opcao-header">
                        <h4>{opcao.nome}</h4>
                        {opcao.obrigatorio && <span className="obrigatorio">*</span>}
                    </div>
                    {opcao.descricao && <p className="opcao-descricao">{opcao.descricao}</p>}
                    
                    <div className="valores-lista">
                        {opcao.valores.map(valor => {
                            const checked = Array.isArray(valorSelecionado) && 
                                          valorSelecionado.includes(valor.idvalor);
                            
                            return (
                                <label key={valor.idvalor} className="valor-item checkbox">
                                    <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={() => handleSelecaoCheckbox(opcao.idopcao, valor.idvalor)}
                                    />
                                    <span className="valor-nome">{valor.nome}</span>
                                    {valor.preco > 0 && (
                                        <span className="valor-preco">
                                            + R$ {valor.preco.toFixed(2)}
                                        </span>
                                    )}
                                </label>
                            );
                        })}
                    </div>
                </div>
            );
        }

        if (opcao.tipo === 'select') {
            return (
                <div key={opcao.idopcao} className="opcao-personalizacao">
                    <div className="opcao-header">
                        <label htmlFor={`select_${opcao.idopcao}`}>
                            {opcao.nome}
                        </label>
                        {opcao.obrigatorio && <span className="obrigatorio">*</span>}
                    </div>
                    {opcao.descricao && <p className="opcao-descricao">{opcao.descricao}</p>}
                    
                    <select
                        id={`select_${opcao.idopcao}`}
                        className="valor-select"
                        value={valorSelecionado || ''}
                        onChange={(e) => handleSelecaoRadio(opcao.idopcao, parseInt(e.target.value))}
                    >
                        <option value="">Selecione...</option>
                        {opcao.valores.map(valor => (
                            <option key={valor.idvalor} value={valor.idvalor}>
                                {valor.nome}
                                {valor.preco > 0 && ` (+R$ ${valor.preco.toFixed(2)})`}
                            </option>
                        ))}
                    </select>
                </div>
            );
        }

        return null;
    }

    if (loading) {
        return (
            <div className="personalizacao-produto">
                <div className="personalizacao-loading">
                    <div className="spinner"></div>
                    <p>Carregando opções...</p>
                </div>
            </div>
        );
    }

    if (opcoes.length === 0) {
        return null;
    }

    const precoBase = produto.preco || produto.valor || 0;
    const valorTotal = precoBase + valorAcrescimo;

    return (
        <div className="personalizacao-produto" onClick={onCancelar}>
            <div className="personalizacao-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="personalizacao-header">
                    <h3>Personalize seu {produto.nome}</h3>
                    <button className="btn-fechar" onClick={onCancelar}>×</button>
                </div>

                <div className="personalizacao-content">
                    {erro && (
                        <div className="personalizacao-erro">
                            {erro}
                        </div>
                    )}

                    <div className="opcoes-container">
                        {opcoes.map(opcao => renderOpcao(opcao))}
                    </div>

                    <div className="personalizacao-resumo">
                        <div className="resumo-linha">
                            <span>Valor Base:</span>
                            <span>R$ {precoBase.toFixed(2)}</span>
                        </div>
                        {valorAcrescimo > 0 && (
                            <div className="resumo-linha acrescimo">
                                <span>Personalizações:</span>
                                <span>+ R$ {valorAcrescimo.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="resumo-linha total">
                            <span>TOTAL:</span>
                            <span>R$ {valorTotal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <div className="personalizacao-footer">
                    <button 
                        className="btn-cancelar" 
                        onClick={onCancelar}
                        disabled={validando}
                    >
                        Cancelar
                    </button>
                    <button 
                        className="btn-confirmar" 
                        onClick={validarEConfirmar}
                        disabled={validando}
                    >
                        {validando ? 'Validando...' : 'Confirmar Personalização'}
                    </button>
                </div>
            </div>
        </div>
    );
}
