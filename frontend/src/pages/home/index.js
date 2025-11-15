import './index.scss'
import { Link } from 'react-router-dom'
import React from "react";
import Header from "../../components/header";
import BotaoVoltarTopo from "../../components/botaoVoltarTopo";
import Queridinhos from "../../components/queridinhos";
import NossaMarca from "../../components/nossaMarca";
import Foter from '../../components/footer';
import { FaShoppingCart, FaBox, FaHeart, FaTruck, FaWhatsapp, FaStar, FaClock, FaCheckCircle } from 'react-icons/fa';


export default function Home() {
  return (
    <div className="pagina-home">
      <div className="flex-column">
        <Header produtosReservados={[]} />
        <BotaoVoltarTopo />
        
        <main id="main-content" role="main" aria-label="Conteúdo principal">
          {/* Hero Section */}
          <section className="hero-section" aria-label="Apresentação principal">
            <div className="hero-overlay" aria-hidden="true"></div>
            <div className="hero-content">
              <h1 className="hero-title">
                <span role="img" aria-label="emoji de bolo">🍰</span> Segredo do Sabor
              </h1>
              <p className="hero-subtitle">
                Doces artesanais que conquistam corações e paladares
              </p>
              <p className="hero-description">
                Faça seu pedido online de forma rápida, fácil e segura
              </p>
              <div className="hero-actions">
                <Link to="/catalogo" className="btn-primary" aria-label="Ver catálogo completo de produtos">
                  <FaShoppingCart aria-hidden="true" /> Ver Catálogo Completo
                </Link>
                <a href="#como-funciona" className="btn-secondary">
                  Como Funciona
                </a>
              </div>
            </div>
          </section>

        {/* Benefícios */}
        <section className="beneficios-section" aria-label="Benefícios">
          <div className="container">
            <h2 className="section-title">Por que escolher Segredo do Sabor?</h2>
            <div className="beneficios-grid">
              <div className="beneficio-card">
                <div className="beneficio-icon" aria-hidden="true">
                  <FaHeart />
                </div>
                <h3>Feito com Amor</h3>
                <p>Todos os nossos produtos são feitos artesanalmente com ingredientes selecionados</p>
              </div>
              
              <div className="beneficio-card">
                <div className="beneficio-icon" aria-hidden="true">
                  <FaTruck />
                </div>
                <h3>Entrega Rápida</h3>
                <p>Receba seus doces fresquinhos no conforto da sua casa</p>
              </div>
              
              <div className="beneficio-card">
                <div className="beneficio-icon" aria-hidden="true">
                  <FaCheckCircle />
                </div>
                <h3>Qualidade Garantida</h3>
                <p>Satisfação garantida ou seu dinheiro de volta</p>
              </div>
              
              <div className="beneficio-card">
                <div className="beneficio-icon" aria-hidden="true">
                  <FaWhatsapp />
                </div>
                <h3>Atendimento WhatsApp</h3>
                <p>Tire suas dúvidas diretamente pelo WhatsApp</p>
              </div>
            </div>
          </div>
        </section>

        {/* Como Funciona */}
        <section id="como-funciona" className="como-funciona-section" aria-label="Como fazer pedido">
          <div className="container">
            <h2 className="section-title">Como Fazer Seu Pedido</h2>
            <p className="section-subtitle">Em apenas 3 passos simples você garante seus doces favoritos!</p>
            
            <div className="passos-grid">
              <div className="passo-card">
                <div className="passo-numero" aria-label="Passo 1">1</div>
                <div className="passo-icon" aria-hidden="true">
                  <FaShoppingCart />
                </div>
                <h3>Escolha seus Produtos</h3>
                <p>Navegue pelo nosso catálogo e adicione os doces que você mais ama ao carrinho</p>
                <Link to="/catalogo" className="passo-link" aria-label="Ir para o catálogo de produtos">
                  Ir para o Catálogo →
                </Link>
              </div>
              
              <div className="passo-card">
                <div className="passo-numero" aria-label="Passo 2">2</div>
                <div className="passo-icon" aria-hidden="true">
                  <FaBox />
                </div>
                <h3>Finalize o Pedido</h3>
                <p>Preencha seus dados de entrega e escolha a forma de pagamento</p>
              </div>
              
              <div className="passo-card">
                <div className="passo-numero" aria-label="Passo 3">3</div>
                <div className="passo-icon" aria-hidden="true">
                  <FaClock />
                </div>
                <h3>Acompanhe a Entrega</h3>
                <p>Receba atualizações em tempo real e acompanhe seu pedido até a entrega</p>
                <Link to="/meus-pedidos" className="passo-link" aria-label="Ver página de meus pedidos">
                  Ver Meus Pedidos →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section" aria-label="Chamada para ação">
          <div className="cta-content">
            <h2>Pronto para experimentar?</h2>
            <p>Explore nosso catálogo completo e descubra sabores incríveis!</p>
            <div className="cta-actions">
              <Link to="/catalogo" className="btn-cta-primary" aria-label="Fazer pedido agora - ir para catálogo">
                <FaShoppingCart aria-hidden="true" /> Fazer Pedido Agora
              </Link>
              <a 
                href="https://wa.me/5511967696744" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-cta-secondary"
                aria-label="Falar com atendimento pelo WhatsApp - abre em nova janela"
              >
                <FaWhatsapp aria-hidden="true" /> Falar com Atendimento
              </a>
            </div>
          </div>
        </section>

        {/* Depoimentos */}
        <section className="depoimentos-section" aria-label="Depoimentos de clientes">
          <div className="container">
            <h2 className="section-title">O que nossos clientes dizem</h2>
            <div className="depoimentos-grid">
              <div className="depoimento-card">
                <div className="cliente-foto">
                  <img 
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face" 
                    alt="Foto de Maria Silva" 
                    className="foto-cliente"
                  />
                </div>
                <div className="depoimento-stars" aria-label="Avaliação: 5 de 5 estrelas">
                  <FaStar aria-hidden="true" />
                  <FaStar aria-hidden="true" />
                  <FaStar aria-hidden="true" />
                  <FaStar aria-hidden="true" />
                  <FaStar aria-hidden="true" />
                </div>
                <p>"Os melhores doces que já experimentei! A qualidade é excepcional e a entrega super rápida."</p>
                <div className="depoimento-autor">
                  <strong>Maria Silva</strong>
                  <span>Cliente desde 2024</span>
                </div>
              </div>
              
              <div className="depoimento-card">
                <div className="cliente-foto">
                  <img 
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" 
                    alt="Foto de João Santos" 
                    className="foto-cliente"
                  />
                </div>
                <div className="depoimento-stars" aria-label="Avaliação: 5 de 5 estrelas">
                  <FaStar aria-hidden="true" />
                  <FaStar aria-hidden="true" />
                  <FaStar aria-hidden="true" />
                  <FaStar aria-hidden="true" />
                  <FaStar aria-hidden="true" />
                </div>
                <p>"Compro toda semana! Os cones recheados são simplesmente divinos. Recomendo muito!"</p>
                <div className="depoimento-autor">
                  <strong>João Santos</strong>
                  <span>Cliente desde 2023</span>
                </div>
              </div>
              
              <div className="depoimento-card">
                <div className="cliente-foto">
                  <img 
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face" 
                    alt="Foto de Ana Paula" 
                    className="foto-cliente"
                  />
                </div>
                <div className="depoimento-stars" aria-label="Avaliação: 5 de 5 estrelas">
                  <FaStar aria-hidden="true" />
                  <FaStar aria-hidden="true" />
                  <FaStar aria-hidden="true" />
                  <FaStar aria-hidden="true" />
                  <FaStar aria-hidden="true" />
                </div>
                <p>"Atendimento impecável e produtos fresquinhos. Virei cliente fiel!"</p>
                <div className="depoimento-autor">
                  <strong>Ana Paula</strong>
                  <span>Cliente desde 2024</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Queridinhos />
        <NossaMarca />
        </main>
        
        <Foter />
      </div>
    </div>
  );
}