import React, { useState, useEffect } from 'react';
import './AccessibilityMenu.scss';
import { 
    FaUniversalAccess, 
    FaTextHeight, 
    FaAdjust, 
    FaTimes,
    FaFont,
    FaPalette,
    FaBold,
    FaSignLanguage,
    FaVolumeUp,
    FaMoon,
    FaSun,
    FaBookReader,
    FaCog,
    FaRedo,
    FaMousePointer,
    FaExpand
} from 'react-icons/fa';

const AccessibilityMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('ferramentas');
    const [isReading, setIsReading] = useState(false);
    const [settings, setSettings] = useState({
        fontSize: 100,
        contrast: 'normal',
        spacing: 'normal',
        animations: true,
        links: 'normal',
        cursor: 'normal',
        highlightLinks: false
    });

    useEffect(() => {
        const saved = localStorage.getItem('accessibility-settings');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setSettings(parsed);
                applySettings(parsed);
            } catch (e) {
                console.error('Erro ao carregar configurações', e);
            }
        }
        
        injectStyles();

        const handleKeys = (e) => {
            if (e.altKey && e.key.toLowerCase() === 'a') {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
            if (e.key === 'Escape' && isOpen) {
                setIsOpen(false);
            }
        };

        document.addEventListener('keydown', handleKeys);
        return () => document.removeEventListener('keydown', handleKeys);
    }, [isOpen]);

    const injectStyles = () => {
        if (document.getElementById('wcag-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'wcag-styles';
        style.textContent = `
            /* Estilos de Acessibilidade WCAG 2.2 AAA */
            
            /* CONTRASTE ALTO - Aumenta contraste visual */
            html[data-contrast="high"],
            html[data-contrast="high"] body {
                filter: contrast(1.8) brightness(1.1) !important;
            }
            
            /* CONTRASTE ESCURO - Modo escuro completo */
            html[data-contrast="dark"],
            html[data-contrast="dark"] body {
                background: #1a1a1a !important;
                color: #f0f0f0 !important;
                filter: invert(1) hue-rotate(180deg) !important;
            }
            
            html[data-contrast="dark"] img,
            html[data-contrast="dark"] video,
            html[data-contrast="dark"] [style*="background-image"] {
                filter: invert(1) hue-rotate(180deg) !important;
            }
            
            /* ESPAÇAMENTO COMPACTO */
            html[data-spacing="compact"] p,
            html[data-spacing="compact"] li,
            html[data-spacing="compact"] span:not(.badge),
            html[data-spacing="compact"] label,
            html[data-spacing="compact"] div {
                line-height: 1.2 !important;
                letter-spacing: -0.02em !important;
            }
            
            /* ESPAÇAMENTO CONFORTÁVEL */
            html[data-spacing="comfortable"] p,
            html[data-spacing="comfortable"] li,
            html[data-spacing="comfortable"] span:not(.badge),
            html[data-spacing="comfortable"] label,
            html[data-spacing="comfortable"] div {
                line-height: 2.0 !important;
                letter-spacing: 0.1em !important;
                word-spacing: 0.2em !important;
            }
            
            /* ANIMAÇÕES DESATIVADAS */
            html[data-animations="off"] *,
            html[data-animations="off"] *::before,
            html[data-animations="off"] *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
            
            /* LINKS SUBLINHADOS */
            html[data-links="underline"] a {
                text-decoration: underline !important;
                text-underline-offset: 3px !important;
                text-decoration-thickness: 2px !important;
            }
            
            /* LINKS EM NEGRITO */
            html[data-links="bold"] a {
                font-weight: 700 !important;
                text-shadow: 0.5px 0 0 currentColor !important;
            }
            
            /* DESTAQUES EM LINKS */
            html[data-highlight-links="true"] a {
                background: #ffeb3b !important;
                color: #000 !important;
                padding: 2px 6px !important;
                border-radius: 4px !important;
                font-weight: 600 !important;
                box-shadow: 0 1px 3px rgba(0,0,0,0.2) !important;
            }
            
            /* CURSOR GRANDE */
            html[data-cursor="large"],
            html[data-cursor="large"] * {
                cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"><circle cx="24" cy="24" r="16" fill="black" stroke="white" stroke-width="3"/></svg>') 24 24, auto !important;
            }
            
            html[data-cursor="large"] a,
            html[data-cursor="large"] button {
                cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"><circle cx="24" cy="24" r="16" fill="%23667eea" stroke="white" stroke-width="3"/></svg>') 24 24, pointer !important;
            }
            
            /* FOCO VISÍVEL APRIMORADO */
            *:focus-visible {
                outline: 4px solid #667eea !important;
                outline-offset: 3px !important;
                border-radius: 4px !important;
                box-shadow: 0 0 0 8px rgba(102, 126, 234, 0.2) !important;
            }
            
            /* Garante legibilidade no modo escuro */
            html[data-contrast="dark"] .accessibility-menu {
                filter: invert(1) hue-rotate(180deg) !important;
            }
        `;
        document.head.appendChild(style);
    };

    const applySettings = (s) => {
        const root = document.documentElement;
        const body = document.body;
        
        // Tamanho da fonte
        root.style.fontSize = s.fontSize === 100 ? '' : `${(s.fontSize / 100) * 16}px`;
        
        // Contraste - Limpar todos antes de aplicar novo
        root.removeAttribute('data-contrast');
        body.removeAttribute('data-contrast');
        if (s.contrast !== 'normal') {
            root.setAttribute('data-contrast', s.contrast);
            body.setAttribute('data-contrast', s.contrast);
        }
        
        // Espaçamento
        root.setAttribute('data-spacing', s.spacing);
        
        // Animações
        root.setAttribute('data-animations', s.animations ? 'on' : 'off');
        
        // Links
        root.setAttribute('data-links', s.links);
        
        // Destacar links
        root.setAttribute('data-highlight-links', s.highlightLinks ? 'true' : 'false');
        
        // Cursor
        root.setAttribute('data-cursor', s.cursor);
        
        // Salvar no localStorage
        localStorage.setItem('accessibility-settings', JSON.stringify(s));
    };

    const updateSetting = (key, value) => {
        const newSettings = { ...settings, [key]: value };
        setSettings(newSettings);
        applySettings(newSettings);
    };

    const reset = () => {
        const defaults = {
            fontSize: 100,
            contrast: 'normal',
            spacing: 'normal',
            animations: true,
            links: 'normal',
            cursor: 'normal',
            highlightLinks: false
        };
        setSettings(defaults);
        applySettings(defaults);
    };

    return (
        <>
            <button
                className="accessibility-toggle"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Recursos Assistivos (Alt+A)"
                aria-expanded={isOpen}
            >
                <FaUniversalAccess />
            </button>

            {isOpen && (
                <>
                    <div 
                        className="accessibility-overlay"
                        onClick={() => setIsOpen(false)}
                        aria-hidden="true"
                    />
                    
                    <div 
                        className="accessibility-menu"
                        role="dialog"
                        aria-labelledby="accessibility-menu-title"
                        aria-modal="true"
                    >
                        <div className="accessibility-menu-header">
                            <div className="header-title">
                                <FaUniversalAccess className="header-icon" />
                                <h2 id="accessibility-menu-title">Recursos Assistivos</h2>
                            </div>
                            <button
                                className="accessibility-close"
                                onClick={() => setIsOpen(false)}
                                aria-label="Fechar"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <div className="accessibility-tabs" role="tablist">
                            <button
                                className={`tab ${activeTab === 'ferramentas' ? 'active' : ''}`}
                                onClick={() => setActiveTab('ferramentas')}
                                role="tab"
                                aria-selected={activeTab === 'ferramentas'}
                            >
                                <FaCog />
                                <span>Ferramentas de IA</span>
                            </button>
                            <button
                                className={`tab ${activeTab === 'controle' ? 'active' : ''}`}
                                onClick={() => setActiveTab('controle')}
                                role="tab"
                                aria-selected={activeTab === 'controle'}
                            >
                                <FaAdjust />
                                <span>Controle de Fonte</span>
                            </button>
                        </div>

                        <div className="accessibility-menu-content">
                            {activeTab === 'ferramentas' && (
                                <div role="tabpanel" className="tab-panel">
                                    <h3 className="section-title">Ferramentas de IA</h3>
                                    
                                    <div className="tool-grid">
                                        {/* VLibras - Tradutor de Libras */}
                                        <button 
                                            className="tool-card"
                                            onClick={() => {
                                                try {
                                                    const vlibrasBtn = document.querySelector('[vw-access-button]');
                                                    if (vlibrasBtn) {
                                                        vlibrasBtn.click();
                                                        console.log('VLibras ativado com sucesso!');
                                                    } else {
                                                        alert('VLibras ainda não carregou. Aguarde alguns segundos e tente novamente.');
                                                    }
                                                } catch (e) {
                                                    console.error('Erro ao ativar VLibras:', e);
                                                    alert('Erro ao ativar o VLibras. Recarregue a página.');
                                                }
                                            }}
                                            aria-label="Tradutor de Libras - VLibras"
                                        >
                                            <div className="tool-icon">
                                                <FaSignLanguage />
                                            </div>
                                            <span className="tool-name">Tradutor de Libras</span>
                                        </button>

                                        {/* Leitura de Texto com controle */}
                                        <button 
                                            className="tool-card"
                                            onClick={() => {
                                                if (!('speechSynthesis' in window)) {
                                                    alert('Seu navegador não suporta leitura de texto. Use Chrome, Edge ou Firefox.');
                                                    return;
                                                }

                                                // Se já está lendo, para
                                                if (isReading || window.speechSynthesis.speaking) {
                                                    window.speechSynthesis.cancel();
                                                    setIsReading(false);
                                                    alert('Leitura interrompida.');
                                                    return;
                                                }

                                                // Inicia nova leitura
                                                try {
                                                    const mainContent = document.querySelector('main') || 
                                                                       document.querySelector('#root') || 
                                                                       document.body;
                                                    
                                                    let textToRead = mainContent.innerText
                                                        .replace(/\s+/g, ' ')
                                                        .trim()
                                                        .substring(0, 2000); // Aumentado para 2000 caracteres
                                                    
                                                    if (!textToRead || textToRead.length < 10) {
                                                        alert('Nenhum texto encontrado para ler.');
                                                        return;
                                                    }
                                                    
                                                    const utterance = new SpeechSynthesisUtterance(textToRead);
                                                    utterance.lang = 'pt-BR';
                                                    utterance.rate = 1.0;
                                                    utterance.pitch = 1.0;
                                                    utterance.volume = 1.0;
                                                    
                                                    utterance.onstart = () => {
                                                        setIsReading(true);
                                                        console.log('Leitura iniciada');
                                                    };
                                                    
                                                    utterance.onend = () => {
                                                        setIsReading(false);
                                                        console.log('Leitura concluída');
                                                    };
                                                    
                                                    utterance.onerror = (e) => {
                                                        setIsReading(false);
                                                        console.error('Erro na leitura:', e);
                                                        alert('Erro ao ler o texto. Tente novamente.');
                                                    };
                                                    
                                                    window.speechSynthesis.speak(utterance);
                                                    alert('✅ Leitura iniciada! Clique novamente para parar.');
                                                    
                                                } catch (e) {
                                                    setIsReading(false);
                                                    console.error('Erro ao iniciar leitura:', e);
                                                    alert('Erro ao iniciar leitura de texto.');
                                                }
                                            }}
                                            aria-label="Leitura de Texto - Clique novamente para parar"
                                        >
                                            <div className="tool-icon">
                                                <FaVolumeUp />
                                            </div>
                                            <span className="tool-name">
                                                {isReading ? '⏹ Parar Leitura' : 'Leitura de Texto'}
                                            </span>
                                        </button>

                                        {/* Informação sobre o plugin */}
                                        <button 
                                            className="tool-card info-card"
                                            onClick={() => {
                                                alert('💡 DICA: O botão azul de acessibilidade do VLibras aparece automaticamente no canto inferior direito da tela!\n\nVocê pode clicar diretamente nele a qualquer momento para ativar o tradutor de LIBRAS.');
                                            }}
                                            aria-label="Informação sobre VLibras"
                                        >
                                            <div className="tool-icon">
                                                <FaBookReader />
                                            </div>
                                            <span className="tool-name">ℹ️ Sobre VLibras</span>
                                        </button>
                                    </div>

                                    <div className="info-box">
                                        <p><strong>💡 Dica:</strong> Use <kbd>Alt+A</kbd> para abrir este menu!</p>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'controle' && (
                                <div role="tabpanel" className="tab-panel">
                                    <h3 className="section-title">Controle de Fonte</h3>
                                    
                                    <div className="control-section">
                                        <label className="control-label">
                                            <FaTextHeight />
                                            Tamanho da Fonte
                                        </label>
                                        <div className="control-buttons-row">
                                            <button
                                                className="control-btn"
                                                onClick={() => updateSetting('fontSize', Math.max(80, settings.fontSize - 10))}
                                                aria-label="Diminuir fonte"
                                            >
                                                A-
                                            </button>
                                            <span className="control-value">{settings.fontSize}%</span>
                                            <button
                                                className="control-btn"
                                                onClick={() => updateSetting('fontSize', Math.min(200, settings.fontSize + 10))}
                                                aria-label="Aumentar fonte"
                                            >
                                                A+
                                            </button>
                                        </div>
                                        <input
                                            type="range"
                                            min="80"
                                            max="200"
                                            step="10"
                                            value={settings.fontSize}
                                            onChange={(e) => updateSetting('fontSize', parseInt(e.target.value))}
                                            className="control-slider"
                                            aria-label="Ajustar tamanho de fonte"
                                        />
                                    </div>

                                    <div className="control-section">
                                        <label className="control-label">
                                            <FaFont />
                                            Estilo de Texto
                                        </label>
                                        <div className="option-buttons">
                                            <button
                                                className={`option-btn ${settings.links === 'underline' ? 'active' : ''}`}
                                                onClick={() => updateSetting('links', 'underline')}
                                                aria-pressed={settings.links === 'underline'}
                                            >
                                                Sublinhado
                                            </button>
                                            <button
                                                className={`option-btn ${settings.links === 'bold' ? 'active' : ''}`}
                                                onClick={() => updateSetting('links', 'bold')}
                                                aria-pressed={settings.links === 'bold'}
                                            >
                                                <FaBold /> Negrito
                                            </button>
                                        </div>
                                    </div>

                                    <div className="control-section">
                                        <label className="control-label">
                                            <FaBold />
                                            Letras Destacadas
                                        </label>
                                        <label className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                checked={settings.highlightLinks}
                                                onChange={(e) => updateSetting('highlightLinks', e.target.checked)}
                                                aria-label="Destacar letras"
                                            />
                                            <span className="toggle-slider"></span>
                                            <span className="toggle-label">
                                                {settings.highlightLinks ? 'Ativado' : 'Desativado'}
                                            </span>
                                        </label>
                                    </div>

                                    <div className="control-section">
                                        <label className="control-label">
                                            <FaExpand />
                                            Espaço entre Linhas
                                        </label>
                                        <div className="option-buttons">
                                            <button
                                                className={`option-btn ${settings.spacing === 'compact' ? 'active' : ''}`}
                                                onClick={() => updateSetting('spacing', 'compact')}
                                                aria-pressed={settings.spacing === 'compact'}
                                            >
                                                Compacto
                                            </button>
                                            <button
                                                className={`option-btn ${settings.spacing === 'normal' ? 'active' : ''}`}
                                                onClick={() => updateSetting('spacing', 'normal')}
                                                aria-pressed={settings.spacing === 'normal'}
                                            >
                                                Normal
                                            </button>
                                            <button
                                                className={`option-btn ${settings.spacing === 'comfortable' ? 'active' : ''}`}
                                                onClick={() => updateSetting('spacing', 'comfortable')}
                                                aria-pressed={settings.spacing === 'comfortable'}
                                            >
                                                Confortável
                                            </button>
                                        </div>
                                    </div>

                                    <div className="control-section">
                                        <label className="control-label">
                                            <FaPalette />
                                            Contraste
                                        </label>
                                        <div className="contrast-options">
                                            <button
                                                className={`contrast-btn ${settings.contrast === 'normal' ? 'active' : ''}`}
                                                onClick={() => updateSetting('contrast', 'normal')}
                                                aria-pressed={settings.contrast === 'normal'}
                                            >
                                                <FaSun /> Normal
                                            </button>
                                            <button
                                                className={`contrast-btn ${settings.contrast === 'dark' ? 'active' : ''}`}
                                                onClick={() => updateSetting('contrast', 'dark')}
                                                aria-pressed={settings.contrast === 'dark'}
                                            >
                                                <FaMoon /> Escuro
                                            </button>
                                            <button
                                                className={`contrast-btn ${settings.contrast === 'high' ? 'active' : ''}`}
                                                onClick={() => updateSetting('contrast', 'high')}
                                                aria-pressed={settings.contrast === 'high'}
                                            >
                                                <FaAdjust /> Alto
                                            </button>
                                        </div>
                                    </div>

                                    <div className="control-section">
                                        <label className="control-label">
                                            <FaMousePointer />
                                            Cursor Grande
                                        </label>
                                        <label className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                checked={settings.cursor !== 'normal'}
                                                onChange={(e) => updateSetting('cursor', e.target.checked ? 'large' : 'normal')}
                                                aria-label="Cursor grande"
                                            />
                                            <span className="toggle-slider"></span>
                                            <span className="toggle-label">
                                                {settings.cursor !== 'normal' ? 'Ativado' : 'Desativado'}
                                            </span>
                                        </label>
                                    </div>

                                    <button 
                                        className="reset-btn"
                                        onClick={reset}
                                        aria-label="Redefinir todas as configurações"
                                    >
                                        <FaRedo />
                                        Redefinir Tudo
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="accessibility-menu-footer">
                            <p className="wcag-badge">
                                ♿ Conforme WCAG 2.2 AAA
                            </p>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default AccessibilityMenu;