# 🧪 Guia de Teste - RF052 + RF053: Personalização de Produtos

## 📋 Índice
1. [Pré-requisitos](#pré-requisitos)
2. [Executar Migração](#executar-migração)
3. [Endpoints da API](#endpoints-da-api)
4. [Testes via Postman](#testes-via-postman)
5. [Fluxo Completo](#fluxo-completo)

---

## 🎯 Pré-requisitos

### 1. Banco de Dados Atualizado
```bash
cd backend
node executar-migracao-personalizacao.js
```

### 2. Backend Rodando
```bash
npm start
```

### 3. Postman ou Similar
- URL Base: `http://localhost:5000`

---

## 🗄️ Executar Migração

O script `executar-migracao-personalizacao.js` cria:

| Tipo | Nome | Descrição |
|------|------|-----------|
| **Tabela** | `produto_opcoes_personalizacao` | Opções de personalização (Recheio, Cobertura, etc) |
| **Tabela** | `opcao_valores` | Valores das opções (Morango, Chocolate, etc) |
| **Tabela** | `produto_opcao_associacao` | Associação produto ↔ opção |
| **Tabela** | `pedido_personalizacoes` | Personalizações escolhidas pelo cliente |
| **Procedure** | `sp_buscar_opcoes_produto` | Busca opções disponíveis para produto |
| **Procedure** | `sp_calcular_acrescimo_personalizacao` | Calcula valor adicional |
| **Procedure** | `sp_salvar_personalizacao_pedido` | Salva personalizações |
| **View** | `vw_opcoes_personalizacao_completas` | Visão completa de opções |
| **View** | `vw_relatorio_personalizacoes` | Relatório de personalizações |
| **Trigger** | `trg_atualizar_valor_com_personalizacao` | Atualiza valor do pedido |

### Dados de Exemplo Inseridos

#### 5 Opções de Personalização:
1. **Recheio** (Seleção única - obrigatória)
2. **Cobertura** (Seleção única - obrigatória)
3. **Decoração** (Seleção única - opcional)
4. **Tamanho** (Seleção única - obrigatória)
5. **Extras** (Múltipla seleção - opcional)

#### 20+ Valores com Preços:
- Morango (R$ 5,00)
- Chocolate (R$ 4,00)
- Doce de Leite (R$ 6,00)
- Ganache (R$ 8,00)
- Flores comestíveis (R$ 15,00)
- Tamanho P/M/G (R$ 0 a 30)
- Granulado, Castanhas, etc.

---

## 🔗 Endpoints da API

### 📚 Gerenciamento de Opções (RF052)

#### 1. Listar Todas as Opções
```http
GET /personalizacao/opcoes
```

**Resposta 200:**
```json
[
  {
    "idopcao": 1,
    "nome_opcao": "Recheio",
    "descricao": "Escolha o sabor do recheio",
    "tipo_selecao": "radio",
    "obrigatorio": true,
    "ordem_exibicao": 1,
    "ativo": true
  }
]
```

---

#### 2. Listar Opções Completas (com valores)
```http
GET /personalizacao/opcoes/completas
```

**Resposta 200:**
```json
[
  {
    "idopcao": 1,
    "nome_opcao": "Recheio",
    "tipo_selecao": "radio",
    "obrigatorio": true,
    "valores": [
      {
        "idvalor": 1,
        "nome_valor": "Morango",
        "preco_adicional": 5.00
      },
      {
        "idvalor": 2,
        "nome_valor": "Chocolate",
        "preco_adicional": 4.00
      }
    ]
  }
]
```

---

#### 3. Buscar Opção por ID
```http
GET /personalizacao/opcoes/:id
```

**Exemplo:** `GET /personalizacao/opcoes/1`

---

#### 4. Criar Nova Opção
```http
POST /personalizacao/opcoes
Content-Type: application/json
```

**Body:**
```json
{
  "nome_opcao": "Formato do Bolo",
  "descricao": "Escolha o formato da base",
  "tipo_selecao": "radio",
  "obrigatorio": true,
  "ordem_exibicao": 6
}
```

**Resposta 201:**
```json
{
  "mensagem": "Opção criada com sucesso!",
  "idopcao": 6
}
```

---

#### 5. Atualizar Opção
```http
PUT /personalizacao/opcoes/:id
Content-Type: application/json
```

**Body:**
```json
{
  "nome_opcao": "Recheio Premium",
  "descricao": "Recheios especiais",
  "obrigatorio": false
}
```

---

#### 6. Deletar Opção (Soft Delete)
```http
DELETE /personalizacao/opcoes/:id
```

**Exemplo:** `DELETE /personalizacao/opcoes/6`

**Resposta 200:**
```json
{
  "mensagem": "Opção deletada com sucesso!"
}
```

---

### 💰 Gerenciamento de Valores (RF053)

#### 7. Adicionar Valor a Opção
```http
POST /personalizacao/opcoes/:id/valores
Content-Type: application/json
```

**Exemplo:** `POST /personalizacao/opcoes/1/valores`

**Body:**
```json
{
  "nome_valor": "Maracujá",
  "preco_adicional": 7.50,
  "ordem_exibicao": 5
}
```

**Resposta 201:**
```json
{
  "mensagem": "Valor adicionado com sucesso!",
  "idvalor": 21
}
```

---

#### 8. Atualizar Valor
```http
PUT /personalizacao/valores/:id
Content-Type: application/json
```

**Body:**
```json
{
  "nome_valor": "Maracujá com Chantilly",
  "preco_adicional": 9.00
}
```

---

#### 9. Deletar Valor
```http
DELETE /personalizacao/valores/:id
```

---

### 🔗 Associação Produto-Opção

#### 10. Buscar Opções de um Produto
```http
GET /personalizacao/produtos/:id/opcoes
```

**Exemplo:** `GET /personalizacao/produtos/1/opcoes`

**Resposta 200:**
```json
[
  {
    "idopcao": 1,
    "nome_opcao": "Recheio",
    "tipo_selecao": "radio",
    "obrigatorio": true,
    "valores": [...]
  }
]
```

**Uso:** Cliente visualiza opções disponíveis no catálogo.

---

#### 11. Associar Opção a Produto
```http
POST /personalizacao/produtos/:id/opcoes
Content-Type: application/json
```

**Exemplo:** `POST /personalizacao/produtos/1/opcoes`

**Body:**
```json
{
  "idopcao": 1,
  "obrigatorio": true
}
```

**Resposta 201:**
```json
{
  "mensagem": "Opção associada ao produto com sucesso!"
}
```

---

#### 12. Remover Associação
```http
DELETE /personalizacao/produtos/:idproduto/opcoes/:idopcao
```

**Exemplo:** `DELETE /personalizacao/produtos/1/opcoes/5`

---

#### 13. Listar Produtos com Opções
```http
GET /personalizacao/produtos-com-opcoes
```

**Resposta 200:**
```json
[
  {
    "idproduto": 1,
    "nome_produto": "Bolo de Chocolate",
    "total_opcoes": 4
  }
]
```

---

### 🛒 Personalização de Pedidos

#### 14. Calcular Acréscimo (RF053)
```http
POST /personalizacao/calcular-acrescimo
Content-Type: application/json
```

**Body:**
```json
{
  "personalizacoes": [
    { "idopcao": 1, "idvalor": 1 },
    { "idopcao": 2, "idvalor": 6 },
    { "idopcao": 5, "idvalor": 18 },
    { "idopcao": 5, "idvalor": 19 }
  ]
}
```

**Resposta 200:**
```json
{
  "valor_acrescimo": 22.50,
  "formatado": "R$ 22.50"
}
```

**Uso:** Cálculo em tempo real no carrinho.

---

#### 15. Salvar Personalização do Pedido
```http
POST /personalizacao/pedidos/:id/salvar
Content-Type: application/json
```

**Exemplo:** `POST /personalizacao/pedidos/10/salvar`

**Body:**
```json
{
  "idproduto": 1,
  "personalizacoes": [
    { "idopcao": 1, "idvalor": 1 },
    { "idopcao": 2, "idvalor": 6 }
  ]
}
```

**Resposta 201:**
```json
{
  "mensagem": "Personalizações salvas com sucesso!",
  "valor_acrescimo": 13.00
}
```

**Efeito:** Trigger atualiza automaticamente `valor_total` da reserva.

---

#### 16. Buscar Personalizações de um Pedido
```http
GET /personalizacao/pedidos/:id
```

**Exemplo:** `GET /personalizacao/pedidos/10`

**Resposta 200:**
```json
[
  {
    "idpersonalizacao": 1,
    "idreserva_fk": 10,
    "idproduto_fk": 1,
    "personalizacoes_json": "[{\"idopcao\":1,\"idvalor\":1}]",
    "valor_acrescimo": 13.00
  }
]
```

---

#### 17. Validar Personalizações Obrigatórias
```http
POST /personalizacao/validar-obrigatorias
Content-Type: application/json
```

**Body:**
```json
{
  "idproduto": 1,
  "personalizacoes": [
    { "idopcao": 1, "idvalor": 1 },
    { "idopcao": 2, "idvalor": 6 }
  ]
}
```

**Resposta 200 (OK):**
```json
{
  "valido": true,
  "mensagem": "Todas as personalizações obrigatórias foram selecionadas"
}
```

**Resposta 400 (Erro):**
```json
{
  "valido": false,
  "mensagem": "Personalizações obrigatórias faltando: Tamanho",
  "opcoes_faltantes": ["Tamanho"]
}
```

---

### 📊 Relatórios

#### 18. Relatório de Personalizações
```http
GET /personalizacao/relatorio?data_inicio=2024-01-01&data_fim=2024-12-31
```

**Query Params:**
- `data_inicio` (opcional): Data inicial
- `data_fim` (opcional): Data final
- `idproduto` (opcional): Filtrar por produto
- `limit` (opcional): Limitar resultados

**Resposta 200:**
```json
[
  {
    "idreserva": 10,
    "nome_cliente": "João Silva",
    "nome_produto": "Bolo de Chocolate",
    "data_pedido": "2024-01-15",
    "personalizacoes": "Recheio: Morango, Cobertura: Ganache",
    "valor_acrescimo": 13.00
  }
]
```

---

## 🧪 Testes via Postman

### 📦 Collection Sugerida

#### **Folder 1: Admin - Gerenciar Opções**
1. ✅ Listar opções
2. ✅ Criar opção "Formato do Bolo"
3. ✅ Buscar opção por ID
4. ✅ Atualizar opção
5. ✅ Deletar opção

#### **Folder 2: Admin - Gerenciar Valores**
6. ✅ Adicionar valor "Maracujá" (R$ 7,50)
7. ✅ Atualizar valor
8. ✅ Deletar valor

#### **Folder 3: Admin - Associar ao Produto**
9. ✅ Associar "Recheio" ao produto 1
10. ✅ Associar "Cobertura" ao produto 1
11. ✅ Listar produtos com opções
12. ✅ Remover associação

#### **Folder 4: Cliente - Personalização**
13. ✅ Buscar opções do produto 1
14. ✅ Validar personalizações obrigatórias (sucesso)
15. ✅ Validar personalizações obrigatórias (erro - faltando)
16. ✅ Calcular acréscimo (R$ 22,50)
17. ✅ Salvar personalização no pedido
18. ✅ Buscar personalizações do pedido

#### **Folder 5: Relatórios**
19. ✅ Relatório geral
20. ✅ Relatório filtrado por data
21. ✅ Relatório filtrado por produto

---

## 🎯 Fluxo Completo de Teste

### **Cenário 1: Admin Cria Opção de Personalização**

**Passo 1:** Criar opção "Formato"
```bash
POST /personalizacao/opcoes
{
  "nome_opcao": "Formato do Bolo",
  "tipo_selecao": "radio",
  "obrigatorio": true
}
# Resposta: idopcao = 6
```

**Passo 2:** Adicionar valores
```bash
POST /personalizacao/opcoes/6/valores
{ "nome_valor": "Redondo", "preco_adicional": 0 }

POST /personalizacao/opcoes/6/valores
{ "nome_valor": "Quadrado", "preco_adicional": 5 }

POST /personalizacao/opcoes/6/valores
{ "nome_valor": "Coração", "preco_adicional": 10 }
```

**Passo 3:** Associar ao produto
```bash
POST /personalizacao/produtos/1/opcoes
{ "idopcao": 6, "obrigatorio": true }
```

---

### **Cenário 2: Cliente Personaliza Pedido**

**Passo 1:** Buscar opções disponíveis
```bash
GET /personalizacao/produtos/1/opcoes
# Retorna: Recheio, Cobertura, Decoração, Tamanho, Extras, Formato
```

**Passo 2:** Selecionar personalizações
```json
{
  "personalizacoes": [
    { "idopcao": 1, "idvalor": 1 },   // Recheio: Morango (R$ 5)
    { "idopcao": 2, "idvalor": 6 },   // Cobertura: Ganache (R$ 8)
    { "idopcao": 4, "idvalor": 12 },  // Tamanho: Médio (R$ 15)
    { "idopcao": 6, "idvalor": 23 }   // Formato: Coração (R$ 10)
  ]
}
```

**Passo 3:** Validar obrigatórias
```bash
POST /personalizacao/validar-obrigatorias
{
  "idproduto": 1,
  "personalizacoes": [...]
}
# Retorna: { "valido": true }
```

**Passo 4:** Calcular acréscimo
```bash
POST /personalizacao/calcular-acrescimo
{
  "personalizacoes": [...]
}
# Retorna: { "valor_acrescimo": 38.00 }
```

**Passo 5:** Adicionar ao carrinho
- Frontend soma: `produto.preco + valor_acrescimo`
- Exemplo: R$ 50,00 (bolo) + R$ 38,00 = **R$ 88,00**

**Passo 6:** Finalizar pedido
```bash
POST /personalizacao/pedidos/15/salvar
{
  "idproduto": 1,
  "personalizacoes": [...]
}
# Trigger atualiza valor_total da reserva automaticamente
```

---

### **Cenário 3: Verificar Resultados**

**Consultar banco:**
```sql
-- Personalização salva
SELECT * FROM pedido_personalizacoes WHERE idreserva_fk = 15;

-- Valor atualizado
SELECT idreserva, valor_total FROM reserva WHERE idreserva = 15;

-- Relatório
SELECT * FROM vw_relatorio_personalizacoes WHERE idreserva = 15;
```

---

## ✅ Checklist de Validação

### Backend
- [ ] Migração executada sem erros
- [ ] 4 tabelas criadas
- [ ] 3 stored procedures criadas
- [ ] 2 views criadas
- [ ] 1 trigger criado
- [ ] Dados de exemplo inseridos (5 opções, 20+ valores)
- [ ] Backend iniciado sem erros
- [ ] 18 endpoints respondendo

### Testes de API
- [ ] CRUD de opções funcionando
- [ ] CRUD de valores funcionando
- [ ] Associação produto-opção funcionando
- [ ] Cálculo de acréscimo correto
- [ ] Validação de obrigatórias funcionando
- [ ] Salvamento de personalização OK
- [ ] Trigger atualizando valor_total
- [ ] Relatórios retornando dados

### Casos de Erro
- [ ] Criar opção sem nome → erro 400
- [ ] Criar valor com preço negativo → erro 400
- [ ] Validar sem opção obrigatória → erro 400
- [ ] Calcular acréscimo com ID inválido → erro 400

---

## 🚀 Próximos Passos

### 1. Frontend Admin (Gerenciamento)
- Página de gerenciamento de opções
- CRUD completo com interface amigável
- Associar opções aos produtos

### 2. Frontend Cliente (Seleção)
- Componente de personalização no catálogo
- Exibição de opções por tipo (radio, checkbox, select)
- Cálculo em tempo real no carrinho
- Exibição de resumo das personalizações

### 3. Integração Completa
- Modificar fluxo de checkout
- Salvar personalizações ao finalizar pedido
- Exibir personalizações no painel de pedidos
- Incluir personalizações na confirmação WhatsApp

---

## 📞 Suporte

Documentação completa: `IMPLEMENTACAO_RF052_RF053_COMPLETA.md`

**Status Atual:** ✅ Backend 100% completo (Database + Repository + Service + Controller + Rotas)
**Próximo:** 🔄 Frontend (Admin + Cliente)

---

**Versão:** 1.0  
**Data:** Janeiro 2025  
**RFs Implementados:** RF052 (Opções de Personalização) + RF053 (Acréscimos de Preço)
