# 📋 GUIA DE IMPLEMENTAÇÃO: PERSONALIZAÇÃO COM CONTROLE DE ESTOQUE

## 🎯 Objetivo
Integrar o sistema de personalização de produtos com o controle de estoque de ingredientes, permitindo que ao personalizar um produto com recheios, coberturas, decorações ou extras, os ingredientes sejam automaticamente descontados do estoque.

## 📊 O que foi implementado

### 1. **Banco de Dados** ✅
- **Nova tabela**: `personalizacao_ingrediente`
  - Vincula valores de personalização (ex: "Brigadeiro", "Nutella") aos ingredientes usados
  - Armazena a quantidade de cada ingrediente necessária para a personalização
  - Relaciona com as tabelas `opcao_valores` e `ingrediente`

- **Views criadas**:
  - `vw_personalizacao_com_ingredientes`: Lista personalizações com seus ingredientes
  - `vw_disponibilidade_personalizacao`: Verifica disponibilidade baseado no estoque

### 2. **Backend** ✅

#### **Repository** (`personalizacaoRepository.js`)
- `vincularValorIngrediente()`: Vincula ingrediente a um valor de personalização
- `removerVinculoValorIngrediente()`: Remove o vínculo
- `listarIngredientesValor()`: Lista ingredientes de uma personalização
- `verificarDisponibilidadePersonalizacao()`: Verifica se há estoque suficiente
- `darBaixaIngredientesPersonalizacao()`: Dá baixa nos ingredientes ao confirmar pedido

#### **Service** (`personalizacaoService.js`)
- `vincularValorIngrediente()`: Lógica de negócio para vincular
- `removerVinculoValorIngrediente()`: Lógica para remover vínculo
- `listarIngredientesValor()`: Buscar ingredientes
- `verificarDisponibilidadePersonalizacao()`: Validar disponibilidade
- `processarPersonalizacaoComEstoque()`: Processo completo - valida e dá baixa no estoque

#### **Controller** (`personalizacaoController.js`)
Novos endpoints:
```
POST   /personalizacao/valores/:id/ingredientes
DELETE /personalizacao/valores/:idvalor/ingredientes/:idingrediente
GET    /personalizacao/valores/:id/ingredientes
GET    /personalizacao/valores/:id/disponibilidade
POST   /personalizacao/processar-estoque
```

#### **Integração com Pedidos** (`reservaService.js`)
- Ao criar pedido (`inserirReserva`), automaticamente:
  1. Valida se há ingredientes suficientes
  2. Dá baixa nos ingredientes vinculados às personalizações
  3. Registra movimentações de estoque

### 3. **Frontend** (Parcial) ⚠️
- Componente de personalização atualizado para carregar ingredientes
- Mostra ingredientes utilizados em cada opção de personalização
- Indica status de estoque (Disponível, Estoque Baixo, Indisponível)
- Desabilita opções indisponíveis

---

## 🚀 Como Executar

### Passo 1: Executar Migração SQL
```bash
# Windows (MySQL via xampp/wamp)
mysql -u root -p db_segredo_do_sabor < vincular-personalizacao-ingredientes.sql

# Ou abra o arquivo no MySQL Workbench e execute
```

### Passo 2: Verificar Tabelas Criadas
```sql
-- Verificar se tabela foi criada
SHOW TABLES LIKE 'personalizacao_ingrediente';

-- Ver vínculos existentes
SELECT * FROM vw_personalizacao_com_ingredientes;

-- Verificar disponibilidade
SELECT * FROM vw_disponibilidade_personalizacao;
```

### Passo 3: Testar Backend
```bash
cd d:\Downloads\Segredo-do-Sabor\backend
npm start
```

### Passo 4: Testar Endpoints

#### 4.1 Listar ingredientes de uma personalização
```http
GET http://localhost:5000/personalizacao/valores/1/ingredientes
```

#### 4.2 Verificar disponibilidade
```http
GET http://localhost:5000/personalizacao/valores/1/disponibilidade
```

Resposta esperada:
```json
{
  "idvalor": 1,
  "nome_valor": "Brigadeiro",
  "nome_opcao": "Recheio",
  "disponivel": true,
  "ingredientes_faltando": null
}
```

