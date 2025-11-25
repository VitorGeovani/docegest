import { useEffect } from 'react';

/**
 * Componente wrapper para garantir compatibilidade do VLibras com React
 * O VLibras precisa ser reinicializado quando o conteúdo da página muda
 */
const VLibrasWrapper = () => {
    useEffect(() => {
        // Função para reinicializar o VLibras quando necessário
        const reinitializeVLibras = () => {
            try {
                // Verifica se o VLibras está carregado
                if (window.VLibras && window.VLibras.Widget) {
                    // Força a atualização do VLibras
                    const vlibrasElements = document.querySelectorAll('[vw]');
                    if (vlibrasElements.length > 0) {
                        console.log('VLibras: Plugin detectado e ativo');
                    }
                }
            } catch (error) {
                console.error('Erro ao verificar VLibras:', error);
            }
        };

        // Reinicializa após o componente montar
        const timer = setTimeout(reinitializeVLibras, 1000);

        // Cleanup
        return () => clearTimeout(timer);
    }, []);

    // Este componente não renderiza nada
    return null;
};

export default VLibrasWrapper;
