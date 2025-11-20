# RELATÓRIO TÉCNICO - PARTE 9
## 4.3.3. FRONTEND (React 19.1.0 + SCSS)

---

### 📁 Estrutura de Diretórios Frontend

```
frontend/
├── public/
│   ├── logo.png
│   ├── favicon.ico
│   ├── vlibras/                  # Scripts VLibras
│   └── uploads/                  # Imagens de produtos
├── src/
│   ├── components/               # Componentes reutilizáveis
│   │   ├── assistente/
│   │   │   ├── Assistente.js    # Chat virtual IA
│   │   │   └── Assistente.scss
│   │   ├── carrinho/
│   │   │   ├── Carrinho.js      # Modal carrinho
│   │   │   └── Carrinho.scss
│   │   ├── footer/
│   │   │   ├── Footer.js
│   │   │   └── Footer.scss
│   │   ├── header/
│   │   │   ├── Header.js        # Navegação principal
│   │   │   └── Header.scss
│   │   └── whatsappFlutuante/
│   │       ├── WhatsappFlutuante.js
│   │       └── WhatsappFlutuante.scss
│   ├── contexts/
│   │   ├── AuthContext.js       # Autenticação global
│   │   ├── FavoritosContext.js  # Favoritos global
│   │   └── CarrinhoContext.js   # Carrinho global
│   ├── pages/
│   │   ├── cadastro/
│   │   │   ├── Cadastro.js
│   │   │   └── Cadastro.scss
│   │   ├── catalogo/
│   │   │   ├── Catalogo.js      # E-commerce principal
│   │   │   └── Catalogo.scss
│   │   ├── checkout/
│   │   │   ├── Checkout.js      # Finalização pedido
│   │   │   └── Checkout.scss
│   │   ├── confirmacao/
│   │   │   ├── Confirmacao.js
│   │   │   └── Confirmacao.scss
│   │   ├── home/
│   │   │   ├── Home.js          # Landing page
│   │   │   └── Home.scss
│   │   ├── login/
│   │   │   ├── Login.js
│   │   │   └── Login.scss
│   │   ├── meusPedidos/
│   │   │   ├── MeusPedidos.js   # Área do cliente
│   │   │   └── MeusPedidos.scss
│   │   ├── termosUso/
│   │   │   ├── TermosUso.js
│   │   │   └── TermosUso.scss
│   │   ├── politicaPrivacidade/
│   │   │   ├── PoliticaPrivacidade.js
│   │   │   └── PoliticaPrivacidade.scss
│   │   └── gerenciamentos/       # Área administrativa
│   │       ├── Gerenciamentos.js # Dashboard BI
│   │       ├── Gerenciamentos.scss
│   │       ├── adicionarProduto/
│   │       │   └── AdicionarProduto.js
│   │       ├── ingrediente/
│   │       │   ├── Ingrediente.js
│   │       │   └── Ingrediente.scss
│   │       ├── receita/
│   │       │   ├── Receita.js
│   │       │   └── Receita.scss
│   │       ├── relatorios/
│   │       │   ├── Relatorios.js
│   │       │   └── Relatorios.scss
│   │       └── whatsappBot/
│   │           ├── WhatsappBot.js
│   │           └── WhatsappBot.scss
│   ├── services/
│   │   └── api.js               # Axios configurado
│   ├── utils/
│   │   ├── formatters.js        # Formatação de valores
│   │   └── validators.js        # Validações
│   ├── styles/
│   │   ├── _variables.scss      # Variáveis globais
│   │   ├── _mixins.scss         # Mixins reutilizáveis
│   │   ├── _accessibility.scss  # Estilos WCAG
│   │   └── global.scss          # Estilos globais
│   ├── App.js                   # Componente raiz
│   ├── App.scss
│   ├── index.js                 # Entry point
│   └── index.css
├── package.json
└── README.md
```

### 🎨 Componentes Principais

