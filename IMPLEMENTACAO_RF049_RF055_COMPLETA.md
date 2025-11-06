# 🎯 Implementação Completa: RF049 e RF055

## 📋 Visão Geral

Este documento descreve a implementação completa de dois requisitos funcionais que estavam faltando no sistema **Segredos do Sabor**:

- **RF049**: Permitir reenvio de confirmação de pedidos ao cliente via WhatsApp
- **RF055**: Permitir que o sistema salve preferências do cliente para futuras compras

---

## 🔄 RF049: Reenvio de Confirmação de Pedidos

### 📝 Descrição
Permite que o proprietário reenvie a confirmação de um pedido ao cliente via WhatsApp, facilitando a comunicação e garantindo que o cliente receba as informações do pedido.

### 🏗️ Arquivos Criados/Modificados

#### 1. **reenvioConfirmacaoController.js** (NOVO)
**Localização**: `backend/src/controller/reenvioConfirmacaoController.js`

**Endpoints Implementados**:
```javascript
POST /reserva/:id/reenviar-confirmacao
```

**Funcionalidades**:
- Busca dados completos da reserva pelo ID
- Busca dados do cliente associado
- Formata mensagem de confirmação com detalhes do pedido
- Envia mensagem via WhatsApp através do `whatsappService`
- Registra o reenvio no histórico do pedido
- Retorna confirmação de sucesso

**Exemplo de Requisição**:
```bash
POST http://localhost:3000/reserva/123/reenviar-confirmacao
```

**Exemplo de Resposta**:
```json
{
  "sucesso": true,
  "mensagem": "Confirmação reenviada com sucesso para +5511999999999"
}
```

#### 2. **reservaService.js** (MODIFICADO)
**Localização**: `backend/src/services/reservaService.js`

**Métodos Adicionados**:
```javascript
// Buscar reserva por ID para reenvio de confirmação
export async function buscarReservaPorId(id)

// Buscar dados do cliente de um pedido
export async function buscarClienteDoPedido(idReserva)

// Registrar reenvio de confirmação
export async function registrarReenvioConfirmacao(idReserva)
```

#### 3. **reservaRepository.js** (MODIFICADO)
**Localização**: `backend/src/repository/reservaRepository.js`

**Métodos Adicionados**:
```javascript
// Buscar dados do cliente de uma reserva
export async function buscarClientePorReserva(idReserva)

// Registrar reenvio de confirmação no histórico
export async function registrarReenvioConfirmacao(idReserva)
```

**Nota**: O método `buscarReservaPorId` já existia no sistema.

#### 4. **routes.js** (MODIFICADO)
**Localização**: `backend/src/routes.js`

**Alterações**:
- Adicionado import do `reenvioConfirmacaoController`
- Registrado controlador no sistema de rotas

---

## 💾 RF055: Preferências do Cliente

### 📝 Descrição
Permite que o sistema salve e gerencie preferências dos clientes, incluindo produtos favoritos, observações padrão, métodos de pagamento preferidos e informações sobre alergias/restrições alimentares.

### 🏗️ Arquivos Criados/Modificados

#### 1. **adicionar-preferencias-clientes.sql** (NOVO)
**Localização**: `adicionar-preferencias-clientes.sql`

**Estrutura do Banco de Dados**:

##### Tabela Principal
```sql
CREATE TABLE cliente_preferencias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idcliente_fk INT NOT NULL,
    produtos_favoritos JSON DEFAULT NULL,
    observacoes_padrao VARCHAR(500),
    forma_pagamento_preferida VARCHAR(50),
    alergias_restricoes TEXT,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (idcliente_fk) REFERENCES cliente(idcliente) ON DELETE CASCADE
);
```

##### Stored Procedures (4)
1. **sp_buscar_preferencias_cliente** - Busca preferências de um cliente
2. **sp_salvar_preferencias_cliente** - Salva/atualiza preferências
3. **sp_buscar_produtos_favoritos** - Lista produtos favoritos com detalhes
4. **sp_aplicar_preferencias_pedido** - Aplica preferências a novo pedido