#### 4.3 Vincular novo ingrediente
```http
POST http://localhost:5000/personalizacao/valores/1/ingredientes
Content-Type: application/json

{
  "idingrediente": 5,
  "quantidade_usada": 0.100
}
```

#### 4.4 Processar personalização (dar baixa em ingredientes)
```http
POST http://localhost:5000/personalizacao/processar-estoque
Content-Type: application/json

{
  "idreserva": 123,
  "usuario": "Sistema",
  "personalizacoes": [
    {
      "idvalor": 1,
      "nome_valor": "Brigadeiro"
    },
    {
      "idvalor": 7,
      "nome_valor": "Chocolate ao Leite"
    }
  ]
}
```

Resposta esperada:
```json
{
  "sucesso": true,
  "mensagem": "Personalização processada e estoque atualizado",
  "ingredientes_atualizados": 6
}
```

---

## 📝 Fluxo de Funcionamento

### Cenário: Cliente faz pedido com personalização

1. **Cliente escolhe produto no catálogo**
   - Frontend carrega opções de personalização

2. **Cliente seleciona recheio "Brigadeiro"**
   - Frontend busca ingredientes vinculados:
     ```
     GET /personalizacao/valores/1/ingredientes
     ```
   - Mostra: "50g Farinha, 100g Chocolate, 50ml Leite"
   - Verifica disponibilidade (estoque suficiente?)

3. **Cliente seleciona cobertura "Ganache"**
   - Frontend busca ingredientes:
     ```
     GET /personalizacao/valores/9/ingredientes
     ```
   - Mostra: "200g Chocolate, 100ml Leite"
   - Status: ⚠️ "ESTOQUE BAIXO"

4. **Cliente confirma personalização**
   - Frontend calcula acréscimo:
     ```
     POST /personalizacao/calcular-acrescimo
     ```
   - Mostra valor total (produto + acréscimos)

5. **Cliente finaliza pedido**
   - Backend cria reserva com personalizações
   - `inserirReserva()` automaticamente chama:
     ```javascript
     processarPersonalizacaoComEstoque(personalizacoes, idReserva)
     ```

6. **Backend processa estoque**
   - Valida disponibilidade de todos os ingredientes
   - Dá baixa no estoque:
     - Farinha: -0.050 kg
     - Chocolate: -0.300 kg (50g + 200g)
     - Leite: -0.150 L (50ml + 100ml)
   - Registra movimentações na tabela `movimentacao_estoque`

7. **Admin visualiza movimentações**
   - Acessa painel de ingredientes
   - Vê histórico de saídas vinculadas a personalizações
   - Recebe alertas de estoque baixo

---

## 🧪 Testes Recomendados

### Teste 1: Personalização com estoque OK
```
1. Verificar estoque atual de Chocolate (>=0.300kg)
2. Criar pedido com recheio Brigadeiro (100g)
3. Verificar que estoque foi reduzido em 0.100kg
4. Verificar movimentação registrada
```

### Teste 2: Personalização com estoque insuficiente
```
1. Reduzir estoque de Chocolate para 0.050kg
2. Tentar criar pedido com recheio Nutella (80g)
3. Verificar erro: "Estoque insuficiente de Chocolate"
4. Pedido não deve ser criado
```

### Teste 3: Múltiplas personalizações
```
1. Criar pedido com:
   - Recheio: Nutella (80g chocolate)
   - Cobertura: Ganache (200g chocolate, 100ml leite)
   - Decoração: Chocolate Raspado (50g chocolate)
2. Total descontado: 330g chocolate, 100ml leite
3. Verificar ambos ingredientes foram atualizados
```

### Teste 4: Interface mostra status
```
1. Acessar catálogo como cliente
2. Selecionar produto personalizável
3. Ver opções com badges:
   - ✅ DISPONÍVEL (estoque OK)
   - ⚠️ ESTOQUE BAIXO (estoque < 5x quantidade)
   - ❌ INDISPONÍVEL (estoque insuficiente)
4. Opções indisponíveis devem estar desabilitadas
```