#### 1. **Header.js** - Navegação Principal
```javascript
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import './Header.scss';

export default function Header() {
  const { usuario, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header" role="banner">
      <div className="container">
        <Link to="/" className="logo" aria-label="Ir para página inicial">
          <img src="/logo.png" alt="Segredo do Sabor" />
          <span>Segredo do Sabor</span>
        </Link>

        <nav className="nav" role="navigation" aria-label="Menu principal">
          <Link to="/" aria-label="Página inicial">Início</Link>
          <Link to="/catalogo" aria-label="Ver catálogo de produtos">Catálogo</Link>
          
          {usuario ? (
            <>
              <Link to="/meus-pedidos" aria-label="Ver meus pedidos">
                Meus Pedidos
              </Link>
              {usuario.tipo === 'admin' && (
                <Link to="/gerenciamentos" aria-label="Acessar painel administrativo">
                  Admin
                </Link>
              )}
              <button 
                onClick={handleLogout} 
                className="btn-logout"
                aria-label="Sair da conta"
              >
                Sair ({usuario.nome})
              </button>
            </>
          ) : (
            <Link to="/login" aria-label="Fazer login">Entrar</Link>
          )}
          
          <button 
            className="btn-carrinho" 
            aria-label="Abrir carrinho de compras, 3 itens"
          >
            🛒 <span className="badge">3</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
```

#### 2. **AuthContext.js** - Gerenciamento de Autenticação
```javascript
import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carrega usuário do localStorage ao iniciar
  useEffect(() => {
    const usuarioSalvo = localStorage.getItem('usuario');
    const token = localStorage.getItem('token');
    
    if (usuarioSalvo && token) {
      setUsuario(JSON.parse(usuarioSalvo));
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  // Login
  const login = async (email, senha) => {
    try {
      const response = await api.post('/auth/login', { email, senha });
      const { token, usuario: dadosUsuario } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('usuario', JSON.stringify(dadosUsuario));
      
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUsuario(dadosUsuario);

      return { sucesso: true };
    } catch (error) {
      return { 
        sucesso: false, 
        mensagem: error.response?.data?.mensagem || 'Erro ao fazer login' 
      };
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    delete api.defaults.headers.common['Authorization'];
    setUsuario(null);
  };

  // Atualizar dados do usuário
  const atualizarUsuario = (novosDados) => {
    const usuarioAtualizado = { ...usuario, ...novosDados };
    setUsuario(usuarioAtualizado);
    localStorage.setItem('usuario', JSON.stringify(usuarioAtualizado));
  };

  return (
    <AuthContext.Provider value={{ 
      usuario, 
      login, 
      logout, 
      atualizarUsuario,
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
}
```

#### 3. **Catalogo.js** - Página de Produtos
```javascript
import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import './Catalogo.scss';

export default function Catalogo() {
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaAtiva, setCategoriaAtiva] = useState('todas');
  const [busca, setBusca] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [resProdutos, resCategorias] = await Promise.all([
        api.get('/produto'),
        api.get('/categoria')
      ]);
      
      setProdutos(resProdutos.data);
      setCategorias(resCategorias.data);
    } catch (error) {
      toast.error('Erro ao carregar catálogo');
    } finally {
      setLoading(false);
    }
  };

  const adicionarAoCarrinho = (produto) => {
    const carrinho = JSON.parse(localStorage.getItem('carrinho') || '[]');
    const itemExistente = carrinho.find(item => item.idproduto === produto.idproduto);

    if (itemExistente) {
      itemExistente.quantidade += 1;
    } else {
      carrinho.push({ ...produto, quantidade: 1 });
    }

    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    toast.success(`${produto.nome} adicionado ao carrinho!`);
  };

  const produtosFiltrados = produtos.filter(produto => {
    const passaCategoria = categoriaAtiva === 'todas' || 
                          produto.idcategoria === parseInt(categoriaAtiva);
    const passaBusca = produto.nome.toLowerCase().includes(busca.toLowerCase());
    return passaCategoria && passaBusca && produto.ativo === 1;
  });

  if (loading) {
    return <div className="loading">Carregando catálogo...</div>;
  }

  return (
    <main className="catalogo" role="main">
      <section className="filtros" role="search">
        <h1>Nossos Produtos</h1>
        
        <input
          type="search"
          placeholder="Buscar produtos..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          aria-label="Buscar produtos"
        />

        <div className="categorias" role="tablist">
          <button
            className={categoriaAtiva === 'todas' ? 'active' : ''}
            onClick={() => setCategoriaAtiva('todas')}
            role="tab"
            aria-selected={categoriaAtiva === 'todas'}
          >
            Todas
          </button>
          {categorias.map(cat => (
            <button
              key={cat.idcategoria}
              className={categoriaAtiva === cat.idcategoria ? 'active' : ''}
              onClick={() => setCategoriaAtiva(cat.idcategoria)}
              role="tab"
              aria-selected={categoriaAtiva === cat.idcategoria}
            >
              {cat.nome}
            </button>
          ))}
        </div>
      </section>

      <section className="grid-produtos">
        {produtosFiltrados.length === 0 ? (
          <p className="sem-resultados">Nenhum produto encontrado.</p>
        ) : (
          produtosFiltrados.map(produto => (
            <article key={produto.idproduto} className="card-produto">
              <img 
                src={`/uploads/${produto.img_Produto}`} 
                alt={produto.nome}
                loading="lazy"
              />
              <h2>{produto.nome}</h2>
              <p className="descricao">{produto.descricao}</p>
              <div className="preco">
                <span aria-label={`Preço: ${produto.preco} reais`}>
                  R$ {produto.preco.toFixed(2)}
                </span>
              </div>
              <button
                onClick={() => adicionarAoCarrinho(produto)}
                className="btn-adicionar"
                aria-label={`Adicionar ${produto.nome} ao carrinho`}
              >
                🛒 Adicionar ao Carrinho
              </button>
            </article>
          ))
        )}
      </section>
    </main>
  );
}
```

