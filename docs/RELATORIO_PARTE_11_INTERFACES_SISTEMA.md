# RELATÓRIO TÉCNICO - PARTE 11
## 5. INTERFACES DO SISTEMA

---

## 5.1. Interface do Cliente (E-commerce)

### 🏠 Tela 1: Página Inicial (Home)

**Descrição:**
Landing page do sistema com design acolhedor e atrativo que apresenta a confeitaria aos visitantes.

**Elementos Principais:**
- **Header responsivo** com logo, menu de navegação e botão de carrinho
- **Banner hero** com imagem de destaque e chamada para ação ("Conheça nossos produtos")
- **Carrossel de produtos** em destaque/promoção
- **Seções informativas:**
  - Sobre a confeitaria
  - Depoimentos de clientes
  - Diferenciais (qualidade, entrega, personalização)
- **Footer** com redes sociais, contato e links úteis
- **Botão flutuante WhatsApp** fixo no canto direito
- **Widget VLibras** para acessibilidade em LIBRAS
- **Botão do Assistente Virtual** no canto inferior direito

**Características de Acessibilidade:**
- ✅ Contraste de cores conforme WCAG 2.2 AAA
- ✅ Textos alternativos em todas as imagens
- ✅ Navegação por teclado (Tab, Enter, Esc)
- ✅ Landmarks semânticos (header, nav, main, footer)
- ✅ Tamanho mínimo de fonte 16px
- ✅ Áreas clicáveis mínimas de 44x44px

---

### 📚 Tela 2: Catálogo de Produtos

**Descrição:**
Vitrine virtual com todos os produtos disponíveis para compra.

**Elementos Principais:**
- **Barra de busca** com autocomplete
- **Filtros de categoria** (Bolos, Tortas, Docinhos, Salgados, etc.)
- **Grid responsivo** de cards de produtos:
  - Imagem do produto (lazy loading)
  - Nome e descrição breve
  - Preço formatado
  - Botão "Adicionar ao Carrinho"
  - Ícone de favoritos
- **Indicador de disponibilidade** (Em estoque / Esgotado)
- **Paginação** ou scroll infinito
- **Toast de feedback** ao adicionar produtos

**Filtros Disponíveis:**
- Por categoria
- Por faixa de preço
- Por disponibilidade
- Ordem: Mais vendidos, Menor preço, Maior preço, Novidades

**Comportamento:**
1. Cliente busca/filtra produtos
2. Clica em "Adicionar ao Carrinho"
3. Produto vai para localStorage
4. Toast de sucesso: "🎂 Bolo de Chocolate adicionado ao carrinho!"
5. Badge do carrinho atualiza contador

---

### 🛒 Tela 3: Modal do Carrinho

**Descrição:**
Modal lateral que exibe resumo dos produtos selecionados.

**Elementos:**
- **Lista de itens:**
  - Miniatura do produto
  - Nome e preço unitário
  - Controles de quantidade (+/-)
  - Subtotal do item
  - Botão remover (X)
- **Resumo financeiro:**
  - Subtotal de produtos
  - Taxa de entrega (calculada)
  - **Valor total destacado**
- **Botões de ação:**
  - "Continuar Comprando" (fecha modal)
  - "Finalizar Pedido" (vai para Checkout)

**Validações:**
- Quantidade mínima: 1
- Quantidade máxima: estoque disponível
- Alertas de estoque baixo

---

### 💳 Tela 4: Checkout

**Descrição:**
Página de finalização do pedido com formulário completo.

**Seções:**

**4.1. Dados do Cliente**
```
Nome completo: [_________________]
E-mail:        [_________________]
Telefone:      [(___)_____-_____]
CPF (opcional):[___.___.___-__]
```

**4.2. Entrega/Retirada**
```
( ) Entrega em domicílio
    Endereço: [_______________________________]
    Bairro:   [____________] CEP: [_____-___]
    
( ) Retirar na loja
    📍 Rua Exemplo, 123 - Centro
```

**4.3. Data e Horário**
```
Data de entrega/retirada: [__/__/____] 📅
Horário:                   [__:__]     🕐

💡 Prazo mínimo: 24 horas de antecedência
```

**4.4. Forma de Pagamento**
```
( ) PIX (Desconto de 5%)
( ) Dinheiro (Levar troco? [____])
( ) Cartão (Na entrega/retirada)
```

**4.5. Observações Adicionais**
```
Mensagem personalizada, alergia alimentar, etc.
[________________________________]
[________________________________]
```