---

## 🎨 Gestão de Ingredientes Unificada

### Visualização no Painel Admin

O painel de ingredientes agora mostra:

#### Aba "Ingredientes"
- Lista todos os ingredientes
- Estoque atual
- Usos em receitas de produtos
- **NOVO**: Usos em personalizações

#### Aba "Personalização"
- Lista todas as opções de personalização
- Valores de cada opção
- **NOVO**: Ingredientes vinculados a cada valor
- Status de disponibilidade baseado em estoque

#### Card de Ingrediente Expandido
```
📦 Chocolate
├─ Estoque: 2.500 kg
├─ Estoque Mínimo: 1.000 kg
├─ Status: ✅ OK
│
├─ 🍰 Usado em Produtos:
│  ├─ Bolo de Chocolate (0.200 kg/unidade)
│  └─ Brigadeiro (0.050 kg/unidade)
│
└─ 🎨 Usado em Personalizações:
   ├─ Recheio Brigadeiro (0.100 kg)
   ├─ Recheio Nutella (0.080 kg)
   ├─ Cobertura Ganache (0.200 kg)
   └─ Decoração Chocolate Raspado (0.050 kg)
```

---

## ⚙️ Configuração de Vínculos

### Como Vincular Ingrediente a Personalização

#### Via API:
```http
POST /personalizacao/valores/1/ingredientes
{
  "idingrediente": 3,  // ID do Chocolate
  "quantidade_usada": 0.100  // 100g
}
```

#### Via Banco de Dados:
```sql
INSERT INTO personalizacao_ingrediente (idvalor_fk, idingrediente_fk, quantidade_usada)
VALUES (1, 3, 0.100);
```

### Exemplo: Configurar Recheio "Nutella"
```sql
-- Nutella usa chocolate e leite
INSERT INTO personalizacao_ingrediente (idvalor_fk, idingrediente_fk, quantidade_usada) VALUES
(3, 3, 0.080),  -- 80g de Chocolate
(3, 2, 0.020);  -- 20ml de Leite
```

---

## 🔧 Troubleshooting

### Problema: Ingredientes não aparecem no frontend
**Solução**: Verificar se vínculos existem
```sql
SELECT * FROM personalizacao_ingrediente WHERE idvalor_fk = 1;
```

### Problema: Erro "Estoque insuficiente" mas há estoque
**Solução**: Verificar unidade de medida
```sql
SELECT nome, quantidade_estoque, unidade_medida 
FROM ingrediente 
WHERE idingrediente = 3;
```
- Se está em kg e personalização usa g, converter: 1kg = 1000g

### Problema: Pedido criado mas estoque não atualizou
**Solução**: Verificar se personalizações foram passadas
```javascript
const reserva = {
  // ... outros campos
  personalizacoes: [  // ← DEVE existir
    { idvalor: 1, nome_valor: "Brigadeiro" }
  ]
};
```

---

## 📈 Próximos Passos

### Frontend (A completar)
1. ✅ Carregar ingredientes de cada valor
2. ✅ Mostrar status de estoque
3. ❌ Atualizar página de gerenciamento (admin)
4. ❌ Adicionar interface para vincular ingredientes
5. ❌ Dashboard com consumo de ingredientes por personalização

### Backend (Melhorias)
1. ❌ Adicionar cache para disponibilidade
2. ❌ Notificar admin quando personalização ficar indisponível
3. ❌ Relatório de personalizações mais populares
4. ❌ Previsão de reposição baseado em histórico

### Regras de Negócio
1. ❌ Definir se pedido falha ou avisa sobre estoque baixo
2. ❌ Permitir "reservar" ingredientes ao add carrinho
3. ❌ Implementar prioridade (pedidos confirmados > carrinho)

---

## 📞 Suporte

Para dúvidas ou problemas:
1. Verificar logs do backend
2. Consultar tabela `movimentacao_estoque`
3. Executar queries de diagnóstico no SQL

**Arquivo SQL**: `vincular-personalizacao-ingredientes.sql`  
**Data**: 18 de Outubro de 2025  
**Versão**: 1.0
