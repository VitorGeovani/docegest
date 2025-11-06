import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [accessToken, setAccessToken] = useState(null);

    const API_URL = 'http://localhost:5000';

    // Carregar usuário do localStorage ao iniciar
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('accessToken');

        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setAccessToken(storedToken);
            configureAxios(storedToken);
        }

        setLoading(false);
    }, []);

    // Configurar interceptor do Axios
    const configureAxios = (token) => {
        // Adicionar token em todas as requisições
        axios.interceptors.request.use(
            config => {
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            error => Promise.reject(error)
        );

        // Interceptar respostas para renovar token
        axios.interceptors.response.use(
            response => response,
            async error => {
                const originalRequest = error.config;

                // Se erro 401 e não é tentativa de renovação
                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;

                    try {
                        const refreshToken = localStorage.getItem('refreshToken');
                        
                        if (refreshToken) {
                            const response = await axios.post(`${API_URL}/auth/refresh`, {
                                refreshToken
                            });

                            const newToken = response.data.accessToken;
                            
                            localStorage.setItem('accessToken', newToken);
                            setAccessToken(newToken);
                            
                            originalRequest.headers.Authorization = `Bearer ${newToken}`;
                            return axios(originalRequest);
                        }
                    } catch (refreshError) {
                        // Refresh falhou - fazer logout
                        logout();
                        toast.error('Sessão expirada. Faça login novamente.');
                    }
                }

                return Promise.reject(error);
            }
        );
    };

    // Registrar novo usuário
    const register = async (nome, email, telefone, senha) => {
        try {
            const response = await axios.post(`${API_URL}/auth/register`, {
                nome,
                email,
                telefone,
                senha
            });

            toast.success('Cadastro realizado com sucesso! Faça login para continuar.');
            return response.data;
        } catch (error) {
            const mensagem = error.response?.data?.error || 'Erro ao realizar cadastro';
            toast.error(mensagem);
            throw error;
        }
    };

    // Login
    const login = async (email, senha) => {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, {
                email,
                senha
            });

            const { user: userData, accessToken: token, refreshToken } = response.data;

            // Salvar no state
            setUser(userData);
            setAccessToken(token);

            // Salvar no localStorage
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('accessToken', token);
            localStorage.setItem('refreshToken', refreshToken);

            // Configurar axios
            configureAxios(token);

            toast.success(`Bem-vindo(a), ${userData.nome}!`);
            return userData;
        } catch (error) {
            const mensagem = error.response?.data?.error || 'Erro ao fazer login';
            toast.error(mensagem);
            throw error;
        }
    };

    // Logout
    const logout = async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            
            if (refreshToken) {
                await axios.post(`${API_URL}/auth/logout`, { refreshToken });
            }
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        } finally {
            // Limpar state
            setUser(null);
            setAccessToken(null);

            // Limpar localStorage
            localStorage.removeItem('user');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');

            toast.info('Logout realizado com sucesso');
        }
    };

    // Atualizar dados do usuário
    const updateUser = async (dados) => {
        try {
            const response = await axios.put(`${API_URL}/auth/me`, dados);

            const updatedUser = response.data.user;
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));

            toast.success('Dados atualizados com sucesso!');
            return updatedUser;
        } catch (error) {
            const mensagem = error.response?.data?.error || 'Erro ao atualizar dados';
            toast.error(mensagem);
            throw error;
        }
    };

    // Alterar senha
    const changePassword = async (senhaAtual, novaSenha) => {
        try {
            await axios.put(`${API_URL}/auth/change-password`, {
                senhaAtual,
                novaSenha
            });

            toast.success('Senha alterada com sucesso!');
        } catch (error) {
            const mensagem = error.response?.data?.error || 'Erro ao alterar senha';
            toast.error(mensagem);
            throw error;
        }
    };

    // Recuperar senha
    const forgotPassword = async (email) => {
        try {
            const response = await axios.post(`${API_URL}/auth/forgot-password`, {
                email
            });

            toast.success('Instruções de recuperação enviadas para seu email');
            return response.data;
        } catch (error) {
            const mensagem = error.response?.data?.error || 'Erro ao solicitar recuperação';
            toast.error(mensagem);
            throw error;
        }
    };

    // Redefinir senha
    const resetPassword = async (token, novaSenha) => {
        try {
            await axios.post(`${API_URL}/auth/reset-password`, {
                token,
                novaSenha
            });

            toast.success('Senha redefinida com sucesso! Faça login.');
        } catch (error) {
            const mensagem = error.response?.data?.error || 'Erro ao redefinir senha';
            toast.error(mensagem);
            throw error;
        }
    };

    // Verificar se está autenticado
    const isAuthenticated = () => {
        return !!user && !!accessToken;
    };

    const value = {
        user,
        loading,
        isAuthenticated,
        register,
        login,
        logout,
        updateUser,
        changePassword,
        forgotPassword,
        resetPassword,
        accessToken
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

// Hook personalizado para usar o contexto
export const useAuth = () => {
    const context = useContext(AuthContext);
    
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    
    return context;
};

export default AuthContext;
