import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './index.scss';

/**
 * Error Boundary - Captura erros em componentes React
 * Exibe uma interface amigável quando ocorrem erros
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Atualiza o estado para que a próxima renderização mostre a UI alternativa
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Armazena informações do erro
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log do erro (poderia enviar para um serviço de monitoramento)
    console.error('Erro capturado pelo ErrorBoundary:', error, errorInfo);
    
    // Se houver uma função de callback para reportar erros
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoBack = () => {
    window.history.back();
  };

  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
  };

  render() {
    if (this.state.hasError) {
      // Interface de erro personalizada
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            {/* Ilustração de erro */}
            <div className="error-illustration">
              <div className="broken-cake">
                <div className="cake-layer cake-layer-1"></div>
                <div className="cake-layer cake-layer-2"></div>
                <div className="cake-layer cake-layer-3"></div>
                <div className="cake-crack"></div>
                <div className="cake-crumbs">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
              <div className="error-icon">
                <span>!</span>
              </div>
            </div>

            {/* Mensagem de erro */}
            <h1 className="error-title">Oops! Algo deu errado</h1>
            <p className="error-message">
              Parece que encontramos um problema inesperado. 
              Nossa equipe foi notificada e está trabalhando para resolver.
            </p>

            {/* Botões de ação */}
            <div className="error-actions">
              <button 
                onClick={this.handleReload} 
                className="btn-primary"
                aria-label="Recarregar a página"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 4v6h-6"/>
                  <path d="M1 20v-6h6"/>
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
                </svg>
                Recarregar Página
              </button>
              
              <button 
                onClick={this.handleGoBack} 
                className="btn-secondary"
                aria-label="Voltar para a página anterior"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="19" y1="12" x2="5" y2="12"/>
                  <polyline points="12 19 5 12 12 5"/>
                </svg>
                Voltar
              </button>

              <Link to="/" className="btn-tertiary">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
                Ir para Início
              </Link>
            </div>

            {/* Detalhes técnicos (apenas em desenvolvimento) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="error-details">
                <summary>Detalhes técnicos (ambiente de desenvolvimento)</summary>
                <div className="error-stack">
                  <h4>Erro:</h4>
                  <pre>{this.state.error.toString()}</pre>
                  
                  {this.state.errorInfo && (
                    <>
                      <h4>Stack Trace:</h4>
                      <pre>{this.state.errorInfo.componentStack}</pre>
                    </>
                  )}
                </div>
              </details>
            )}
          </div>

          {/* Informações de contato */}
          <footer className="error-footer">
            <p>
              Se o problema persistir, entre em contato conosco
            </p>
            <div className="contact-options">
              <a 
                href="mailto:contato@segredodosabor.com.br" 
                className="contact-link"
                aria-label="Enviar email para contato"
              >
                📧 contato@segredodosabor.com.br
              </a>
              <a 
                href="https://wa.me/5511999999999" 
                target="_blank" 
                rel="noopener noreferrer"
                className="contact-link"
                aria-label="Entrar em contato via WhatsApp"
              >
                💬 WhatsApp
              </a>
            </div>
          </footer>
        </div>
      );
    }

    // Renderiza os children normalmente
    return this.props.children;
  }
}

/**
 * HOC para envolver componentes com Error Boundary
 */
export function withErrorBoundary(WrappedComponent, fallback = null) {
  return function WithErrorBoundaryWrapper(props) {
    return (
      <ErrorBoundary fallback={fallback}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  };
}

export default ErrorBoundary;