##### Views (2)
1. **vw_cliente_preferencias** - Visão completa de clientes com preferências
2. **vw_relatorio_clientes_preferencias** - Relatório gerencial com estatísticas

##### Trigger (1)
- **trg_historico_preferencias** - Registra mudanças nas preferências

##### Índices
- Índice em `idcliente_fk` para otimização de buscas

#### 2. **preferenciasController.js** (NOVO)
**Localização**: `backend/src/controller/preferenciasController.js`

**Endpoints Implementados** (8 endpoints):

##### 1. Buscar Preferências
```javascript
GET /preferencias/:idcliente
```
Retorna todas as preferências de um cliente.

**Exemplo de Resposta**:
```json
{
  "id": 1,
  "idcliente_fk": 10,
  "produtos_favoritos": [15, 23, 42],
  "observacoes_padrao": "Sem açúcar adicional",
  "forma_pagamento_preferida": "PIX",
  "alergias_restricoes": "Alergia a amendoim",
  "data_criacao": "2024-01-15T10:30:00Z",
  "data_atualizacao": "2024-01-20T14:25:00Z"
}
```

##### 2. Salvar/Atualizar Preferências
```javascript
POST /preferencias/:idcliente
```
Cria ou atualiza preferências do cliente.

**Exemplo de Requisição**:
```json
{
  "produtos_favoritos": [15, 23, 42],
  "observacoes_padrao": "Sem açúcar adicional",
  "forma_pagamento_preferida": "PIX",
  "alergias_restricoes": "Alergia a amendoim"
}
```

##### 3. Buscar Produtos Favoritos
```javascript
GET /preferencias/:idcliente/produtos-favoritos
```
Lista produtos favoritos com detalhes completos.

**Exemplo de Resposta**:
```json
[
  {
    "idproduto": 15,
    "nome": "Bolo de Chocolate",
    "descricao": "Delicioso bolo de chocolate com cobertura",
    "preco": 45.90,
    "categoria": "Bolos",
    "disponivel": 1
  }
]
```

##### 4. Aplicar Preferências ao Pedido
```javascript
POST /preferencias/:idcliente/aplicar-pedido
```
Retorna dados para pré-preencher um novo pedido com as preferências do cliente.

**Exemplo de Resposta**:
```json
{
  "observacoes_padrao": "Sem açúcar adicional",
  "forma_pagamento_preferida": "PIX",
  "produtos_favoritos": [15, 23, 42],
  "alerta_alergias": "Atenção: Cliente possui alergia a amendoim"
}
```

##### 5. Adicionar Produto aos Favoritos
```javascript
PUT /preferencias/:idcliente/adicionar-favorito
```
Adiciona um produto à lista de favoritos.

**Exemplo de Requisição**:
```json
{
  "idproduto": 55
}
```

##### 6. Remover Produto dos Favoritos
```javascript
DELETE /preferencias/:idcliente/remover-favorito/:idproduto
```
Remove um produto da lista de favoritos.

##### 7. Relatório de Clientes com Preferências (Admin)
```javascript
GET /preferencias/relatorio
```
Retorna relatório estatístico sobre preferências dos clientes.

**Exemplo de Resposta**:
```json
{
  "total_clientes_com_preferencias": 45,
  "clientes": [
    {
      "idcliente": 10,
      "nome": "João Silva",
      "total_favoritos": 3,
      "tem_restricoes": 1,
      "forma_pagamento": "PIX",
      "ultima_atualizacao": "2024-01-20"
    }
  ]
}
```

##### 8. Histórico de Alterações
```javascript
GET /preferencias/:idcliente/historico
```
Retorna histórico de mudanças nas preferências.

#### 3. **routes.js** (MODIFICADO)
**Localização**: `backend/src/routes.js`

**Alterações**:
- Adicionado import do `preferenciasController`
- Registrado controlador no sistema de rotas

---

## 🔧 Instruções de Instalação

### Passo 1: Executar Migração do Banco de Dados (RF055)

**Opção 1 - Usando o Script Automatizado (RECOMENDADO):**

Execute o script batch que automatiza todo o processo:

