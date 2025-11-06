// HeaderCatalogo.js - Header simplificado para página de catálogo
import React from 'react';
import './index.scss';
import { Link } from 'react-router-dom';
import Logo from '../logo';
import { FaHome, FaClipboardList } from 'react-icons/fa';

const HeaderCatalogo = () => {
    return (
        <div className="header-catalogo">
            <Link to='/' className="logo-link">
                <Logo />
            </Link>
            
            <div className="header-actions">
                <Link to='/' className="btn-home">
                    <FaHome />
                    <span>Voltar para Home</span>
                </Link>
                
                <Link to='/meus-pedidos' className="btn-pedidos">
                    <FaClipboardList />
                    <span>Meus Pedidos</span>
                </Link>
            </div>
        </div>
    );
};

export default HeaderCatalogo;