#### 4. **Gerenciamentos.js** - Dashboard Admin (BI)
```javascript
import React, { useState, useEffect } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import api from '../../services/api';
import './Gerenciamentos.scss';

export default function Gerenciamentos() {
  const [estatisticas, setEstatisticas] = useState({
    vendasHoje: 0,
    vendasMes: 0,
    pedidosPendentes: 0,
    estoqueBaixo: 0,
    ticketMedio: 0
  });
  
  const [graficoVendas, setGraficoVendas] = useState(null);
  const [graficoCategorias, setGraficoCategorias] = useState(null);
  const [graficoPagamentos, setGraficoPagamentos] = useState(null);
  const [produtosMaisVendidos, setProdutosMaisVendidos] = useState([]);

  useEffect(() => {
    carregarDashboard();
  }, []);

  const carregarDashboard = async () => {
    try {
      const [resEstatisticas, resVendas, resCategorias, resPagamentos, resProdutos] = 
        await Promise.all([
          api.get('/relatorios/estatisticas-gerais'),
          api.get('/relatorios/vendas-ultimos-30-dias'),
          api.get('/relatorios/vendas-por-categoria'),
          api.get('/relatorios/vendas-por-pagamento'),
          api.get('/relatorios/produtos-mais-vendidos')
        ]);

      setEstatisticas(resEstatisticas.data);
      
      // Gráfico de Vendas (Linha)
      setGraficoVendas({
        labels: resVendas.data.map(item => item.data),
        datasets: [{
          label: 'Vendas Diárias (R$)',
          data: resVendas.data.map(item => item.valor),
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
        }]
      });

      // Gráfico de Categorias (Barras)
      setGraficoCategorias({
        labels: resCategorias.data.map(item => item.categoria),
        datasets: [{
          label: 'Quantidade Vendida',
          data: resCategorias.data.map(item => item.quantidade),
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
          ]
        }]
      });

      // Gráfico de Pagamentos (Pizza)
      setGraficoPagamentos({
        labels: resPagamentos.data.map(item => item.metodo),
        datasets: [{
          data: resPagamentos.data.map(item => item.total),
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 206, 86, 0.8)',
          ]
        }]
      });

      setProdutosMaisVendidos(resProdutos.data);

    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    }
  };

  return (
    <main className="dashboard" role="main">
      <h1>Dashboard - Visão Geral</h1>

      <section className="cards-estatisticas">
        <div className="card">
          <h3>Vendas Hoje</h3>
          <p className="valor">R$ {estatisticas.vendasHoje.toFixed(2)}</p>
        </div>
        <div className="card">
          <h3>Vendas do Mês</h3>
          <p className="valor">R$ {estatisticas.vendasMes.toFixed(2)}</p>
        </div>
        <div className="card">
          <h3>Pedidos Pendentes</h3>
          <p className="valor">{estatisticas.pedidosPendentes}</p>
        </div>
        <div className="card alerta">
          <h3>Estoque Baixo</h3>
          <p className="valor">{estatisticas.estoqueBaixo} itens</p>
        </div>
        <div className="card">
          <h3>Ticket Médio</h3>
          <p className="valor">R$ {estatisticas.ticketMedio.toFixed(2)}</p>
        </div>
      </section>

      <section className="graficos">
        <div className="grafico-container">
          <h2>Vendas - Últimos 30 Dias</h2>
          {graficoVendas && <Line data={graficoVendas} />}
        </div>

        <div className="grafico-container">
          <h2>Vendas por Categoria</h2>
          {graficoCategorias && <Bar data={graficoCategorias} />}
        </div>

        <div className="grafico-container">
          <h2>Formas de Pagamento</h2>
          {graficoPagamentos && <Doughnut data={graficoPagamentos} />}
        </div>
      </section>

      <section className="tabela-produtos">
        <h2>Produtos Mais Vendidos</h2>
        <table>
          <thead>
            <tr>
              <th>Produto</th>
              <th>Quantidade</th>
              <th>Receita Total</th>
              <th>Margem Lucro</th>
            </tr>
          </thead>
          <tbody>
            {produtosMaisVendidos.map(produto => (
              <tr key={produto.idproduto}>
                <td>{produto.nome}</td>
                <td>{produto.quantidade_total}</td>
                <td>R$ {produto.receita_total.toFixed(2)}</td>
                <td className={produto.margem_lucro_percentual >= 30 ? 'lucro-bom' : 'lucro-baixo'}>
                  {produto.margem_lucro_percentual}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
```

