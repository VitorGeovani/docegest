# 🧪 Collection Postman - RF049 e RF055

## Configuração Inicial

**Base URL**: `http://localhost:3000`

**Headers Globais**:
```
Authorization: Bearer {seu_token_jwt}
Content-Type: application/json
```

---

## 📁 RF049: Reenvio de Confirmação

### 1. Reenviar Confirmação de Pedido ✅

**Request**:
```
POST {{baseUrl}}/reserva/1/reenviar-confirmacao
```

**Response Esperado (200)**:
```json
{
  "sucesso": true,
  "mensagem": "Confirmação reenviada com sucesso para +5511999999999"
}
```

**Response Erro - Pedido não encontrado (404)**:
```json
{
  "erro": "Reserva não encontrada"
}
```

**Response Erro - Cliente sem telefone (400)**:
```json
{
  "erro": "Cliente não possui número de telefone cadastrado"
}
```

---

## 📁 RF055: Preferências do Cliente

### 1. Buscar Preferências ✅

**Request**:
```
GET {{baseUrl}}/preferencias/10
```

**Response Esperado (200)**:
```json
{
  "id": 1,
  "idcliente_fk": 10,
  "produtos_favoritos": [15, 23, 42],
  "observacoes_padrao": "Sem açúcar adicional",
  "forma_pagamento_preferida": "PIX",
  "alergias_restricoes": "Alergia a amendoim",
  "data_criacao": "2024-01-15T10:30:00.000Z",
  "data_atualizacao": "2024-01-20T14:25:00.000Z"
}
```

**Response - Nenhuma preferência encontrada (200)**:
```json
null
```

---

### 2. Criar/Atualizar Preferências ✅

**Request**:
```
POST {{baseUrl}}/preferencias/10
```

**Body**:
```json
{
  "produtos_favoritos": [15, 23, 42],
  "observacoes_padrao": "Sem açúcar adicional",
  "forma_pagamento_preferida": "PIX",
  "alergias_restricoes": "Alergia a amendoim"
}
```

**Response Esperado (200)**:
```json
{
  "sucesso": true,
  "mensagem": "Preferências salvas com sucesso"
}
```

---

### 3. Buscar Produtos Favoritos ✅

**Request**:
```
GET {{baseUrl}}/preferencias/10/produtos-favoritos
```

**Response Esperado (200)**:
```json
[
  {
    "idproduto": 15,
    "nome": "Bolo de Chocolate",
    "descricao": "Delicioso bolo de chocolate com cobertura",
    "preco": 45.90,
    "categoria": "Bolos",
    "disponivel": 1
  },
  {
    "idproduto": 23,
    "nome": "Torta de Limão",
    "descricao": "Torta refrescante de limão",
    "preco": 38.50,
    "categoria": "Tortas",
    "disponivel": 1
  }
]
```

---

### 4. Aplicar Preferências a Novo Pedido ✅

**Request**:
```
POST {{baseUrl}}/preferencias/10/aplicar-pedido
```

**Response Esperado (200)**:
```json
{
  "observacoes_padrao": "Sem açúcar adicional",
  "forma_pagamento_preferida": "PIX",
  "produtos_favoritos": [15, 23, 42],
  "alerta_alergias": "Atenção: Cliente possui alergia a amendoim"
}
```

---

### 5. Adicionar Produto aos Favoritos ✅

**Request**:
```
PUT {{baseUrl}}/preferencias/10/adicionar-favorito
```

**Body**:
```json
{
  "idproduto": 55
}
```

**Response Esperado (200)**:
```json
{
  "sucesso": true,
  "mensagem": "Produto adicionado aos favoritos"
}
```

**Response Erro - Produto já é favorito (400)**:
```json
{
  "erro": "Produto já está nos favoritos"
}
```

---

### 6. Remover Produto dos Favoritos ✅

**Request**:
```
DELETE {{baseUrl}}/preferencias/10/remover-favorito/55
```

**Response Esperado (200)**:
```json
{
  "sucesso": true,
  "mensagem": "Produto removido dos favoritos"
}
```

---

### 7. Relatório de Clientes com Preferências (Admin) ✅

**Request**:
```
GET {{baseUrl}}/preferencias/relatorio
```

