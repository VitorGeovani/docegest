import React from 'react';
import './index.scss';

/**
 * Componente de Loading Global
 * Exibe uma animação de carregamento profissional
 * 
 * @param {string} message - Mensagem opcional a ser exibida
 * @param {string} size - Tamanho: 'small', 'medium', 'large'
 * @param {boolean} fullScreen - Se deve ocupar a tela toda
 */
export default function Loading({ 
  message = 'Carregando...', 
  size = 'medium',
  fullScreen = false 
}) {
  return (
    <div className={`loading-container ${fullScreen ? 'fullscreen' : ''} ${size}`}>
      <div className="loading-content">
        {/* Spinner animado com tema de doces */}
        <div className="spinner">
          <div className="donut">
            <div className="frosting"></div>
            <div className="sprinkles">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
        
        {/* Texto de carregamento */}
        {message && (
          <p className="loading-message" aria-live="polite">
            {message}
          </p>
        )}
        
        {/* Indicador de progresso acessível */}
        <div 
          role="progressbar" 
          aria-label="Carregando conteúdo"
          aria-busy="true"
          className="sr-only"
        >
          Aguarde enquanto carregamos o conteúdo...
        </div>
      </div>
    </div>
  );
}

/**
 * Componente de Loading Inline (para botões, cards, etc)
 */
export function LoadingInline({ size = 'small' }) {
  return (
    <span className={`loading-inline ${size}`}>
      <span className="dot"></span>
      <span className="dot"></span>
      <span className="dot"></span>
    </span>
  );
}

/**
 * Componente de Skeleton Loading
 * Para placeholders de conteúdo
 */
export function Skeleton({ 
  width = '100%', 
  height = '20px', 
  borderRadius = '4px',
  className = ''
}) {
  return (
    <div 
      className={`skeleton ${className}`}
      style={{ width, height, borderRadius }}
      aria-hidden="true"
    />
  );
}

/**
 * Skeleton para Card de Produto
 */
export function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <Skeleton height="200px" borderRadius="12px 12px 0 0" />
      <div className="skeleton-card-content">
        <Skeleton width="80%" height="24px" />
        <Skeleton width="60%" height="16px" />
        <Skeleton width="40%" height="28px" />
      </div>
    </div>
  );
}
