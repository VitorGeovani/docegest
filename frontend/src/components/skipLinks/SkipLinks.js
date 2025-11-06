/**
 * Skip Links - WCAG 2.4.1 (Bypass Blocks) - Nível A
 * Permite que usuários de leitores de tela pulem blocos repetitivos
 */

import React from 'react';
import './SkipLinks.scss';

const SkipLinks = () => {
    // Estilos inline para garantir funcionamento sem CSS externo
    const containerStyle = {
        position: 'absolute',
        top: '-100px',
        left: 0,
        zIndex: 10000,
        width: '100%'
    };

    const linkStyle = {
        position: 'absolute',
        top: '-100px',
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '1rem 2rem',
        background: '#000',
        color: '#fff',
        textDecoration: 'none',
        borderRadius: '0 0 8px 8px',
        fontWeight: '600',
        fontSize: '1rem',
        zIndex: 10001,
        transition: 'top 0.3s ease'
    };

    const linkFocusStyle = {
        ...linkStyle,
        top: '0'
    };

    return (
        <div style={containerStyle} role="navigation" aria-label="Links de atalho">
            <a 
                href="#main-content" 
                style={linkStyle}
                onFocus={(e) => e.target.style.top = '0'}
                onBlur={(e) => e.target.style.top = '-100px'}
            >
                Pular para o conteúdo principal
            </a>
            <a 
                href="#navigation"
                style={{...linkStyle, left: 'calc(50% - 250px)'}}
                onFocus={(e) => e.target.style.top = '0'}
                onBlur={(e) => e.target.style.top = '-100px'}
            >
                Pular para o menu de navegação
            </a>
            <a 
                href="#footer"
                style={{...linkStyle, left: 'calc(50% + 250px)'}}
                onFocus={(e) => e.target.style.top = '0'}
                onBlur={(e) => e.target.style.top = '-100px'}
            >
                Pular para o rodapé
            </a>
        </div>
    );
};

export default SkipLinks;
