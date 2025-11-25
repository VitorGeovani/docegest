import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import './ChatAssistente.scss';

const ChatAssistente = () => {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [mensagens, setMensagens] = useState([]);
    const [inputMensagem, setInputMensagem] = useState('');
    const [carregando, setCarregando] = useState(false);
    const [sugestoes, setSugestoes] = useState([]);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    
    // URL base do backend
    const API_URL = 'http://localhost:5000';

    // Auto scroll para última mensagem
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [mensagens]);

    // Mensagem de boas-vindas ao abrir
    useEffect(() => {
        if (isOpen && mensagens.length === 0) {
            carregarSaudacao();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    // Foco no input ao abrir
    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
        }
    }, [isOpen]);
    
    // Mostrar apenas na página Home (rota '/')
    // IMPORTANTE: Esta verificação vem DEPOIS de todos os hooks
    if (location.pathname !== '/') {
        return null;
    }

    const carregarSaudacao = async () => {
        try {
            const response = await fetch(`${API_URL}/api/assistente/saudacao`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            // Verifica se a resposta é JSON válido
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Backend não está respondendo corretamente');
            }
            
            const data = await response.json();
            
            if (data.sucesso && data.saudacao) {
                setMensagens([{
                    tipo: 'assistente',
                    texto: data.saudacao,
                    timestamp: new Date(),
                    idMensagem: 'saudacao-inicial' // ID único para feedback
                }]);
                
                // Carregar menu principal
                carregarMenu();
            } else {
                // Fallback: saudação padrão se backend não responder corretamente
                setMensagens([{
                    tipo: 'assistente',
                    texto: `👋 Olá! Sou o assistente virtual do Segredo do Sabor!\n\n` +
                           `Como posso ajudar você hoje? 🍰`,
                    timestamp: new Date(),
                    idMensagem: 'saudacao-padrao'
                }]);
                carregarMenu();
            }
        } catch (error) {
            console.error('Erro ao carregar saudação:', error);
            
            // Mensagem amigável quando backend está offline
            setMensagens([{
                tipo: 'assistente',
                texto: `👋 Olá! Sou o assistente virtual do Segredo do Sabor!\n\n` +
                       `🤖 Como posso ajudar você hoje?\n\n` +
                       `Você pode:\n` +
                       `• Consultar pedidos (ex: #PED000037)\n` +
                       `• Ver nosso cardápio\n` +
                       `• Tirar dúvidas sobre produtos\n` +
                       `• Fazer um pedido`,
                timestamp: new Date(),
                idMensagem: 'saudacao-offline',
                semBackend: true
            }]);
            
            // Sugestões padrão quando offline
            setSugestoes([
                'Ver cardápio',
                'Como fazer pedido',
                'Formas de pagamento',
                'Horário de funcionamento'
            ]);
        }
    };

    const carregarMenu = async () => {
        try {
            const response = await fetch(`${API_URL}/api/assistente/menu`);
            const data = await response.json();
            
            if (data.sucesso) {
                setSugestoes(data.opcoes || []);
            }
        } catch (error) {
            console.error('Erro ao carregar menu:', error);
        }
    };

    const enviarMensagem = async (mensagemTexto = null) => {
        const texto = mensagemTexto || inputMensagem.trim();
        
        if (!texto) return;

        // Adicionar mensagem do usuário
        const novaMensagemUsuario = {
            tipo: 'usuario',
            texto: texto,
            timestamp: new Date(),
            idMensagem: `user-${Date.now()}`
        };
        
        setMensagens(prev => [...prev, novaMensagemUsuario]);
        setInputMensagem('');
        setCarregando(true);
        setSugestoes([]);

        try {
            // Enviar para o backend
            const response = await fetch(`${API_URL}/api/assistente/mensagem`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    mensagem: texto,
                    contexto: {
                        origem: 'web-chat',
                        idCliente: localStorage.getItem('idCliente') || null,
                        telefone: localStorage.getItem('telefone') || null
                    }
                })
            });

            const data = await response.json();

            if (data.sucesso) {
                // Adicionar resposta do assistente
                const novaMensagemAssistente = {
                    tipo: 'assistente',
                    texto: data.resposta,
                    categoria: data.categoria,
                    confianca: data.confianca,
                    timestamp: new Date(),
                    idMensagem: `bot-${Date.now()}`
                };
                
                setMensagens(prev => [...prev, novaMensagemAssistente]);
                
                // Atualizar sugestões
                if (data.sugestoes && data.sugestoes.length > 0) {
                    setSugestoes(data.sugestoes);
                }

                // Se houver pedido encontrado, mostrar detalhes
                if (data.pedido) {
                    mostrarDetalhesPedido(data.pedido);
                }
            } else {
                throw new Error(data.erro || 'Erro ao processar mensagem');
            }
        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
            
            // Mensagem de erro mais específica
            let mensagemErro = 'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.';
            
            if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
                mensagemErro = '⚠️ Não foi possível conectar ao servidor. Verifique se o backend está rodando na porta 5000.';
            }
            
            setMensagens(prev => [...prev, {
                tipo: 'erro',
                texto: mensagemErro,
                timestamp: new Date(),
                idMensagem: `error-${Date.now()}`
            }]);
        } finally {
            setCarregando(false);
        }
    };

    const mostrarDetalhesPedido = (pedido) => {
        const textoPedido = `
📦 *Pedido #${pedido.codigo}*

${pedido.statusEmoji} Status: ${pedido.status}
📅 Data: ${pedido.data}
⏰ Hora: ${pedido.hora}
💰 Valor: R$ ${pedido.valor}
        `.trim();

        setMensagens(prev => [...prev, {
            tipo: 'assistente',
            texto: textoPedido,
            timestamp: new Date()
        }]);
    };

    const enviarFeedback = async (indice, feedback) => {
        try {
            const mensagem = mensagens[indice];
            
            // Se não houver texto ou for uma mensagem sem backend, não enviar
            if (!mensagem.texto || mensagem.semBackend) {
                // Apenas marcar visualmente como feedback enviado
                setMensagens(prev => prev.map((msg, idx) => 
                    idx === indice ? { ...msg, feedbackEnviado: feedback } : msg
                ));
                return;
            }
            
            const response = await fetch(`${API_URL}/api/assistente/feedback`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    mensagem: mensagem.idMensagem || mensagem.texto,
                    feedback: feedback,
                    contexto: {
                        categoria: mensagem.categoria,
                        timestamp: mensagem.timestamp
                    }
                })
            });

            const data = await response.json();

            if (data.sucesso || response.ok) {
                // Atualizar estado da mensagem para marcar feedback
                setMensagens(prev => prev.map((msg, idx) => 
                    idx === indice ? { ...msg, feedbackEnviado: feedback } : msg
                ));
            } else {
                // Mesmo com erro, marcar feedback localmente
                setMensagens(prev => prev.map((msg, idx) => 
                    idx === indice ? { ...msg, feedbackEnviado: feedback } : msg
                ));
            }
        } catch (error) {
            console.error('Erro ao enviar feedback:', error);
            // Marcar feedback localmente mesmo com erro de rede
            setMensagens(prev => prev.map((msg, idx) => 
                idx === indice ? { ...msg, feedbackEnviado: feedback } : msg
            ));
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            enviarMensagem();
        }
    };

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const formatarTimestamp = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="chat-assistente" role="complementary" aria-label="Chat do Assistente Virtual">
            {/* Botão flutuante */}
            <button
                className={`chat-assistente__toggle ${isOpen ? 'chat-assistente__toggle--open' : ''}`}
                onClick={toggleChat}
                aria-label={isOpen ? 'Fechar chat' : 'Abrir chat do assistente'}
                aria-expanded={isOpen}
                title={isOpen ? 'Fechar chat' : 'Fale conosco'}
            >
                {isOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M6.225 4.811a1 1 0 00-1.414 1.414L10.586 12 4.81 17.775a1 1 0 101.414 1.414L12 13.414l5.775 5.775a1 1 0 001.414-1.414L13.414 12l5.775-5.775a1 1 0 00-1.414-1.414L12 10.586 6.225 4.81z"/>
                    </svg>
                ) : (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M12 2C6.486 2 2 6.486 2 12c0 1.89.525 3.66 1.438 5.168L2.546 20.2A1 1 0 003.8 21.454l3.032-.892A9.957 9.957 0 0012 22c5.514 0 10-4.486 10-10S17.514 2 12 2zm0 18c-1.816 0-3.505-.602-4.867-1.615l-.316-.235-2.436.716.716-2.436-.235-.316A7.961 7.961 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z"/>
                        </svg>
                        {mensagens.length > 0 && (
                            <span className="chat-assistente__badge" aria-label="Novas mensagens">
                                {mensagens.length}
                            </span>
                        )}
                    </>
                )}
            </button>

            {/* Janela do chat */}
            {isOpen && (
                <div className="chat-assistente__window" role="dialog" aria-label="Janela do Chat">
                    {/* Header */}
                    <div className="chat-assistente__header">
                        <div className="chat-assistente__header-info">
                            <div className="chat-assistente__avatar" aria-hidden="true">
                                🤖
                            </div>
                            <div>
                                <h3 className="chat-assistente__title">Assistente Virtual</h3>
                                <p className="chat-assistente__status">
                                    <span className="chat-assistente__status-indicator" aria-label="Online"></span>
                                    Online - Pronto para ajudar!
                                </p>
                            </div>
                        </div>
                        <button
                            className="chat-assistente__close"
                            onClick={toggleChat}
                            aria-label="Fechar chat"
                            title="Fechar"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Mensagens */}
                    <div 
                        className="chat-assistente__messages"
                        role="log"
                        aria-live="polite"
                        aria-atomic="false"
                    >
                        {mensagens.map((mensagem, index) => (
                            <div
                                key={index}
                                className={`chat-assistente__message chat-assistente__message--${mensagem.tipo}`}
                                role="article"
                            >
                                {mensagem.tipo === 'assistente' && (
                                    <div className="chat-assistente__message-avatar" aria-hidden="true">
                                        🤖
                                    </div>
                                )}
                                <div className="chat-assistente__message-content">
                                    <div className="chat-assistente__message-bubble">
                                        <p className="chat-assistente__message-text">
                                            {mensagem.texto}
                                        </p>
                                        <span className="chat-assistente__message-time">
                                            {formatarTimestamp(mensagem.timestamp)}
                                        </span>
                                    </div>
                                    
                                    {/* Feedback (apenas para mensagens do assistente) */}
                                    {mensagem.tipo === 'assistente' && !mensagem.feedbackEnviado && (
                                        <div className="chat-assistente__feedback" role="group" aria-label="Esta resposta foi útil?">
                                            <button
                                                className="chat-assistente__feedback-btn chat-assistente__feedback-btn--positive"
                                                onClick={() => enviarFeedback(index, 'positivo')}
                                                aria-label="Sim, foi útil"
                                                title="👍 Útil"
                                            >
                                                👍
                                            </button>
                                            <button
                                                className="chat-assistente__feedback-btn chat-assistente__feedback-btn--negative"
                                                onClick={() => enviarFeedback(index, 'negativo')}
                                                aria-label="Não, não foi útil"
                                                title="👎 Não útil"
                                            >
                                                👎
                                            </button>
                                        </div>
                                    )}
                                    
                                    {/* Indicador de feedback enviado */}
                                    {mensagem.feedbackEnviado && (
                                        <div className="chat-assistente__feedback-sent" aria-live="polite">
                                            {mensagem.feedbackEnviado === 'positivo' ? '✅ Obrigado!' : '📝 Feedback recebido'}
                                        </div>
                                    )}
                                </div>
                                {mensagem.tipo === 'usuario' && (
                                    <div className="chat-assistente__message-avatar chat-assistente__message-avatar--user" aria-hidden="true">
                                        👤
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Indicador de digitação */}
                        {carregando && (
                            <div className="chat-assistente__message chat-assistente__message--assistente">
                                <div className="chat-assistente__message-avatar" aria-hidden="true">
                                    🤖
                                </div>
                                <div className="chat-assistente__typing" role="status" aria-label="Assistente está digitando">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Sugestões */}
                    {sugestoes.length > 0 && (
                        <div className="chat-assistente__suggestions" role="list" aria-label="Sugestões de perguntas">
                            {sugestoes.map((sugestao, index) => (
                                <button
                                    key={index}
                                    className="chat-assistente__suggestion"
                                    onClick={() => enviarMensagem(sugestao)}
                                    role="listitem"
                                >
                                    {sugestao}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input */}
                    <form 
                        className="chat-assistente__input-container"
                        onSubmit={(e) => {
                            e.preventDefault();
                            enviarMensagem();
                        }}
                    >
                        <label htmlFor="chat-input" className="sr-only">
                            Digite sua mensagem
                        </label>
                        <textarea
                            id="chat-input"
                            ref={inputRef}
                            className="chat-assistente__input"
                            value={inputMensagem}
                            onChange={(e) => setInputMensagem(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Digite sua mensagem..."
                            rows="1"
                            disabled={carregando}
                            aria-label="Campo de mensagem"
                            maxLength="500"
                        />
                        <button
                            type="submit"
                            className="chat-assistente__send"
                            disabled={!inputMensagem.trim() || carregando}
                            aria-label="Enviar mensagem"
                            title="Enviar (Enter)"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                            </svg>
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ChatAssistente;
