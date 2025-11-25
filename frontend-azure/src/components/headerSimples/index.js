// HeaderSimples.js - Header simplificado para páginas institucionais
import React from 'react';
import './index.scss';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';

const HeaderSimples = () => (
  <header className="header-simples">
    <div className="header-content">
      <Link to="/" className="logo-link">
        <img 
          src="/imgs/logo_segredo_branca-removebg.png" 
          alt="Logo Segredo do Sabor" 
          className="logo-img"
        />
      </Link>
      
      <Link to="/" className="btn-voltar-home">
        <FaHome />
        <span>Voltar para Home</span>
      </Link>
    </div>
  </header>
);

export default HeaderSimples;
