import React, { useState, useEffect } from "react";
import './index.scss';
import Header from "../../components/header";
import Footer from "../../components/footer";
import { FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaCreditCard, FaMoneyBillWave, FaShoppingCart, FaArrowLeft } from "react-icons/fa";
import { SlScreenSmartphone } from "react-icons/sl";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Checkout() {
    const navigate = useNavigate();
    const [carrinho, setCarrinho] = useState(null);
    const [step, setStep] = useState(1); // 1: Dados, 2: Pagamento, 3: Confirmação

    // Dados do Cliente
    const [dadosCliente, setDadosCliente] = useState({
        nome: "",
        email: "",
        telefone: "",
        cpf: "",
        cep: "",
        endereco: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
        uf: ""
    });

    // Dados do Pedido
    const [metodoPagamento, setMetodoPagamento] = useState("PIX");
    const [observacoes, setObservacoes] = useState("");
    const [buscandoCep, setBuscandoCep] = useState(false);

    useEffect(() => {
        // Recuperar carrinho do localStorage
        const carrinhoSalvo = localStorage.getItem('carrinho');
        if (!carrinhoSalvo) {
            toast.error("Carrinho vazio! Redirecionando...");
            setTimeout(() => navigate('/catalogo'), 2000);
            return;
        }

        setCarrinho(JSON.parse(carrinhoSalvo));
        setObservacoes(JSON.parse(carrinhoSalvo).observacoes || "");
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDadosCliente(prev => ({ ...prev, [name]: value }));
    };

    const buscarCep = async (cep) => {
        // Remove caracteres não numéricos
        const cepLimpo = cep.replace(/\D/g, '');
        
        if (cepLimpo.length !== 8) return;

        setBuscandoCep(true);
        try {
            const response = await axios.get(`https://viacep.com.br/ws/${cepLimpo}/json/`);
            
            if (response.data.erro) {
                toast.error('CEP não encontrado');
                return;
            }

            setDadosCliente(prev => ({
                ...prev,
                endereco: response.data.logradouro || '',
                bairro: response.data.bairro || '',
                cidade: response.data.localidade || '',
                uf: response.data.uf || ''
            }));
            
            toast.success('Endereço preenchido automaticamente!');
        } catch (error) {
            toast.error('Erro ao buscar CEP');
        } finally {
            setBuscandoCep(false);
        }
    };

    const handleCepChange = async (e) => {
        const value = e.target.value;
        setDadosCliente(prev => ({ ...prev, cep: value }));
        
        // Buscar CEP quando digitar 8 números
        const cepLimpo = value.replace(/\D/g, '');
        if (cepLimpo.length === 8) {
            await buscarCep(value);
        }
    };

    const validarStep1 = () => {
        const { nome, email, telefone, endereco, numero, cidade, uf } = dadosCliente;
        
        if (!nome || !email || !telefone || !endereco || !numero || !cidade || !uf) {
            toast.warning("Preencha todos os campos obrigatórios!");
            return false;
        }

        if (!email.includes('@')) {
            toast.warning("E-mail inválido!");
            return false;
        }

        return true;
    };

    const finalizarPedido = async () => {
        try {
            // 1. Criar/buscar cliente
            const enderecoCompleto = `${dadosCliente.endereco}, ${dadosCliente.numero}${dadosCliente.complemento ? ' - ' + dadosCliente.complemento : ''}, ${dadosCliente.bairro}, ${dadosCliente.cidade}/${dadosCliente.uf}`;
            
            const clienteResponse = await axios.post('http://localhost:5000/cliente/verificar', {
                nome: dadosCliente.nome,
                email: dadosCliente.email,
                telefone: dadosCliente.telefone
            });

            const idCliente = clienteResponse.data.id_cliente || clienteResponse.data.id;

            // 2. Preparar dados do pedido
            const produtosReservados = carrinho.itens.map(item => ({
                id: item.id,
                nome: item.nome,
                valor: item.valor,
                caminhoImagem: item.imagem, // Incluir imagem do produto
                personalizacoes: item.personalizacoes || [], // ✅ Incluir personalizações
                valor_acrescimo: item.valor_acrescimo || 0  // ✅ Incluir valor acréscimo
            }));

            const qtdReserva = carrinho.itens.map(item => ({
                id: item.id,
                quantidade: item.quantidade
            }));

            // Data e hora atuais
            const now = new Date();
            const dataEntrega = now.toISOString().split('T')[0]; // YYYY-MM-DD
            const horaEntrega = now.toTimeString().split(' ')[0]; // HH:MM:SS

            const pedidoData = {
                data: dataEntrega,
                horario: horaEntrega,
                pontoEntrega: "Entrega em Domicílio",
                totalGeral: carrinho.total,
                status: "Pendente",
                pagamento: metodoPagamento,
                produtos: produtosReservados,
                produtosComQuantidade: qtdReserva,
                clienteId: idCliente,
                nomeCliente: dadosCliente.nome,
                telefoneCliente: dadosCliente.telefone,
                emailCliente: dadosCliente.email,
                enderecoEntrega: enderecoCompleto,
                tipoPedido: "ENTREGA",
                observacoes: observacoes || ""
            };

            // 3. Criar pedido (reserva) com notificação WhatsApp automática
            const pedidoResponse = await axios.post('http://localhost:5000/pedido/criar', pedidoData);
            
            // 4. Salvar personalizações (se houver)
            const idReserva = pedidoResponse.data.idreserva || pedidoResponse.data.id;
            for (const item of carrinho.itens) {
                if (item.personalizacoes && item.personalizacoes.length > 0) {
                    try {
                        await axios.post(`http://localhost:5000/personalizacao/pedidos/${idReserva}/salvar`, {
                            idproduto: item.idproduto,
                            personalizacoes: item.personalizacoes
                        });
                    } catch (error) {
                        console.error('Erro ao salvar personalizações:', error);
                        // Não bloqueia o pedido se falhar
                    }
                }
            }
            
            // 5. Limpar carrinho
            localStorage.removeItem('carrinho');

            // 6. Salvar informações do cliente para Meus Pedidos
            localStorage.setItem('clienteInfo', JSON.stringify({
                nome: dadosCliente.nome,
                telefone: dadosCliente.telefone,
                email: dadosCliente.email
            }));

            // 7. Salvar número do pedido para exibição
            localStorage.setItem('ultimoPedido', JSON.stringify({
                numero: pedidoResponse.data.numeroPedido,
                whatsappEnviado: pedidoResponse.data.whatsappEnviado,
                total: carrinho.total,
                telefone: dadosCliente.telefone
            }));

            // 8. Mostrar sucesso
            toast.success("Pedido realizado com sucesso! Você receberá uma confirmação no WhatsApp.");
            
            // 9. Redirecionar
            setTimeout(() => {
                navigate('/pedido-confirmado');
            }, 2000);

        } catch (error) {
            console.error("Erro ao finalizar pedido:", error);
            const mensagemErro = error.response?.data?.erro || "Erro ao finalizar pedido. Tente novamente.";
            toast.error(mensagemErro);
        }
    };

    if (!carrinho) {
        return (
            <div className="loading-page">
                <div className="spinner"></div>
                <p>Carregando...</p>
            </div>
        );
    }

    return (
        <div className="pagina-checkout">
            <Header />

            <div className="checkout-container">
                <h1 className="checkout-titulo">Finalizar Pedido</h1>

                {/* Breadcrumb */}
                <div className="checkout-breadcrumb">
                    <div className={`breadcrumb-item ${step >= 1 ? 'active' : ''}`}>
                        <span className="numero">1</span>
                        <span className="texto">Dados</span>
                    </div>
                    <div className="breadcrumb-linha"></div>
                    <div className={`breadcrumb-item ${step >= 2 ? 'active' : ''}`}>
                        <span className="numero">2</span>
                        <span className="texto">Pagamento</span>
                    </div>
                    <div className="breadcrumb-linha"></div>
                    <div className={`breadcrumb-item ${step >= 3 ? 'active' : ''}`}>
                        <span className="numero">3</span>
                        <span className="texto">Confirmação</span>
                    </div>
                </div>

                <div className="checkout-content">
                    {/* Coluna Principal */}
                    <div className="checkout-form">
                        {/* Step 1: Dados do Cliente */}
                        {step === 1 && (
                            <div className="form-section">
                                <h2><FaUser /> Dados Pessoais</h2>
                                
                                <div className="form-grid">
                                    <div className="form-group full">
                                        <label>Nome Completo *</label>
                                        <input
                                            type="text"
                                            name="nome"
                                            value={dadosCliente.nome}
                                            onChange={handleInputChange}
                                            placeholder="Seu nome completo"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label><FaEnvelope /> E-mail *</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={dadosCliente.email}
                                            onChange={handleInputChange}
                                            placeholder="seu@email.com"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label><FaPhone /> Telefone *</label>
                                        <input
                                            type="tel"
                                            name="telefone"
                                            value={dadosCliente.telefone}
                                            onChange={handleInputChange}
                                            placeholder="(11) 99999-9999"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>CPF</label>
                                        <input
                                            type="text"
                                            name="cpf"
                                            value={dadosCliente.cpf}
                                            onChange={handleInputChange}
                                            placeholder="000.000.000-00"
                                        />
                                    </div>
                                </div>

                                <h2><FaMapMarkerAlt /> Endereço de Entrega</h2>
                                
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>CEP *</label>
                                        <input
                                            type="text"
                                            name="cep"
                                            value={dadosCliente.cep}
                                            onChange={handleCepChange}
                                            placeholder="00000-000"
                                            maxLength="9"
                                            required
                                        />
                                        {buscandoCep && <small style={{color: '#667eea'}}>Buscando CEP...</small>}
                                    </div>

                                    <div className="form-group"></div>

                                    <div className="form-group">
                                        <label>Rua/Avenida *</label>
                                        <input
                                            type="text"
                                            name="endereco"
                                            value={dadosCliente.endereco}
                                            onChange={handleInputChange}
                                            placeholder="Nome da rua"
                                            required
                                        />
                                    </div>

                                    <div className="form-group small">
                                        <label>Número *</label>
                                        <input
                                            type="text"
                                            name="numero"
                                            value={dadosCliente.numero}
                                            onChange={handleInputChange}
                                            placeholder="123"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Complemento</label>
                                        <input
                                            type="text"
                                            name="complemento"
                                            value={dadosCliente.complemento}
                                            onChange={handleInputChange}
                                            placeholder="Apto, bloco..."
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Bairro</label>
                                        <input
                                            type="text"
                                            name="bairro"
                                            value={dadosCliente.bairro}
                                            onChange={handleInputChange}
                                            placeholder="Nome do bairro"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Cidade *</label>
                                        <input
                                            type="text"
                                            name="cidade"
                                            value={dadosCliente.cidade}
                                            onChange={handleInputChange}
                                            placeholder="São Paulo"
                                            required
                                        />
                                    </div>

                                    <div className="form-group small">
                                        <label>UF *</label>
                                        <input
                                            type="text"
                                            name="uf"
                                            value={dadosCliente.uf}
                                            onChange={handleInputChange}
                                            placeholder="SP"
                                            maxLength="2"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="checkout-actions">
                                    <button 
                                        className="btn-voltar-carrinho"
                                        onClick={() => navigate('/catalogo', { state: { abrirCarrinho: true } })}
                                    >
                                        <FaArrowLeft /> Voltar ao Carrinho
                                    </button>
                                    <button 
                                        className="btn-proximo"
                                        onClick={() => validarStep1() && setStep(2)}
                                    >
                                        Próximo: Pagamento
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Pagamento */}
                        {step === 2 && (
                            <div className="form-section">
                                <h2><FaCreditCard /> Forma de Pagamento</h2>
                                
                                <div className="metodos-pagamento">
                                    <div 
                                        className={`metodo-card ${metodoPagamento === 'PIX' ? 'active' : ''}`}
                                        onClick={() => setMetodoPagamento('PIX')}
                                    >
                                        <SlScreenSmartphone />
                                        <span>PIX</span>
                                    </div>

                                    <div 
                                        className={`metodo-card ${metodoPagamento === 'Dinheiro' ? 'active' : ''}`}
                                        onClick={() => setMetodoPagamento('Dinheiro')}
                                    >
                                        <FaMoneyBillWave />
                                        <span>Dinheiro</span>
                                    </div>

                                    <div 
                                        className={`metodo-card ${metodoPagamento === 'Cartão' ? 'active' : ''}`}
                                        onClick={() => setMetodoPagamento('Cartão')}
                                    >
                                        <FaCreditCard />
                                        <span>Cartão</span>
                                    </div>
                                </div>

                                <h2>Observações (Opcional)</h2>
                                <div className="form-group full">
                                    <textarea
                                        value={observacoes}
                                        onChange={(e) => setObservacoes(e.target.value)}
                                        placeholder="Ex: ponto de referência, instruções de entrega..."
                                        rows="3"
                                        className="textarea-observacoes"
                                    />
                                </div>

                                <div className="form-actions">
                                    <button 
                                        className="btn-voltar"
                                        onClick={() => setStep(1)}
                                    >
                                        Voltar
                                    </button>
                                    <button 
                                        className="btn-proximo"
                                        onClick={() => setStep(3)}
                                    >
                                        Próximo: Confirmação
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Confirmação */}
                        {step === 3 && (
                            <div className="form-section">
                                <h2>Confirme seu Pedido</h2>
                                
                                <div className="confirmacao-dados">
                                    <div className="dados-section">
                                        <h3>Dados Pessoais</h3>
                                        <p><strong>Nome:</strong> {dadosCliente.nome}</p>
                                        <p><strong>E-mail:</strong> {dadosCliente.email}</p>
                                        <p><strong>Telefone:</strong> {dadosCliente.telefone}</p>
                                    </div>

                                    <div className="dados-section">
                                        <h3>Endereço de Entrega</h3>
                                        <p>{dadosCliente.endereco}, {dadosCliente.numero}</p>
                                        {dadosCliente.complemento && <p>{dadosCliente.complemento}</p>}
                                        <p>{dadosCliente.bairro}, {dadosCliente.cidade}/{dadosCliente.uf}</p>
                                    </div>

                                    <div className="dados-section">
                                        <h3>Detalhes do Pedido</h3>
                                        <p><strong>Pagamento:</strong> {metodoPagamento}</p>
                                        <p><strong>Entrega:</strong> Delivery</p>
                                    </div>
                                </div>

                                <div className="form-actions">
                                    <button 
                                        className="btn-voltar"
                                        onClick={() => setStep(2)}
                                    >
                                        Voltar
                                    </button>
                                    <button 
                                        className="btn-finalizar"
                                        onClick={finalizarPedido}
                                    >
                                        Finalizar Pedido
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Resumo do Pedido (Sidebar) */}
                    <div className="checkout-resumo">
                        <h3>Resumo do Pedido</h3>
                        
                        <div className="resumo-itens">
                            {carrinho.itens.map(item => (
                                <div key={item.id} className="resumo-item">
                                    <img 
                                        src={item.imagem ? `http://localhost:5000/storage/${item.imagem}` : '/imgs/placeholder.png'}
                                        alt={item.nome}
                                    />
                                    <div className="item-info">
                                        <p className="item-nome">{item.nome}</p>
                                        <p className="item-quantidade">Qtd: {item.quantidade}</p>
                                        
                                        {/* Personalizações */}
                                        {item.personalizacoes && item.personalizacoes.length > 0 && (
                                            <div className="item-personalizacoes">
                                                <span className="personalizacoes-titulo">✨ Personalizações:</span>
                                                {item.personalizacoes.map((p, idx) => (
                                                    <div key={idx} className="personalizacao-item">
                                                        • {p.nome_opcao}: {p.nome_valor}
                                                    </div>
                                                ))}
                                                {item.valor_acrescimo > 0 && (
                                                    <div className="personalizacao-acrescimo">
                                                        + R$ {item.valor_acrescimo.toFixed(2)}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <p className="item-preco">
                                        R$ {((item.valor + (item.valor_acrescimo || 0)) * item.quantidade).toFixed(2)}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {observacoes && (
                            <div className="resumo-observacoes">
                                <strong>Observações:</strong>
                                <p>{observacoes}</p>
                            </div>
                        )}

                        <div className="resumo-total">
                            <div className="total-linha">
                                <span>Subtotal:</span>
                                <span>R$ {carrinho.total.toFixed(2)}</span>
                            </div>
                            <div className="total-linha taxa">
                                <span>Taxa de Entrega:</span>
                                <span>GRÁTIS</span>
                            </div>
                            <div className="total-linha final">
                                <span>Total:</span>
                                <span>R$ {carrinho.total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default Checkout;