**4.6. Resumo do Pedido**
```
┌─────────────────────────────────────┐
│ Bolo de Chocolate (1x)    R$ 80,00  │
│ Docinhos Sortidos (50x)   R$ 150,00 │
│ ─────────────────────────────────── │
│ Subtotal                  R$ 230,00 │
│ Taxa de entrega           R$  10,00 │
│ ─────────────────────────────────── │
│ TOTAL                     R$ 240,00 │
└─────────────────────────────────────┘
```

**Botões:**
- ⬅️ Voltar ao Carrinho
- ✅ Confirmar Pedido

**Validações:**
- Campos obrigatórios destacados
- E-mail válido
- Telefone no formato correto
- Data não pode ser anterior a hoje
- Horário dentro do funcionamento

---

### ✅ Tela 5: Confirmação de Pedido

**Descrição:**
Tela de sucesso após finalização do pedido.

**Elementos:**
- ✅ **Ícone de sucesso animado**
- **Mensagem de confirmação:**
  ```
  🎉 Pedido Realizado com Sucesso!
  
  Seu pedido foi confirmado e já está sendo processado.
  ```
- **Detalhes do pedido:**
  ```
  📋 Código do Pedido: PED000123
  💰 Valor Total: R$ 240,00
  📅 Entrega: 25/01/2025 às 15:00
  💳 Pagamento: PIX
  ```
- **Próximos passos:**
  ```
  1️⃣ Em breve você receberá uma confirmação via WhatsApp
  2️⃣ Acompanhe o status do pedido em "Meus Pedidos"
  3️⃣ Caso escolheu PIX, enviaremos a chave de pagamento
  ```
- **Botões:**
  - 📱 Compartilhar pedido
  - 📦 Ver meus pedidos
  - 🏠 Voltar ao início

---

### 📦 Tela 6: Meus Pedidos (Área do Cliente)

**Descrição:**
Histórico de pedidos do cliente logado.

**Elementos:**
- **Header da seção:**
  ```
  Olá, João! 👋
  Aqui estão seus pedidos
  ```
- **Filtros rápidos:**
  ```
  [Todos] [Pendentes] [Finalizados] [Cancelados]
  ```
- **Lista de pedidos:**
  Cada card exibe:
  ```
  ┌─────────────────────────────────────────┐
  │ Pedido #PED000123                       │
  │ Status: 🟢 Pronto para retirada        │
  │ ─────────────────────────────────────── │
  │ Data: 25/01/2025 às 15:00               │
  │ Total: R$ 240,00                        │
  │ ─────────────────────────────────────── │
  │ • Bolo de Chocolate (1x)                │
  │ • Docinhos Sortidos (50x)               │
  │ ─────────────────────────────────────── │
  │ [Ver Detalhes] [Pedir Novamente]       │
  └─────────────────────────────────────────┘
  ```

**Indicadores de Status:**
- 🟡 Pendente
- 🔵 Confirmado
- 🟠 Em Produção
- 🟢 Pronto
- ✅ Finalizado
- ❌ Cancelado

**Funcionalidades:**
- Visualizar detalhes completos
- Rastrear status em tempo real
- Repetir pedido anterior
- Avaliar pedido (5 estrelas)

---

### 🤖 Tela 7: Assistente Virtual

**Descrição:**
Chat flutuante com inteligência artificial para atendimento.

**Interface:**
```
┌──────────────────────────────────────┐
│ 💬 Assistente Virtual              [X]│
├──────────────────────────────────────┤
│                                      │
│  🤖 Olá! Sou o assistente do        │
│     Segredo do Sabor.               │
│     Como posso ajudar?              │
│                                  10:25│
│                                      │
│  👤 Qual o horário de funcionamento? │
│                              Você 10:26│
│                                      │
│  🤖 Funcionamos:                     │
│     Segunda a Sexta: 08h às 18h     │
│     Sábado: 08h às 14h              │
│     Domingo: Fechado                │
│                                  10:26│
│                                      │
│     [✅ Útil] [❌ Não útil]         │
│                                      │
├──────────────────────────────────────┤
│ [Digite sua mensagem...]        [▶] │
└──────────────────────────────────────┘
```

**Perguntas Frequentes:**
- Horário de funcionamento
- Como fazer um pedido?
- Formas de pagamento
- Prazo de entrega
- Como consultar meu pedido?
- Produtos disponíveis
- Política de cancelamento

**Recursos:**
- Busca por palavras-chave
- Sugestões de perguntas
- Feedback de utilidade
- Histórico de conversas
- Opção de falar com humano

---

## 5.2. Interface do Administrador (Dashboard)

### 📊 Tela 8: Dashboard Principal (BI)

**Descrição:**
Painel de controle com visão geral do negócio.