### 🎨 Estilos SCSS - Padrões de Acessibilidade

**_variables.scss**
```scss
// Cores Principais
$primary-color: #D77FA1;
$secondary-color: #92C5DE;
$accent-color: #F4A261;
$dark-color: #2A2A2A;
$light-color: #F5F5F5;

// Cores de Feedback
$success-color: #4CAF50;
$error-color: #F44336;
$warning-color: #FF9800;
$info-color: #2196F3;

// Tipografia
$font-primary: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
$font-size-base: 16px;
$line-height-base: 1.6;

// Espaçamentos
$spacing-xs: 0.5rem;
$spacing-sm: 1rem;
$spacing-md: 1.5rem;
$spacing-lg: 2rem;
$spacing-xl: 3rem;

// Breakpoints Responsivos
$mobile: 480px;
$tablet: 768px;
$desktop: 1024px;
$wide: 1440px;

// Acessibilidade - Tamanhos Mínimos WCAG
$min-touch-target: 44px; // WCAG 2.2 - Guideline 2.5.8
$min-font-size: 14px;
$focus-outline-width: 3px;
```

**_mixins.scss**
```scss
// Foco visível para teclado (WCAG 2.4.7)
@mixin focus-visible {
  &:focus-visible {
    outline: $focus-outline-width solid $primary-color;
    outline-offset: 2px;
    box-shadow: 0 0 0 4px rgba($primary-color, 0.2);
  }
}

// Botão acessível
@mixin btn-accessible {
  min-width: $min-touch-target;
  min-height: $min-touch-target;
  padding: $spacing-sm $spacing-md;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  @include focus-visible;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
}

// Responsividade
@mixin responsive($breakpoint) {
  @if $breakpoint == mobile {
    @media (max-width: $mobile) { @content; }
  }
  @else if $breakpoint == tablet {
    @media (max-width: $tablet) { @content; }
  }
  @else if $breakpoint == desktop {
    @media (min-width: $desktop) { @content; }
  }
}

// Alto contraste (WCAG 1.4.3)
@mixin high-contrast-text($bg-color) {
  @if lightness($bg-color) > 50 {
    color: $dark-color; // Texto escuro em fundo claro
  } @else {
    color: $light-color; // Texto claro em fundo escuro
  }
}
```

### 📦 Dependências Frontend