```bash
executar-migracao-preferencias.bat
```

Ou diretamente via Node.js:

```bash
cd backend
node executar-migracao-preferencias.js
```

**Opção 2 - Via MySQL CLI:**

```bash
mysql -u root -p segredos_do_sabor < adicionar-preferencias-clientes.sql
```

**Opção 3 - Via MySQL Workbench:**
1. Abra o arquivo `adicionar-preferencias-clientes.sql`
2. Execute o script completo

### Passo 2: Reiniciar o Backend

O backend já está configurado com os novos controladores. Basta reiniciá-lo:

```bash
cd backend
npm start
```

Ou use o script de inicialização:
```bash
iniciar-backend.bat
```

---

## 🧪 Guia de Testes

### Testar RF049: Reenvio de Confirmação

#### Via Postman/Insomnia

**1. Reenviar Confirmação de Pedido**
```
POST http://localhost:3000/reserva/1/reenviar-confirmacao
Headers:
  Authorization: Bearer {seu_token_jwt}
  Content-Type: application/json
```

**Cenários de Teste**:
- ✅ Pedido existente → Deve enviar confirmação via WhatsApp
- ❌ Pedido inexistente (ID inválido) → Erro 404
- ❌ Sem token de autenticação → Erro 401
- ✅ Cliente sem WhatsApp → Erro informativo

#### Via Frontend (Implementação Futura)

Adicionar botão no painel de pedidos:
```jsx
<Button 
  onClick={() => reenviarConfirmacao(pedido.id)}
  variant="outline"
  size="sm"
>
  <RefreshIcon /> Reenviar Confirmação
</Button>
```

---

### Testar RF055: Preferências do Cliente

#### Via Postman/Insomnia

**1. Buscar Preferências de um Cliente**
```
GET http://localhost:3000/preferencias/10
Headers:
  Authorization: Bearer {seu_token_jwt}
```

**2. Criar/Atualizar Preferências**
```
POST http://localhost:3000/preferencias/10
Headers:
  Authorization: Bearer {seu_token_jwt}
  Content-Type: application/json
Body:
{
  "produtos_favoritos": [15, 23, 42],
  "observacoes_padrao": "Sem açúcar adicional",
  "forma_pagamento_preferida": "PIX",
  "alergias_restricoes": "Alergia a amendoim"
}
```

**3. Buscar Produtos Favoritos**
```
GET http://localhost:3000/preferencias/10/produtos-favoritos
Headers:
  Authorization: Bearer {seu_token_jwt}
```

**4. Aplicar Preferências a Novo Pedido**
```
POST http://localhost:3000/preferencias/10/aplicar-pedido
Headers:
  Authorization: Bearer {seu_token_jwt}
  Content-Type: application/json
```

**5. Adicionar Produto aos Favoritos**
```
PUT http://localhost:3000/preferencias/10/adicionar-favorito
Headers:
  Authorization: Bearer {seu_token_jwt}
  Content-Type: application/json
Body:
{
  "idproduto": 55
}
```

**6. Remover Produto dos Favoritos**
```
DELETE http://localhost:3000/preferencias/10/remover-favorito/55
Headers:
  Authorization: Bearer {seu_token_jwt}
```

**7. Relatório de Preferências (Admin)**
```
GET http://localhost:3000/preferencias/relatorio
Headers:
  Authorization: Bearer {seu_token_jwt_admin}
```

**8. Histórico de Alterações**
```
GET http://localhost:3000/preferencias/10/historico
Headers:
  Authorization: Bearer {seu_token_jwt}
```

#### Via SQL (Testes Diretos no Banco)

**1. Buscar Preferências via Stored Procedure**
```sql
CALL sp_buscar_preferencias_cliente(10);
```

**2. Salvar Preferências**
```sql
CALL sp_salvar_preferencias_cliente(
    10, 
    '[15, 23, 42]', 
    'Sem açúcar adicional', 
    'PIX', 
    'Alergia a amendoim'
);
```

**3. Buscar Produtos Favoritos**
```sql
CALL sp_buscar_produtos_favoritos(10);
```

