import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import Header from '../../components/header';
import './index.scss';

export default function PersonalizacaoAdmin() {
    const [opcoes, setOpcoes] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editando, setEditando] = useState(null);
    const [novaOpcao, setNovaOpcao] = useState({
        nome_opcao: '',
        descricao: '',
        tipo_selecao: 'radio',
        obrigatorio: false
    });

    useEffect(() => {
        carregarDados();
    }, []);

    async function carregarDados() {
        try {
            setLoading(true);
            const [opcoesResp, produtosResp] = await Promise.all([
                axios.get('http://localhost:5000/personalizacao/opcoes/completas'),
                axios.get('http://localhost:5000/produto/listar')
            ]);
            setOpcoes(opcoesResp.data);
            setProdutos(produtosResp.data);
        } catch (error) {
            toast.error('Erro ao carregar dados');
        } finally {
            setLoading(false);
        }
    }

    async function criarOpcao() {
        if (!novaOpcao.nome_opcao) {
            toast.warning('Nome da opção é obrigatório');
            return;
        }

        try {
            await axios.post('http://localhost:5000/personalizacao/opcoes', novaOpcao);
            toast.success('Opção criada com sucesso!');
            setNovaOpcao({ nome_opcao: '', descricao: '', tipo_selecao: 'radio', obrigatorio: false });
            carregarDados();
        } catch (error) {
            toast.error(error.response?.data?.erro || 'Erro ao criar opção');
        }
    }

    async function deletarOpcao(id) {
        if (!window.confirm('Deseja realmente deletar esta opção?')) return;

        try {
            await axios.delete(`http://localhost:5000/personalizacao/opcoes/${id}`);
            toast.success('Opção deletada!');
            carregarDados();
        } catch (error) {
            toast.error('Erro ao deletar opção');
        }
    }

    async function adicionarValor(idopcao) {
        const nome = prompt('Nome do valor:');
        if (!nome) return;

        const precoStr = prompt('Preço adicional (ex: 5.50):');
        const preco = parseFloat(precoStr) || 0;

        try {
            await axios.post(`http://localhost:5000/personalizacao/opcoes/${idopcao}/valores`, {
                nome_valor: nome,
                preco_adicional: preco
            });
            toast.success('Valor adicionado!');
            carregarDados();
        } catch (error) {
            toast.error('Erro ao adicionar valor');
        }
    }

    async function associarProduto(idopcao) {
        const idproduto = prompt('ID do Produto:');
        if (!idproduto) return;

        const obrigatorio = window.confirm('Esta opção será obrigatória para este produto?');

        try {
            await axios.post(`http://localhost:5000/personalizacao/produtos/${idproduto}/opcoes`, {
                idopcao,
                obrigatorio
            });
            toast.success('Opção associada ao produto!');
        } catch (error) {
            toast.error(error.response?.data?.erro || 'Erro ao associar');
        }
    }

    if (loading) {
        return (
            <div className="personalizacao-admin">
                <Header />
                <div className="loading">Carregando...</div>
            </div>
        );
    }

    return (
        <div className="personalizacao-admin">
            <Header />
            
            <div className="admin-container">
                <h1>Gerenciar Personalizações</h1>

                {/* Criar Nova Opção */}
                <div className="criar-opcao-card">
                    <h2>Nova Opção de Personalização</h2>
                    <div className="form-grid">
                        <input
                            type="text"
                            placeholder="Nome da opção (ex: Recheio)"
                            value={novaOpcao.nome_opcao}
                            onChange={(e) => setNovaOpcao({...novaOpcao, nome_opcao: e.target.value})}
                        />
                        <input
                            type="text"
                            placeholder="Descrição (opcional)"
                            value={novaOpcao.descricao}
                            onChange={(e) => setNovaOpcao({...novaOpcao, descricao: e.target.value})}
                        />
                        <select
                            value={novaOpcao.tipo_selecao}
                            onChange={(e) => setNovaOpcao({...novaOpcao, tipo_selecao: e.target.value})}
                        >
                            <option value="radio">Seleção Única (Radio)</option>
                            <option value="checkbox">Múltipla Seleção (Checkbox)</option>
                            <option value="select">Dropdown (Select)</option>
                        </select>
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={novaOpcao.obrigatorio}
                                onChange={(e) => setNovaOpcao({...novaOpcao, obrigatorio: e.target.checked})}
                            />
                            Obrigatório
                        </label>
                    </div>
                    <button className="btn-criar" onClick={criarOpcao}>
                        <FaPlus /> Criar Opção
                    </button>
                </div>

                {/* Lista de Opções */}
                <div className="opcoes-lista">
                    {opcoes.map(opcao => (
                        <div key={opcao.idopcao} className="opcao-card">
                            <div className="opcao-header">
                                <div>
                                    <h3>{opcao.nome_opcao}</h3>
                                    <span className="tipo-badge">{opcao.tipo_selecao}</span>
                                    {opcao.obrigatorio && <span className="obrigatorio-badge">Obrigatório</span>}
                                </div>
                                <div className="opcao-actions">
                                    <button onClick={() => adicionarValor(opcao.idopcao)} title="Adicionar valor">
                                        <FaPlus /> Valor
                                    </button>
                                    <button onClick={() => associarProduto(opcao.idopcao)} title="Associar produto">
                                        <FaEdit /> Produto
                                    </button>
                                    <button onClick={() => deletarOpcao(opcao.idopcao)} className="btn-delete">
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>

                            {opcao.descricao && (
                                <p className="opcao-descricao">{opcao.descricao}</p>
                            )}

                            {/* Valores */}
                            <div className="valores-lista">
                                {opcao.valores && opcao.valores.map(valor => (
                                    <div key={valor.idvalor} className="valor-item">
                                        <span className="valor-nome">{valor.nome_valor}</span>
                                        <span className="valor-preco">
                                            {valor.preco_adicional > 0 
                                                ? `+R$ ${valor.preco_adicional.toFixed(2)}` 
                                                : 'Grátis'}
                                        </span>
                                    </div>
                                ))}
                                {(!opcao.valores || opcao.valores.length === 0) && (
                                    <p className="sem-valores">Nenhum valor cadastrado</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {opcoes.length === 0 && (
                    <div className="vazio">
                        <p>Nenhuma opção de personalização cadastrada.</p>
                        <p>Crie a primeira opção acima!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