**package.json**
```json
{
  "name": "segredo-do-sabor-frontend",
  "version": "5.0.0",
  "dependencies": {
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "react-router-dom": "^7.5.0",
    "react-icons": "^5.0.1",
    "react-toastify": "^10.0.4",
    "axios": "^1.8.4",
    "chart.js": "^4.4.1",
    "react-chartjs-2": "^5.2.0",
    "sass": "^1.86.3"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
}
```

---

## 4.3.4. BACKEND (Node.js 20.x + Express 5.1.0)

### 📁 Estrutura de Diretórios Backend

```
backend/
├── config/
│   ├── database.js              # Configuração MySQL
│   └── jwt.js                   # Configuração JWT
├── controllers/
│   ├── authController.js        # Login, logout, registro
│   ├── clienteController.js     # CRUD clientes
│   ├── produtoController.js     # CRUD produtos
│   ├── categoriaController.js   # CRUD categorias
│   ├── ingredienteController.js # CRUD ingredientes
│   ├── receitaController.js     # CRUD receitas (BOM)
│   ├── reservaController.js     # CRUD pedidos
│   ├── relatoriosController.js  # Relatórios BI
│   ├── whatsappController.js    # Bot WhatsApp
│   └── assistenteController.js  # FAQ virtual
├── middlewares/
│   ├── auth.js                  # Validação JWT
│   ├── errorHandler.js          # Tratamento erros
│   ├── validator.js             # Validação dados
│   └── upload.js                # Upload imagens (Multer)
├── repositories/
│   ├── clienteRepository.js
│   ├── produtoRepository.js
│   ├── ingredienteRepository.js
│   ├── receitaRepository.js
│   └── reservaRepository.js
├── routes/
│   ├── authRoutes.js
│   ├── clienteRoutes.js
│   ├── produtoRoutes.js
│   ├── categoriaRoutes.js
│   ├── ingredienteRoutes.js
│   ├── receitaRoutes.js
│   ├── reservaRoutes.js
│   ├── relatoriosRoutes.js
│   ├── whatsappRoutes.js
│   └── assistenteRoutes.js
├── services/
│   ├── authService.js
│   ├── custoService.js          # Cálculo custos
│   ├── estoqueService.js        # Gestão estoque
│   ├── whatsappService.js       # Integration Evolution API
│   └── assistenteService.js     # IA NLP
├── utils/
│   ├── formatters.js
│   ├── validators.js
│   └── logger.js
├── uploads/                      # Imagens enviadas
├── .env                          # Variáveis ambiente
├── server.js                     # Entry point
├── app.js                        # Configuração Express
└── package.json
```

### 🚀 Arquivo Principal - server.js

```javascript
require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📡 API disponível em http://localhost:${PORT}/api`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
});
```

### ⚙️ Configuração Express - app.js

```javascript
const express = require('express');
const cors = require('cors');
const path = require('path');
const errorHandler = require('./middlewares/errorHandler');

// Importar rotas
const authRoutes = require('./routes/authRoutes');
const produtoRoutes = require('./routes/produtoRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const ingredienteRoutes = require('./routes/ingredienteRoutes');
const receitaRoutes = require('./routes/receitaRoutes');
const reservaRoutes = require('./routes/reservaRoutes');
const relatoriosRoutes = require('./routes/relatoriosRoutes');
const whatsappRoutes = require('./routes/whatsappRoutes');
const assistenteRoutes = require('./routes/assistenteRoutes');

const app = express();

// Middlewares Globais
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/produto', produtoRoutes);
app.use('/api/categoria', categoriaRoutes);
app.use('/api/ingrediente', ingredienteRoutes);
app.use('/api/receita', receitaRoutes);
app.use('/api/reserva', reservaRoutes);
app.use('/api/relatorios', relatoriosRoutes);
app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/assistente', assistenteRoutes);

// Rota 404
app.use('*', (req, res) => {
  res.status(404).json({ mensagem: 'Rota não encontrada' });
});

// Middleware de Tratamento de Erros
app.use(errorHandler);

module.exports = app;
```

---

**Conclusão Parcial:** Frontend React e estrutura Backend Node.js detalhados. Próxima parte: Controllers, Services e Integra ções externas.