**4. Aplicar Preferências a Pedido**
```sql
CALL sp_aplicar_preferencias_pedido(10);
```

**5. Verificar View de Preferências**
```sql
SELECT * FROM vw_cliente_preferencias WHERE idcliente = 10;
```

**6. Relatório de Clientes**
```sql
SELECT * FROM vw_relatorio_clientes_preferencias;
```

**7. Verificar Histórico (Tabela de Log)**
```sql
SELECT * FROM cliente_preferencias_historico 
WHERE idcliente_fk = 10 
ORDER BY data_alteracao DESC;
```

---

## 📊 Estrutura de Dados (RF055)

### Campos JSON em `produtos_favoritos`

Armazena array de IDs de produtos:
```json
[15, 23, 42, 55]
```

### Exemplo Completo de Registro
```json
{
  "id": 1,
  "idcliente_fk": 10,
  "produtos_favoritos": [15, 23, 42],
  "observacoes_padrao": "Sem açúcar adicional, entregar até 14h",
  "forma_pagamento_preferida": "PIX",
  "alergias_restricoes": "Alergia a amendoim e glúten",
  "data_criacao": "2024-01-15T10:30:00Z",
  "data_atualizacao": "2024-01-20T14:25:00Z"
}
```

---

## 🎨 Implementação Frontend (Próxima Fase)

### RF049: Botão de Reenvio no Painel de Pedidos

**Componente**: `PainelPedidos.jsx`

```jsx
import { RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../services/api';

const reenviarConfirmacao = async (idPedido) => {
  try {
    const response = await api.post(`/reserva/${idPedido}/reenviar-confirmacao`);
    toast.success('Confirmação reenviada com sucesso!');
  } catch (error) {
    toast.error('Erro ao reenviar confirmação');
    console.error(error);
  }
};

// No JSX
<button 
  onClick={() => reenviarConfirmacao(pedido.id)}
  className="btn-reenviar"
  title="Reenviar confirmação ao cliente"
>
  <RefreshCw size={16} />
  Reenviar
</button>
```

### RF055: Página de Preferências do Cliente

**Componente**: `PreferenciasCliente.jsx`

