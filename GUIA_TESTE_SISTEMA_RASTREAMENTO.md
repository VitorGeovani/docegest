# 🧪 GUIA COMPLETO DE TESTE - SISTEMA DE RASTREAMENTO DE PEDIDOS

## ⚠️ **PASSOS OBRIGATÓRIOS ANTES DE TESTAR**

### **1. Executar SQL no Banco de Dados**

O arquivo `atualizar_sistema_pedidos.sql` adiciona campos essenciais na tabela `reserva`. **Execute antes de testar:**

#### **Método 1: MySQL Workbench (Recomendado)**
```
1. Abrir MySQL Workbench
2. Conectar ao servidor local
3. Abrir atualizar_sistema_pedidos.sql (File → Open SQL Script)
4. Executar todo o script (⚡ Execute button)
5. Verificar no Output: "4 rows affected" para cada ALTER TABLE
```

#### **Método 2: Command Line**
```cmd
cd d:\Downloads\Segredos-do-Sabor
type atualizar_sistema_pedidos.sql | mysql -u root -p segredodosabor
```

#### **Método 3: Copiar e Colar**
```
1. Abrir atualizar_sistema_pedidos.sql
2. Copiar todo o conteúdo
3. Abrir MySQL Workbench
4. Colar no Query Editor
5. Executar
```

#### **✅ Verificar se funcionou:**
```sql
USE segredodosabor;
DESCRIBE reserva;
```

**Deve aparecer:**
- `data_pedido` (datetime)
- `numero_pedido` (varchar(20))
- `data_atualizacao` (datetime)
- `historico_status` (json)

---

### **2. Reiniciar Backend**

Após executar o SQL, reinicie o backend para aplicar as mudanças:

```cmd
cd backend
npm start
```

**Verificar no console:**
```
✅ Servidor rodando na porta 5000
✅ Banco de dados conectado
```

---

## 🧪 **TESTES - FLUXO COMPLETO**

### **TESTE 1: Cliente Faz um Pedido**

#### **1.1. Acessar Catálogo**
```
1. Abrir navegador: http://localhost:3000/catalogo
2. Verificar que produtos estão listados
```

#### **1.2. Adicionar Produtos ao Carrinho**
```
1. Clicar em produtos (Kit-Kat, Brigadeiro, etc)
2. Selecionar quantidades
3. Verificar carrinho com produtos
```

#### **1.3. Finalizar Pedido**
```
1. Ir para Checkout
2. Preencher dados:
   - Nome: João Silva
   - Telefone: 5511999999999
   - Email: joao@email.com
   - Data de Entrega: [selecionar data futura]
   - Hora: 14:00
   - Ponto de Entrega: Loja Segredos do Sabor
   - Pagamento: PIX
3. Confirmar Pedido
```

#### **✅ Resultado Esperado:**
```
- Mensagem de sucesso
- Pedido criado com status "Pendente"
- Número do pedido gerado (PED000001)
```

---

### **TESTE 2: Cliente Visualiza Pedido**

#### **2.1. Acessar Meus Pedidos**
```
1. Navegar para: http://localhost:3000/meus-pedidos
2. Verificar que o sistema está carregando
```

#### **✅ Resultado Esperado:**
```
- Lista com o pedido recém-criado
- Status: "Aguardando Pagamento" (🕐)
- Cor do badge: Amarelo
- Data do pedido exibida corretamente
- Valor total correto
```

#### **2.2. Ver Detalhes do Pedido**
```
1. Clicar em "Ver Detalhes"
2. Modal abre com informações completas
```

#### **✅ Resultado Esperado no Modal:**
```
✅ Número do pedido (PED000001)
✅ Timeline de status (apenas "Pendente" por enquanto)
✅ Data do pedido formatada
✅ Endereço de entrega
✅ Forma de pagamento
✅ Lista de produtos com imagens
✅ Quantidades corretas
✅ Valor total
✅ Botões: "Contatar Loja" e "Pedir Novamente"
```

---

### **TESTE 3: Admin Confirma Pagamento**

