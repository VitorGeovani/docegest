
// Queridinhos.js
import React from 'react';
import './index.scss';
import { Link } from 'react-router-dom';
import Carroselimg from '../carrosselImg';
import { FaShoppingCart, FaStar } from 'react-icons/fa';


const Queridinhos = () => (
    <section id='produtos' className="secao-queridinhos" aria-label="Produtos em destaque">
        <div className="queridinhos-container">
            {/* Conteúdo */}
            <div className="queridinhos-content">
                {/* <div className="badge-destaque" aria-label="Produtos em destaque">
                    <FaStar aria-hidden="true" /> Produtos em Destaque
                </div> */}
                <h2 className="titulo-queridinhos">
                    Nossos Queridinhos
                    <br />
                    <span className="destaque">Estão de Volta!</span>
                </h2>
                <p className="descricao-queridinhos">
                    Os deliciosos e amados cones estão de volta,
                    agora com uma releitura de apresentação,
                    mas o mesmo intrigante sabor que conquista paladares!
                </p>

                <Link to='/catalogo' className="btn-ver-produtos" aria-label="Ver todos os produtos no catálogo">
                    <FaShoppingCart aria-hidden="true" />
                    <span>Ver Todos os Produtos</span>
                </Link>

                <div className="stats-grid" role="list" aria-label="Estatísticas dos produtos">
                    <div className="stat-item" role="listitem">
                        <div className="stat-numero" aria-label="11 ou mais">11+</div>
                        <div className="stat-label">Sabores</div>
                    </div>
                    <div className="stat-item" role="listitem">
                        <div className="stat-numero" aria-label="100 porcento">100%</div>
                        <div className="stat-label">Artesanal</div>
                    </div>
                    <div className="stat-item" role="listitem">
                        <div className="stat-numero" aria-label="5 estrelas">⭐⭐⭐⭐⭐</div>
                        <div className="stat-label">Avaliação</div>
                    </div>
                </div>
            </div>

            {/* Carrossel de Imagens */}
            <div className="queridinhos-carrossel">
                <Carroselimg />
            </div>
        </div>
    </section>
);

export default Queridinhos;