```jsx
import React, { useState, useEffect } from 'react';
import { Heart, Save, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-toastify';

const PreferenciasCliente = ({ idCliente }) => {
  const [preferencias, setPreferencias] = useState({
    produtos_favoritos: [],
    observacoes_padrao: '',
    forma_pagamento_preferida: 'PIX',
    alergias_restricoes: ''
  });
  
  const [produtosFavoritos, setProdutosFavoritos] = useState([]);
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    carregarPreferencias();
    carregarProdutos();
  }, [idCliente]);

  const carregarPreferencias = async () => {
    try {
      const response = await api.get(`/preferencias/${idCliente}`);
      if (response.data) {
        setPreferencias(response.data);
        carregarProdutosFavoritos();
      }
    } catch (error) {
      console.error('Erro ao carregar preferências:', error);
    }
  };

  const carregarProdutosFavoritos = async () => {
    try {
      const response = await api.get(`/preferencias/${idCliente}/produtos-favoritos`);
      setProdutosFavoritos(response.data);
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
    }
  };

  const carregarProdutos = async () => {
    try {
      const response = await api.get('/produtos');
      setProdutos(response.data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    }
  };

  const salvarPreferencias = async () => {
    try {
      await api.post(`/preferencias/${idCliente}`, preferencias);
      toast.success('Preferências salvas com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar preferências');
      console.error(error);
    }
  };

  const adicionarFavorito = async (idProduto) => {
    try {
      await api.put(`/preferencias/${idCliente}/adicionar-favorito`, { idproduto: idProduto });
      toast.success('Produto adicionado aos favoritos!');
      carregarProdutosFavoritos();
    } catch (error) {
      toast.error('Erro ao adicionar favorito');
    }
  };

  const removerFavorito = async (idProduto) => {
    try {
      await api.delete(`/preferencias/${idCliente}/remover-favorito/${idProduto}`);
      toast.success('Produto removido dos favoritos!');
      carregarProdutosFavoritos();
    } catch (error) {
      toast.error('Erro ao remover favorito');
    }
  };

  return (
    <div className="preferencias-container">
      <h2><Heart /> Minhas Preferências</h2>
      
      {/* Seção de Produtos Favoritos */}
      <section className="secao-favoritos">
        <h3>Produtos Favoritos</h3>
        <div className="lista-favoritos">
          {produtosFavoritos.map(produto => (
            <div key={produto.idproduto} className="card-favorito">
              <img src={produto.imagem} alt={produto.nome} />
              <h4>{produto.nome}</h4>
              <p>R$ {produto.preco}</p>
              <button onClick={() => removerFavorito(produto.idproduto)}>
                Remover
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Seção de Configurações */}
      <section className="secao-configuracoes">
        <h3>Configurações Padrão</h3>
        
        <div className="form-group">
          <label>Observações Padrão</label>
          <textarea
            value={preferencias.observacoes_padrao}
            onChange={(e) => setPreferencias({...preferencias, observacoes_padrao: e.target.value})}
            placeholder="Ex: Entregar até 14h, sem açúcar adicional..."
            rows={4}
          />
        </div>

        <div className="form-group">
          <label>Forma de Pagamento Preferida</label>
          <select
            value={preferencias.forma_pagamento_preferida}
            onChange={(e) => setPreferencias({...preferencias, forma_pagamento_preferida: e.target.value})}
          >
            <option value="PIX">PIX</option>
            <option value="Cartão de Crédito">Cartão de Crédito</option>
            <option value="Cartão de Débito">Cartão de Débito</option>
            <option value="Dinheiro">Dinheiro</option>
          </select>
        </div>

        <div className="form-group">
          <label><AlertCircle size={16} /> Alergias e Restrições Alimentares</label>
          <textarea
            value={preferencias.alergias_restricoes}
            onChange={(e) => setPreferencias({...preferencias, alergias_restricoes: e.target.value})}
            placeholder="Ex: Alergia a amendoim, intolerância à lactose..."
            rows={3}
          />
        </div>

        <button className="btn-salvar" onClick={salvarPreferencias}>
          <Save size={18} />
          Salvar Preferências
        </button>
      </section>
    </div>
  );
};

export default PreferenciasCliente;
```

**Estilos SCSS**: `PreferenciasCliente.scss`

```scss
.preferencias-container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;

  h2 {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--primary-color);
    margin-bottom: 2rem;
  }

  .secao-favoritos {
    margin-bottom: 3rem;

    h3 {
      margin-bottom: 1rem;
      color: var(--text-dark);
    }

    .lista-favoritos {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1rem;

      .card-favorito {
        background: white;
        border-radius: 8px;
        padding: 1rem;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        text-align: center;
        transition: transform 0.2s;

        &:hover {
          transform: translateY(-4px);
        }

        img {
          width: 100%;
          height: 150px;
          object-fit: cover;
          border-radius: 4px;
          margin-bottom: 0.5rem;
        }

        h4 {
          font-size: 1rem;
          margin-bottom: 0.5rem;
        }

        p {
          color: var(--primary-color);
          font-weight: bold;
          margin-bottom: 0.5rem;
        }

        button {
          background: var(--danger-color);
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;

          &:hover {
            opacity: 0.9;
          }
        }
      }
    }
  }

  .secao-configuracoes {
    background: white;
    border-radius: 8px;
    padding: 2rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);

    h3 {
      margin-bottom: 1.5rem;
      color: var(--text-dark);
    }

    .form-group {
      margin-bottom: 1.5rem;

      label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 500;
        margin-bottom: 0.5rem;
        color: var(--text-dark);
      }

      textarea,
      select {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-family: inherit;
        font-size: 1rem;

        &:focus {
          outline: none;
          border-color: var(--primary-color);
        }
      }
    }

    .btn-salvar {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: var(--primary-color);
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      transition: background 0.2s;

      &:hover {
        background: var(--primary-dark);
      }
    }
  }
}
```

---

