# 🍰 DoceGest MVP - Planejamento de Implementação

## Sistema Integrado de Gestão para Microempreendedores Alimentícios

---

## 📋 Escopo do MVP

### Módulos Implementados:
1. ✅ **Gestão de Estoque Básico** (Parcialmente implementado)
2. ✅ **Sistema de Registro de Vendas Digital** (Implementado como Reservas)
3. ✅ **Catálogo Digital de Produtos** (Implementado)
4. 🔄 **Integração com WhatsApp Business** (A implementar)
5. 🔄 **Cálculo Automático de Custos Básico** (A implementar)
6. ✅ **Dashboard Financeiro Simplificado** (Parcialmente implementado)
7. ✅ **Sistema de Pedidos Online Básico** (Implementado)

---

## 🎯 Mapeamento de User Stories para Funcionalidades Existentes

### PROPRIETÁRIO (João Vitor)

#### ✅ User Story 1: Cadastro de Produtos
**Status:** Implementado
- RF001: ✅ Cadastro com nome, descrição, preço, categoria
- RF002: ⚠️ Ingredientes (tabela a ser criada)
- RF003: ✅ ID automático (AUTO_INCREMENT)
- RF004: ✅ Upload de imagem
- RF005: ✅ Validação de preços e campos

**Arquivos:**
- `backend/src/controller/produtoController.js`
- `backend/src/services/produtoService.js`
- `backend/src/repository/produtoRepository.js`

#### ✅ User Story 2: Registro de Vendas
**Status:** Implementado (como Reservas)
- RF006: ✅ Registro com data, hora, produtos, quantidades
- RF007: ✅ Atualização automática de estoque
- RF008: ✅ Cálculo automático do total
- RF009: ✅ Forma de pagamento
- RF010: ⚠️ Cálculo de troco (a implementar)

**Arquivos:**
- `backend/src/controller/reservaController.js`
- `backend/src/services/reservaService.js`

#### ✅ User Story 3: Controle de Estoque
**Status:** Implementado
- RF011: ✅ Nível atual de estoque
- RF012: ⚠️ Alertas de estoque mínimo (a implementar)
- RF013: ⚠️ Lista de compras automática (a implementar)
- RF014: ✅ Registro de entradas/saídas
- RF015: ✅ Ajuste manual

**Arquivos:**
- `backend/src/repository/produtoRepository.js`

#### 🔄 User Story 4: Cálculo de Custos
**Status:** A implementar
- RF016-RF020: Sistema de custos de produção

**Novos Arquivos Necessários:**
- `backend/src/controller/custoController.js`
- `backend/src/services/custoService.js`
- `backend/src/repository/custoRepository.js`

#### ✅ User Story 5: Dashboard
**Status:** Parcialmente implementado
- RF021-RF025: Dashboard financeiro básico

**Arquivos:**
- `backend/src/controller/relatorioController.js`

#### 🔄 User Story 6: Integração WhatsApp
**Status:** A implementar
- RF026-RF030: Integração com WhatsApp Business API

**Novos Arquivos Necessários:**
- `backend/src/controller/whatsappController.js`
- `backend/src/services/whatsappService.js`

#### ✅ User Story 7: Relatórios Financeiros
**Status:** Implementado
- RF031-RF035: Relatórios de vendas e lucro

**Arquivos:**
- `backend/src/controller/relatorioController.js`
- `backend/src/repository/relatorioRepository.js`

### CLIENTES

#### ✅ User Story 8: Visualizar Cardápio
**Status:** Implementado
- RF036-RF040: Catálogo público de produtos

**Arquivos:**
- `frontend/src/pages/home/`
- `frontend/src/components/produtos/`

#### 🔄 User Story 9-13: Pedidos via WhatsApp
**Status:** A implementar
- RF041-RF065: Sistema de pedidos via WhatsApp

---

## 🔨 Implementações Necessárias

### 1. Sistema de Ingredientes e Custos

#### Banco de Dados:
```sql
-- Tabela de ingredientes
CREATE TABLE ingrediente (
  idingrediente INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  unidade_medida VARCHAR(20) NOT NULL, -- kg, g, L, ml, unidade
  preco_unitario DECIMAL(10,2) NOT NULL,
  quantidade_estoque DECIMAL(10,2) NOT NULL,
  estoque_minimo DECIMAL(10,2) DEFAULT 0,
  data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
  data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de receitas (ingredientes por produto)
CREATE TABLE receita (
  idreceita INT AUTO_INCREMENT PRIMARY KEY,
  idproduto INT NOT NULL,
  idingrediente INT NOT NULL,
  quantidade DECIMAL(10,3) NOT NULL,
  FOREIGN KEY (idproduto) REFERENCES produto(idproduto),
  FOREIGN KEY (idingrediente) REFERENCES ingrediente(idingrediente)
);

-- Tabela de custos indiretos
CREATE TABLE custo_indireto (
  idcusto INT AUTO_INCREMENT PRIMARY KEY,
  tipo VARCHAR(50) NOT NULL, -- luz, agua, gas, embalagem
  valor_mensal DECIMAL(10,2) NOT NULL,
  mes_referencia DATE NOT NULL
);

-- Tabela de categorias
CREATE TABLE categoria (
  idcategoria INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(50) NOT NULL,
  descricao VARCHAR(200)
);

-- Alterar tabela produto para incluir categoria
ALTER TABLE produto ADD COLUMN idcategoria INT;
ALTER TABLE produto ADD FOREIGN KEY (idcategoria) REFERENCES categoria(idcategoria);
```

