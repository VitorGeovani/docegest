import React, { useState } from "react";
import "./index.scss";
import Logo from '../../components/logo'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import axios from 'axios';

const API_URL = 'http://localhost:5000';

export default function Login() {
  const [emailOuCpf, setEmailOuCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!emailOuCpf || !senha) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    setCarregando(true);
    
    try {
      const response = await axios.post(`${API_URL}/auth/admin/login`, {
        email: emailOuCpf,
        senha: senha
      });

      if (response.data.success) {
        // Salvar token no localStorage
        localStorage.setItem('authToken', response.data.accessToken);
        localStorage.setItem('adminData', JSON.stringify(response.data.user));
        
        toast.success('Login realizado com sucesso! 🎉');
        navigate('/gerenciamentos');
      }
    } catch (error) {
      const mensagem = error.response?.data?.error || 'Erro ao fazer login';
      toast.error(mensagem);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="pagina-login">
      <div className="login-background">
        <div className="login-overlay"></div>
      </div>

      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <Logo />
            <h1 className="login-title">Entre na Cozinha Chefe!</h1>
            <p className="login-subtitle">Acesso exclusivo para administradores</p>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">📧</span>
                E-mail ou CPF
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="Digite seu e-mail ou CPF"
                value={emailOuCpf}
                onChange={(e) => setEmailOuCpf(e.target.value)}
                disabled={carregando}
                autoComplete="username"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">🔒</span>
                Senha
              </label>
              <div className="password-wrapper">
                <input
                  type={mostrarSenha ? "text" : "password"}
                  className="form-input"
                  placeholder="Digite sua senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  disabled={carregando}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  disabled={carregando}
                  tabIndex="-1"
                >
                  {mostrarSenha ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn-login"
              disabled={carregando}
            >
              {carregando ? (
                <>
                  <span className="spinner"></span>
                  Entrando...
                </>
              ) : (
                <>
                  <span>Entrar</span>
                  <span className="arrow">→</span>
                </>
              )}
            </button>

            <button 
              type="button" 
              className="btn-voltar-home"
              onClick={() => navigate('/')}
              disabled={carregando}
            >
              <span className="arrow-back">←</span>
              <span>Voltar para Home</span>
            </button>

            <div className="login-footer">
              <div className="info-acesso">
                <p className="info-text">
                  🔐 <strong>Acesso Restrito</strong>
                </p>
                <p className="info-description">
                  Apenas administradores cadastrados têm acesso à área de gerenciamento. 
                  Estava querendo desvendar nosso segredo? 😉
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
