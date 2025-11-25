// Marca.js
import React from 'react';
import './index.scss';
import CarrosselNossaMarca from '../carrosselNossaMarca';
import { FaHeart, FaLightbulb, FaAward, FaBullseye, FaEye } from 'react-icons/fa';

const Marca = () => (
  <section id='nossaMarca' className="secao-nossa-marca" aria-label="Sobre nossa marca">
    <div className="marca-container">
      {/* Header */}
      <div className="marca-header">
        <h2 className="marca-titulo">Nossa Marca</h2>
        <div className="marca-linha" aria-hidden="true"></div>
      </div>

      {/* Grid Principal */}
      <div className="marca-grid">
        {/* Sobre */}
        <div className="marca-sobre">
          <p className="marca-texto">
            <strong>Segredo do Sabor</strong> nasceu em 2023 com uma missão clara: transformar a
            experiência dos amantes de cones em algo verdadeiramente inesquecível.
            Especializados na criação e vendas de cones que unem sabor e inovação,
            nossa marca é um convite para explorar um mundo de possibilidades
            gastronômicas.
          </p>
          <p className="marca-texto">
            Guiados pela visão criativa de <strong>João</strong>, nosso idealizador, cada detalhe é
            pensado com cuidado, desde os ingredientes selecionados até a
            apresentação única. Combinamos tradição e modernidade, trazendo sabores
            que encantam e surpresas que conquistam a cada mordida.
          </p>
        </div>

        {/* Carrossel */}
        <div className="marca-carrossel">
          <CarrosselNossaMarca />
        </div>
      </div>

      {/* Cards de Valores */}
      <div className="valores-grid" role="list" aria-label="Nossos valores e missão">
        <div className="valor-card" role="listitem">
          <div className="valor-icon" aria-hidden="true">
            <FaBullseye />
          </div>
          <h3 className="valor-titulo">Missão</h3>
          <p className="valor-texto">
            Surpreender e conectar pessoas por meio de criações únicas que celebram
            o prazer de saborear.
          </p>
        </div>

        <div className="valor-card" role="listitem">
          <div className="valor-icon" aria-hidden="true">
            <FaEye />
          </div>
          <h3 className="valor-titulo">Visão</h3>
          <p className="valor-texto">
            Redefinir o conceito de cones, transformando-os em experiências
            culinárias refinadas e inesquecíveis.
          </p>
        </div>

        <div className="valor-card" role="listitem">
          <div className="valor-icon" aria-hidden="true">
            <FaAward />
          </div>
          <h3 className="valor-titulo">Valores</h3>
          <div className="valor-lista" role="list">
            <span role="listitem"><FaLightbulb aria-hidden="true" /> Inovação</span>
            <span role="listitem"><FaHeart aria-hidden="true" /> Paixão</span>
            <span role="listitem"><FaAward aria-hidden="true" /> Excelência</span>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Marca;
