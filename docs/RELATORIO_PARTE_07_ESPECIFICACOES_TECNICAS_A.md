# RELATÓRIO TÉCNICO - PARTE 7
## 4. ESPECIFICAÇÕES TÉCNICAS

---

## 4.1. Especificação do Sistema (User Stories)

As user stories foram organizadas seguindo a abordagem do **Design Thinking**, identificadas durante a etapa de **Imersão** e **Definição**. Estão agrupadas por persona e prioridade.

### 👨‍💼 PROPRIETÁRIO (João Vitor) - 7 User Stories

---

#### **US001: Cadastro de Produtos**

**Como** proprietário de confeitaria  
**Quero** cadastrar produtos com nome, descrição, preço, categoria, imagem e receita  
**Para** organizar meu catálogo e calcular custos automaticamente

**Critérios de Aceitação:**
- ✅ Deve permitir cadastro com nome, descrição, preço, categoria
- ✅ Deve fazer upload de imagem (JPEG, PNG)
- ✅ Deve gerar código único automaticamente
- ✅ Deve permitir associar ingredientes e quantidades (receita)
- ✅ Deve validar campos obrigatórios e preços positivos

**Prioridade:** ⭐⭐⭐⭐⭐ Crítica  
**Complexidade:** ⭐⭐⭐ Média  
**RFs Relacionados:** RF001, RF002, RF003, RF004, RF005  

---

#### **US002: Registro de Vendas**

**Como** proprietário  
**Quero** registrar vendas com produtos, quantidades, data e pagamento  
**Para** ter controle financeiro e atualizar estoque automaticamente

**Critérios de Aceitação:**
- ✅ Deve registrar data, hora, produtos vendidos e valor total
- ✅ Deve baixar estoque automaticamente (ingredientes + produtos)
- ✅ Deve calcular valor total automaticamente
- ✅ Deve permitir escolher forma de pagamento (PIX, Dinheiro, Cartão)
- ✅ Deve calcular troco se pagamento em dinheiro

**Prioridade:** ⭐⭐⭐⭐⭐ Crítica  
**Complexidade:** ⭐⭐⭐⭐ Alta  
**RFs Relacionados:** RF006, RF007, RF008, RF009, RF010  

---

#### **US003: Controle de Estoque**

**Como** proprietário  
**Quero** controlar estoque de ingredientes com alertas de mínimo  
**Para** evitar falta de matéria-prima e reduzir desperdício

**Critérios de Aceitação:**
- ✅ Deve mostrar quantidade atual de cada ingrediente
- ✅ Deve alertar quando ingrediente atingir estoque mínimo
- ✅ Deve gerar lista de compras automática
- ✅ Deve registrar entradas e saídas com histórico
- ✅ Deve permitir ajuste manual de estoque

**Prioridade:** ⭐⭐⭐⭐⭐ Crítica  
**Complexidade:** ⭐⭐⭐ Média  
**RFs Relacionados:** RF011, RF012, RF013, RF014, RF015  

---

#### **US004: Cálculo de Custos**

**Como** proprietário  
**Quero** calcular custo de produção baseado nos ingredientes  
**Para** saber meu lucro real e precificar corretamente

**Critérios de Aceitação:**
- ✅ Deve calcular custo automaticamente baseado na receita
- ✅ Deve sugerir preço de venda com margem configurável
- ✅ Deve considerar custos indiretos (energia, embalagem)
- ✅ Deve mostrar comparativo custo × preço × margem
- ✅ Deve permitir simular diferentes cenários de preço

**Prioridade:** ⭐⭐⭐⭐⭐ Crítica  
**Complexidade:** ⭐⭐⭐⭐ Alta  
**RFs Relacionados:** RF016, RF017, RF018, RF019, RF020  

---

#### **US005: Dashboard de Vendas**

**Como** proprietário  
**Quero** visualizar total de vendas, ticket médio e produtos mais vendidos  
**Para** tomar decisões baseadas em dados reais

**Critérios de Aceitação:**
- ✅ Deve mostrar total de vendas do dia e do mês
- ✅ Deve listar produtos mais vendidos (ranking)
- ✅ Deve exibir gráficos de vendas por período
- ✅ Deve calcular ticket médio automaticamente
- ✅ Deve permitir filtrar por data (hoje, semana, mês, personalizado)

**Prioridade:** ⭐⭐⭐⭐ Alta  
**Complexidade:** ⭐⭐⭐⭐ Alta  
**RFs Relacionados:** RF021, RF022, RF023, RF024, RF025  

