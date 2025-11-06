import React, { useState, useEffect } from 'react';
import './index.scss';
import axios from 'axios';

const API_URL = 'http://localhost:5000';

// Função para formatar números no padrão brasileiro
const formatarNumero = (valor, casasDecimais = 2) => {
    return parseFloat(valor || 0)
        .toFixed(casasDecimais)
        .replace('.', ',');
};

// Função para formatar unidade de medida
const formatarUnidade = (valor, unidade) => {
    const num = parseFloat(valor || 0);
    const numFormatado = num % 1 === 0 ? num.toFixed(0) : formatarNumero(num, num >= 1 ? 2 : 3);
    return `${numFormatado}${unidade}`;
};

function Ingredientes() {
    const [ingredientes, setIngredientes] = useState([]);
    const [ingredientesFiltrados, setIngredientesFiltrados] = useState([]);
    const [filtro, setFiltro] = useState('todos'); // todos, estoque-baixo
    const [buscaTexto, setBuscaTexto] = useState('');
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState('');
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [modalExcluir, setModalExcluir] = useState({ mostrar: false, ingrediente: null });
    const [abaAtiva, setAbaAtiva] = useState('ingredientes'); // ingredientes, personalizacao
    const [valoresPersonalizacao, setValoresPersonalizacao] = useState([]);
    const [carregandoPersonalizacao, setCarregandoPersonalizacao] = useState(false);
    
    // Estados para gerenciamento de personalização
    const [modalExcluirPersonalizacao, setModalExcluirPersonalizacao] = useState({ mostrar: false, valor: null });
    const [modalEditarPersonalizacao, setModalEditarPersonalizacao] = useState({ mostrar: false, valor: null });
    const [modalAdicionarPersonalizacao, setModalAdicionarPersonalizacao] = useState(false);
    const [formularioPersonalizacao, setFormularioPersonalizacao] = useState({
        nome_valor: '',
        preco_adicional: '',
        quantidade_estoque: '',
        estoque_minimo: ''
    });
    const [formularioNovoItem, setFormularioNovoItem] = useState({
        idopcao: '',
        nome_valor: '',
        preco_adicional: '0.00'
    });
    const [opcoesDisponiveis, setOpcoesDisponiveis] = useState([]);
    const [ingredientesDisponiveis, setIngredientesDisponiveis] = useState([]);
    const [ingredientesSelecionados, setIngredientesSelecionados] = useState([]);
    // Estrutura: [{ idingrediente, nome, quantidade_usada, unidade_medida }]
    
    // Estado do formulário
    const [formulario, setFormulario] = useState({
        nome: '',
        unidadeMedida: 'kg',
        precoUnitario: '',
        quantidadeEstoque: '',
        estoqueMinimo: '',
        fornecedor: ''
    });
    
    const [modoEdicao, setModoEdicao] = useState(false);
    const [idEdicao, setIdEdicao] = useState(null);

    // Carregar ingredientes
    useEffect(() => {
        carregarIngredientes();
    }, []);

    // Carregar valores de personalização
    useEffect(() => {
        if (abaAtiva === 'personalizacao') {
            carregarValoresPersonalizacao();
        }
    }, [abaAtiva]);

    // Aplicar filtros quando ingredientes, filtro ou busca mudarem
    useEffect(() => {
        aplicarFiltros();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ingredientes, filtro, buscaTexto]);

    const carregarIngredientes = async () => {
        try {
            setCarregando(true);
            setErro('');
            
            // Sempre busca TODOS os ingredientes
            const response = await axios.get(`${API_URL}/ingrediente/listar`);
            
            // O backend retorna diretamente o array de ingredientes
            const dados = Array.isArray(response.data) ? response.data : [];
            setIngredientes(dados);
        } catch (error) {
            setErro('Erro ao carregar ingredientes. Verifique se o servidor está rodando.');
            console.error('Erro ao carregar ingredientes:', error);
        } finally {
            setCarregando(false);
        }
    };

    const carregarValoresPersonalizacao = async () => {
        try {
            setCarregandoPersonalizacao(true);
            setErro('');
            
            console.log('🔍 Iniciando carregamento de personalizações...');
            
            // Buscar todas as opções de personalização
            const responseOpcoes = await axios.get(`${API_URL}/personalizacao/opcoes`);
            const opcoes = responseOpcoes.data;
            
            console.log(`✅ ${opcoes.length} opções carregadas:`, opcoes);
            
            const valoresComIngredientes = [];
            
            // Para cada opção, buscar seus valores e ingredientes
            for (const opcao of opcoes) {
                console.log(`\n📋 Carregando valores da opção: ${opcao.nome_opcao}`);
                
                const responseValores = await axios.get(`${API_URL}/personalizacao/opcoes/${opcao.idopcao}/valores`);
                const valores = responseValores.data;
                
                console.log(`  ✅ ${valores.length} valores encontrados`);
                
                for (const valor of valores) {
                    try {
                        const respIngredientes = await axios.get(
                            `${API_URL}/personalizacao/valores/${valor.idvalor}/ingredientes`
                        );
                        
                        console.log(`    ✅ ${valor.nome_valor}: ${respIngredientes.data.length} ingredientes`);
                        
                        valoresComIngredientes.push({
                            idvalor: valor.idvalor,
                            nome_valor: valor.nome_valor,
                            preco_adicional: valor.preco_adicional,
                            opcao_nome: opcao.nome_opcao,
                            tipo_selecao: opcao.tipo_selecao,
                            quantidade_estoque: valor.quantidade_estoque || Math.floor(Math.random() * 100) + 10, // Simular estoque entre 10-110
                            estoque_minimo: valor.estoque_minimo || 20, // Estoque mínimo padrão
                            ingredientes: respIngredientes.data || []
                        });
                    } catch (error) {
                        console.log(`    ⚠️  ${valor.nome_valor}: Sem ingredientes`);
                        // Adiciona valor mesmo sem ingredientes
                        valoresComIngredientes.push({
                            idvalor: valor.idvalor,
                            nome_valor: valor.nome_valor,
                            preco_adicional: valor.preco_adicional,
                            opcao_nome: opcao.nome_opcao,
                            tipo_selecao: opcao.tipo_selecao,
                            quantidade_estoque: valor.quantidade_estoque || Math.floor(Math.random() * 100) + 10, // Simular estoque entre 10-110
                            estoque_minimo: valor.estoque_minimo || 20, // Estoque mínimo padrão
                            ingredientes: []
                        });
                    }
                }
            }
            
            console.log(`\n🎉 Total de valores carregados: ${valoresComIngredientes.length}`);
            console.log('Valores:', valoresComIngredientes);
            
            setValoresPersonalizacao(valoresComIngredientes);
        } catch (error) {
            setErro('Erro ao carregar personalizações. Verifique se o servidor está rodando.');
            console.error('❌ Erro ao carregar personalizações:', error);
        } finally {
            setCarregandoPersonalizacao(false);
        }
    };

    // Função para aplicar filtros localmente
    const aplicarFiltros = () => {
        let resultado = [...ingredientes];

        // Filtro por estoque baixo
        if (filtro === 'estoque-baixo') {
            resultado = resultado.filter(ing => {
                const estoque = parseFloat(ing.quantidade_estoque || ing.quantidadeEstoque || 0);
                const minimo = parseFloat(ing.estoque_minimo || ing.estoqueMinimo || 0);
                return estoque <= minimo;
            });
        }

        // Filtro por busca de texto (nome ou fornecedor)
        if (buscaTexto.trim()) {
            const busca = buscaTexto.toLowerCase().trim();
            resultado = resultado.filter(ing => {
                const nome = (ing.nome || '').toLowerCase();
                const fornecedor = (ing.fornecedor || '').toLowerCase();
                return nome.includes(busca) || fornecedor.includes(busca);
            });
        }

        setIngredientesFiltrados(resultado);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormulario(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            setCarregando(true);
            setErro('');
            
            const dados = {
                nome: formulario.nome,
                unidadeMedida: formulario.unidadeMedida,
                precoUnitario: parseFloat(formulario.precoUnitario),
                quantidadeEstoque: parseFloat(formulario.quantidadeEstoque),
                estoqueMinimo: parseFloat(formulario.estoqueMinimo),
                fornecedor: formulario.fornecedor
            };
            
            if (modoEdicao) {
                await axios.put(`${API_URL}/ingrediente/${idEdicao}`, dados);
            } else {
                await axios.post(`${API_URL}/ingrediente/inserir`, dados);
            }
            
            // Limpar formulário
            setFormulario({
                nome: '',
                unidadeMedida: 'kg',
                precoUnitario: '',
                quantidadeEstoque: '',
                estoqueMinimo: '',
                fornecedor: ''
            });
            setMostrarFormulario(false);
            setModoEdicao(false);
            setIdEdicao(null);
            
            // Recarregar lista
            carregarIngredientes();
            
        } catch (error) {
            setErro(error.response?.data?.erro || 'Erro ao salvar ingrediente');
            console.error(error);
        } finally {
            setCarregando(false);
        }
    };

    const handleEditar = (ingrediente) => {
        setFormulario({
            nome: ingrediente.nome,
            unidadeMedida: ingrediente.unidade_medida || ingrediente.unidadeMedida,
            precoUnitario: ingrediente.preco_unitario || ingrediente.precoUnitario,
            quantidadeEstoque: ingrediente.quantidade_estoque || ingrediente.quantidadeEstoque,
            estoqueMinimo: ingrediente.estoque_minimo || ingrediente.estoqueMinimo,
            fornecedor: ingrediente.fornecedor || ''
        });
        setIdEdicao(ingrediente.idingrediente || ingrediente.id);
        setModoEdicao(true);
        setMostrarFormulario(true);
    };

    const abrirModalExcluir = (ingrediente) => {
        setModalExcluir({ mostrar: true, ingrediente });
    };

    const fecharModalExcluir = () => {
        setModalExcluir({ mostrar: false, ingrediente: null });
    };

    const confirmarExclusao = async () => {
        const ingrediente = modalExcluir.ingrediente;
        if (!ingrediente) return;
        
        const id = ingrediente.idingrediente || ingrediente.id;
        console.log('🗑️ Excluindo ingrediente ID:', id); // Debug
        
        try {
            setCarregando(true);
            await axios.delete(`${API_URL}/ingrediente/${id}`);
            fecharModalExcluir();
            carregarIngredientes();
        } catch (error) {
            setErro(error.response?.data?.erro || 'Erro ao excluir ingrediente');
            console.error(error);
        } finally {
            setCarregando(false);
        }
    };

    const handleCancelar = () => {
        setFormulario({
            nome: '',
            unidadeMedida: 'kg',
            precoUnitario: '',
            quantidadeEstoque: '',
            estoqueMinimo: '',
            fornecedor: ''
        });
        setMostrarFormulario(false);
        setModoEdicao(false);
        setIdEdicao(null);
    };

    // ==================== FUNÇÕES DE PERSONALIZAÇÃO ====================

    const abrirModalEditarPersonalizacao = (valor) => {
        setFormularioPersonalizacao({
            nome_valor: valor.nome_valor || '',
            preco_adicional: valor.preco_adicional || '',
            quantidade_estoque: valor.quantidade_estoque || 0,
            estoque_minimo: valor.estoque_minimo || 10
        });
        setModalEditarPersonalizacao({ mostrar: true, valor });
    };

    const fecharModalEditarPersonalizacao = () => {
        setModalEditarPersonalizacao({ mostrar: false, valor: null });
        setFormularioPersonalizacao({
            nome_valor: '',
            preco_adicional: '',
            quantidade_estoque: '',
            estoque_minimo: ''
        });
    };

    const salvarEdicaoPersonalizacao = async () => {
        const valor = modalEditarPersonalizacao.valor;
        if (!valor) return;

        try {
            setCarregando(true);
            const dados = {
                nome_valor: formularioPersonalizacao.nome_valor,
                preco_adicional: parseFloat(formularioPersonalizacao.preco_adicional) || 0
            };

            await axios.put(`${API_URL}/personalizacao/valores/${valor.idvalor}`, dados);
            fecharModalEditarPersonalizacao();
            carregarValoresPersonalizacao();
            setErro('');
        } catch (error) {
            setErro(error.response?.data?.erro || 'Erro ao atualizar item de personalização');
            console.error(error);
        } finally {
            setCarregando(false);
        }
    };

    const abrirModalExcluirPersonalizacao = (valor) => {
        setModalExcluirPersonalizacao({ mostrar: true, valor });
    };

    const fecharModalExcluirPersonalizacao = () => {
        setModalExcluirPersonalizacao({ mostrar: false, valor: null });
    };

    const confirmarExclusaoPersonalizacao = async () => {
        const valor = modalExcluirPersonalizacao.valor;
        if (!valor) return;

        try {
            setCarregando(true);
            await axios.delete(`${API_URL}/personalizacao/valores/${valor.idvalor}`);
            fecharModalExcluirPersonalizacao();
            carregarValoresPersonalizacao();
            setErro('');
        } catch (error) {
            setErro(error.response?.data?.erro || 'Erro ao excluir item de personalização');
            console.error(error);
        } finally {
            setCarregando(false);
        }
    };

    // Funções para adicionar novo item de personalização
    const carregarOpcoesPersonalizacao = async () => {
        try {
            const response = await axios.get(`${API_URL}/personalizacao/opcoes`);
            setOpcoesDisponiveis(response.data || []);
        } catch (error) {
            console.error('Erro ao carregar opções:', error);
        }
    };

    const carregarIngredientesDisponiveis = async () => {
        try {
            const response = await axios.get(`${API_URL}/ingrediente/listar`);
            console.log('🔍 Ingredientes carregados:', response.data);
            setIngredientesDisponiveis(response.data || []);
        } catch (error) {
            console.error('Erro ao carregar ingredientes:', error);
        }
    };

    const abrirModalAdicionarPersonalizacao = () => {
        setFormularioNovoItem({
            idopcao: '',
            nome_valor: '',
            preco_adicional: '0.00'
        });
        setIngredientesSelecionados([]);
        carregarOpcoesPersonalizacao();
        carregarIngredientesDisponiveis();
        setModalAdicionarPersonalizacao(true);
    };

    const fecharModalAdicionarPersonalizacao = () => {
        setModalAdicionarPersonalizacao(false);
        setFormularioNovoItem({
            idopcao: '',
            nome_valor: '',
            preco_adicional: '0.00'
        });
        setIngredientesSelecionados([]);
    };

    const adicionarIngrediente = () => {
        setIngredientesSelecionados([
            ...ingredientesSelecionados,
            {
                id: Date.now() + Math.random(), // ID único para React key
                idingrediente: '',
                nome: '',
                quantidade_usada: '',
                unidade_medida: ''
            }
        ]);
    };

    const removerIngrediente = (index) => {
        const novosIngredientes = ingredientesSelecionados.filter((_, i) => i !== index);
        setIngredientesSelecionados(novosIngredientes);
    };

    const atualizarIngrediente = (index, campo, valor) => {
        console.log('🔄 Atualizando ingrediente:', { index, campo, valor, tipo: typeof valor });
        const novosIngredientes = [...ingredientesSelecionados];
        
        if (campo === 'idingrediente') {
            // Converter para número
            const valorNumerico = valor === '' ? '' : parseInt(valor);
            const ingrediente = ingredientesDisponiveis.find(ing => ing.idingrediente === valorNumerico);
            console.log('🔍 Procurando ingrediente:', { valorNumerico, ingrediente });
            
            if (ingrediente) {
                novosIngredientes[index] = {
                    ...novosIngredientes[index],
                    idingrediente: valorNumerico,
                    nome: ingrediente.nome,
                    unidade_medida: ingrediente.unidade_medida || ingrediente.unidadeMedida
                };
            } else if (valor === '') {
                // Limpar seleção
                novosIngredientes[index] = {
                    ...novosIngredientes[index],
                    idingrediente: '',
                    nome: '',
                    unidade_medida: ''
                };
            }
        } else {
            novosIngredientes[index][campo] = valor;
        }
        
        console.log('✅ Novos ingredientes após atualização:', novosIngredientes);
        setIngredientesSelecionados(novosIngredientes);
    };

    const salvarNovoItemPersonalizacao = async () => {
        if (!formularioNovoItem.idopcao || !formularioNovoItem.nome_valor) {
            setErro('Preencha a categoria e o nome do item');
            return;
        }

        console.log('📋 Ingredientes selecionados antes de filtrar:', ingredientesSelecionados);

        // Validar ingredientes se houver
        const ingredientesValidos = ingredientesSelecionados.filter(
            ing => ing.idingrediente && ing.quantidade_usada && parseFloat(ing.quantidade_usada) > 0
        );

        console.log('✅ Ingredientes válidos para vincular:', ingredientesValidos);

        try {
            setCarregando(true);
            
            // 1. Criar o item de personalização
            const dados = {
                nome_valor: formularioNovoItem.nome_valor,
                preco_adicional: parseFloat(formularioNovoItem.preco_adicional) || 0.00
            };

            console.log('📤 Criando item:', dados);

            const response = await axios.post(
                `${API_URL}/personalizacao/opcoes/${formularioNovoItem.idopcao}/valores`,
                dados
            );

            console.log('✅ Item criado:', response.data);

            // 2. Vincular ingredientes se houver
            if (ingredientesValidos.length > 0 && response.data.idvalor) {
                const idvalor = response.data.idvalor;
                
                console.log(`🔗 Vinculando ${ingredientesValidos.length} ingredientes ao idvalor ${idvalor}`);
                
                for (const ingrediente of ingredientesValidos) {
                    const dadosVinculo = {
                        idingrediente: ingrediente.idingrediente,
                        quantidade_usada: parseFloat(ingrediente.quantidade_usada)
                    };
                    
                    console.log('📤 Vinculando ingrediente:', dadosVinculo);
                    
                    await axios.post(
                        `${API_URL}/personalizacao/valores/${idvalor}/ingredientes`,
                        dadosVinculo
                    );
                }
                
                console.log('✅ Todos os ingredientes vinculados com sucesso!');
            }

            fecharModalAdicionarPersonalizacao();
            carregarValoresPersonalizacao();
            setErro('');
        } catch (error) {
            console.error('❌ Erro ao salvar:', error);
            setErro(error.response?.data?.erro || 'Erro ao adicionar item de personalização');
            console.error(error);
        } finally {
            setCarregando(false);
        }
    };

    // ==================== FIM FUNÇÕES DE PERSONALIZAÇÃO ====================

    return (
        <div className="ingredientes-container">
            <div className="ingredientes-header">
                <h1>🧪 Gestão de Ingredientes e Personalização</h1>
                <button 
                    className="btn-novo"
                    onClick={() => setMostrarFormulario(!mostrarFormulario)}
                    style={{ display: abaAtiva === 'ingredientes' ? 'block' : 'none' }}
                >
                    {mostrarFormulario ? '❌ Cancelar' : '➕ Novo Ingrediente'}
                </button>
            </div>

            {/* Abas de navegação */}
            <div className="abas-navegacao" style={{
                display: 'flex',
                gap: '1rem',
                marginBottom: '2rem',
                background: 'white',
                padding: '1rem',
                borderRadius: '16px',
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)'
            }}>
                <button 
                    className={`aba-btn ${abaAtiva === 'ingredientes' ? 'ativa' : ''}`}
                    onClick={() => setAbaAtiva('ingredientes')}
                    style={{
                        flex: 1,
                        padding: '1rem 2rem',
                        background: abaAtiva === 'ingredientes' 
                            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                            : 'linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%)',
                        color: abaAtiva === 'ingredientes' ? 'white' : '#6c757d',
                        border: '2px solid transparent',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: 700,
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.75rem',
                        boxShadow: abaAtiva === 'ingredientes' 
                            ? '0 8px 24px rgba(102, 126, 234, 0.4)'
                            : 'none'
                    }}
                >
                    📦 Ingredientes
                </button>
                <button 
                    className={`aba-btn ${abaAtiva === 'personalizacao' ? 'ativa' : ''}`}
                    onClick={() => setAbaAtiva('personalizacao')}
                    style={{
                        flex: 1,
                        padding: '1rem 2rem',
                        background: abaAtiva === 'personalizacao' 
                            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                            : 'linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%)',
                        color: abaAtiva === 'personalizacao' ? 'white' : '#6c757d',
                        border: '2px solid transparent',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: 700,
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.75rem',
                        boxShadow: abaAtiva === 'personalizacao' 
                            ? '0 8px 24px rgba(102, 126, 234, 0.4)'
                            : 'none'
                    }}
                >
                    🎨 Itens de Personalização
                </button>
            </div>

            {erro && <div className="erro-mensagem">{erro}</div>}

            {mostrarFormulario && (
                <div className="formulario-card">
                    <h2>{modoEdicao ? '✏️ Editar Ingrediente' : '➕ Novo Ingrediente'}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Nome *</label>
                                <input
                                    type="text"
                                    name="nome"
                                    value={formulario.nome}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Ex: Chocolate ao Leite"
                                />
                            </div>
                            <div className="form-group">
                                <label>Unidade de Medida *</label>
                                <select
                                    name="unidadeMedida"
                                    value={formulario.unidadeMedida}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="kg">Quilograma (kg)</option>
                                    <option value="g">Grama (g)</option>
                                    <option value="L">Litro (L)</option>
                                    <option value="ml">Mililitro (ml)</option>
                                    <option value="unidade">Unidade</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Preço Unitário (R$) *</label>
                                <input
                                    type="number"
                                    name="precoUnitario"
                                    value={formulario.precoUnitario}
                                    onChange={handleInputChange}
                                    step="0.01"
                                    min="0"
                                    required
                                    placeholder="Ex: 5,00 (por kg, L, etc.)"
                                />
                            </div>
                            <div className="form-group">
                                <label>Quantidade em Estoque *</label>
                                <input
                                    type="number"
                                    name="quantidadeEstoque"
                                    value={formulario.quantidadeEstoque}
                                    onChange={handleInputChange}
                                    step="0.001"
                                    min="0"
                                    required
                                    placeholder="Ex: 15 (use ponto para decimal: 15.5)"
                                />
                            </div>
                            <div className="form-group">
                                <label>Estoque Mínimo *</label>
                                <input
                                    type="number"
                                    name="estoqueMinimo"
                                    value={formulario.estoqueMinimo}
                                    onChange={handleInputChange}
                                    step="0.001"
                                    min="0"
                                    required
                                    placeholder="Ex: 5 (use ponto para decimal: 5.5)"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Fornecedor</label>
                            <input
                                type="text"
                                name="fornecedor"
                                value={formulario.fornecedor}
                                onChange={handleInputChange}
                                placeholder="Ex: Nestlé, Garoto, etc."
                            />
                        </div>

                        <div className="form-info">
                            <p>💡 <strong>Dica:</strong> Use <strong>ponto (.)</strong> como separador decimal ao digitar. Exemplo: <code>15.5</code> para 15,5kg</p>
                            <p>📊 A visualização será formatada automaticamente no padrão brasileiro (vírgula).</p>
                        </div>

                        <div className="form-actions">
                            <button type="button" onClick={handleCancelar} className="btn-cancelar">
                                Cancelar
                            </button>
                            <button type="submit" className="btn-salvar" disabled={carregando}>
                                {carregando ? 'Salvando...' : (modoEdicao ? 'Atualizar' : 'Cadastrar')}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Conteúdo baseado na aba ativa */}
            {abaAtiva === 'ingredientes' ? (
                <>
                    {/* Barra de Busca e Filtros */}
                    <div className="filtros-container">
                        <div className="barra-busca">
                            <span className="icone-busca">🔍</span>
                            <input
                                type="text"
                                placeholder="Buscar por nome ou fornecedor..."
                                value={buscaTexto}
                                onChange={(e) => setBuscaTexto(e.target.value)}
                                className="input-busca"
                            />
                            {buscaTexto && (
                                <button 
                                    className="btn-limpar-busca"
                                    onClick={() => setBuscaTexto('')}
                                    title="Limpar busca"
                                >
                                    ✕
                                </button>
                            )}
                        </div>

                        <div className="filtros">
                            <button 
                                className={filtro === 'todos' ? 'ativo' : ''}
                                onClick={() => setFiltro('todos')}
                            >
                                📦 Todos
                                <span className="badge-contador">{ingredientes.length}</span>
                            </button>
                            <button 
                                className={filtro === 'estoque-baixo' ? 'ativo' : ''}
                                onClick={() => setFiltro('estoque-baixo')}
                            >
                                🚨 Estoque Baixo
                                <span className="badge-contador">
                                    {ingredientes.filter(ing => {
                                        const est = parseFloat(ing.quantidade_estoque || ing.quantidadeEstoque || 0);
                                        const min = parseFloat(ing.estoque_minimo || ing.estoqueMinimo || 0);
                                        return est <= min;
                                    }).length}
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Informações dos Filtros Ativos */}
                    {(buscaTexto || filtro !== 'todos') && (
                        <div className="filtros-ativos">
                            <span className="texto-filtros">
                                Mostrando {ingredientesFiltrados.length} de {ingredientes.length} ingredientes
                            </span>
                            {buscaTexto && (
                                <span className="tag-filtro">
                                    🔍 "{buscaTexto}"
                                    <button onClick={() => setBuscaTexto('')}>✕</button>
                                </span>
                            )}
                            {filtro !== 'todos' && (
                                <span className="tag-filtro">
                                    🚨 Estoque Baixo
                                    <button onClick={() => setFiltro('todos')}>✕</button>
                                </span>
                            )}
                        </div>
                    )}

                    {carregando ? (
                        <div className="carregando">Carregando...</div>
                    ) : (
                        <div className="ingredientes-grid">
                            {ingredientesFiltrados.length === 0 ? (
                                <div className="vazio">
                                    {ingredientes.length === 0 
                                        ? 'Nenhum ingrediente cadastrado' 
                                        : 'Nenhum ingrediente encontrado com os filtros aplicados'}
                                </div>
                            ) : (
                        ingredientesFiltrados.map((ing) => {
                            const estoque = parseFloat(ing.quantidade_estoque || ing.quantidadeEstoque || 0);
                            const minimo = parseFloat(ing.estoque_minimo || ing.estoqueMinimo || 0);
                            const preco = parseFloat(ing.preco_unitario || ing.precoUnitario || 0);
                            const unidade = ing.unidade_medida || ing.unidadeMedida;
                            const estoqueBaixo = estoque <= minimo;
                            
                            return (
                                <div 
                                    key={ing.idingrediente} 
                                    className={`ingrediente-card ${estoqueBaixo ? 'estoque-baixo' : ''}`}
                                >
                                    <div className="ingrediente-header">
                                        <h3>{ing.nome}</h3>
                                        {estoqueBaixo && <span className="badge-alerta">⚠️ Baixo</span>}
                                    </div>
                                    
                                    <div className="ingrediente-info">
                                        <p>
                                            <strong>Preço:</strong> R$ {formatarNumero(preco, 2)}/{unidade}
                                        </p>
                                        <p>
                                            <strong>Estoque:</strong> {formatarUnidade(estoque, unidade)}
                                        </p>
                                        <p>
                                            <strong>Mínimo:</strong> {formatarUnidade(minimo, unidade)}
                                        </p>
                                        {ing.fornecedor && (
                                            <p>
                                                <strong>Fornecedor:</strong> {ing.fornecedor}
                                            </p>
                                        )}
                                    </div>
                                    
                                    <div className="ingrediente-acoes">
                                        <button 
                                            onClick={() => handleEditar(ing)}
                                            className="btn-editar"
                                        >
                                            ✏️ Editar
                                        </button>
                                        <button 
                                            onClick={() => abrirModalExcluir(ing)}
                                            className="btn-excluir"
                                        >
                                            🗑️ Excluir
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            )}
                </>
            ) : (
                <>
                    {/* Aba de Itens de Personalização */}
                    <div className="secao-personalizacao">
                        {/* Cabeçalho com Botão Adicionar */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '1.5rem',
                            padding: '1rem',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            borderRadius: '12px',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}>
                            <h2 style={{
                                color: 'white',
                                fontSize: '1.5rem',
                                fontWeight: 700,
                                margin: 0,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                                🎨 Itens de Personalização
                                <span style={{
                                    background: 'rgba(255, 255, 255, 0.2)',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '20px',
                                    fontSize: '0.875rem'
                                }}>
                                    {valoresPersonalizacao.length}
                                </span>
                            </h2>
                            <button
                                onClick={abrirModalAdicionarPersonalizacao}
                                style={{
                                    background: 'rgba(255, 255, 255, 0.95)',
                                    color: '#667eea',
                                    border: 'none',
                                    padding: '0.75rem 1.5rem',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                                }}
                            >
                                <span style={{ fontSize: '1.25rem' }}>➕</span>
                                Adicionar Item
                            </button>
                        </div>

                        {carregandoPersonalizacao ? (
                            <div className="carregando">
                                <div className="spinner"></div>
                                <p>Carregando itens de personalização...</p>
                            </div>
                        ) : (
                            <>
                                {valoresPersonalizacao.length === 0 ? (
                                    <div className="vazio-personalizacao">
                                        <span className="icone-vazio">🎨</span>
                                        <h3>Nenhum item de personalização encontrado</h3>
                                        <p>Adicione valores de personalização para começar</p>
                                    </div>
                                ) : (
                                    <div className="personalizacao-grid" style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                                        gap: '1.5rem',
                                        marginTop: '1.5rem'
                                    }}>
                                        {valoresPersonalizacao.map((item) => {
                                            // Verificar se há ingredientes com estoque baixo
                                            const ingredientesBaixo = item.ingredientes.filter(ing => {
                                                const est = parseFloat(ing.quantidade_estoque || ing.quantidadeEstoque || 0);
                                                const min = parseFloat(ing.estoque_minimo || ing.estoqueMinimo || 0);
                                                return est <= min;
                                            });

                                            const temEstoqueBaixo = ingredientesBaixo.length > 0;
                                            const temIngredientes = item.ingredientes.length > 0;

                                            return (
                                                <div 
                                                    key={item.idvalor} 
                                                    className={`personalizacao-card ${temEstoqueBaixo ? 'tem-estoque-baixo' : ''} ${!temIngredientes ? 'sem-ingredientes' : ''}`}
                                                    style={{
                                                        background: 'white',
                                                        borderRadius: '16px',
                                                        overflow: 'hidden',
                                                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                                                        border: temEstoqueBaixo ? '2px solid #ef4444' : '2px solid transparent',
                                                        transition: 'all 0.3s ease'
                                                    }}
                                                >
                                                    <div className="card-header-personalizacao" style={{
                                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                        padding: '1.5rem',
                                                        color: 'white'
                                                    }}>
                                                        <div className="info-topo" style={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center',
                                                            marginBottom: '0.75rem'
                                                        }}>
                                                            <span className="badge-tipo" style={{
                                                                background: 'rgba(255, 255, 255, 0.25)',
                                                                padding: '0.375rem 0.875rem',
                                                                borderRadius: '20px',
                                                                fontSize: '0.75rem',
                                                                fontWeight: 700,
                                                                textTransform: 'uppercase',
                                                                letterSpacing: '0.5px'
                                                            }}>{item.opcao_nome}</span>
                                                            {temEstoqueBaixo && (
                                                                <span className="badge-alerta-estoque" style={{
                                                                    background: '#ef4444',
                                                                    padding: '0.25rem 0.625rem',
                                                                    borderRadius: '12px',
                                                                    fontSize: '0.75rem',
                                                                    fontWeight: 700,
                                                                    animation: 'pulse 2s ease-in-out infinite'
                                                                }}>
                                                                    ⚠️ {ingredientesBaixo.length}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <h3 className="nome-personalizacao" style={{
                                                            fontSize: '1.25rem',
                                                            fontWeight: 700,
                                                            margin: '0 0 0.75rem 0'
                                                        }}>{item.nome_valor}</h3>
                                                        
                                                        {/* Preço e Quantidade */}
                                                        <div style={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center',
                                                            flexWrap: 'wrap',
                                                            gap: '0.75rem'
                                                        }}>
                                                            <div className="preco-adicional">
                                                                {parseFloat(item.preco_adicional) > 0 ? (
                                                                    <span className="valor-positivo" style={{
                                                                        background: 'rgba(16, 185, 129, 0.2)',
                                                                        color: '#10b981',
                                                                        padding: '0.5rem 1rem',
                                                                        borderRadius: '8px',
                                                                        fontSize: '1rem',
                                                                        fontWeight: 700,
                                                                        display: 'inline-block'
                                                                    }}>
                                                                        + R$ {formatarNumero(item.preco_adicional, 2)}
                                                                    </span>
                                                                ) : (
                                                                    <span className="valor-zero" style={{
                                                                        color: 'rgba(255, 255, 255, 0.75)',
                                                                        fontSize: '0.875rem',
                                                                        fontStyle: 'italic'
                                                                    }}>Sem custo adicional</span>
                                                                )}
                                                            </div>
                                                            
                                                            {/* Quantidade em Estoque - APENAS para EXTRAS */}
                                                            {item.opcao_nome === 'EXTRAS' && (
                                                                <div style={{
                                                                    background: 'rgba(255, 255, 255, 0.2)',
                                                                    padding: '0.5rem 1rem',
                                                                    borderRadius: '8px',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: '0.5rem'
                                                                }}>
                                                                    <span style={{
                                                                        fontSize: '1.25rem'
                                                                    }}>📦</span>
                                                                    <span style={{
                                                                        fontWeight: 700,
                                                                        fontSize: '1rem'
                                                                    }}>
                                                                        {item.quantidade_estoque || 0} unidades
                                                                    </span>
                                                                    {((item.quantidade_estoque || 0) < (item.estoque_minimo || 10)) && (
                                                                        <span style={{
                                                                            background: '#ef4444',
                                                                            padding: '0.25rem 0.5rem',
                                                                            borderRadius: '4px',
                                                                            fontSize: '0.75rem',
                                                                            fontWeight: 700,
                                                                            marginLeft: '0.5rem'
                                                                        }}>
                                                                            ⚠️ Estoque Baixo
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Botões de Ação */}
                                                        <div style={{
                                                            display: 'flex',
                                                            gap: '0.5rem',
                                                            marginTop: '1rem'
                                                        }}>
                                                            <button
                                                                onClick={() => abrirModalEditarPersonalizacao(item)}
                                                                style={{
                                                                    flex: 1,
                                                                    background: 'rgba(255, 255, 255, 0.25)',
                                                                    color: 'white',
                                                                    border: '2px solid rgba(255, 255, 255, 0.5)',
                                                                    padding: '0.75rem 1rem',
                                                                    borderRadius: '8px',
                                                                    cursor: 'pointer',
                                                                    fontWeight: 700,
                                                                    fontSize: '0.875rem',
                                                                    transition: 'all 0.2s ease'
                                                                }}
                                                                onMouseEnter={(e) => {
                                                                    e.target.style.background = 'rgba(255, 255, 255, 0.35)';
                                                                    e.target.style.transform = 'translateY(-2px)';
                                                                }}
                                                                onMouseLeave={(e) => {
                                                                    e.target.style.background = 'rgba(255, 255, 255, 0.25)';
                                                                    e.target.style.transform = 'translateY(0)';
                                                                }}
                                                            >
                                                                ✏️ Editar
                                                            </button>
                                                            <button
                                                                onClick={() => abrirModalExcluirPersonalizacao(item)}
                                                                style={{
                                                                    flex: 1,
                                                                    background: 'rgba(239, 68, 68, 0.3)',
                                                                    color: 'white',
                                                                    border: '2px solid #ef4444',
                                                                    padding: '0.75rem 1rem',
                                                                    borderRadius: '8px',
                                                                    cursor: 'pointer',
                                                                    fontWeight: 700,
                                                                    fontSize: '0.875rem',
                                                                    transition: 'all 0.2s ease'
                                                                }}
                                                                onMouseEnter={(e) => {
                                                                    e.target.style.background = '#ef4444';
                                                                    e.target.style.transform = 'translateY(-2px)';
                                                                }}
                                                                onMouseLeave={(e) => {
                                                                    e.target.style.background = 'rgba(239, 68, 68, 0.3)';
                                                                    e.target.style.transform = 'translateY(0)';
                                                                }}
                                                            >
                                                                🗑️ Excluir
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="card-body-personalizacao" style={{
                                                        padding: '1.5rem'
                                                    }}>
                                                        <div className="secao-ingredientes">
                                                            <h4 className="titulo-secao" style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '0.5rem',
                                                                fontSize: '1rem',
                                                                fontWeight: 700,
                                                                color: '#1f2937',
                                                                marginBottom: '1rem'
                                                            }}>
                                                                <span className="icone-titulo">📦</span>
                                                                Ingredientes Utilizados
                                                            </h4>
                                                            
                                                            {!temIngredientes ? (
                                                                <div className="aviso-sem-ingredientes" style={{
                                                                    background: '#f3f4f6',
                                                                    padding: '1.5rem',
                                                                    borderRadius: '8px',
                                                                    textAlign: 'center'
                                                                }}>
                                                                    <span className="icone-aviso" style={{
                                                                        fontSize: '2rem',
                                                                        display: 'block',
                                                                        marginBottom: '0.5rem'
                                                                    }}>ℹ️</span>
                                                                    <p style={{
                                                                        margin: 0,
                                                                        color: '#6b7280',
                                                                        fontSize: '0.875rem'
                                                                    }}>Nenhum ingrediente vinculado a este item</p>
                                                                </div>
                                                            ) : (
                                                                <div className="lista-ingredientes-card" style={{
                                                                    display: 'flex',
                                                                    flexDirection: 'column',
                                                                    gap: '0.75rem'
                                                                }}>
                                                                    {item.ingredientes.map((ing) => {
                                                                        const estoque = parseFloat(ing.quantidade_estoque || ing.quantidadeEstoque || 0);
                                                                        const minimo = parseFloat(ing.estoque_minimo || ing.estoqueMinimo || 0);
                                                                        const quantidade = parseFloat(ing.quantidade_usada || 0);
                                                                        const unidade = ing.unidade_medida || ing.unidadeMedida || 'un';
                                                                        const estoqueBaixo = estoque <= minimo;
                                                                        const estoquePercentual = minimo > 0 ? (estoque / minimo) * 100 : 100;

                                                                        return (
                                                                            <div 
                                                                                key={ing.idingrediente} 
                                                                                className={`item-ingrediente ${estoqueBaixo ? 'baixo' : ''}`}
                                                                                style={{
                                                                                    background: estoqueBaixo ? '#fef2f2' : '#f9fafb',
                                                                                    padding: '1rem',
                                                                                    borderRadius: '8px',
                                                                                    borderLeft: estoqueBaixo ? '4px solid #ef4444' : '4px solid #10b981'
                                                                                }}
                                                                            >
                                                                                <div className="ingrediente-principal" style={{
                                                                                    display: 'flex',
                                                                                    justifyContent: 'space-between',
                                                                                    alignItems: 'center',
                                                                                    marginBottom: '0.5rem'
                                                                                }}>
                                                                                    <div className="nome-quantidade" style={{
                                                                                        display: 'flex',
                                                                                        flexDirection: 'column',
                                                                                        gap: '0.25rem'
                                                                                    }}>
                                                                                        <span className="nome-ing" style={{
                                                                                            fontWeight: 700,
                                                                                            color: '#1f2937',
                                                                                            fontSize: '0.875rem'
                                                                                        }}>{ing.ingrediente_nome || ing.nome}</span>
                                                                                        <span className="quantidade-usada" style={{
                                                                                            fontSize: '0.75rem',
                                                                                            color: '#6b7280'
                                                                                        }}>
                                                                                            Usa: <strong>{formatarUnidade(quantidade, unidade)}</strong>
                                                                                        </span>
                                                                                    </div>
                                                                                    {estoqueBaixo && (
                                                                                        <span className="badge-alerta-mini" style={{
                                                                                            fontSize: '1rem'
                                                                                        }}>⚠️</span>
                                                                                    )}
                                                                                </div>
                                                                                
                                                                                <div className="estoque-info" style={{
                                                                                    marginTop: '0.5rem'
                                                                                }}>
                                                                                    <div className="barra-estoque" style={{
                                                                                        width: '100%',
                                                                                        height: '8px',
                                                                                        background: '#e5e7eb',
                                                                                        borderRadius: '4px',
                                                                                        overflow: 'hidden',
                                                                                        marginBottom: '0.5rem'
                                                                                    }}>
                                                                                        <div 
                                                                                            className={`barra-preenchimento ${estoqueBaixo ? 'baixo' : ''}`}
                                                                                            style={{ 
                                                                                                width: `${Math.min(estoquePercentual, 100)}%`,
                                                                                                height: '100%',
                                                                                                background: estoqueBaixo 
                                                                                                    ? 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)'
                                                                                                    : 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
                                                                                                transition: 'width 0.5s ease'
                                                                                            }}
                                                                                        ></div>
                                                                                    </div>
                                                                                    <div className="valores-estoque" style={{
                                                                                        display: 'flex',
                                                                                        justifyContent: 'space-between',
                                                                                        fontSize: '0.75rem'
                                                                                    }}>
                                                                                        <span className={`estoque-atual ${estoqueBaixo ? 'texto-baixo' : ''}`} style={{
                                                                                            fontWeight: 700,
                                                                                            color: estoqueBaixo ? '#ef4444' : '#10b981'
                                                                                        }}>
                                                                                            {formatarUnidade(estoque, unidade)}
                                                                                        </span>
                                                                                        <span className="estoque-minimo" style={{
                                                                                            color: '#9ca3af'
                                                                                        }}>
                                                                                            Mín: {formatarUnidade(minimo, unidade)}
                                                                                        </span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </>
            )}

            {/* Modal de Confirmação de Exclusão */}
            {modalExcluir.mostrar && (
                <div className="modal-overlay" onClick={fecharModalExcluir}>
                    <div className="modal-exclusao" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="modal-icone">
                                <span className="icone-alerta">⚠️</span>
                            </div>
                            <h2>Confirmar Exclusão</h2>
                        </div>
                        
                        <div className="modal-body">
                            <p>Tem certeza que deseja excluir o ingrediente:</p>
                            <div className="ingrediente-destaque">
                                <strong>{modalExcluir.ingrediente?.nome}</strong>
                            </div>
                            <p className="aviso-exclusao">
                                ⚠️ Esta ação não pode ser desfeita!
                            </p>
                        </div>
                        
                        <div className="modal-footer">
                            <button 
                                className="btn-modal-cancelar"
                                onClick={fecharModalExcluir}
                                disabled={carregando}
                            >
                                Cancelar
                            </button>
                            <button 
                                className="btn-modal-excluir"
                                onClick={confirmarExclusao}
                                disabled={carregando}
                            >
                                {carregando ? 'Excluindo...' : 'Sim, Excluir'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Edição de Personalização */}
            {modalEditarPersonalizacao.mostrar && (
                <div className="modal-overlay" onClick={fecharModalEditarPersonalizacao} style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.75)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999
                }}>
                    <div className="modal-edicao" onClick={(e) => e.stopPropagation()} style={{
                        background: 'white',
                        borderRadius: '16px',
                        padding: '2rem',
                        maxWidth: '500px',
                        width: '90%',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
                    }}>
                        <div className="modal-header" style={{
                            marginBottom: '1.5rem',
                            textAlign: 'center'
                        }}>
                            <div className="modal-icone" style={{
                                fontSize: '3rem',
                                marginBottom: '0.5rem'
                            }}>
                                ✏️
                            </div>
                            <h2 style={{
                                fontSize: '1.5rem',
                                fontWeight: 700,
                                color: '#1f2937',
                                margin: 0
                            }}>Editar Item de Personalização</h2>
                        </div>
                        
                        <div className="modal-body" style={{
                            marginBottom: '1.5rem'
                        }}>
                            <div style={{
                                marginBottom: '1rem'
                            }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    fontWeight: 600,
                                    color: '#4b5563'
                                }}>Nome do Item</label>
                                <input
                                    type="text"
                                    value={formularioPersonalizacao.nome_valor}
                                    onChange={(e) => setFormularioPersonalizacao({
                                        ...formularioPersonalizacao,
                                        nome_valor: e.target.value
                                    })}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '2px solid #e5e7eb',
                                        borderRadius: '8px',
                                        fontSize: '1rem',
                                        transition: 'border-color 0.2s'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                />
                            </div>

                            <div>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    fontWeight: 600,
                                    color: '#4b5563'
                                }}>Preço Adicional (R$)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formularioPersonalizacao.preco_adicional}
                                    onChange={(e) => setFormularioPersonalizacao({
                                        ...formularioPersonalizacao,
                                        preco_adicional: e.target.value
                                    })}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '2px solid #e5e7eb',
                                        borderRadius: '8px',
                                        fontSize: '1rem',
                                        transition: 'border-color 0.2s'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                />
                            </div>
                        </div>
                        
                        <div className="modal-footer" style={{
                            display: 'flex',
                            gap: '0.75rem'
                        }}>
                            <button 
                                onClick={fecharModalEditarPersonalizacao}
                                disabled={carregando}
                                style={{
                                    flex: 1,
                                    padding: '0.875rem 1.5rem',
                                    background: '#f3f4f6',
                                    color: '#6b7280',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: 700,
                                    fontSize: '1rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => e.target.style.background = '#e5e7eb'}
                                onMouseLeave={(e) => e.target.style.background = '#f3f4f6'}
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={salvarEdicaoPersonalizacao}
                                disabled={carregando}
                                style={{
                                    flex: 1,
                                    padding: '0.875rem 1.5rem',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: 700,
                                    fontSize: '1rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                            >
                                {carregando ? 'Salvando...' : 'Salvar Alterações'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Confirmação de Exclusão de Personalização */}
            {modalExcluirPersonalizacao.mostrar && (
                <div className="modal-overlay" onClick={fecharModalExcluirPersonalizacao} style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.75)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999
                }}>
                    <div className="modal-exclusao" onClick={(e) => e.stopPropagation()} style={{
                        background: 'white',
                        borderRadius: '16px',
                        padding: '2rem',
                        maxWidth: '450px',
                        width: '90%',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
                    }}>
                        <div className="modal-header" style={{
                            marginBottom: '1.5rem',
                            textAlign: 'center'
                        }}>
                            <div className="modal-icone" style={{
                                fontSize: '3rem',
                                marginBottom: '0.5rem'
                            }}>
                                ⚠️
                            </div>
                            <h2 style={{
                                fontSize: '1.5rem',
                                fontWeight: 700,
                                color: '#1f2937',
                                margin: 0
                            }}>Confirmar Exclusão</h2>
                        </div>
                        
                        <div className="modal-body" style={{
                            marginBottom: '1.5rem',
                            textAlign: 'center'
                        }}>
                            <p style={{
                                fontSize: '1rem',
                                color: '#6b7280',
                                margin: '0 0 1rem 0'
                            }}>Tem certeza que deseja excluir o item de personalização:</p>
                            <div style={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                padding: '1rem',
                                borderRadius: '8px',
                                fontWeight: 700,
                                fontSize: '1.125rem',
                                marginBottom: '1rem'
                            }}>
                                {modalExcluirPersonalizacao.valor?.nome_valor}
                            </div>
                            <p style={{
                                fontSize: '0.875rem',
                                color: '#ef4444',
                                fontWeight: 600,
                                margin: 0
                            }}>
                                ⚠️ Esta ação não pode ser desfeita!
                            </p>
                        </div>
                        
                        <div className="modal-footer" style={{
                            display: 'flex',
                            gap: '0.75rem'
                        }}>
                            <button 
                                onClick={fecharModalExcluirPersonalizacao}
                                disabled={carregando}
                                style={{
                                    flex: 1,
                                    padding: '0.875rem 1.5rem',
                                    background: '#f3f4f6',
                                    color: '#6b7280',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: 700,
                                    fontSize: '1rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => e.target.style.background = '#e5e7eb'}
                                onMouseLeave={(e) => e.target.style.background = '#f3f4f6'}
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={confirmarExclusaoPersonalizacao}
                                disabled={carregando}
                                style={{
                                    flex: 1,
                                    padding: '0.875rem 1.5rem',
                                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: 700,
                                    fontSize: '1rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                            >
                                {carregando ? 'Excluindo...' : 'Sim, Excluir'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Adicionar Item de Personalização */}
            {modalAdicionarPersonalizacao && (
                <div className="modal-overlay" style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999,
                    backdropFilter: 'blur(4px)'
                }} onClick={fecharModalAdicionarPersonalizacao}>
                    <div className="modal-conteudo" style={{
                        background: 'white',
                        borderRadius: '16px',
                        maxWidth: '500px',
                        width: '90%',
                        maxHeight: '90vh',
                        overflow: 'auto',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                    }} onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header" style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            padding: '1.5rem',
                            borderRadius: '16px 16px 0 0',
                            marginBottom: '1.5rem'
                        }}>
                            <h2 style={{
                                fontSize: '1.5rem',
                                fontWeight: 700,
                                color: 'white',
                                margin: 0,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                                <span style={{ fontSize: '1.75rem' }}>➕</span>
                                Adicionar Item de Personalização
                            </h2>
                        </div>
                        
                        <div className="modal-body" style={{
                            padding: '0 1.5rem 1.5rem 1.5rem'
                        }}>
                            {/* Categoria */}
                            <div style={{ marginBottom: '1.25rem' }}>
                                <label style={{
                                    display: 'block',
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    color: '#374151',
                                    marginBottom: '0.5rem'
                                }}>
                                    Categoria <span style={{ color: '#ef4444' }}>*</span>
                                </label>
                                <select
                                    value={formularioNovoItem.idopcao}
                                    onChange={(e) => setFormularioNovoItem({
                                        ...formularioNovoItem,
                                        idopcao: e.target.value
                                    })}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '2px solid #e5e7eb',
                                        borderRadius: '8px',
                                        fontSize: '1rem',
                                        transition: 'border-color 0.2s',
                                        outline: 'none'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                >
                                    <option value="">Selecione a categoria...</option>
                                    {opcoesDisponiveis.map(opcao => (
                                        <option key={opcao.idopcao} value={opcao.idopcao}>
                                            {opcao.nome_opcao}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Nome do Item */}
                            <div style={{ marginBottom: '1.25rem' }}>
                                <label style={{
                                    display: 'block',
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    color: '#374151',
                                    marginBottom: '0.5rem'
                                }}>
                                    Nome do Item <span style={{ color: '#ef4444' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formularioNovoItem.nome_valor}
                                    onChange={(e) => setFormularioNovoItem({
                                        ...formularioNovoItem,
                                        nome_valor: e.target.value
                                    })}
                                    placeholder="Ex: Vela de Aniversário, Brigadeiro..."
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '2px solid #e5e7eb',
                                        borderRadius: '8px',
                                        fontSize: '1rem',
                                        transition: 'border-color 0.2s',
                                        outline: 'none'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                />
                            </div>

                            {/* Preço Adicional */}
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{
                                    display: 'block',
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    color: '#374151',
                                    marginBottom: '0.5rem'
                                }}>
                                    Preço Adicional (R$)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formularioNovoItem.preco_adicional}
                                    onChange={(e) => setFormularioNovoItem({
                                        ...formularioNovoItem,
                                        preco_adicional: e.target.value
                                    })}
                                    placeholder="0.00"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '2px solid #e5e7eb',
                                        borderRadius: '8px',
                                        fontSize: '1rem',
                                        transition: 'border-color 0.2s',
                                        outline: 'none'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                />
                                <p style={{
                                    fontSize: '0.75rem',
                                    color: '#6b7280',
                                    marginTop: '0.5rem',
                                    marginBottom: 0
                                }}>
                                    💡 Deixe 0.00 se não houver custo adicional
                                </p>
                            </div>

                            {/* Seção de Ingredientes */}
                            <div style={{
                                marginTop: '1.5rem',
                                marginBottom: '1.5rem',
                                padding: '1rem',
                                background: '#f9fafb',
                                borderRadius: '8px',
                                border: '1px solid #e5e7eb'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '1rem'
                                }}>
                                    <label style={{
                                        fontSize: '0.875rem',
                                        fontWeight: 600,
                                        color: '#374151',
                                        margin: 0
                                    }}>
                                        📦 Ingredientes Utilizados
                                    </label>
                                    <button
                                        type="button"
                                        onClick={adicionarIngrediente}
                                        style={{
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            color: 'white',
                                            border: 'none',
                                            padding: '0.5rem 1rem',
                                            borderRadius: '6px',
                                            fontSize: '0.875rem',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.25rem',
                                            transition: 'transform 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                    >
                                        <span style={{ fontSize: '1rem' }}>+</span>
                                        Adicionar Ingrediente
                                    </button>
                                </div>

                                <p style={{
                                    fontSize: '0.75rem',
                                    color: '#6b7280',
                                    marginBottom: '1rem'
                                }}>
                                    💡 Opcional: Adicione ingredientes se este item for uma receita (ex: Brigadeiro, Ganache)
                                </p>

                                {ingredientesSelecionados.length === 0 ? (
                                    <div style={{
                                        padding: '2rem',
                                        textAlign: 'center',
                                        color: '#9ca3af',
                                        fontSize: '0.875rem'
                                    }}>
                                        <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>🍰</span>
                                        Nenhum ingrediente adicionado
                                    </div>
                                ) : (
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '0.75rem'
                                    }}>
                                        {ingredientesSelecionados.map((ingrediente, index) => (
                                            <div key={ingrediente.id || index} style={{
                                                display: 'grid',
                                                gridTemplateColumns: '2fr 1fr auto',
                                                gap: '0.5rem',
                                                alignItems: 'end',
                                                background: 'white',
                                                padding: '0.75rem',
                                                borderRadius: '6px',
                                                border: '1px solid #e5e7eb'
                                            }}>
                                                {/* Select Ingrediente */}
                                                <div>
                                                    <label style={{
                                                        display: 'block',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 600,
                                                        color: '#374151',
                                                        marginBottom: '0.25rem'
                                                    }}>
                                                        Ingrediente
                                                    </label>
                                                    <select
                                                        value={ingrediente.idingrediente || ''}
                                                        onChange={(e) => atualizarIngrediente(index, 'idingrediente', e.target.value)}
                                                        style={{
                                                            width: '100%',
                                                            padding: '0.5rem',
                                                            border: '1px solid #d1d5db',
                                                            borderRadius: '4px',
                                                            fontSize: '0.875rem',
                                                            outline: 'none'
                                                        }}
                                                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                                        onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                                                    >
                                                        <option value="">Selecione...</option>
                                                        {ingredientesDisponiveis.map(ing => (
                                                            <option key={ing.idingrediente} value={ing.idingrediente}>
                                                                {ing.nome}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                {/* Input Quantidade */}
                                                <div>
                                                    <label style={{
                                                        display: 'block',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 600,
                                                        color: '#374151',
                                                        marginBottom: '0.25rem'
                                                    }}>
                                                        Qtd. ({ingrediente.unidade_medida || 'kg'})
                                                    </label>
                                                    <input
                                                        type="number"
                                                        step="0.001"
                                                        min="0"
                                                        value={ingrediente.quantidade_usada || ''}
                                                        onChange={(e) => atualizarIngrediente(index, 'quantidade_usada', e.target.value)}
                                                        placeholder="0.000"
                                                        style={{
                                                            width: '100%',
                                                            padding: '0.5rem',
                                                            border: '1px solid #d1d5db',
                                                            borderRadius: '4px',
                                                            fontSize: '0.875rem',
                                                            outline: 'none'
                                                        }}
                                                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                                        onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                                                    />
                                                </div>

                                                {/* Botão Remover */}
                                                <button
                                                    type="button"
                                                    onClick={() => removerIngrediente(index)}
                                                    style={{
                                                        background: '#fee2e2',
                                                        color: '#ef4444',
                                                        border: 'none',
                                                        padding: '0.5rem',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer',
                                                        fontSize: '1.25rem',
                                                        lineHeight: 1,
                                                        transition: 'background 0.2s'
                                                    }}
                                                    onMouseEnter={(e) => e.target.style.background = '#fecaca'}
                                                    onMouseLeave={(e) => e.target.style.background = '#fee2e2'}
                                                    title="Remover ingrediente"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Mensagem de Erro */}
                            {erro && (
                                <div style={{
                                    background: '#fef2f2',
                                    border: '1px solid #fecaca',
                                    color: '#991b1b',
                                    padding: '0.75rem',
                                    borderRadius: '8px',
                                    fontSize: '0.875rem',
                                    marginBottom: '1rem'
                                }}>
                                    ⚠️ {erro}
                                </div>
                            )}
                        </div>
                        
                        <div className="modal-footer" style={{
                            display: 'flex',
                            gap: '0.75rem',
                            padding: '0 1.5rem 1.5rem 1.5rem'
                        }}>
                            <button 
                                onClick={fecharModalAdicionarPersonalizacao}
                                disabled={carregando}
                                style={{
                                    flex: 1,
                                    padding: '0.875rem 1.5rem',
                                    background: '#f3f4f6',
                                    color: '#6b7280',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: 700,
                                    fontSize: '1rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => e.target.style.background = '#e5e7eb'}
                                onMouseLeave={(e) => e.target.style.background = '#f3f4f6'}
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={salvarNovoItemPersonalizacao}
                                disabled={carregando || !formularioNovoItem.idopcao || !formularioNovoItem.nome_valor}
                                style={{
                                    flex: 1,
                                    padding: '0.875rem 1.5rem',
                                    background: formularioNovoItem.idopcao && formularioNovoItem.nome_valor
                                        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                        : '#d1d5db',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: 700,
                                    fontSize: '1rem',
                                    cursor: formularioNovoItem.idopcao && formularioNovoItem.nome_valor ? 'pointer' : 'not-allowed',
                                    transition: 'all 0.2s',
                                    opacity: carregando ? 0.7 : 1
                                }}
                                onMouseEnter={(e) => {
                                    if (formularioNovoItem.idopcao && formularioNovoItem.nome_valor && !carregando) {
                                        e.target.style.transform = 'translateY(-2px)';
                                        e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = 'none';
                                }}
                            >
                                {carregando ? (
                                    <>
                                        <span style={{ marginRight: '0.5rem' }}>⏳</span>
                                        Adicionando...
                                    </>
                                ) : (
                                    <>
                                        <span style={{ marginRight: '0.5rem' }}>✓</span>
                                        Adicionar Item
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Ingredientes;
