import React from 'react';
import './index.scss';

const Card = ({ imgSrc, descricao, valor, nomeProduto, onReservar }) => {
    const aoReservar = () => {
        alert(`${nomeProduto} foi adicionado ao carrinho de reserva!`);
        onReservar(); // Chama a função passada como prop para adicionar o produto
    };

    return (
        <article className="card" aria-label={`Produto: ${nomeProduto}`}>
            <div className="img">
                <img 
                    src={imgSrc} 
                    alt={`Foto do produto ${nomeProduto}. ${descricao}`}
                    title={`${nomeProduto} - ${descricao}`}
                    loading="lazy"
                    width="300"
                    height="auto"
                />
            </div>
            <h3 className="nome-produto">{nomeProduto}</h3>
            <p className="descricao">{descricao}</p>
            <p className="valor" aria-label={`Preço: ${valor}`}>
                <span aria-hidden="true">{valor}</span>
            </p>
            <button 
                onClick={aoReservar} 
                className="botao-reserva"
                aria-label={`Adicionar ${nomeProduto} ao carrinho`}
            >
                Reservar
            </button>
        </article>
    );
};

export default Card;