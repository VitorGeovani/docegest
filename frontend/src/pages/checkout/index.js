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

    // Estado para validações em tempo real
    const [errosValidacao, setErrosValidacao] = useState({});
    const [camposValidados, setCamposValidados] = useState({});

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

    // ========== FUNÇÕES DE FORMATAÇÃO ==========
    
    const formatarTelefone = (valor) => {
        const numeros = valor.replace(/\D/g, '');
        if (numeros.length <= 10) {
            return numeros.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
        }
        return numeros.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    };

    const formatarCPF = (valor) => {
        const numeros = valor.replace(/\D/g, '');
        return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4');
    };

    const formatarCEP = (valor) => {
        const numeros = valor.replace(/\D/g, '');
        return numeros.replace(/(\d{5})(\d{0,3})/, '$1-$2');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        let valorFormatado = value;
        
        // Aplicar formatações específicas
        if (name === 'telefone') {
            valorFormatado = formatarTelefone(value);
        } else if (name === 'cpf') {
            valorFormatado = formatarCPF(value);
        } else if (name === 'cep') {
            valorFormatado = formatarCEP(value);
        } else if (name === 'uf') {
            valorFormatado = value.toUpperCase().slice(0, 2);
        } else if (name === 'nome' || name === 'cidade') {
            // Capitalizar primeira letra de cada palavra
            valorFormatado = value.replace(/\b\w/g, (char) => char.toUpperCase());
        }
        
        setDadosCliente(prev => ({ ...prev, [name]: valorFormatado }));
        
        // Validação em tempo real (após 500ms de pausa na digitação)
        if (value.trim().length > 0) {
            setTimeout(() => validarCampo(name, valorFormatado), 500);
        } else {
            setErrosValidacao(prev => ({ ...prev, [name]: '' }));
            setCamposValidados(prev => ({ ...prev, [name]: false }));
        }
    };

    const validarCampo = (campo, valor) => {
        let resultado;
        
        switch (campo) {
            case 'nome':
                resultado = validarNome(valor);
                break;
            case 'email':
                resultado = validarEmail(valor);
                break;
            case 'telefone':
                resultado = validarTelefone(valor);
                break;
            case 'cpf':
                resultado = validarCPF(valor);
                break;
            case 'cep':
                resultado = validarCEP(valor);
                break;
            case 'endereco':
                resultado = validarEndereco(valor);
                break;
            case 'numero':
                resultado = validarNumero(valor);
                break;
            case 'cidade':
                resultado = validarCidade(valor);
                break;
            case 'uf':
                resultado = validarUF(valor);
                break;
            default:
                return;
        }
        
        if (resultado.valido) {
            setErrosValidacao(prev => ({ ...prev, [campo]: '' }));
            setCamposValidados(prev => ({ ...prev, [campo]: true }));
        } else {
            setErrosValidacao(prev => ({ ...prev, [campo]: resultado.mensagem }));
            setCamposValidados(prev => ({ ...prev, [campo]: false }));
        }
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

    // ========== FUNÇÕES DE VALIDAÇÃO ==========
    
    const validarNome = (nome) => {
        if (!nome || nome.trim().length < 3) {
            return { valido: false, mensagem: "Nome deve ter pelo menos 3 caracteres" };
        }
        
        // Verificar se tem pelo menos nome e sobrenome
        const palavras = nome.trim().split(' ').filter(p => p.length > 0);
        if (palavras.length < 2) {
            return { valido: false, mensagem: "Digite nome e sobrenome completos" };
        }
        
        // Verificar se contém apenas letras e espaços
        if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(nome)) {
            return { valido: false, mensagem: "Nome deve conter apenas letras" };
        }
        
        // Verificar se não é um nome obviamente falso
        const nomesTeste = ['teste', 'test', 'fulano', 'ciclano', 'beltrano', 'asdf', 'qwerty', 'nome', 'sobrenome'];
        const nomeMinusculo = nome.toLowerCase();
        if (nomesTeste.some(teste => nomeMinusculo.includes(teste))) {
            return { valido: false, mensagem: "Por favor, digite seu nome real" };
        }
        
        return { valido: true };
    };

    const validarEmail = (email) => {
        if (!email || email.trim().length === 0) {
            return { valido: false, mensagem: "E-mail é obrigatório" };
        }
        
        // Regex completo para validação de e-mail
        const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!regexEmail.test(email)) {
            return { valido: false, mensagem: "E-mail inválido" };
        }
        
        // Verificar domínios temporários ou falsos comuns
        const dominiosInvalidos = ['teste.com', 'test.com', 'fake.com', 'temp.com', 'exemplo.com'];
        const dominio = email.split('@')[1]?.toLowerCase();
        if (dominiosInvalidos.includes(dominio)) {
            return { valido: false, mensagem: "Por favor, use um e-mail válido" };
        }
        
        return { valido: true };
    };

    const validarTelefone = (telefone) => {
        if (!telefone || telefone.trim().length === 0) {
            return { valido: false, mensagem: "Telefone é obrigatório" };
        }
        
        // Remover caracteres não numéricos
        const telefoneLimpo = telefone.replace(/\D/g, '');
        
        // Verificar tamanho (deve ter 10 ou 11 dígitos)
        if (telefoneLimpo.length < 10 || telefoneLimpo.length > 11) {
            return { valido: false, mensagem: "Telefone deve ter 10 ou 11 dígitos" };
        }
        
        // Verificar DDD válido (11 a 99)
        const ddd = parseInt(telefoneLimpo.substring(0, 2));
        if (ddd < 11 || ddd > 99) {
            return { valido: false, mensagem: "DDD inválido" };
        }
        
        // Verificar se não são todos números iguais
        if (/^(\d)\1+$/.test(telefoneLimpo)) {
            return { valido: false, mensagem: "Telefone inválido (números repetidos)" };
        }
        
        // Verificar se o primeiro dígito do celular é 9 (para números com 11 dígitos)
        if (telefoneLimpo.length === 11 && telefoneLimpo[2] !== '9') {
            return { valido: false, mensagem: "Número de celular deve começar com 9" };
        }
        
        return { valido: true };
    };

    const validarCPF = (cpf) => {
        // CPF é opcional, mas se preenchido deve ser válido
        if (!cpf || cpf.trim().length === 0) {
            return { valido: true }; // CPF opcional
        }
        
        const cpfLimpo = cpf.replace(/\D/g, '');
        
        if (cpfLimpo.length !== 11) {
            return { valido: false, mensagem: "CPF deve ter 11 dígitos" };
        }
        
        // Verificar se todos os dígitos são iguais
        if (/^(\d)\1+$/.test(cpfLimpo)) {
            return { valido: false, mensagem: "CPF inválido" };
        }
        
        // Validar dígitos verificadores
        let soma = 0;
        let resto;
        
        for (let i = 1; i <= 9; i++) {
            soma += parseInt(cpfLimpo.substring(i - 1, i)) * (11 - i);
        }
        
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpfLimpo.substring(9, 10))) {
            return { valido: false, mensagem: "CPF inválido" };
        }
        
        soma = 0;
        for (let i = 1; i <= 10; i++) {
            soma += parseInt(cpfLimpo.substring(i - 1, i)) * (12 - i);
        }
        
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpfLimpo.substring(10, 11))) {
            return { valido: false, mensagem: "CPF inválido" };
        }
        
        return { valido: true };
    };

    const validarCEP = (cep) => {
        if (!cep || cep.trim().length === 0) {
            return { valido: false, mensagem: "CEP é obrigatório" };
        }
        
        const cepLimpo = cep.replace(/\D/g, '');
        
        if (cepLimpo.length !== 8) {
            return { valido: false, mensagem: "CEP deve ter 8 dígitos" };
        }
        
        // Verificar se não são todos números iguais
        if (/^(\d)\1+$/.test(cepLimpo)) {
            return { valido: false, mensagem: "CEP inválido" };
        }
        
        return { valido: true };
    };

    const validarEndereco = (endereco) => {
        if (!endereco || endereco.trim().length < 5) {
            return { valido: false, mensagem: "Endereço deve ter pelo menos 5 caracteres" };
        }
        
        // Verificar se não contém palavras de teste
        const palavrasTeste = ['teste', 'test', 'asdf', 'qwerty', 'xxxxx'];
        const enderecoMinusculo = endereco.toLowerCase();
        if (palavrasTeste.some(teste => enderecoMinusculo.includes(teste))) {
            return { valido: false, mensagem: "Por favor, digite um endereço válido" };
        }
        
        return { valido: true };
    };

    const validarNumero = (numero) => {
        if (!numero || numero.trim().length === 0) {
            return { valido: false, mensagem: "Número é obrigatório" };
        }
        
        // Aceitar números e "S/N" para sem número
        if (numero.toUpperCase() === 'S/N' || numero.toUpperCase() === 'SN') {
            return { valido: true };
        }
        
        // Verificar se contém pelo menos um dígito
        if (!/\d/.test(numero)) {
            return { valido: false, mensagem: "Número inválido" };
        }
        
        return { valido: true };
    };

    const validarCidade = (cidade) => {
        if (!cidade || cidade.trim().length < 3) {
            return { valido: false, mensagem: "Cidade deve ter pelo menos 3 caracteres" };
        }
        
        // Verificar se contém apenas letras e espaços
        if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(cidade)) {
            return { valido: false, mensagem: "Cidade deve conter apenas letras" };
        }
        
        return { valido: true };
    };

    const validarUF = (uf) => {
        if (!uf || uf.trim().length !== 2) {
            return { valido: false, mensagem: "UF deve ter 2 caracteres" };
        }
        
        // Lista de UFs válidas
        const ufsValidas = [
            'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
            'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
            'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
        ];
        
        if (!ufsValidas.includes(uf.toUpperCase())) {
            return { valido: false, mensagem: "UF inválida" };
        }
        
        return { valido: true };
    };

    const validarStep1 = () => {
        const { nome, email, telefone, cpf, cep, endereco, numero, cidade, uf } = dadosCliente;
        
        // Validar nome
        const validacaoNome = validarNome(nome);
        if (!validacaoNome.valido) {
            toast.warning(validacaoNome.mensagem);
            return false;
        }
        
        // Validar email
        const validacaoEmail = validarEmail(email);
        if (!validacaoEmail.valido) {
            toast.warning(validacaoEmail.mensagem);
            return false;
        }
        
        // Validar telefone
        const validacaoTelefone = validarTelefone(telefone);
        if (!validacaoTelefone.valido) {
            toast.warning(validacaoTelefone.mensagem);
            return false;
        }
        
        // Validar CPF (se preenchido)
        const validacaoCPF = validarCPF(cpf);
        if (!validacaoCPF.valido) {
            toast.warning(validacaoCPF.mensagem);
            return false;
        }
        
        // Validar CEP
        const validacaoCEP = validarCEP(cep);
        if (!validacaoCEP.valido) {
            toast.warning(validacaoCEP.mensagem);
            return false;
        }
        
        // Validar endereço
        const validacaoEndereco = validarEndereco(endereco);
        if (!validacaoEndereco.valido) {
            toast.warning(validacaoEndereco.mensagem);
            return false;
        }
        
        // Validar número
        const validacaoNumero = validarNumero(numero);
        if (!validacaoNumero.valido) {
            toast.warning(validacaoNumero.mensagem);
            return false;
        }
        
        // Validar cidade
        const validacaoCidade = validarCidade(cidade);
        if (!validacaoCidade.valido) {
            toast.warning(validacaoCidade.mensagem);
            return false;
        }
        
        // Validar UF
        const validacaoUF = validarUF(uf);
        if (!validacaoUF.valido) {
            toast.warning(validacaoUF.mensagem);
            return false;
        }
        
        // Se passou por todas as validações
        toast.success("✅ Dados validados com sucesso!");
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
                                    <div className={`form-group full ${errosValidacao.nome ? 'erro' : ''} ${camposValidados.nome ? 'valido' : ''}`}>
                                        <label>Nome Completo *</label>
                                        <input
                                            type="text"
                                            name="nome"
                                            value={dadosCliente.nome}
                                            onChange={handleInputChange}
                                            placeholder="Seu nome completo"
                                            required
                                        />
                                        {errosValidacao.nome && <small className="erro-mensagem">{errosValidacao.nome}</small>}
                                        {camposValidados.nome && <small className="sucesso-mensagem">✓ Nome válido</small>}
                                    </div>

                                    <div className={`form-group ${errosValidacao.email ? 'erro' : ''} ${camposValidados.email ? 'valido' : ''}`}>
                                        <label><FaEnvelope /> E-mail *</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={dadosCliente.email}
                                            onChange={handleInputChange}
                                            placeholder="seu@email.com"
                                            required
                                        />
                                        {errosValidacao.email && <small className="erro-mensagem">{errosValidacao.email}</small>}
                                        {camposValidados.email && <small className="sucesso-mensagem">✓ E-mail válido</small>}
                                    </div>

                                    <div className={`form-group ${errosValidacao.telefone ? 'erro' : ''} ${camposValidados.telefone ? 'valido' : ''}`}>
                                        <label><FaPhone /> Telefone *</label>
                                        <input
                                            type="tel"
                                            name="telefone"
                                            value={dadosCliente.telefone}
                                            onChange={handleInputChange}
                                            placeholder="(11) 99999-9999"
                                            maxLength="15"
                                            required
                                        />
                                        {errosValidacao.telefone && <small className="erro-mensagem">{errosValidacao.telefone}</small>}
                                        {camposValidados.telefone && <small className="sucesso-mensagem">✓ Telefone válido</small>}
                                    </div>

                                    <div className={`form-group ${errosValidacao.cpf ? 'erro' : ''} ${camposValidados.cpf ? 'valido' : ''}`}>
                                        <label>CPF</label>
                                        <input
                                            type="text"
                                            name="cpf"
                                            value={dadosCliente.cpf}
                                            onChange={handleInputChange}
                                            placeholder="000.000.000-00"
                                            maxLength="14"
                                        />
                                        {errosValidacao.cpf && <small className="erro-mensagem">{errosValidacao.cpf}</small>}
                                        {camposValidados.cpf && <small className="sucesso-mensagem">✓ CPF válido</small>}
                                    </div>
                                </div>

                                <h2><FaMapMarkerAlt /> Endereço de Entrega</h2>
                                
                                <div className="form-grid">
                                    <div className={`form-group ${errosValidacao.cep ? 'erro' : ''} ${camposValidados.cep ? 'valido' : ''}`}>
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
                                        {buscandoCep && <small style={{color: '#667eea'}}>🔍 Buscando CEP...</small>}
                                        {errosValidacao.cep && <small className="erro-mensagem">{errosValidacao.cep}</small>}
                                        {camposValidados.cep && <small className="sucesso-mensagem">✓ CEP válido</small>}
                                    </div>

                                    <div className="form-group"></div>

                                    <div className={`form-group ${errosValidacao.endereco ? 'erro' : ''} ${camposValidados.endereco ? 'valido' : ''}`}>
                                        <label>Rua/Avenida *</label>
                                        <input
                                            type="text"
                                            name="endereco"
                                            value={dadosCliente.endereco}
                                            onChange={handleInputChange}
                                            placeholder="Nome da rua"
                                            required
                                        />
                                        {errosValidacao.endereco && <small className="erro-mensagem">{errosValidacao.endereco}</small>}
                                        {camposValidados.endereco && <small className="sucesso-mensagem">✓ Endereço válido</small>}
                                    </div>

                                    <div className={`form-group small ${errosValidacao.numero ? 'erro' : ''} ${camposValidados.numero ? 'valido' : ''}`}>
                                        <label>Número *</label>
                                        <input
                                            type="text"
                                            name="numero"
                                            value={dadosCliente.numero}
                                            onChange={handleInputChange}
                                            placeholder="123 ou S/N"
                                            required
                                        />
                                        {errosValidacao.numero && <small className="erro-mensagem">{errosValidacao.numero}</small>}
                                        {camposValidados.numero && <small className="sucesso-mensagem">✓</small>}
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

                                    <div className={`form-group ${errosValidacao.cidade ? 'erro' : ''} ${camposValidados.cidade ? 'valido' : ''}`}>
                                        <label>Cidade *</label>
                                        <input
                                            type="text"
                                            name="cidade"
                                            value={dadosCliente.cidade}
                                            onChange={handleInputChange}
                                            placeholder="São Paulo"
                                            required
                                        />
                                        {errosValidacao.cidade && <small className="erro-mensagem">{errosValidacao.cidade}</small>}
                                        {camposValidados.cidade && <small className="sucesso-mensagem">✓ Cidade válida</small>}
                                    </div>

                                    <div className={`form-group small ${errosValidacao.uf ? 'erro' : ''} ${camposValidados.uf ? 'valido' : ''}`}>
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
                                        {errosValidacao.uf && <small className="erro-mensagem">{errosValidacao.uf}</small>}
                                        {camposValidados.uf && <small className="sucesso-mensagem">✓</small>}
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