**Cards de Estatísticas (KPIs):**
```
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ Vendas Hoje │ │ Vendas Mês  │ │  Pedidos    │
│             │ │             │ │  Pendentes  │
│  R$ 850,00  │ │ R$ 12.450,00│ │     8       │
│   ↑ +15%    │ │   ↑ +23%    │ │   ⚠️        │
└─────────────┘ └─────────────┘ └─────────────┘

┌─────────────┐ ┌─────────────┐
│  Estoque    │ │   Ticket    │
│   Baixo     │ │   Médio     │
│   3 itens   │ │  R$ 127,50  │
│   🚨        │ │   ↑ +8%     │
└─────────────┘ └─────────────┘
```

**Gráficos:**

1. **Gráfico de Linha: Vendas - Últimos 30 Dias**
   - Eixo X: Datas
   - Eixo Y: Valor em R$
   - Permite identificar tendências e sazonalidade

2. **Gráfico de Barras: Vendas por Categoria**
   - Mostra qual categoria vende mais
   - Auxilia decisões de estoque

3. **Gráfico de Pizza: Formas de Pagamento**
   - PIX: 45%
   - Dinheiro: 30%
   - Cartão: 25%

**Tabela: Produtos Mais Vendidos**
```
┌───────────────────┬────────┬───────────┬────────┐
│ Produto           │ Qtd    │ Receita   │ Margem │
├───────────────────┼────────┼───────────┼────────┤
│ Bolo de Chocolate │ 45     │ R$ 3.600  │ 42%    │
│ Docinhos Sortidos │ 120    │ R$ 3.600  │ 38%    │
│ Torta de Limão    │ 28     │ R$ 2.520  │ 45%    │
└───────────────────┴────────┴───────────┴────────┘
```

**Alertas:**
- 🚨 3 ingredientes com estoque baixo
- ⚠️ 8 pedidos aguardando confirmação
- ℹ️ 2 novos clientes cadastrados hoje

---

### 🎂 Tela 9: Gerenciamento de Produtos

**Descrição:**
CRUD completo de produtos com interface amigável.

**Listagem:**
```
[+ Adicionar Produto]  [🔍 Buscar...]  [Filtro ▼]

┌────────────────────────────────────────────────┐
│ [Imagem] Bolo de Chocolate                     │
│          Delicioso bolo com cobertura...       │
│          R$ 80,00 | Estoque: 15 un | Ativo    │
│          Categoria: Bolos                      │
│          [✏️ Editar] [👁️ Ver] [🗑️ Excluir]  │
└────────────────────────────────────────────────┘
```

**Formulário de Adição/Edição:**
```
┌─────────────────────────────────────┐
│ Adicionar Novo Produto              │
├─────────────────────────────────────┤
│ Nome do Produto:                    │
│ [_____________________________]     │
│                                     │
│ Descrição:                          │
│ [_____________________________]     │
│ [_____________________________]     │
│                                     │
│ Categoria: [Bolos ▼]                │
│                                     │
│ Preço de Venda: R$ [______]         │
│ Custo de Produção: R$ [______]      │
│ (Calculado automaticamente)         │
│                                     │
│ Margem de Lucro: [40]%              │
│                                     │
│ Quantidade em Estoque: [___]        │
│ Tempo de Preparo: [30] minutos      │
│                                     │
│ Imagem do Produto:                  │
│ [Escolher arquivo] produto.jpg      │
│ 📸 [Prévia da imagem]               │
│                                     │
│ Status: [✓] Ativo                   │
│                                     │
│ [💾 Salvar] [❌ Cancelar]           │
└─────────────────────────────────────┘
```

---

### 🥚 Tela 10: Gerenciamento de Ingredientes

**Descrição:**
Controle de estoque de ingredientes.

**Listagem:**
```
[+ Adicionar Ingrediente]  [⚠️ Estoque Baixo (3)]

┌────────────────────────────────────────┐
│ 🟢 Farinha de Trigo                   │
│     Estoque: 25,5 kg (min: 10 kg)     │
│     Preço: R$ 8,50/kg                 │
│     Fornecedor: Distribuidora XYZ     │
│     [✏️ Editar] [➕ Repor]            │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│ 🔴 Chocolate em Pó                    │
│     Estoque: 2,3 kg (min: 5 kg) 🚨    │
│     Preço: R$ 45,00/kg                │
│     Fornecedor: Cacau Premium         │
│     [✏️ Editar] [➕ Repor]            │
└────────────────────────────────────────┘
```

**Indicadores:**
- 🟢 Verde: Estoque OK (acima do mínimo)
- 🟡 Amarelo: Estoque médio (próximo ao mínimo)
- 🔴 Vermelho: Estoque crítico (abaixo do mínimo)

---

### 📝 Tela 11: Receitas (Bill of Materials)

**Descrição:**
Cadastro de receitas (ingredientes necessários para cada produto).

