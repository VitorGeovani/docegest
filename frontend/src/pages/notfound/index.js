import './index.scss';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className='pagina-not-found'>
      <div className="not-found-container">
        {/* Animação 404 */}
        <div className="error-code">
          <span className="digit">4</span>
          <span className="digit zero">
            <div className="donut"></div>
          </span>
          <span className="digit">4</span>
        </div>

        <h1 className='titulo'>Oops! Página não encontrada</h1>
        
        <p className="descricao">
          Parece que você se perdeu no caminho dos doces! 🍰
          <br />
          A página que você está procurando não existe ou foi movida.
        </p>

        <div className="acoes">
          <Link to="/" className="btn-primary">
            🏠 Voltar ao Início
          </Link>
          <Link to="/catalogo" className="btn-secondary">
            🛒 Ver Catálogo
          </Link>
        </div>

        <div className="dicas">
          <p>💡 <strong>Dicas úteis:</strong></p>
          <ul>
            <li>Verifique se o endereço foi digitado corretamente</li>
            <li>Use o menu de navegação para encontrar o que procura</li>
            <li>Entre em contato conosco se precisar de ajuda</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
 
 
 