---

#### **US006: Integração WhatsApp**

**Como** proprietário  
**Quero** integrar sistema com WhatsApp para automação de atendimento  
**Para** reduzir tempo respondendo perguntas repetitivas

**Critérios de Aceitação:**
- ✅ Deve integrar com WhatsApp Business API (Evolution API)
- ✅ Deve receber e processar pedidos via WhatsApp
- ✅ Deve enviar confirmação automática ao cliente
- ✅ Deve sincronizar mensagens com banco de dados
- ✅ Deve identificar clientes automaticamente pelo telefone

**Prioridade:** ⭐⭐⭐⭐ Alta  
**Complexidade:** ⭐⭐⭐⭐⭐ Muito Alta  
**RFs Relacionados:** RF026, RF027, RF028, RF029, RF030  

---

#### **US007: Relatórios Financeiros**

**Como** proprietário  
**Quero** gerar relatórios de vendas, lucro e rentabilidade  
**Para** apresentar ao contador e analisar performance do negócio

**Critérios de Aceitação:**
- ✅ Deve gerar relatório de vendas por período (data inicial/final)
- ✅ Deve calcular lucro bruto e líquido
- ✅ Deve listar produtos mais rentáveis
- ✅ Deve permitir exportar em PDF e Excel
- ✅ Deve permitir comparar períodos diferentes

**Prioridade:** ⭐⭐⭐⭐ Alta  
**Complexidade:** ⭐⭐⭐⭐ Alta  
**RFs Relacionados:** RF031, RF032, RF033, RF034, RF035  

---

### 👥 CLIENTES - 6 User Stories

---

#### **US008: Visualização de Cardápio**

**Como** cliente  
**Quero** visualizar catálogo de produtos online  
**Para** conhecer opções sem precisar ligar ou mandar mensagem

**Critérios de Aceitação:**
- ✅ Deve exibir catálogo público (sem login)
- ✅ Deve mostrar foto, nome, descrição e preço de cada produto
- ✅ Deve permitir filtrar por categoria
- ✅ Deve ser responsivo (funcionar em celular)
- ✅ Não deve exigir login para visualizar

**Prioridade:** ⭐⭐⭐⭐⭐ Crítica  
**Complexidade:** ⭐⭐ Baixa  
**RFs Relacionados:** RF036, RF037, RF038, RF039, RF040  

---

#### **US009: Pedidos via WhatsApp**

**Como** cliente  
**Quero** fazer pedido via WhatsApp com link pré-formatado  
**Para** facilitar comunicação e evitar erros

**Critérios de Aceitação:**
- ✅ Deve gerar link WhatsApp com mensagem pré-formatada
- ✅ Deve estruturar pedido de forma organizada
- ✅ Deve incluir todos os itens selecionados
- ✅ Deve confirmar recebimento automaticamente
- ✅ Deve manter histórico de pedidos por cliente

**Prioridade:** ⭐⭐⭐⭐⭐ Crítica  
**Complexidade:** ⭐⭐⭐ Média  
**RFs Relacionados:** RF041, RF042, RF043, RF044, RF045  

---

#### **US010: Confirmação de Pedido**

**Como** cliente  
**Quero** receber confirmação automática via WhatsApp  
**Para** ter certeza que meu pedido foi recebido

**Critérios de Aceitação:**
- ✅ Deve enviar WhatsApp automaticamente ao finalizar pedido
- ✅ Deve incluir código do pedido, total e data/hora de retirada
- ✅ Deve permitir salvar confirmação no celular
- ✅ Deve notificar quando status mudar (em produção, pronto)
- ✅ Deve permitir reenvio de confirmação

**Prioridade:** ⭐⭐⭐⭐ Alta  
**Complexidade:** ⭐⭐⭐ Média  
**RFs Relacionados:** RF046, RF047, RF048, RF049, RF050  

---

#### **US011: Personalização de Pedido**

**Como** cliente  
**Quero** personalizar produtos (sabor, tamanho, cobertura)  
**Para** receber exatamente o que desejo

**Critérios de Aceitação:**
- ✅ Deve permitir selecionar opções de personalização
- ✅ Deve calcular acréscimos automaticamente
- ✅ Deve permitir adicionar observações especiais
- ✅ Deve mostrar prévia do pedido antes de confirmar
- ✅ Deve salvar preferências do cliente