#### **3.1. Acessar Painel Admin**
```
1. Navegar para: http://localhost:3000/admin/reservas
2. Verificar que o pedido aparece na lista
```

#### **✅ Resultado Esperado:**
```
- Card com informações do pedido
- Header com número do pedido (PED000001)
- Badge de status: "Aguardando Pagamento"
- Botões: "Confirmar Pagamento" e "Cancelar"
```

#### **3.2. Confirmar Pagamento**
```
1. Clicar em "Confirmar Pagamento" (ou "Confirmar" se status for Pendente)
2. Modal de confirmação aparece
3. Clicar em "Confirmar"
```

#### **✅ Resultado Esperado:**
```
✅ Modal de sucesso aparece
✅ Mensagem: "Status atualizado para Confirmado com sucesso!"
✅ Card atualiza automaticamente
✅ Novo badge: "Pagamento Confirmado" (verde)
✅ Novo botão aparece: "Iniciar Preparação"
```

---

### **TESTE 4: Cliente Vê Atualização Automática**

#### **4.1. Verificar Atualização em Meus Pedidos**
```
1. Voltar para: http://localhost:3000/meus-pedidos
2. Aguardar até 30 segundos (atualização automática)
3. OU Recarregar a página manualmente
```

#### **✅ Resultado Esperado:**
```
✅ Status muda para "Pagamento Confirmado" (✅)
✅ Badge fica verde
✅ Pedido move para aba "Confirmados"
```

#### **4.2. Ver Timeline Atualizada**
```
1. Clicar em "Ver Detalhes"
2. Ver timeline de status
```

#### **✅ Resultado Esperado:**
```
Timeline mostra 2 etapas:
1. Pendente - [data/hora]
2. Confirmado - [data/hora] ← ATIVO (verde)
```

---

### **TESTE 5: Admin Progride Status - Preparação**

#### **5.1. Iniciar Preparação**
```
1. No painel admin, clicar em "Iniciar Preparação"
2. Confirmar no modal
```

#### **✅ Resultado Esperado:**
```
✅ Status muda para "Preparando"
✅ Badge fica azul (🥘)
✅ Novo botão: "Marcar como Pronto"
```

#### **5.2. Cliente Vê Mudança**
```
1. Meus Pedidos atualiza automaticamente
2. Status: "Em Preparação" (azul)
3. Timeline: 3 etapas (Pendente → Confirmado → Preparando)
```

---

### **TESTE 6: Admin Progride Status - Pronto**

#### **6.1. Marcar como Pronto**
```
1. Clicar em "Marcar como Pronto"
2. Confirmar
```

#### **✅ Resultado Esperado:**
```
✅ Status: "Pronto"
✅ Badge roxo (📦)
✅ Novo botão: "Marcar como Entregue"
```

#### **6.2. Cliente Recebe Notificação Visual**
```
1. Status atualiza: "Pronto para Retirada"
2. Badge com animação pulsante
3. Timeline: 4 etapas
```

---

### **TESTE 7: Admin Marca como Entregue**

#### **7.1. Finalizar Entrega**
```
1. Clicar em "Marcar como Entregue"
2. Confirmar
```

#### **✅ Resultado Esperado:**
```
✅ Status: "Entregue"
✅ Badge verde (✅)
✅ Pedido some da lista de pendentes (opcional)
```

#### **7.2. Cliente Vê Conclusão**
```
1. Status: "Entregue" (verde)
2. Timeline completa: 5 etapas
3. Pedido move para aba "Entregues"
```

---

### **TESTE 8: Função "Pedir Novamente"**

#### **8.1. Repetir Pedido**
```
1. Meus Pedidos → Pedido entregue
2. Clicar em "Pedir Novamente"
```

#### **✅ Resultado Esperado:**
```
✅ Navega para /catalogo
✅ Carrinho já preenchido com produtos do pedido anterior
✅ Quantidades mantidas
✅ Cliente pode ajustar e finalizar novo pedido
```

---

### **TESTE 9: Cancelamento de Pedido**

