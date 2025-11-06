import React, { createContext, useContext, useState, useEffect } from 'react';

const FavoritosContext = createContext();

export const useFavoritosContext = () => {
    const context = useContext(FavoritosContext);
    if (!context) {
        throw new Error('useFavoritosContext deve ser usado dentro de FavoritosProvider');
    }
    return context;
};

export const FavoritosProvider = ({ children }) => {
    const [favoritos, setFavoritos] = useState([]);

    // Carregar favoritos do localStorage ao iniciar
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

    const salvarFavoritos = (novosFavoritos) => {
        try {
            localStorage.setItem('produtos-favoritos', JSON.stringify(novosFavoritos));
            setFavoritos(novosFavoritos);
        } catch (error) {
            console.error('Erro ao salvar favoritos:', error);
        }
    };

    const isFavorito = (produtoId) => {
        return favoritos.includes(produtoId);
    };

    const adicionarFavorito = (produtoId) => {
        if (!favoritos.includes(produtoId)) {
            const novosFavoritos = [...favoritos, produtoId];
            salvarFavoritos(novosFavoritos);
            return true;
        }
        return false;
    };

    const removerFavorito = (produtoId) => {
        const novosFavoritos = favoritos.filter(id => id !== produtoId);
        salvarFavoritos(novosFavoritos);
        return true;
    };

    const toggleFavorito = (produtoId) => {
        if (isFavorito(produtoId)) {
            removerFavorito(produtoId);
            return false;
        } else {
            adicionarFavorito(produtoId);
            return true;
        }
    };

    const limparFavoritos = () => {
        salvarFavoritos([]);
    };

    const value = {
        favoritos,
        isFavorito,
        adicionarFavorito,
        removerFavorito,
        toggleFavorito,
        limparFavoritos,
        quantidadeFavoritos: favoritos.length
    };

    return (
        <FavoritosContext.Provider value={value}>
            {children}
        </FavoritosContext.Provider>
    );
};

export default FavoritosContext;
