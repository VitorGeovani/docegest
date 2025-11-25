// BotaoVoltarTopo.js - Botão flutuante para voltar ao topo da página
import React, { useState, useEffect } from 'react';
import './index.scss';
import { FaArrowUp } from 'react-icons/fa';

const BotaoVoltarTopo = () => {
  const [mostrarBotao, setMostrarBotao] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Mostra o botão quando rolar mais de 300px
      if (window.scrollY > 300) {
        setMostrarBotao(true);
      } else {
        setMostrarBotao(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const voltarAoTopo = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      className={`botao-voltar-topo ${mostrarBotao ? 'visivel' : ''}`}
      onClick={voltarAoTopo}
      aria-label="Voltar ao topo"
    >
      <FaArrowUp />
    </button>
  );
};

export default BotaoVoltarTopo;
