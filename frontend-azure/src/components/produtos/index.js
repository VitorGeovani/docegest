import React from 'react';
import './index.scss';
import Carrossel from'../carrossel'

const Produtos = ({ onReservar }) => {
    return (
        <div id='produtos' className="fundo-produtos">
            < span className="nossos-produtos">Nossos Produtos</span>
            <span className="exclusivos-selecionados-apresentacao">
                Os produtos do Segredo do Sabor são exclusivos, preparados com
                ingredientes selecionados e uma apresentação impecável. Cada criação
                é uma experiência sensorial que une sofisticação, sabor e um
                toquinho de segredo.
            </span>
            <Carrossel onReservar={onReservar}/>
        </div>
    );
};

export default Produtos;
