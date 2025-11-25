import React from "react";
import Slider from "react-slick";
import "./index.scss";

function PauseOnHover() {
    const settings = {
        dots: true,
        arrows: false,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        pauseOnHover: true,
        fade: true,
        cssEase: 'linear',
        lazyLoad: 'ondemand'
    };
    
    const images = [
        { 
            src: `${process.env.PUBLIC_URL}/imgs/cones3.jpg`, 
            alt: "Cones recheados de chocolate e outros sabores artesanais dispostos em forma de apresentação"
        },
        { 
            src: `${process.env.PUBLIC_URL}/imgs/cones.jpg`, 
            alt: "Cones artesanais trufados com cobertura de chocolate e decoração sofisticada"
        },
        { 
            src: `${process.env.PUBLIC_URL}/imgs/limao-chocolate.jpg`, 
            alt: "Cone de limão siciliano com cobertura de chocolate meio amargo e raspas de limão"
        },
        { 
            src: `${process.env.PUBLIC_URL}/imgs/cones2.jpg`, 
            alt: "Variedade de cones recheados com diferentes sabores e coberturas gourmet"
        }
    ];
    
    return (
        <div className="slider-container" role="region" aria-label="Carrossel de produtos em destaque">
            <Slider {...settings}>
                {images.map((image, index) => (
                    <div key={index} className="slide-wrapper">
                        <img 
                            src={image.src} 
                            alt={image.alt}
                            title={image.alt}
                            loading="lazy"
                            onError={(e) => {
                                console.error('Erro ao carregar imagem:', image.src);
                                e.target.style.display = 'none';
                            }}
                        />
                    </div>
                ))}
            </Slider>
        </div>
    );
}

export default PauseOnHover;