#### **9.1. Admin Cancela**
```
1. Painel admin → Pedido ativo
2. Clicar em "Cancelar Pedido"
3. Confirmar cancelamento
```

#### **✅ Resultado Esperado:**
```
✅ Modal de confirmação
✅ Mensagem de sucesso
✅ Estoque restaurado automaticamente
✅ Pedido removido da lista
```

#### **9.2. Cliente Vê Cancelamento**
```
1. Status: "Cancelado" (vermelho)
2. Badge com X
3. Timeline mostra cancelamento
```

---

### **TESTE 10: Filtros de Status**

#### **10.1. Testar Filtros**
```
Cliente em Meus Pedidos:
1. Clicar em "Todos" → Ver todos os pedidos
2. Clicar em "Pendentes" → Ver apenas pendentes
3. Clicar em "Confirmados" → Ver apenas confirmados
4. Clicar em "Entregues" → Ver apenas entregues
```

#### **✅ Resultado Esperado:**
```
✅ Contadores corretos em cada filtro
✅ Pedidos filtrados corretamente
✅ Transição suave entre filtros
```

---

## 🔍 **TESTES DE API (OPCIONAL)**

### **Via Postman ou Insomnia:**

#### **1. Buscar Pedidos de um Cliente**
```http
GET http://localhost:5000/pedidos/cliente/5511999999999
```

**Resposta esperada:**
```json
[
  {
    "id": 1,
    "numero": "PED000001",
    "dataPedido": "2025-10-11T10:30:00",
    "status": "Confirmado",
    "produtos": [...],
    "historicoStatus": [...]
  }
]
```

---

#### **2. Buscar Detalhes de um Pedido**
```http
GET http://localhost:5000/pedido/1/detalhes
```

**Resposta esperada:**
```json
{
  "id": 1,
  "numero": "PED000001",
  "dataPedido": "2025-10-11T10:30:00",
  "produtos": [...],
  "qtdReserva": [...],
  "historicoStatus": [
    {"status": "Pendente", "data": "2025-10-11T10:30:00"},
    {"status": "Confirmado", "data": "2025-10-11T10:35:00"}
  ],
  "nomeCliente": "João Silva",
  "telefoneCliente": "5511999999999"
}
```

---

#### **3. Atualizar Status**
```http
PUT http://localhost:5000/reserva/1/status
Content-Type: application/json

{
  "status": "Preparando"
}
```

**Resposta esperada:**
```json
{
  "mensagem": "Status atualizado para Preparando com sucesso!",
  "status": "Preparando"
}
```

---

## ⚠️ **PROBLEMAS COMUNS E SOLUÇÕES**

### **1. SQL não aplicado**
```
Erro: "Unknown column 'numero_pedido'"
Solução: Executar atualizar_sistema_pedidos.sql no MySQL
```

### **2. Pedidos não aparecem**
```
Problema: Meus Pedidos vazio
Verificar:
- clienteInfo está no localStorage?
- Telefone está correto?
- Backend está rodando?
- Console do navegador tem erros?
```

### **3. Status não atualiza**
```
Problema: Status fica igual
Verificar:
- Endpoint PUT /reserva/:id/status está funcionando?
- Backend retorna sucesso?
- Polling de 30s está ativo?
```

### **4. Modal não abre**
```
Problema: Ver Detalhes não funciona
Verificar:
- Console do navegador (F12)
- Endpoint GET /pedido/:id/detalhes funciona?
- pedidoDetalhe está sendo populado?
```

### **5. Produtos não aparecem no modal**
```
Problema: Lista vazia
Verificar:
- JSON de produtos está parseado?
- caminhoImagem está correto?
- Backend retorna produtos e qtdReserva?
```

---

## ✅ **CHECKLIST DE VALIDAÇÃO FINAL**

