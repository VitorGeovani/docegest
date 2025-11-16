import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './index.css';
// CSS de acessibilidade REMOVIDO - Estilos aplicados via JS no AccessibilityMenu
import AccessibilityMenu from './components/accessibilityMenu/AccessibilityMenu';
import SkipLinks from './components/skipLinks/SkipLinks';
import ChatAssistente from './components/ChatAssistente/ChatAssistente';
import Home from './pages/home';
import NotFound from './pages/notfound';
import Reserva from './pages/reserva';
import Login from './pages/login';
import ReservaFinalizada from './pages/reservaFinalizada';
import Gerenciamento from './pages/gerenciamentos';
import Catalogo from './pages/catalogo';
import Checkout from './pages/checkout';
import PedidoConfirmado from './pages/pedidoConfirmado';
import MeusPedidos from './pages/meusPedidos';
import PoliticaPrivacidade from './pages/politicaPrivacidade';
import TermosUso from './pages/termosUso';
import { AuthProvider } from './context/AuthContext';
import { FavoritosProvider } from './context/FavoritosContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

function App() {
    const [produtosReservados, setProdutosReservados] = useState([]);

    // Função para excluir um produto do carrinho (usado em Reserva)
    const excluirProduto = (id) => {
        const novosProdutos = produtosReservados.filter((produto) => produto.id !== id);
        setProdutosReservados(novosProdutos);
    };

    return (
        <AuthProvider>
            <FavoritosProvider>
                <BrowserRouter>
                    <SkipLinks />
                    <AccessibilityMenu />
                    <ChatAssistente />
                    <ToastContainer
                        position="top-right"
                        autoClose={3000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="colored"
                        role="alert"
                        aria-live="polite"
                    />
                    <Routes>
                        <Route
                            path="/"
                            element={<Home />}
                        />
                        <Route
                            path="/reserva"
                            element={<Reserva produtosReservados={produtosReservados} excluirProduto={excluirProduto} />}
                        />
                        <Route path="/catalogo" element={<Catalogo />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/pedido-confirmado" element={<PedidoConfirmado />} />
                        <Route path="/meus-pedidos" element={<MeusPedidos />} />
                        <Route path="/politica-privacidade" element={<PoliticaPrivacidade />} />
                        <Route path="/termos-uso" element={<TermosUso />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/reservaFinalizada" element={<ReservaFinalizada />} />
                        <Route path="/gerenciamentos" element={<Gerenciamento />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </BrowserRouter>
            </FavoritosProvider>
        </AuthProvider>
    );
}

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);