import './index.scss';
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../logo';
import { FaShoppingCart, FaClipboardList, FaUser, FaHeart } from 'react-icons/fa';

const Menu = ({ produtosReservados = [] }) => {
    return (
        <header className="menu" role="banner">
            <Link to='/' className="logo-link" aria-label="Ir para página inicial">
                <Logo />
            </Link>
            
            {/* Navegação Principal */}
            <nav id="navigation" className="menu-nav" role="navigation" aria-label="Menu principal">
                <a href="#produtos" className="nav-link">Produtos</a>
                <a href="#nossaMarca" className="nav-link">Nossa Marca</a>
                <Link to="/sobre" className="nav-link">Sobre Nós</Link>
                <a href="#contatos" className="nav-link">Contato</a>
            </nav>

            {/* Ações do Usuário */}
            <div className="menu-actions" role="navigation" aria-label="Ações do usuário">
                <Link to='/catalogo' className="action-btn catalogo-btn" aria-label="Ver catálogo de produtos">
                    <FaShoppingCart aria-hidden="true" />
                    <span>Catálogo</span>
                </Link>
                <Link to='/favoritos' className="action-btn favoritos-btn" aria-label="Ver meus favoritos">
                    <FaHeart aria-hidden="true" />
                    <span>Favoritos</span>
                </Link>
                <Link to='/meus-pedidos' className="action-btn pedidos-btn" aria-label="Ver meus pedidos">
                    <FaClipboardList aria-hidden="true" />
                    <span>Meus Pedidos</span>
                </Link>
                <Link to='/login' className="action-btn login-btn" aria-label="Fazer login">
                    <FaUser aria-hidden="true" />
                    <span>Login</span>
                </Link>
            </div>
        </header>
    );
};

export default Menu;