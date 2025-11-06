// Footer.js
import React from 'react';
import './index.scss';
import { FaFacebook, FaInstagram, FaWhatsapp, FaMapMarkerAlt, FaPhone, FaShoppingCart } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer id='footer' className="footer-moderno" role="contentinfo" aria-label="Rodapé do site">
    <div className="footer-container">
      {/* Grid Principal */}
      <div className="footer-grid">
        {/* Coluna 1 - Logo e Descrição */}
        <div className="footer-coluna footer-sobre">
          <div className="footer-logo">
            <img 
              src="/imgs/logo_segredo_branca-removebg.png" 
              alt="Logo Segredo do Sabor - Confeitaria Artesanal"
              title="Logo Segredo do Sabor - Confeitaria Artesanal"
              width="120"
              height="auto"
            />
          </div>
          <p className="footer-descricao">
            Doces artesanais que conquistam corações e paladares desde 2023.
          </p>
          <div id="contatos" className="footer-social" role="navigation" aria-label="Redes sociais">
            <a 
              href="https://facebook.com/segredosabor" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-link"
              aria-label="Visite nossa página no Facebook (abre em nova aba)"
            >
              <FaFacebook aria-hidden="true" />
            </a>
            <a 
              href="https://instagram.com/segredosabor.confeitaria" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-link"
              aria-label="Visite nosso perfil no Instagram (abre em nova aba)"
            >
              <FaInstagram aria-hidden="true" />
            </a>
            <a 
              href="https://wa.me/5511997661964" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-link"
              aria-label="Entre em contato pelo WhatsApp (abre em nova aba)"
            >
              <FaWhatsapp aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* Coluna 2 - Links Rápidos */}
        <div className="footer-coluna">
          <h3 className="footer-titulo">Links Rápidos</h3>
          <ul className="footer-links">
            <li><a href="#home" aria-label="Ir para seção Home">Home</a></li>
            <li><a href="#produtos" aria-label="Ir para seção Produtos">Produtos</a></li>
            <li><a href="#nossaMarca" aria-label="Ir para seção Nossa Marca">Nossa Marca</a></li>
            <li><Link to="/catalogo" aria-label="Ver catálogo completo de produtos">Catálogo Completo</Link></li>
            <li><Link to="/meus-pedidos" aria-label="Ver meus pedidos">Meus Pedidos</Link></li>
          </ul>
        </div>

        {/* Coluna 3 - Contato */}
        <div className="footer-coluna">
          <h3 className="footer-titulo">Contato</h3>
          <ul className="footer-contatos">
            <li>
              <FaMapMarkerAlt className="icon" aria-hidden="true" />
              <span>Av. Engenheiro Eusébio Stevaux, 600<br />Santo Amaro, 04696-000</span>
            </li>
            <li>
              <FaPhone className="icon" aria-hidden="true" />
              <a href="tel:5511997661964" aria-label="Ligar para (11) 99766-1964">(11) 99766-1964</a>
            </li>
            <li>
              <FaWhatsapp className="icon" aria-hidden="true" />
              <a href="https://wa.me/5511997661964" target="_blank" rel="noopener noreferrer" aria-label="Enviar mensagem pelo WhatsApp (abre em nova aba)">WhatsApp</a>
            </li>
            <li>
              <FaInstagram className="icon" aria-hidden="true" />
              <a href="https://instagram.com/segredosabor.confeitaria" target="_blank" rel="noopener noreferrer" aria-label="Visitar perfil do Instagram @segredosabor.confeitaria (abre em nova aba)">@segredosabor.confeitaria</a>
            </li>
          </ul>
        </div>

        {/* Coluna 4 - Horário */}
        <div className="footer-coluna">
          <h3 className="footer-titulo">Horário de Atendimento</h3>
          <ul className="footer-horario">
            <li>
              <strong>Segunda a Sexta</strong>
              <span>09:00 - 18:00</span>
            </li>
            <li>
              <strong>Sábado</strong>
              <span>09:00 - 14:00</span>
            </li>
            <li>
              <strong>Domingo</strong>
              <span>Fechado</span>
            </li>
          </ul>
          <Link to="/catalogo" className="footer-cta" aria-label="Fazer pedido - ir para catálogo">
            <FaShoppingCart aria-hidden="true" />
            <span>Fazer Pedido</span>
          </Link>
        </div>
      </div>

      {/* Linha Divisória */}
      <div className="footer-divisor"></div>

      {/* Rodapé Inferior */}
      <div className="footer-bottom">
        <p className="footer-copyright">
          © 2023-2025 <strong>Segredo do Sabor</strong>. Todos os direitos reservados.
        </p>
        <div className="footer-links-bottom">
          <Link to="/politica-privacidade">Política de Privacidade</Link>
          <span>•</span>
          <Link to="/termos-uso">Termos de Uso</Link>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