**Response Esperado (200)**:
```json
{
  "total_clientes_com_preferencias": 45,
  "clientes": [
    {
      "idcliente": 10,
      "nome": "João Silva",
      "email": "joao@email.com",
      "telefone": "11999999999",
      "total_favoritos": 3,
      "tem_restricoes": 1,
      "forma_pagamento": "PIX",
      "ultima_atualizacao": "2024-01-20"
    },
    {
      "idcliente": 15,
      "nome": "Maria Santos",
      "email": "maria@email.com",
      "telefone": "11988888888",
      "total_favoritos": 5,
      "tem_restricoes": 0,
      "forma_pagamento": "Cartão de Crédito",
      "ultima_atualizacao": "2024-01-18"
    }
  ]
}
```

---

### 8. Histórico de Alterações de Preferências ✅

**Request**:
```
GET {{baseUrl}}/preferencias/10/historico
```

**Response Esperado (200)**:
```json
[
  {
    "id": 1,
    "data_alteracao": "2024-01-20T14:25:00.000Z",
    "campo_alterado": "produtos_favoritos",
    "valor_antigo": "[15, 23]",
    "valor_novo": "[15, 23, 42]"
  },
  {
    "id": 2,
    "data_alteracao": "2024-01-18T10:30:00.000Z",
    "campo_alterado": "forma_pagamento_preferida",
    "valor_antigo": "Dinheiro",
    "valor_novo": "PIX"
  }
]
```

---

## 🔧 Variáveis de Ambiente (Postman)

Configure estas variáveis no Postman:

```
baseUrl: http://localhost:3000
token: {seu_token_jwt_aqui}
idCliente: 10
idReserva: 1
idProduto: 15
```

---

## 📝 Scripts de Teste (Postman Tests)

### Teste Genérico para Status 200

```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response time is less than 2000ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(2000);
});

pm.test("Content-Type is application/json", function () {
    pm.response.to.have.header("Content-Type", /application\/json/);
});
```

### Teste Específico para RF049

```javascript
pm.test("Confirmação reenviada com sucesso", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('sucesso');
    pm.expect(jsonData.sucesso).to.eql(true);
    pm.expect(jsonData.mensagem).to.include('reenviada com sucesso');
});
```

### Teste Específico para RF055 - Salvar Preferências

```javascript
pm.test("Preferências salvas com sucesso", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('sucesso');
    pm.expect(jsonData.sucesso).to.eql(true);
});
```

### Teste Específico para RF055 - Buscar Favoritos

```javascript
pm.test("Produtos favoritos retornados corretamente", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.be.an('array');
    
    if (jsonData.length > 0) {
        pm.expect(jsonData[0]).to.have.property('idproduto');
        pm.expect(jsonData[0]).to.have.property('nome');
        pm.expect(jsonData[0]).to.have.property('preco');
    }
});
```

---

## 🚀 Como Usar

### 1. Importar no Postman

1. Abra o Postman
2. Clique em "Import"
3. Cole o conteúdo deste arquivo
4. Configure as variáveis de ambiente

### 2. Obter Token JWT

Primeiro, faça login para obter o token:

```
POST {{baseUrl}}/login
```

**Body**:
```json
{
  "email": "admin@segredosdosabor.com",
  "senha": "senha123"
}
```

**Response**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "..."
}
```

Copie o `token` e configure na variável `token` do Postman.

### 3. Executar Testes

Execute os requests na ordem:

1. **RF055**: Primeiro crie preferências com POST
2. **RF055**: Depois teste os GETs para verificar dados
3. **RF055**: Teste adicionar/remover favoritos
4. **RF049**: Teste reenvio de confirmação

---

## 🔍 Troubleshooting

### Erro 401 - Unauthorized
- Verifique se o token JWT está configurado corretamente
- Confirme se o token não expirou (tokens expiram após 24h)

### Erro 404 - Not Found
- Verifique se o ID do cliente/reserva existe no banco
- Confirme se o backend está rodando na porta 3000

### Erro 500 - Internal Server Error
- Verifique os logs do backend para detalhes
- Confirme se a migração do banco (RF055) foi executada
- Verifique se o serviço do WhatsApp está configurado (RF049)

---

## 📊 Resultados Esperados

Após executar todos os testes:

- ✅ 1 endpoint do RF049 funcionando
- ✅ 8 endpoints do RF055 funcionando
- ✅ Total: 9 endpoints testados com sucesso
- ✅ Sistema com 92.3% dos requisitos funcionais implementados

---

**Criado em**: Janeiro de 2025  
**Versão**: 1.0  
**Projeto**: Segredos do Sabor