**Prioridade:** ⭐⭐⭐⭐ Alta  
**Complexidade:** ⭐⭐⭐⭐ Alta  
**RFs Relacionados:** RF051, RF052, RF053, RF054, RF055  

---

#### **US012: Formas de Pagamento**

**Como** cliente  
**Quero** escolher forma de pagamento (PIX, Dinheiro, Cartão)  
**Para** pagar da forma mais conveniente para mim

**Critérios de Aceitação:**
- ✅ Deve oferecer PIX, Dinheiro e Cartão
- ✅ Deve mostrar chave PIX ao selecionar
- ✅ Deve permitir informar "troco para quanto?" se dinheiro
- ✅ Deve calcular desconto se PIX (configurável)
- ✅ Deve registrar forma de pagamento escolhida

**Prioridade:** ⭐⭐⭐⭐⭐ Crítica  
**Complexidade:** ⭐⭐ Baixa  
**RFs Relacionados:** RF056, RF057, RF058, RF059, RF060  

---

#### **US013: Atualizações de Status**

**Como** cliente  
**Quero** consultar status do meu pedido  
**Para** saber quando estará pronto

**Critérios de Aceitação:**
- ✅ Deve mostrar status atual (Pendente, Em Produção, Pronto, Finalizado)
- ✅ Deve permitir consulta por código do pedido
- ✅ Deve enviar notificação quando status mudar
- ✅ Deve mostrar tempo estimado de preparo
- ✅ Deve permitir consulta via WhatsApp (bot)

**Prioridade:** ⭐⭐⭐⭐ Alta  
**Complexidade:** ⭐⭐⭐ Média  
**RFs Relacionados:** RF061, RF062, RF063, RF064, RF065  

---

### 📊 Resumo de User Stories

| Persona | Quantidade | Prioridade Crítica | Prioridade Alta | RFs Total |
|---------|------------|-------------------|----------------|-----------|
| **Proprietário** | 7 | 4 | 3 | 35 |
| **Cliente** | 6 | 3 | 3 | 30 |
| **TOTAL** | **13** | **7** | **6** | **65** |

---

## 4.2. Especificação do Sistema (Requisitos Funcionais e Não Funcionais)

### 📋 Requisitos Funcionais (RF)

**Total: 65 Requisitos Funcionais 100% Implementados** ✅

Os requisitos estão documentados no arquivo `docs/ANALISE_REQUISITOS_FUNCIONAIS.md`. Abaixo, um resumo por categoria:

#### Categoria 1: Gestão de Produtos (RF001-RF005)
- ✅ RF001: Cadastro de produtos
- ✅ RF002: Associar receitas (BOM)
- ✅ RF003: Código único automático
- ✅ RF004: Upload de imagens
- ✅ RF005: Validações

#### Categoria 2: Vendas e Pedidos (RF006-RF010)
- ✅ RF006: Registro de vendas
- ✅ RF007: Baixa automática de estoque
- ✅ RF008: Cálculo de totais
- ✅ RF009: Formas de pagamento
- ✅ RF010: Cálculo de troco

#### Categoria 3: Controle de Estoque (RF011-RF015)
- ✅ RF011: Visualização de estoque
- ✅ RF012: Alertas de mínimo
- ✅ RF013: Lista de compras
- ✅ RF014: Movimentações
- ✅ RF015: Ajuste manual

#### Categoria 4: Custos e Financeiro (RF016-RF020)
- ✅ RF016: Cálculo de custos
- ✅ RF017: Sugestão de preços
- ✅ RF018: Custos indiretos
- ✅ RF019: Comparativos
- ✅ RF020: Simulador

#### Categoria 5: Business Intelligence (RF021-RF025)
- ✅ RF021: Dashboard de vendas
- ✅ RF022: Produtos mais vendidos
- ✅ RF023: Gráficos
- ✅ RF024: Ticket médio
- ✅ RF025: Filtros de data

#### Categoria 6: WhatsApp Integração (RF026-RF030)
- ✅ RF026: Integração Evolution API
- ✅ RF027: Receber pedidos
- ✅ RF028: Confirmações automáticas
- ✅ RF029: Sincronização
- ✅ RF030: Identificação de clientes

#### Categoria 7: Relatórios (RF031-RF035)
- ✅ RF031: Relatórios de vendas
- ✅ RF032: Cálculo de lucro
- ✅ RF033: Produtos rentáveis
- ✅ RF034: Exportação PDF/Excel
- ✅ RF035: Comparação de períodos

