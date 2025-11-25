import React, { useEffect, useState } from "react";
import './index.scss';
import Header from "../../components/header";
import Footer from "../../components/footer";
import { FaCheckCircle, FaWhatsapp, FaEnvelope, FaCopy } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function PedidoConfirmado() {
    const navigate = useNavigate();
    const [pedidoInfo, setPedidoInfo] = useState(null);
    const [pixCopiado, setPixCopiado] = useState(false);

    useEffect(() => {
        const ultimoPedido = localStorage.getItem('ultimoPedido');
        if (ultimoPedido) {
            setPedidoInfo(JSON.parse(ultimoPedido));
        } else {
            toast.warning("Nenhum pedido encontrado");
            setTimeout(() => navigate('/catalogo'), 2000);
        }
    }, [navigate]);

    const copiarChavePix = () => {
        const chavePix = "contato@segredodosabor.com.br";
        navigator.clipboard.writeText(chavePix);
        setPixCopiado(true);
        toast.success("Chave PIX copiada!");
        setTimeout(() => setPixCopiado(false), 3000);
    };

    const enviarWhatsApp = () => {
        const telefone = "5511967696744";
        const mensagem = `Olá! Acabei de fazer o pedido ${pedidoInfo?.numero || '---'} no site. Gostaria de confirmar os detalhes.`;
        const url = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;
        window.open(url, '_blank');
    };

    const voltarParaCatalogo = () => {
        localStorage.removeItem('ultimoPedido');
        navigate('/catalogo');
    };

    if (!pedidoInfo) {
        return (
            <div className="loading-page">
                <div className="spinner"></div>
                <p>Carregando...</p>
            </div>
        );
    }

    return (
        <div className="pagina-pedido-confirmado">
            <Header />

            <div className="confirmacao-container">
                <div className="sucesso-animacao">
                    <FaCheckCircle className="check-icon" />
                    <h1>Pedido Confirmado!</h1>
                    <p>Seu pedido foi recebido com sucesso</p>
                </div>

                <div className="pedido-info-card">
                    <div className="pedido-numero">
                        <span className="label">Número do Pedido</span>
                        <span className="numero">{pedidoInfo.numero || '---'}</span>
                    </div>

                    {pedidoInfo.whatsappEnviado && (
                        <div className="whatsapp-notificacao">
                            <FaWhatsapp className="whatsapp-icon" />
                            <div className="whatsapp-texto">
                                <strong>Confirmação enviada!</strong>
                                <p>Você receberá atualizações do seu pedido via WhatsApp</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="proximos-passos">
                    <h2>O que acontece agora?</h2>
                    
                    <div className="passos-timeline">
                        <div className="passo-item">
                            <div className="passo-numero">1</div>
                            <div className="passo-conteudo">
                                <h3>Confirmação Recebida</h3>
                                <p>Você já recebeu a confirmação do pedido via WhatsApp</p>
                            </div>
                        </div>

                        <div className="passo-item">
                            <div className="passo-numero">2</div>
                            <div className="passo-conteudo">
                                <h3>Confirme o Pagamento</h3>
                                <p>Envie o comprovante via WhatsApp para confirmarmos</p>
                            </div>
                        </div>

                        <div className="passo-item">
                            <div className="passo-numero">3</div>
                            <div className="passo-conteudo">
                                <h3>Preparação</h3>
                                <p>Seu pedido será preparado com muito carinho</p>
                            </div>
                        </div>

                        <div className="passo-item">
                            <div className="passo-numero">4</div>
                            <div className="passo-conteudo">
                                <h3>Pronto para Entrega!</h3>
                                <p>Você receberá uma notificação quando estiver pronto</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="instrucoes-pix">
                    <h2>Instruções para Pagamento</h2>
                    
                    <div className="pix-info">
                        <div className="info-item">
                            <strong>Chave PIX:</strong>
                            <div className="chave-pix-container">
                                <span>contato@segredodosabor.com.br</span>
                                <button 
                                    className={`btn-copiar ${pixCopiado ? 'copiado' : ''}`}
                                    onClick={copiarChavePix}
                                >
                                    <FaCopy /> {pixCopiado ? 'Copiado!' : 'Copiar'}
                                </button>
                            </div>
                        </div>

                        <div className="info-item">
                            <strong>Favorecido:</strong>
                            <span>Segredos do Sabor</span>
                        </div>
                    </div>

                    <div className="instrucoes-lista">
                        <h3>Como pagar:</h3>
                        <ol>
                            <li>Abra o app do seu banco</li>
                            <li>Escolha a opção PIX</li>
                            <li>Copie e cole a chave PIX acima</li>
                            <li>Confirme o valor e efetue o pagamento</li>
                            <li>Envie o comprovante via WhatsApp</li>
                        </ol>
                    </div>
                </div>

                <div className="acoes-pedido">
                    <button className="btn-whatsapp" onClick={enviarWhatsApp}>
                        <FaWhatsapp /> Enviar Comprovante via WhatsApp
                    </button>

                    <button className="btn-voltar-catalogo" onClick={voltarParaCatalogo}>
                        Voltar para o Catálogo
                    </button>
                </div>

                <div className="info-contato">
                    <h3>Dúvidas? Entre em contato!</h3>
                    <div className="contatos-grid">
                        <div className="contato-item">
                            <FaWhatsapp />
                            <span>(11) 96769-6744</span>
                        </div>
                        <div className="contato-item">
                            <FaEnvelope />
                            <span>contato@segredodosabor.com.br</span>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default PedidoConfirmado;
