import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaCookie, FaBirthdayCake, FaTruck, FaUsers, FaAward, FaStar, FaInstagram, FaFacebook, FaWhatsapp, FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa';
import HeaderCatalogo from '../../components/headerCatalogo';
import Footer from '../../components/footer';
import BotaoVoltarTopo from '../../components/botaoVoltarTopo';
import './index.scss';

const SobreNos = () => {
    useEffect(() => {
        // Scroll suave ao topo ao carregar a página
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const estatisticas = [
        { numero: '5+', texto: 'Anos de Experiência', icone: FaAward },
        { numero: '2000+', texto: 'Clientes Satisfeitos', icone: FaUsers },
        { numero: '500+', texto: 'Receitas Especiais', icone: FaBirthdayCake },
        { numero: '4.9', texto: 'Avaliação Média', icone: FaStar }
    ];

    const diferenciais = [
        {
            icone: FaCookie,
            titulo: 'Ingredientes Premium',
            descricao: 'Utilizamos apenas ingredientes de alta qualidade, selecionados cuidadosamente para garantir o melhor sabor em cada mordida.'
        },
        {
            icone: FaHeart,
            titulo: 'Feito com Amor',
            descricao: 'Cada doce é preparado com carinho e dedicação, como se fosse para nossa própria família.'
        },
        {
            icone: FaTruck,
            titulo: 'Entrega Cuidadosa',
            descricao: 'Embalagens especiais e entrega com todo cuidado para seu pedido chegar perfeito.'
        },
        {
            icone: FaUsers,
            titulo: 'Atendimento Personalizado',
            descricao: 'Criamos doces personalizados para tornar seu evento ainda mais especial e memorável.'
        }
    ];

    const depoimentos = [
        {
            nome: 'Maria Silva',
            texto: 'Os doces são simplesmente divinos! O bolo de aniversário do meu filho foi um sucesso, todos elogiaram!',
            nota: 5
        },
        {
            nome: 'João Santos',
            texto: 'Melhor confeitaria da região! Encomendo sempre para eventos da empresa. Qualidade impecável.',
            nota: 5
        },
        {
            nome: 'Ana Costa',
            texto: 'Atendimento maravilhoso e produtos de primeira. Os brigadeiros gourmet são viciantes!',
            nota: 5
        }
    ];

    return (
        <div className="pagina-sobre">
            <HeaderCatalogo />
            
            <main>
                {/* Hero Section */}
                <section className="hero-sobre">
                    <div className="hero-overlay"></div>
                    <div className="hero-content">
                        <span className="hero-tag">🍰 Nossa História</span>
                        <h1>Segredo do Sabor</h1>
                        <p>Transformando momentos especiais em doces memórias desde 2019</p>
                        <div className="hero-cta">
                            <Link to="/catalogo" className="btn-primary">
                                Ver Catálogo
                            </Link>
                            <a href="#contato" className="btn-secondary">
                                Fale Conosco
                            </a>
                        </div>
                    </div>
                </section>

                {/* Nossa História */}
                <section className="nossa-historia">
                    <div className="container">
                        <div className="historia-content">
                            <div className="historia-texto">
                                <span className="section-tag">Sobre Nós</span>
                                <h2>Uma Paixão que Virou Tradição</h2>
                                <p>
                                    O <strong>Segredo do Sabor</strong> nasceu do amor pela confeitaria e do desejo de 
                                    criar doces que despertam emoções. O que começou como um hobby, 
                                    preparando bolos para família e amigos, transformou-se em uma confeitaria 
                                    reconhecida pela qualidade e sabor incomparável.
                                </p>
                                <p>
                                    Cada receita carrega o carinho de gerações, combinando técnicas 
                                    tradicionais com inovações que surpreendem. Nosso compromisso é 
                                    fazer parte dos momentos mais especiais da sua vida, seja um 
                                    aniversário, casamento, ou simplesmente um café da tarde em família.
                                </p>
                                <p>
                                    Acreditamos que o segredo de um bom doce está nos detalhes: ingredientes 
                                    frescos, preparo artesanal e muito amor em cada etapa do processo.
                                </p>
                            </div>
                            <div className="historia-imagem">
                                <div className="imagem-container">
                                    <img 
                                        src="/imgs/confeitaria-artesanal.jpg" 
                                        alt="Confeitaria artesanal Segredo do Sabor"
                                        onError={(e) => {
                                            e.target.src = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600';
                                        }}
                                    />
                                    <div className="imagem-badge">
                                        <span>+5 Anos</span>
                                        <small>de tradição</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Estatísticas */}
                <section className="estatisticas">
                    <div className="container">
                        <div className="stats-grid">
                            {estatisticas.map((stat, index) => {
                                const Icon = stat.icone;
                                return (
                                    <div key={index} className="stat-item">
                                        <Icon className="stat-icon" />
                                        <span className="stat-numero">{stat.numero}</span>
                                        <span className="stat-texto">{stat.texto}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Diferenciais */}
                <section className="diferenciais">
                    <div className="container">
                        <div className="section-header">
                            <span className="section-tag">Por que nos escolher</span>
                            <h2>Nossos Diferenciais</h2>
                            <p>O que nos torna especiais e únicos no mercado</p>
                        </div>
                        <div className="diferenciais-grid">
                            {diferenciais.map((diff, index) => {
                                const Icon = diff.icone;
                                return (
                                    <div key={index} className="diferencial-card">
                                        <div className="diferencial-icon">
                                            <Icon />
                                        </div>
                                        <h3>{diff.titulo}</h3>
                                        <p>{diff.descricao}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Depoimentos */}
                <section className="depoimentos">
                    <div className="container">
                        <div className="section-header">
                            <span className="section-tag">Depoimentos</span>
                            <h2>O que dizem nossos clientes</h2>
                        </div>
                        <div className="depoimentos-grid">
                            {depoimentos.map((dep, index) => (
                                <div key={index} className="depoimento-card">
                                    <div className="depoimento-stars">
                                        {[...Array(dep.nota)].map((_, i) => (
                                            <FaStar key={i} />
                                        ))}
                                    </div>
                                    <p>"{dep.texto}"</p>
                                    <div className="depoimento-autor">
                                        <div className="autor-avatar">
                                            {dep.nome.charAt(0)}
                                        </div>
                                        <span>{dep.nome}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Contato com Mapa */}
                <section className="contato" id="contato">
                    <div className="contato-mapa-bg">
                        <iframe 
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3656.0977436788647!2d-46.70956492377931!3d-23.626562378737644!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce50f2c6b5e3df%3A0x38b3d9c0c8d0a7e9!2sAv.%20Eng.%20Eus%C3%A9bio%20Stevaux%2C%20600%20-%20Santo%20Amaro%2C%20S%C3%A3o%20Paulo%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1701380000000!5m2!1spt-BR!2sbr"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Localização Segredo do Sabor"
                        ></iframe>
                    </div>
                    <div className="container">
                        <div className="contato-content">
                            <div className="contato-info">
                                <span className="section-tag">Contato</span>
                                <h2>Entre em Contato</h2>
                                <p>Ficou com alguma dúvida ou quer fazer uma encomenda especial? Fale conosco!</p>
                                
                                <div className="info-items">
                                    <div className="info-item">
                                        <FaMapMarkerAlt />
                                        <div>
                                            <strong>Endereço</strong>
                                            <span>Av. Engenheiro Eusébio Stevaux, 600 - Santo Amaro, SP</span>
                                        </div>
                                    </div>
                                    <div className="info-item">
                                        <FaPhone />
                                        <div>
                                            <strong>Telefone</strong>
                                            <span>(11) 99766-1964</span>
                                        </div>
                                    </div>
                                    <div className="info-item">
                                        <FaEnvelope />
                                        <div>
                                            <strong>E-mail</strong>
                                            <span>contato@segredodosabor.com.br</span>
                                        </div>
                                    </div>
                                    <div className="info-item">
                                        <FaClock />
                                        <div>
                                            <strong>Horário</strong>
                                            <span>Segunda a Sábado: 8h às 19h</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="social-links">
                                    <a href="https://instagram.com/segredosabor.confeitaria" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                                        <FaInstagram />
                                    </a>
                                    <a href="https://facebook.com/segredosabor" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                                        <FaFacebook />
                                    </a>
                                    <a href="https://wa.me/5511997661964" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                                        <FaWhatsapp />
                                    </a>
                                </div>
                            </div>
                            
                            <div className="contato-cta">
                                <div className="cta-card">
                                    <h3>🎂 Faça sua Encomenda</h3>
                                    <p>Bolos, doces e sobremesas personalizadas para seu evento especial</p>
                                    <a 
                                        href="https://wa.me/5511997661964?text=Olá! Gostaria de fazer uma encomenda especial." 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="btn-whatsapp"
                                    >
                                        <FaWhatsapp /> Falar no WhatsApp
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Final */}
                <section className="cta-final">
                    <div className="container">
                        <h2>Pronto para experimentar?</h2>
                        <p>Descubra nosso catálogo completo e escolha seus favoritos</p>
                        <Link to="/catalogo" className="btn-cta">
                            🛒 Ver Catálogo Completo
                        </Link>
                    </div>
                </section>
            </main>

            <BotaoVoltarTopo />
            <Footer />
        </div>
    );
};

export default SobreNos;