### **Frontend - Cliente:**
- [ ] Criar pedido com sucesso
- [ ] Ver pedido em Meus Pedidos
- [ ] Status exibido corretamente
- [ ] Data formatada (DD de Mês de AAAA, HH:MM)
- [ ] Modal de detalhes abre
- [ ] Timeline de status funciona
- [ ] Botão "Pedir Novamente" funciona
- [ ] Filtros (Todos/Pendentes/Confirmados/Entregues) funcionam
- [ ] Atualização automática (30s) funciona
- [ ] Botão WhatsApp abre conversa

### **Frontend - Admin:**
- [ ] Pedidos listados em Gerenciamento
- [ ] Header com número do pedido
- [ ] Badge de status com cor correta
- [ ] Botão "Confirmar Pagamento" (se Pendente)
- [ ] Botão "Iniciar Preparação" (se Confirmado)
- [ ] Botão "Marcar como Pronto" (se Preparando)
- [ ] Botão "Marcar como Entregue" (se Pronto)
- [ ] Botão "Cancelar" sempre disponível
- [ ] Modais de confirmação funcionam
- [ ] Lista atualiza após ação

### **Backend:**
- [ ] POST /reserva cria pedido com campos novos
- [ ] GET /pedidos/cliente/:telefone retorna pedidos
- [ ] GET /pedido/:id/detalhes retorna detalhes completos
- [ ] PUT /reserva/:id/status atualiza status
- [ ] PUT /reserva/:id/confirmar atualiza para Confirmado
- [ ] PUT /reserva/:id/cancelar cancela e restaura estoque
- [ ] Histórico de status é registrado no JSON

### **Banco de Dados:**
- [ ] Tabela reserva tem novos campos
- [ ] numero_pedido é gerado automaticamente (PED + ID)
- [ ] data_pedido registra CURRENT_TIMESTAMP
- [ ] historico_status é JSON válido
- [ ] Índices criados corretamente

---

## 📊 **MÉTRICAS DE SUCESSO**

**Sistema considerado funcionando se:**

1. ✅ Cliente consegue criar pedido
2. ✅ Cliente vê pedido em tempo real (até 30s de atraso)
3. ✅ Admin consegue atualizar status sequencialmente
4. ✅ Cliente vê mudanças de status automaticamente
5. ✅ Modal de detalhes exibe informações completas
6. ✅ Timeline mostra histórico correto
7. ✅ Função "Pedir Novamente" carrega carrinho
8. ✅ Filtros funcionam corretamente
9. ✅ Cancelamento restaura estoque
10. ✅ Nenhum erro no console (backend ou frontend)

---

## 🎯 **TESTE DE STRESS (OPCIONAL)**

### **Criar múltiplos pedidos:**
```
1. Criar 5 pedidos seguidos
2. Verificar numeração sequencial (PED000001, PED000002...)
3. Admin vê todos os pedidos
4. Atualizar status de cada um individualmente
5. Cliente vê todos atualizando
```

### **Testar concorrência:**
```
1. Abrir 2 abas: Admin + Cliente
2. Admin atualiza status
3. Cliente vê mudança em tempo real (até 30s)
```

---

## 📝 **NOTAS IMPORTANTES**

1. **Atualização Automática:** Sistema usa polling de 30 segundos, não é instantâneo
2. **Status Case Sensitivity:** Backend usa "Pendente", "Confirmado" (capitalizados)
3. **Telefone:** Usar formato completo com DDI (5511999999999)
4. **Imagens:** Precisam estar em `backend/storage/` para exibir no modal
5. **Estoque:** Cancelamento restaura quantidade automaticamente

---

## 🚀 **PRÓXIMOS PASSOS APÓS VALIDAÇÃO**

Após todos os testes passarem:

1. ✅ **Integrar WhatsApp:** Notificações automáticas em cada mudança de status
2. ✅ **WebSocket:** Substituir polling por real-time
3. ✅ **Email:** Enviar confirmações por email
4. ✅ **Relatórios:** Dashboard com métricas de pedidos
5. ✅ **Histórico Avançado:** Filtrar por período, valor, produto

---

**Desenvolvido com ❤️ por GitHub Copilot**  
**Data:** 11/10/2025  
**Versão:** 1.0.0

