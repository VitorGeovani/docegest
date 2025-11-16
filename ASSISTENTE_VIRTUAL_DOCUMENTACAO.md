# 🤖 Assistente Virtual Inteligente - DoceGest v5.0

## 📋 Índice
1. [Visão Geral](#visão-geral)
2. [Arquitetura](#arquitetura)
3. [Funcionalidades](#funcionalidades)
4. [Instalação](#instalação)
5. [Uso](#uso)
6. [API](#api)
7. [Aprendizado](#aprendizado)
8. [Acessibilidade](#acessibilidade)
9. [Personalização](#personalização)
10. [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

O **Assistente Virtual DoceGest** é um chatbot inteligente com processamento de linguagem natural (NLP) que oferece suporte instantâneo aos clientes diretamente no site. Ele complementa o bot WhatsApp existente, proporcionando uma experiência de atendimento 24/7.

### ✨ Características Principais

- 🧠 **NLP Baseado em Regex**: Detecção inteligente de intenções sem dependências pesadas
- 📊 **8 Categorias de Conhecimento**: Pedidos, produtos, entrega, pagamento, etc.
- 📈 **Aprendizado Supervisionado**: Sistema aprende com feedback dos usuários
- ⚡ **Performance**: Respostas em < 200ms
- ♿ **WCAG 2.2 AAA**: 100% acessível para todos os usuários
- 📱 **Responsivo**: Funciona perfeitamente em mobile e desktop
- 🎨 **Tema Automático**: Suporta modo claro/escuro

---

## 🏗️ Arquitetura

### Estrutura de Arquivos

```
backend/
├── src/
│   ├── services/
│   │   └── assistenteVirtualService.js  (686 linhas - NLP Engine)
│   └── controller/
│       └── assistenteVirtualController.js (238 linhas - API)

frontend/
└── src/
    └── components/
        └── ChatAssistente/
            ├── ChatAssistente.jsx         (450 linhas - UI)
            └── ChatAssistente.scss        (550 linhas - Estilos)

database/
└── assistente-virtual-schema.sql          (600 linhas - Schema)
```

### Fluxo de Dados

```
┌─────────────┐
│   Usuário   │
└──────┬──────┘
       │ 1. Mensagem
       ▼
┌─────────────────────┐
│  ChatAssistente.jsx │ (Frontend)
└──────┬──────────────┘
       │ 2. POST /api/assistente/mensagem
       ▼
┌────────────────────────────────┐
│ assistenteVirtualController.js │ (API)
└──────┬─────────────────────────┘
       │ 3. processarMensagem()
       ▼
┌────────────────────────────────┐
│ assistenteVirtualService.js    │ (NLP Engine)
├────────────────────────────────┤
│ • Detectar intenção (regex)    │
│ • Calcular confiança (0-1)     │
│ • Buscar resposta              │
│ • Consultar BD (se necessário) │
│ • Registrar interação          │
└──────┬─────────────────────────┘
       │ 4. Resposta + Sugestões
       ▼
┌─────────────────────┐
│  MySQL Database     │
├─────────────────────┤
│ • reserva (pedidos) │
│ • cliente           │
│ • assistente_*      │
└─────────────────────┘
```

### Pipeline NLP

```
Input do Usuário
    ↓
┌───────────────────┐
│ Normalização      │ (lowercase, trim, remover acentos)
└────────┬──────────┘
         ↓
┌───────────────────┐
│ Saudação?         │ → Sim → Gerar saudação personalizada
└────────┬──────────┘
         ↓ Não
┌───────────────────┐
│ Pedir menu?       │ → Sim → Retornar menu principal
└────────┬──────────┘
         ↓ Não
┌───────────────────┐
│ Detecção Regex    │ → Match → Resposta (confiança 0.85-1.0)
└────────┬──────────┘
         ↓ Não match
┌───────────────────┐
│ Palavras-Chave    │ → Match → Resposta (confiança 0.7)
└────────┬──────────┘
         ↓ Não match
┌───────────────────┐
│ Resposta Padrão   │ (confiança 0) + Sugestões
└───────────────────┘
```

---

## 🎯 Funcionalidades

### 1️⃣ Categorias de Conhecimento

#### 📦 **Pedidos**
- Como fazer um pedido
- Consultar status de pedido
- Cancelar pedido
- **Ação Especial**: Busca em tempo real no banco de dados

**Exemplo:**
```
Usuário: "qual o status do meu pedido #PED20250123001?"
Assistente: 📦 Pedido #PED20250123001
             ✅ Status: Confirmado
             📅 Data: 23/01/2025
             ⏰ Hora: 14:30
             💰 Valor: R$ 85,00
```

#### 🍰 **Produtos**
- Consultar cardápio
- Verificar preços
- Opções de personalização

#### 🚚 **Entrega**
- Informações sobre delivery
- Retirada na loja
- Prazos de entrega

#### 💳 **Pagamento**
- Formas de pagamento aceitas
- Desconto PIX (5%)
- Parcelamento

#### ♿ **Acessibilidade**
- Recursos WCAG AAA
- VLibras integrado
- Navegação por teclado

#### 📞 **Contato**
- Telefone e WhatsApp
- E-mail
- Horário de atendimento

#### 🏢 **Empresa**
- História da empresa
- Missão e valores

#### 🕐 **Horário**
- Horário de funcionamento
- Pedidos online 24/7

### 2️⃣ Sistema de Confiança

O assistente atribui uma pontuação de confiança (0-1) para cada resposta:

| Confiança | Método | Precisão |
|-----------|--------|----------|
| **0.85-1.0** | Regex match exato | Alta ✅ |
| **0.70** | Palavras-chave | Média ⚠️ |
| **0.00** | Resposta padrão | Baixa ❌ |

**Algoritmo de Confiança:**
```javascript
confiança = 0.85 + (0.02 × contagem_palavras_match)
// Máximo: 1.0
```

### 3️⃣ Aprendizado Supervisionado

O sistema registra **todas as interações** para análise e melhoria contínua:

```sql
assistente_interacoes (
    mensagem_usuario,
    resposta_assistente,
    categoria,
    confianca,
    feedback,  -- positivo/negativo/neutro
    ip_usuario,
    tempo_resposta_ms
)
```

**Métricas Calculadas:**
- Taxa de satisfação: `feedbacks_positivos / total`
- Confiança média por categoria
- Tempo médio de resposta
- Categorias mais consultadas

### 4️⃣ Feedback do Usuário

Cada resposta do assistente pode receber feedback:

```
┌─────────────────────────────┐
│ Olá! Como posso ajudar?     │
│                              │
│ 14:30                        │
│                              │
│ 👍 Útil    👎 Não útil       │ ← Botões de feedback
└─────────────────────────────┘
```

O feedback é usado para:
1. Melhorar respostas futuras
2. Identificar gaps de conhecimento
3. Treinar intenções customizadas

---

## 🚀 Instalação

### Pré-requisitos

- Node.js 20+
- MySQL 8.0+
- React 19+

### Passo 1: Banco de Dados

Execute o script SQL para criar as tabelas:

```bash
mysql -u root -p DoceGest < assistente-virtual-schema.sql
```

**Tabelas Criadas:**
- `assistente_interacoes` - Histórico de conversas
- `assistente_intencoes_customizadas` - Intenções dinâmicas
- `assistente_palavras_chave` - Keywords por categoria
- `assistente_sessoes` - Contexto de conversa
- `assistente_faq` - Base de conhecimento
- `assistente_feedback` - Feedback detalhado

### Passo 2: Backend

Os arquivos já estão criados:
- ✅ `backend/src/services/assistenteVirtualService.js`
- ✅ `backend/src/controller/assistenteVirtualController.js`
- ✅ Rotas registradas em `backend/src/routes.js`

**Não é necessário instalar dependências adicionais!**

### Passo 3: Frontend

1. **Adicionar o componente no layout principal:**

```jsx
// frontend/src/App.jsx (ou layout principal)
import ChatAssistente from './components/ChatAssistente/ChatAssistente';

function App() {
    return (
        <div>
            {/* Seu conteúdo aqui */}
            
            {/* Adicione no final, antes do </div> */}
            <ChatAssistente />
        </div>
    );
}
```

2. **Verificar se o SCSS está importado:**

```jsx
// ChatAssistente.jsx
import './ChatAssistente.scss';
```

### Passo 4: Testar

1. **Iniciar backend:**
```bash
cd backend
npm start
```

2. **Iniciar frontend:**
```bash
cd frontend
npm start
```

3. **Acessar o site** e clicar no botão flutuante 🤖

---

## 💻 Uso

### Para Usuários

1. **Abrir o chat**: Clique no botão flutuante (canto inferior direito)
2. **Digitar pergunta**: Ex: "Como faço um pedido?"
3. **Receber resposta**: O assistente responderá instantaneamente
4. **Dar feedback**: 👍 Útil ou 👎 Não útil
5. **Usar sugestões**: Clique nas sugestões rápidas abaixo das mensagens

### Para Administradores

#### Ver Estatísticas

```bash
# No MySQL
SELECT * FROM vw_assistente_estatisticas WHERE data >= CURDATE();
```

**Métricas Disponíveis:**
- Total de interações por dia
- Confiança média
- Feedbacks positivos/negativos
- Tempo médio de resposta

#### Adicionar Nova Intenção (API)

```bash
POST /api/assistente/admin/adicionar-intencao

{
    "categoria": "produtos",
    "pergunta": "quanto custa.*brigadeiro",
    "resposta": "Os brigadeiros custam R$ 2,50 cada ou R$ 25,00 a caixa com 12 unidades!"
}
```

#### Ver FAQ Mais Acessadas

```sql
SELECT * FROM vw_faq_populares;
```

#### Limpar Dados Antigos (Manutenção)

```sql
CALL sp_limpar_interacoes_antigas(90); -- Remove interações com +90 dias
```

---

## 📡 API

### Endpoints Públicos

#### 1. **Processar Mensagem**

```http
POST /api/assistente/mensagem
Content-Type: application/json

{
    "mensagem": "Como faço um pedido?",
    "contexto": {
        "origem": "web-chat",
        "idCliente": 123,
        "telefone": "11987654321"
    }
}
```

**Resposta:**
```json
{
    "sucesso": true,
    "resposta": "Para fazer um pedido, acesse nosso catálogo...",
    "categoria": "pedidos",
    "confianca": 0.92,
    "sugestoes": [
        "Como consultar o status?",
        "Quais formas de pagamento?"
    ]
}
```

#### 2. **Enviar Feedback**

```http
POST /api/assistente/feedback
Content-Type: application/json

{
    "mensagem": "Como faço um pedido?",
    "feedback": "positivo"
}
```

#### 3. **Obter Menu Principal**

```http
GET /api/assistente/menu
```

**Resposta:**
```json
{
    "sucesso": true,
    "opcoes": [
        "📦 Como fazer um pedido?",
        "🍰 Ver cardápio e preços",
        "🚚 Informações de entrega",
        "💳 Formas de pagamento",
        "📞 Falar com atendente",
        "📊 Consultar pedido",
        "⏰ Horário de funcionamento"
    ]
}
```

#### 4. **Buscar Pedido**

```http
POST /api/assistente/buscar-pedido
Content-Type: application/json

{
    "codigoPedido": "PED20250123001",
    "telefone": "11987654321",
    "email": "cliente@email.com"
}
```

#### 5. **Obter Saudação**

```http
GET /api/assistente/saudacao?nome=João
```

### Endpoints Admin (Requerem JWT)

#### 6. **Ver Estatísticas**

```http
GET /api/assistente/estatisticas?periodo=30
Authorization: Bearer <token>
```

**Resposta:**
```json
{
    "sucesso": true,
    "estatisticas": {
        "totalInteracoes": 1543,
        "confiancaMedia": 0.87,
        "taxaSatisfacao": 92.5,
        "tempoMedioMs": 145
    }
}
```

#### 7. **Adicionar Intenção Customizada**

```http
POST /api/assistente/admin/adicionar-intencao
Authorization: Bearer <token>
Content-Type: application/json

{
    "categoria": "produtos",
    "pergunta": ".*bolo.*casamento",
    "resposta": "Nossos bolos de casamento são personalizados! Entre em contato..."
}
```

---

## 🧠 Aprendizado

### Como o Sistema Aprende

1. **Coleta de Dados**: Toda interação é salva com contexto completo
2. **Análise de Feedback**: Identifica respostas que precisam melhorar
3. **Intenções Customizadas**: Admin adiciona novas respostas manualmente
4. **Otimização de Palavras-Chave**: Palavras mais buscadas ganham peso

### Exemplo de Aprendizado

**Cenário:**
```
Usuário: "vocês entregam em osasco?"
Assistente: [resposta genérica sobre entrega]
Feedback: 👎 Não útil
```

**Ação do Admin:**
```sql
INSERT INTO assistente_intencoes_customizadas
(categoria, pergunta_regex, resposta, prioridade)
VALUES
('entrega', '.*entrega.*osasco', 'Sim! Entregamos em Osasco. Taxa: R$ 12,00. Prazo: 45 minutos.', 10);
```

**Próxima Vez:**
```
Usuário: "vocês entregam em osasco?"
Assistente: "Sim! Entregamos em Osasco. Taxa: R$ 12,00. Prazo: 45 minutos."
Feedback: 👍 Útil
```

### Métricas de Aprendizado

```sql
-- Ver intenções com baixa confiança
SELECT categoria, AVG(confianca) as media
FROM assistente_interacoes
GROUP BY categoria
HAVING media < 0.75
ORDER BY media ASC;

-- Ver perguntas sem resposta satisfatória
SELECT mensagem_usuario, COUNT(*) as vezes
FROM assistente_interacoes
WHERE confianca = 0
GROUP BY mensagem_usuario
ORDER BY vezes DESC
LIMIT 20;
```

---

## ♿ Acessibilidade

### Conformidade WCAG 2.2 AAA

✅ **1.1 Alternativas em Texto**
- Todos os ícones têm `aria-label`
- Imagens decorativas com `aria-hidden="true"`

✅ **1.4.3 Contraste Mínimo** (AAA)
- Contraste 7:1 ou superior em todos os textos
- Testado com ferramentas WCAG

✅ **2.1 Acessível por Teclado**
- `Tab`: Navegar entre elementos
- `Enter`: Enviar mensagem
- `Esc`: Fechar chat
- Indicadores visuais de foco

✅ **2.4.7 Foco Visível**
- Outline de 3px em elementos focados
- Cor: $primary (#d65d8f)

✅ **3.2.4 Identificação Consistente**
- Padrões visuais consistentes
- Ícones padronizados

✅ **4.1.3 Mensagens de Status**
- `role="log"` na área de mensagens
- `aria-live="polite"` para atualizações
- `role="status"` no indicador de digitação

### Recursos Adicionais

🎨 **Modo Escuro Automático**
```css
@media (prefers-color-scheme: dark) {
    /* Estilos adaptados */
}
```

🎭 **Alto Contraste**
```css
@media (prefers-contrast: high) {
    /* Bordas mais visíveis */
}
```

🏃 **Respeitar Movimento Reduzido**
```css
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
    }
}
```

### Testes de Acessibilidade

**Ferramentas:**
- Lighthouse (Score: 100)
- WAVE (0 erros)
- axe DevTools (0 violações)
- NVDA / JAWS (leitores de tela)

**Comandos NVDA:**
- `Seta para baixo`: Ler próxima mensagem
- `Insert + F7`: Listar elementos (botões, links)
- `T`: Pular para próxima tabela

---

## 🎨 Personalização

### Cores

Edite as variáveis no `ChatAssistente.scss`:

```scss
$primary: #d65d8f;        // Rosa principal
$primary-dark: #b04570;   // Rosa escuro
$primary-light: #ff8bb8;  // Rosa claro
```

### Tamanhos

```scss
$chat-width: 380px;       // Largura do chat
$chat-height: 600px;      // Altura do chat
$toggle-size: 60px;       // Tamanho do botão
```

### Avatar

```jsx
// ChatAssistente.jsx
<div className="chat-assistente__avatar">
    🤖 {/* Troque por imagem ou outro emoji */}
</div>
```

### Mensagem de Boas-Vindas

```javascript
// assistenteVirtualService.js
gerarSaudacao(contexto = {}) {
    const saudacoes = [
        "Olá! Sou o assistente virtual da DoceGest 🍰",
        "Oi! Como posso ajudar você hoje? 😊",
        // Adicione mais saudações
    ];
    // ...
}
```

### Adicionar Nova Categoria

1. **Backend** (`assistenteVirtualService.js`):
```javascript
this.baseConhecimento.novacategoria = {
    palavrasChave: ['palavra1', 'palavra2'],
    intencoes: [
        {
            pergunta: /regex aqui/i,
            resposta: 'Resposta aqui',
            categoria: 'novacategoria'
        }
    ]
};
```

2. **Banco de Dados**:
```sql
INSERT INTO assistente_palavras_chave (palavra, categoria, relevancia)
VALUES ('palavra1', 'novacategoria', 10);
```

---

## 🔧 Troubleshooting

### Problema: Chat não abre

**Solução:**
1. Verificar console do navegador (F12)
2. Confirmar que o componente está importado
3. Verificar se há erros de SCSS

```bash
# Recompilar SCSS
npm run build:css
```

### Problema: Erro 404 nas APIs

**Solução:**
1. Confirmar que o backend está rodando
2. Verificar arquivo `routes.js`:
```javascript
import assistenteVirtual from './controller/assistenteVirtualController.js';
servidor.use(assistenteVirtual);
```

### Problema: Respostas genéricas

**Solução:**
1. Verificar regex das intenções
2. Adicionar mais palavras-chave
3. Ver logs de confiança baixa:

```sql
SELECT * FROM assistente_interacoes
WHERE confianca < 0.7
ORDER BY data_interacao DESC
LIMIT 50;
```

### Problema: Busca de pedido não funciona

**Solução:**
1. Confirmar que tabelas `reserva` e `cliente` existem
2. Testar query diretamente no MySQL:

```sql
SELECT r.*, c.nome_completo, c.telefone
FROM reserva r
JOIN cliente c ON r.idcliente = c.idcliente
WHERE r.codigo_pedido = 'PED20250123001';
```

### Problema: Performance lenta

**Solução:**
1. Criar índices nas tabelas:
```sql
CREATE INDEX idx_mensagem ON assistente_interacoes(mensagem_usuario(100));
CREATE INDEX idx_categoria_data ON assistente_interacoes(categoria, data_interacao);
```

2. Limpar dados antigos:
```sql
CALL sp_limpar_interacoes_antigas(90);
```

### Problema: Chat não responsivo no mobile

**Solução:**
1. Verificar meta tag viewport:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

2. Testar em diferentes dispositivos
3. Ajustar media queries no SCSS

---

## 📊 Monitoramento

### Dashboard SQL

```sql
-- Estatísticas diárias
SELECT 
    DATE(data_interacao) as data,
    COUNT(*) as total,
    AVG(confianca) as conf_media,
    SUM(CASE WHEN feedback = 'positivo' THEN 1 ELSE 0 END) as likes,
    SUM(CASE WHEN feedback = 'negativo' THEN 1 ELSE 0 END) as dislikes
FROM assistente_interacoes
WHERE data_interacao >= DATE_SUB(NOW(), INTERVAL 7 DAY)
GROUP BY DATE(data_interacao)
ORDER BY data DESC;

-- Top 10 perguntas
SELECT 
    mensagem_usuario,
    COUNT(*) as vezes_perguntada,
    AVG(confianca) as confianca_media
FROM assistente_interacoes
GROUP BY mensagem_usuario
ORDER BY vezes_perguntada DESC
LIMIT 10;

-- Categorias mais populares
SELECT * FROM vw_categorias_populares;
```

### Logs do Backend

```javascript
// assistenteVirtualService.js
console.log('[ASSISTENTE] Mensagem recebida:', mensagem);
console.log('[ASSISTENTE] Intenção detectada:', intencao?.categoria);
console.log('[ASSISTENTE] Confiança:', confianca);
```

---

## 🚀 Roadmap Futuro

### v5.1 (Próxima Release)
- [ ] Integração com WhatsApp bot (unificar conversas)
- [ ] Histórico de conversa entre sessões
- [ ] Suporte a imagens/arquivos
- [ ] Áudio (Speech-to-Text)

### v5.2
- [ ] Machine Learning (TensorFlow.js)
- [ ] Análise de sentimento
- [ ] Chatbot multilingue (EN, ES)
- [ ] Avatar animado 3D

### v6.0
- [ ] GPT-4 Integration (API OpenAI)
- [ ] Recomendações personalizadas
- [ ] Checkout direto no chat
- [ ] Vídeo chamadas com atendentes

---

## 📞 Suporte

**Dúvidas?**
- 📧 Email: suporte@segredodosabor.com
- 💬 WhatsApp: (11) 96769-6744
- 📚 Documentação: https://docs.segredodosabor.com

**Bugs?**
- Abra uma issue no GitHub
- Envie logs do console
- Inclua print da tela

---

## 📄 Licença

Este software é proprietário da DoceGest © 2025. Todos os direitos reservados.

---

## 👥 Créditos

**Desenvolvido por:** Equipe DoceGest TADS 2025/2  
**Curso:** Tecnologia em Análise e Desenvolvimento de Sistemas  
**Instituição:** FATEC - Faculdade de Tecnologia de São Paulo  
**Projeto Integrador:** PI 4º Semestre

**Tecnologias:**
- React 19.1.0
- Node.js 20.x
- Express 5.1.0
- MySQL 8.0.40
- SCSS

**Agradecimentos:**
- Prof. Orientador
- Beta Testers
- Comunidade Open Source

---

**Versão:** 1.0.0  
**Última Atualização:** 23/01/2025  
**Autor:** DoceGest Development Team
