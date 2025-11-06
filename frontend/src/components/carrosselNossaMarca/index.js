import React from "react";
import Slider from "react-slick";
import "./index.scss";

function SwipeToSlide() {
  const images = [
    { 
      src: "/imgs/cone ilustre 2.jpg", 
      alt: "Cone Ilustre premium com recheio especial e cobertura artesanal, produto exclusivo da marca"
    },
    { 
      src: "/imgs/kinder bueno.jpg", 
      alt: "Cone sabor Kinder Bueno com chocolate ao leite, avelã crocante e wafer, inspirado no famoso chocolate"
    }
  ];

  const settings = {
    className: "center",
    infinite: true,
    slidesToShow: 1,
    swipeToSlide: true,
    autoplay: true,
    autoplaySpeed: 3000,
    fade: true,
    speed: 500,
    dots: true,
    arrows: false,
    pauseOnHover: true
  };

  return (
    <div className="slider-container2" role="region" aria-label="Carrossel de produtos da marca">
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index} className="slide-wrapper">
            <img 
              src={`${process.env.PUBLIC_URL}${image.src}`}
              alt={image.alt}
              title={image.alt}
              loading="lazy"
              onError={(e) => {
                console.error(`Erro ao carregar imagem: ${image.src}`);
                e.target.style.display = 'none';
              }}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default SwipeToSlide;
