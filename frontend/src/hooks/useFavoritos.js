import { useState, useEffect } from 'react';

/**
 * Hook customizado para gerenciar produtos favoritos
 * Persiste os favoritos no localStorage
 */
export const useFavoritos = () => {
    const [favoritos, setFavoritos] = useState([]);

    // Carregar favoritos do localStorage ao montar
    useEffect(() => {
        carregarFavoritos();
    }, []);

    const carregarFavoritos = () => {
        try {
            const favoritosStorage = localStorage.getItem('produtos-favoritos');
            if (favoritosStorage) {
                const favoritosArray = JSON.parse(favoritosStorage);
                setFavoritos(favoritosArray);
            }
        } catch (error) {
            console.error('Erro ao carregar favoritos:', error);
            setFavoritos([]);
        }
    };

    const isFavorito = (produtoId) => {
        return favoritos.includes(produtoId);
    };

    const adicionarFavorito = (produtoId) => {
        try {
            const novosFavoritos = [...favoritos, produtoId];
            setFavoritos(novosFavoritos);
            localStorage.setItem('produtos-favoritos', JSON.stringify(novosFavoritos));
            return true;
        } catch (error) {
            console.error('Erro ao adicionar favorito:', error);
            return false;
        }
    };

    const removerFavorito = (produtoId) => {
        try {
            const novosFavoritos = favoritos.filter(id => id !== produtoId);
            setFavoritos(novosFavoritos);
            localStorage.setItem('produtos-favoritos', JSON.stringify(novosFavoritos));
            return true;
        } catch (error) {
            console.error('Erro ao remover favorito:', error);
            return false;
        }
    };

    const toggleFavorito = (produtoId) => {
        if (isFavorito(produtoId)) {
            return removerFavorito(produtoId);
        } else {
            return adicionarFavorito(produtoId);
        }
    };

    const limparFavoritos = () => {
        try {
            setFavoritos([]);
            localStorage.removeItem('produtos-favoritos');
            return true;
        } catch (error) {
            console.error('Erro ao limpar favoritos:', error);
            return false;
        }
    };

    const quantidadeFavoritos = () => {
        return favoritos.length;
    };

    return {
        favoritos,
        isFavorito,
        adicionarFavorito,
        removerFavorito,
        toggleFavorito,
        limparFavoritos,
        quantidadeFavoritos,
        carregarFavoritos
    };
};

export default useFavoritos;