#### Categoria 8: E-commerce Cliente (RF036-RF040)
- ✅ RF036: Catálogo público
- ✅ RF037: Exibição de produtos
- ✅ RF038: Filtros por categoria
- ✅ RF039: Responsividade
- ✅ RF040: Acesso sem login

#### Categoria 9: Pedidos WhatsApp (RF041-RF045)
- ✅ RF041: Link WhatsApp
- ✅ RF042: Mensagens formatadas
- ✅ RF043: Itens incluídos
- ✅ RF044: Confirmação de recebimento
- ✅ RF045: Histórico

#### Categoria 10: Confirmações (RF046-RF050)
- ✅ RF046: Notificação automática
- ✅ RF047: Código de pedido
- ✅ RF048: Salvar confirmação
- ✅ RF049: Reenvio de confirmação
- ✅ RF050: Mudança de status

#### Categoria 11: Personalização (RF051-RF055)
- ✅ RF051: Opções configuráveis
- ✅ RF052: Cálculo de acréscimos
- ✅ RF053: Validação de obrigatórios
- ✅ RF054: Prévia do pedido
- ✅ RF055: Preferências salvas

#### Categoria 12: Pagamento (RF056-RF060)
- ✅ RF056: Múltiplas formas
- ✅ RF057: Chave PIX
- ✅ RF058: Desconto PIX
- ✅ RF059: Troco
- ✅ RF060: Registro de pagamento

#### Categoria 13: Status e Acessibilidade (RF061-RF065)
- ✅ RF061: Consulta de status
- ✅ RF062: Notificações de mudança
- ✅ RF063: Tempo estimado
- ✅ RF064: Assistente Virtual (IA)
- ✅ RF065: Consulta via WhatsApp Bot

---

### 🔒 Requisitos Não Funcionais (RNF)

#### RNF001: Segurança da Informação

**Descrição:** O sistema deve garantir proteção de dados pessoais conforme LGPD.

**Implementação:**
- ✅ Autenticação JWT (JSON Web Tokens)
- ✅ Senhas criptografadas com bcrypt (salt rounds = 10)
- ✅ HTTPS obrigatório em produção
- ✅ Proteção contra SQL Injection (prepared statements)
- ✅ Proteção contra XSS (sanitização de inputs)
- ✅ CORS configurado (apenas origens autorizadas)
- ✅ Rate limiting para prevenir ataques DDoS

**Arquivos:**
- `backend/src/middleware/authMiddleware.js`
- `backend/src/services/authService.js`

---

#### RNF002: Performance

**Descrição:** O sistema deve responder em tempo aceitável para boa experiência do usuário.

**Requisitos:**
- ✅ Carregamento de página < 2 segundos
- ✅ Resposta de API < 500ms (95% das requisições)
- ✅ Busca de produtos < 300ms
- ✅ Assistente Virtual < 200ms

**Implementação:**
- ✅ Lazy loading de imagens (React)
- ✅ Code splitting (React.lazy)
- ✅ Compressão Gzip no servidor
- ✅ Índices otimizados no MySQL
- ✅ Cache de consultas frequentes
- ✅ CDN para assets estáticos

---

#### RNF003: Acessibilidade Digital (WCAG 2.2 AAA)

**Descrição:** O sistema deve ser 100% acessível para pessoas com deficiência.

**Conformidade:**
- ✅ **Perceptível:**
  - Textos alternativos em todas as imagens
  - Contraste mínimo 7:1 (AAA)
  - Legendas e transcrições
  - Conteúdo adaptável

- ✅ **Operável:**
  - Navegação 100% por teclado
  - Tempo ajustável
  - Sem gatilhos de convulsão
  - Skip links implementados

- ✅ **Compreensível:**
  - Linguagem clara e simples
  - Previsibilidade de interface
  - Ajuda contextual

- ✅ **Robusto:**
  - Compatível com leitores de tela (NVDA, JAWS)
  - HTML semântico
  - ARIA labels corretos
  - VLibras integrado

**Arquivos:**
- `frontend/src/styles/wcag-accessibility.css`
- `frontend/src/components/accessibilityMenu/`
- `frontend/src/components/VLibrasWrapper/`

**Documentação:** `docs/CHECKLIST_FINAL_WCAG.md`

---

#### RNF004: Usabilidade

**Descrição:** Interface intuitiva, fácil de aprender e usar.

**Requisitos:**
- ✅ Usuário consegue fazer pedido em < 3 cliques
- ✅ Mensagens de erro claras e orientativas
- ✅ Feedback visual para todas as ações
- ✅ Design consistente em todas as páginas
- ✅ Help/Dicas contextuais