### 2. Sistema de Alertas de Estoque

```javascript
// backend/src/services/alertaService.js
export async function verificarEstoqueBaixo() {
  // Buscar produtos com quantidade <= estoque_minimo
  // Gerar alertas
  // Enviar notificações
}
```

### 3. Integração com WhatsApp Business

#### Opções de Implementação:
1. **WhatsApp Business API Oficial** (Pago, mais confiável)
2. **Baileys** (Biblioteca Node.js, gratuita)
3. **Evolution API** (API REST, gratuita)

```javascript
// backend/src/services/whatsappService.js
export async function enviarMensagem(numero, mensagem) {
  // Implementar envio de mensagem
}

export async function receberPedido(mensagem) {
  // Processar mensagem recebida
  // Converter em pedido
  // Retornar confirmação
}
```

### 4. Dashboard Aprimorado

```javascript
// Novos endpoints necessários:
- GET /dashboard/vendas-hoje
- GET /dashboard/produtos-mais-vendidos
- GET /dashboard/ticket-medio
- GET /dashboard/grafico-vendas
- GET /dashboard/lucro-periodo
```

### 5. Sistema de Notificações de Status

```javascript
// backend/src/services/notificacaoService.js
export async function notificarStatusPedido(idReserva, novoStatus) {
  // Enviar notificação via WhatsApp
  // Atualizar status do pedido
}

// Estados do pedido:
// - Recebido
// - Em Preparação
// - Pronto
// - Saiu para Entrega
// - Entregue
```

---

## 📊 Priorização de Implementação

### Fase 1 - Crítico (Imediato)
1. ✅ Sistema de produtos (já implementado)
2. ✅ Sistema de vendas/pedidos (já implementado)
3. ✅ Controle de estoque (já implementado)
4. 🔄 Sistema de categorias
5. 🔄 Melhorias no dashboard

### Fase 2 - Importante (Curto Prazo)
1. 🔄 Sistema de ingredientes e receitas
2. 🔄 Cálculo automático de custos
3. 🔄 Alertas de estoque baixo
4. 🔄 Lista de compras automática

### Fase 3 - Desejável (Médio Prazo)
1. 🔄 Integração com WhatsApp Business
2. 🔄 Notificações de status de pedido
3. 🔄 Sistema de delivery
4. 🔄 Relatórios avançados

### Fase 4 - Futuro (Longo Prazo)
1. 🔄 Marketing digital integrado
2. 🔄 Programa de fidelidade
3. 🔄 App mobile
4. 🔄 Integração com redes sociais

---

## 🚀 Próximos Passos

### 1. Atualização do Banco de Dados
- Criar tabelas de ingredientes, receitas, custos e categorias
- Migrar dados existentes
- Adicionar campos necessários

### 2. Implementar Sistema de Custos
- Controller, Service e Repository para custos
- Cálculo automático baseado em receitas
- Interface de gestão de custos

### 3. Melhorar Dashboard
- Adicionar métricas importantes
- Gráficos de vendas
- Análise de rentabilidade

### 4. Preparar Integração WhatsApp
- Pesquisar melhor solução
- Implementar POC (Proof of Concept)
- Integrar com sistema de pedidos

---

## 📝 Notas de Implementação

### Tecnologias Adicionais Necessárias:
- **Chart.js** ou **Recharts** - Gráficos no dashboard
- **Baileys** ou **Evolution API** - WhatsApp
- **Node-cron** - Tarefas agendadas (alertas)
- **Socket.io** - Notificações em tempo real

### Considerações de Segurança:
- Autenticação para área administrativa
- Proteção de dados sensíveis (custos, margem de lucro)
- Validação de entrada em todos os endpoints
- Rate limiting para APIs públicas

### Performance:
- Cache para catálogo de produtos
- Índices no banco de dados
- Paginação de resultados
- Compressão de imagens

---

## ✅ Status Atual do Projeto

### Funcionalidades Implementadas:
- ✅ CRUD completo de produtos
- ✅ Sistema de upload de imagens
- ✅ Cadastro de clientes
- ✅ Sistema de reservas/pedidos
- ✅ Controle básico de estoque
- ✅ Atualização automática de estoque nas vendas
- ✅ Validações robustas
- ✅ Arquitetura em camadas
- ✅ Testes unitários
- ✅ Documentação completa

### Funcionalidades a Implementar:
- 🔄 Sistema de ingredientes e receitas
- 🔄 Cálculo de custos de produção
- 🔄 Categorias de produtos
- 🔄 Alertas de estoque baixo
- 🔄 Lista de compras automática
- 🔄 Integração com WhatsApp
- 🔄 Dashboard aprimorado
- 🔄 Notificações de status
- 🔄 Sistema de troco
- 🔄 Relatórios avançados

---

## 🎯 Meta

Transformar o sistema atual em um **DoceGest completo** que atenda todas as necessidades do microempreendedor alimentício, mantendo a simplicidade e facilidade de uso.

**Versão Atual:** 2.0  
**Versão Meta:** 3.0 (MVP Completo DoceGest)  
**Prazo Estimado:** 3-6 meses para MVP completo