**Interface:**
```
Produto: [Bolo de Chocolate ▼]

┌────────────────────────────────────────┐
│ Ingredientes da Receita                │
├────────────────────────────────────────┤
│ [+ Adicionar Ingrediente]              │
│                                        │
│ • Farinha de Trigo      500g           │
│   Custo: R$ 4,25          [❌ Remover] │
│                                        │
│ • Chocolate em Pó       200g           │
│   Custo: R$ 9,00          [❌ Remover] │
│                                        │
│ • Açúcar                300g           │
│   Custo: R$ 1,50          [❌ Remover] │
│                                        │
│ • Ovos                  4 unidades     │
│   Custo: R$ 3,20          [❌ Remover] │
│                                        │
│ ──────────────────────────────────────│
│ CUSTO TOTAL DE PRODUÇÃO: R$ 18,00      │
│ PREÇO DE VENDA SUGERIDO: R$ 72,00      │
│ (Baseado em margem de 75%)             │
└────────────────────────────────────────┘

[💾 Salvar Receita]
```

**Benefícios:**
- Cálculo automático de custos
- Sugestão de preço de venda
- Controle de margem de lucro
- Alerta quando ingrediente ficar indisponível

---

### 📈 Tela 12: Relatórios

**Descrição:**
Geração de relatórios gerenciais em PDF e Excel.

**Opções de Relatórios:**

1. **Vendas por Período**
   - Data início: [__/__/____]
   - Data fim: [__/__/____]
   - Agrupamento: [Diário ▼]
   - [📄 PDF] [📊 Excel]

2. **Produtos Mais Vendidos**
   - Período: [Últimos 30 dias ▼]
   - Top: [10 ▼] produtos
   - [📄 PDF] [📊 Excel]

3. **Análise de Custos**
   - Mostra margem de lucro por produto
   - Identifica produtos menos lucrativos
   - [📄 PDF] [📊 Excel]

4. **Estoque Atual**
   - Inventário completo de ingredientes
   - [📄 PDF] [📊 Excel]

5. **Clientes Frequentes**
   - Ranking de clientes por valor gasto
   - [📄 PDF] [📊 Excel]

**Exemplo de Relatório Gerado:**
```
═══════════════════════════════════════
    SEGREDO DO SABOR - RELATÓRIO
    Vendas por Período
═══════════════════════════════════════
Período: 01/01/2025 a 31/01/2025

Total de Pedidos: 120
Valor Total: R$ 15.300,00
Ticket Médio: R$ 127,50

Forma de Pagamento:
• PIX: R$ 6.885,00 (45%)
• Dinheiro: R$ 4.590,00 (30%)
• Cartão: R$ 3.825,00 (25%)

Produtos Mais Vendidos:
1. Bolo de Chocolate - 45 un - R$ 3.600,00
2. Docinhos Sortidos - 120 un - R$ 3.600,00
3. Torta de Limão - 28 un - R$ 2.520,00

Gerado em: 25/01/2025 14:30
Por: admin@segredodosabor.com.br
═══════════════════════════════════════
```

---

### 📱 Tela 13: WhatsApp Bot

**Descrição:**
Painel de gerenciamento do bot de WhatsApp.

**Dashboard do Bot:**
```
Status da Conexão: 🟢 Conectado

Estatísticas do Dia:
• Mensagens Recebidas: 45
• Mensagens Enviadas: 62
• Pedidos via WhatsApp: 12
• Taxa de Resposta: 98%

Conversas Recentes:
┌────────────────────────────────────┐
│ (11) 99999-1111 - João Silva       │
│ "Gostaria de fazer um pedido"      │
│ 🕐 há 2 minutos                    │
│ [Ver Conversa]                     │
└────────────────────────────────────┘
```

**Configurações:**
- Mensagens automáticas
- Horários de atendimento automático
- Respostas personalizadas
- Blacklist de números

---

## 5.3. Responsividade

**Breakpoints Implementados:**

| Dispositivo | Largura | Adaptações |
|-------------|---------|------------|
| **Mobile** | < 480px | Menu hamburger, grid 1 coluna, botões empilhados |
| **Tablet** | 480-768px | Menu ajustado, grid 2 colunas |
| **Desktop** | 768-1024px | Menu completo, grid 3 colunas |
| **Wide** | > 1024px | Layout máximo de 1200px centralizado |

**Exemplo Mobile:**
- Menu se transforma em ☰ hamburger
- Cards de produtos ocupam largura total
- Gráficos ajustados para vertical
- Botões com tamanho mínimo 44x44px

---

✅ **Todas as interfaces seguem os princípios de acessibilidade WCAG 2.2 nível AAA, garantindo inclusão digital total.**
