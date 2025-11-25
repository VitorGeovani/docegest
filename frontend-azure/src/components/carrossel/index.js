import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import axios from 'axios';
import Card from '../card';
import './index.scss';

const Carrossel = ({ onReservar }) => {
    const [produtos, setProdutos] = useState([]);

    // Configurações do carrossel
    const configuracoes = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    // Função para buscar os dados do backend
    const buscarProdutos = async () => {
        try {
            const resposta = await axios.get('http://localhost:5015/produto'); 
            setProdutos(resposta.data);
        } catch (erro) {
            console.error('Erro ao buscar os produtos:', erro);
        }
    };

    // useEffect para buscar os dados ao carregar o componente
    useEffect(() => {
        buscarProdutos();
    }, []);

    return (
        <div className="carrosel">
            <Slider {...configuracoes}>
                {produtos.map((produto, indice) => (
                    <Card
                        key={indice}
                        imgSrc={`http://localhost:5015/storage/${produto.caminhoImagem}`} // Ajuste o caminho da imagem conforme necessário
                        descricao={produto.descricao}
                        valor={`R$ ${produto.preco}`}
                        nomeProduto={produto.nome}
                        onReservar={() => onReservar(produto)}
                    />
                ))}
            </Slider>
        </div>
    );
};

export default Carrossel;