## 📈 Impacto nos Requisitos Funcionais

### Status Atualizado

Com a implementação de RF049 e RF055, o sistema agora possui:

| Status | Quantidade | Percentual |
|--------|-----------|-----------|
| ✅ Implementado | **60** | **92.3%** |
| ⚠️ Parcial | 5 | 7.7% |
| ❌ Não Implementado | 0 | 0% |
| **TOTAL** | **65** | **100%** |

### Requisitos Agora Implementados

- **RF049**: ✅ Sistema permite reenvio de confirmação de pedidos
- **RF055**: ✅ Sistema salva preferências do cliente para futuras compras

---

## 🔐 Segurança e Validações

### RF049
- ✅ Autenticação via JWT obrigatória
- ✅ Validação de ID de reserva
- ✅ Verificação de existência do cliente
- ✅ Validação de número de telefone
- ✅ Tratamento de erros de envio

### RF055
- ✅ Autenticação via JWT obrigatória
- ✅ Validação de ID de cliente
- ✅ Validação de campos JSON
- ✅ Foreign key para garantir integridade
- ✅ Trigger para auditoria de mudanças
- ✅ Cascade delete ao remover cliente

---

## 📚 Documentação Relacionada

- **ANALISE_REQUISITOS_FUNCIONAIS.md** - Análise completa de todos os 65 requisitos
- **ATIVIDADE_15_MODELO_DICIONARIO_DADOS.md** - Modelo de dados completo
- **CONFIGURACAO_WHATSAPP.md** - Configuração do WhatsApp (para RF049)
- **SOFTWARES_UTILIZADOS.md** - Ferramentas de desenvolvimento

---

## ✅ Checklist de Validação

### RF049: Reenvio de Confirmação
- [ ] Backend: Endpoint criado e funcionando
- [ ] Backend: Integração com WhatsApp funcionando
- [ ] Backend: Registro no histórico funcionando
- [ ] Frontend: Botão de reenvio adicionado ao painel
- [ ] Teste: Reenvio com pedido válido
- [ ] Teste: Erro com pedido inválido
- [ ] Teste: Verificação de histórico no banco

### RF055: Preferências do Cliente
- [ ] Banco: Tabela `cliente_preferencias` criada
- [ ] Banco: Stored procedures criadas (4)
- [ ] Banco: Views criadas (2)
- [ ] Banco: Trigger de histórico criado
- [ ] Backend: 8 endpoints criados e testados
- [ ] Frontend: Página de preferências implementada
- [ ] Teste: Salvar novas preferências
- [ ] Teste: Adicionar/remover favoritos
- [ ] Teste: Aplicar preferências em novo pedido
- [ ] Teste: Visualizar histórico de alterações

---

## 🚀 Próximos Passos

1. **Executar migração do banco** (RF055)
   ```bash
   mysql -u root -p segredos_do_sabor < adicionar-preferencias-clientes.sql
   ```

2. **Reiniciar backend**
   ```bash
   iniciar-backend.bat
   ```

3. **Testar endpoints via Postman** (RF049 e RF055)

4. **Implementar componentes frontend**:
   - Botão de reenvio no painel de pedidos (RF049)
   - Página completa de preferências (RF055)

5. **Realizar testes de integração**

6. **Atualizar documentação do usuário**

---

## 👥 Autores

Implementado em **Janeiro de 2025** como parte do projeto **Segredos do Sabor**.

---

## 📝 Observações Finais

Esta implementação eleva o sistema para **92.3% de completude** dos requisitos funcionais, deixando apenas 5 requisitos com implementação parcial (RF058, RF059, RF060, RF061, RF062 - relacionados a notificações avançadas e métricas).

O sistema agora oferece uma experiência muito mais completa tanto para o proprietário quanto para os clientes, com funcionalidades de reenvio de confirmações e gestão de preferências que melhoram significativamente a usabilidade e a fidelização de clientes.

---

**Data de Criação**: Janeiro de 2025  
**Última Atualização**: Janeiro de 2025  
**Status**: ✅ Implementação Completa (Backend) | 🚧 Frontend Pendente