**Implementação:**
- Toasts para feedback (react-toastify)
- Loading spinners durante processamento
- Validação em tempo real nos formulários
- Tooltips explicativos
- Tutorial inicial (primeira vez)

---

#### RNF005: Compatibilidade

**Descrição:** Sistema deve funcionar em múltiplos dispositivos e navegadores.

**Suporte:**
- ✅ **Navegadores:**
  - Chrome 90+ ✅
  - Firefox 88+ ✅
  - Safari 14+ ✅
  - Edge 90+ ✅
  - Opera 76+ ✅

- ✅ **Dispositivos:**
  - Desktop (1920×1080 até 1024×768) ✅
  - Tablet (768×1024, 820×1180) ✅
  - Mobile (375×667, 390×844, 414×896) ✅

- ✅ **Sistemas Operacionais:**
  - Windows 10/11 ✅
  - macOS 11+ ✅
  - Linux (Ubuntu, Fedora) ✅
  - Android 9+ ✅
  - iOS 13+ ✅

---

#### RNF006: Manutenibilidade

**Descrição:** Código organizado, documentado e fácil de manter.

**Implementação:**
- ✅ Arquitetura MVC (Model-View-Controller)
- ✅ Código modular e reutilizável
- ✅ Comentários em funções complexas
- ✅ README com instruções de instalação
- ✅ Documentação técnica completa
- ✅ Versionamento semântico (SemVer)

**Padrões:**
- ES6+ (JavaScript moderno)
- Async/Await para assincronismo
- Try-Catch para tratamento de erros
- Nomes descritivos de variáveis/funções

---

#### RNF007: Escalabilidade

**Descrição:** Sistema deve suportar crescimento de usuários e dados.

**Capacidade:**
- ✅ Suporta até 10.000 produtos cadastrados
- ✅ Suporta até 100.000 pedidos/ano
- ✅ Suporta até 1.000 clientes ativos
- ✅ Suporta até 50 requisições simultâneas

**Estratégias:**
- Banco de dados otimizado com índices
- Connection pool no MySQL
- Possibilidade de escalonamento horizontal (múltiplos servidores)
- Arquitetura stateless (facilita load balancing)

---

#### RNF008: Disponibilidade

**Descrição:** Sistema deve estar disponível na maior parte do tempo.

**Meta:** 99,5% de uptime (aproximadamente 3,6 horas de downtime/mês)

**Implementação:**
- Health check endpoints
- Logging de erros (Winston)
- Backup automático do banco (diário)
- Monitoramento de recursos (CPU, RAM, Disco)

---

#### RNF009: Portabilidade

**Descrição:** Sistema deve ser facilmente implantável em diferentes ambientes.

**Suporte:**
- ✅ Docker containers (Dockerfile incluído)
- ✅ Deploy em Azure App Service
- ✅ Deploy em AWS EC2/Elastic Beanstalk
- ✅ Deploy em VPS (DigitalOcean, Linode)
- ✅ Self-hosting (servidor próprio)

**Configuração:**
- Variáveis de ambiente (.env)
- Scripts de inicialização automatizados
- Documentação de deploy completa

---

#### RNF010: Conformidade Legal (LGPD)

**Descrição:** Sistema deve estar em conformidade com Lei Geral de Proteção de Dados.

**Implementação:**
- ✅ Termos de Uso aceitos obrigatoriamente
- ✅ Política de Privacidade clara e acessível
- ✅ Consentimento explícito para dados sensíveis
- ✅ Direito de acesso aos dados (exportação)
- ✅ Direito de exclusão (LGPD Art. 18)
- ✅ Criptografia de dados sensíveis
- ✅ Logs de acesso e modificações

**Documentação:**
- `docs/POLITICA_PRIVACIDADE.md`
- `docs/TERMOS_DE_USO.md`
- Páginas implementadas: `/politica-privacidade`, `/termos-uso`

---

### 📊 Resumo de Requisitos

| Tipo | Quantidade | Status |
|------|------------|--------|
| **Requisitos Funcionais** | 65 | ✅ 100% |
| **Requisitos Não Funcionais** | 10 | ✅ 100% |
| **TOTAL** | **75** | **✅ 100%** |

---

**Próxima Subseção:** 4.3. Tecnologias Utilizadas (Arquitetura, Banco de Dados, Frontend, Backend)
