import React from "react";
import "./index.scss";
import Logo from '../../components/logo'
import { Link } from 'react-router-dom'

export default function ReservaFinalizada() {
  return (
    <div className="pagina-reservaFinalizada">

      <header>
        <Logo />
        <span className="verdadeiro-prazer">
          O Verdadeiro prazer está no Segredo do Sabor
        </span>
      </header>

      <main>
        <Link to='/'>
          <div className="rectanglegg">
            <span className="btn-reserva-finalizada">Reserva Finalizada!</span>
          </div>
        </Link>
        <div className="mensagem-confirmacao">
          <span className="mensagem-confirmacao-1">
            Em alguns instantes irá chegar uma mensagem de confirmação no seu
            WhatsApp.
            <br />
          </span>
       
        </div>
      </main>

      <footer>

        <div className="divLogo">

          <img className="wmremove-transformed-4" src="imgs/wmremove-transformed (1).png" />
          <span className="avenida-engenheiro-stevaux">
            Avenida Engenheiro Eusébio Stevaux, 600 - Santo Amaro, 04696-000
          </span>
          <span className="telefones">Telefones: (11) 99766 - 1964</span>

        </div>


        <div className="divLinks">

          <span className="links">Links</span>
          <span className="nossa-marca">Nossa Marca</span>
          <span className="produtos">Produtos</span>
          <span className="contato-6">Contato</span>

        </div>


        <div className="divContatos">
          <span className="contato">Contato</span>

          <div className="flex-row-whats">
            <div className="ic-sharp-whatsapp" />
            <span className="phone-number">(11) 99766 - 1964</span>
          </div>

          <div className="flex-row-face">
            <div className="ic-baseline-facebook" />
            <span className="segredo-sabor-confeitaria">
              @segredosabor.confeitaria
            </span>
          </div>


          <div className="flex-row-insta">

            <div className="mdi-instagram" />
            <span className="segredo-sabor-confeitaria-5">
              @segredosabor.confeitaria
            </span>

          </div>

        </div>



      </footer>


    </div>
  );
}
