# 🔄 Atualiza��ões da VM Azure para Ambiente Local

**Data:** 25 de novembro de 2025  
**Versão:** 5.0  
**Status:** ✅ Concluído

---

## 📋 Resumo das Atualizações

Todas as melhorias implementadas e testadas na **VM Azure** foram aplicadas ao ambiente **local de desenvolvimento**, adaptadas para uso com `localhost`.

---

## 🔧 Alterações no Backend

### 1. **WhatsAppService - Migração para Evolution API**

**Arquivo:** `backend/src/services/whatsappService.js`

#### ✅ **Mudanças Aplicadas:**

**Antes (WhatsApp Business API - Facebook):**
```javascript
class WhatsAppService {
    constructor() {
        this.apiUrl = 'https://graph.facebook.com/v18.0';
        this.token = process.env.WHATSAPP_API_TOKEN || '';
        this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || '';
        this.businessPhone = process.env.WHATSAPP_BUSINESS_PHONE || '5511967696744';
        
        this.demoMode = !this.token || !this.phoneNumberId;
        
        if (this.demoMode) {
            console.warn('⚠️  WhatsApp Service rodando em MODO DEMO');
        }
    }
}
```

**Depois (Evolution API - Gratuita):**
```javascript
class WhatsAppService {
    constructor() {
        // Configurações Evolution API
        this.evolutionApiUrl = process.env.EVOLUTION_API_URL || 'http://localhost:8080';
        this.evolutionApiKey = process.env.EVOLUTION_API_KEY || '';
        this.evolutionInstance = process.env.EVOLUTION_INSTANCE_NAME || '';
        
        this.demoMode = !this.evolutionApiKey || !this.evolutionInstance;
        
        if (this.demoMode) {
            console.warn('⚠️  WhatsApp Service rodando em MODO DEMO (Evolution API não configurado)');
        } else {
            console.log('✅ WhatsApp conectado via Evolution API');
        }
    }
}
```

#### ✅ **Método `enviarMensagem()` Atualizado:**

**Antes:**
```javascript
const response = await axios.post(
    `${this.apiUrl}/${this.phoneNumberId}/messages`,
    {
        messaging_product: 'whatsapp',
        to: telefoneFormatado,
        type: 'text',
        text: { body: mensagem }
    },
    {
        headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
        }
    }
);
```

**Depois:**
```javascript
const response = await axios.post(
    `${this.evolutionApiUrl}/message/sendText/${this.evolutionInstance}`,
    {
        number: telefoneFormatado,
        textMessage: {
            text: mensagem
        },
        delay: 1200
    },
    {
        headers: {
            'apikey': this.evolutionApiKey,
            'Content-Type': 'application/json'
        }
    }
);
```

**📌 Diferenças Críticas:**
- ✅ Endpoint mudou de Facebook Graph API para Evolution API
- ✅ Estrutura do body mudou: `textMessage: { text: mensagem }`
- ✅ Header de autenticação mudou: `apikey` ao invés de `Authorization: Bearer`
- ✅ Adicionado `delay: 1200` para evitar bloqueios

---

### 2. **ReservaService - Notificações Automáticas de Status**

**Arquivo:** `backend/src/services/reservaService.js`

#### ✅ **Função `atualizarStatusPedido()` Melhorada:**

**Antes:**
```javascript
export async function atualizarStatusPedido(id, novoStatus) {
    try {
        // ...validações...
        
        const linhasAfetadas = await reservaRepository.atualizarStatusPedido(id, novoStatus);
        
        if (linhasAfetadas === 0) {
            throw new Error('Reserva não encontrada');
        }

        // TODO: Enviar notificação WhatsApp sobre mudança de status
        // await whatsappService.notificarMudancaStatus(id, novoStatus);

        return linhasAfetadas;
    } catch (error) {
        throw new Error(`Erro ao atualizar status: ${error.message}`);
    }
}
```

**Depois:**
```javascript
export async function atualizarStatusPedido(id, novoStatus) {
    try {
        // ...validações...
        
        const linhasAfetadas = await reservaRepository.atualizarStatusPedido(id, novoStatus);
        
        if (linhasAfetadas === 0) {
            throw new Error('Reserva não encontrada');
        }

        // ✅ Enviar notificação WhatsApp sobre mudança de status
        try {
            await enviarNotificacaoMudancaStatus(id, novoStatus);
        } catch (notifError) {
            console.error('Erro ao enviar notificação, mas status foi atualizado:', notifError.message);
        }

        return linhasAfetadas;
    } catch (error) {
        throw new Error(`Erro ao atualizar status: ${error.message}`);
    }
}
```

#### ✅ **Nova Função `enviarNotificacaoMudancaStatus()` Adicionada:**

```javascript
/**
 * Envia notificação WhatsApp quando o status do pedido muda
 * @param {number} idReserva - ID da reserva
 * @param {string} novoStatus - Novo status do pedido
 */
async function enviarNotificacaoMudancaStatus(idReserva, novoStatus) {
    try {
        // Buscar dados completos da reserva com cliente
        const reserva = await reservaRepository.buscarReservaPorId(idReserva);
        
        if (!reserva) {
            console.log(`Reserva ${idReserva} não encontrada para notificação`);
            return;
        }

        // Buscar dados do cliente
        const cliente = await reservaRepository.buscarClientePorReserva(idReserva);
        
        if (!cliente || !cliente.telefone) {
            console.log(`Cliente sem telefone para reserva ${idReserva}`);
            return;
        }

        // Montar objeto pedido no formato esperado pelo WhatsAppService
        const pedido = {
            id: reserva.id,
            idreserva: reserva.id,
            numero: reserva.numero_pedido || `PED${String(idReserva).padStart(6, '0')}`,
            total: reserva.valor_total || 0,
            metodoPagamento: reserva.pagamento || 'PIX',
            pontoEntrega: reserva.ponto_entrega || reserva.endereco_entrega || 'Loja principal',
            itens: [],
            cliente: {
                nome: cliente.nome || 'Cliente',
                telefone: cliente.telefone
            }
        };

        // Enviar notificação de acordo com o status
        switch (novoStatus) {
            case 'Confirmado':
                console.log(`📱 Enviando notificação de pagamento confirmado para ${cliente.telefone}`);
                await whatsappService.notificarPagamentoConfirmado(pedido);
                break;
            
            case 'Preparando':
                console.log(`📱 Enviando notificação de pedido em preparação para ${cliente.telefone}`);
                const mensagemPreparando = `⏳ *Pedido em Preparação!*\n\n` +
                    `Olá *${pedido.cliente.nome}*!\n\n` +
                    `Seu pedido *#${pedido.numero}* está sendo preparado com muito carinho! 🧁\n\n` +
                    `Em breve você receberá uma notificação quando estiver pronto.\n\n` +
                    `Obrigado pela preferência! 💜`;
                await whatsappService.enviarMensagem(
                    pedido.cliente.telefone,
                    mensagemPreparando,
                    pedido.idreserva,
                    'pedido_preparando'
                );
                break;
            
            case 'Pronto':
                console.log(`📱 Enviando notificação de pedido pronto para ${cliente.telefone}`);
                await whatsappService.notificarPedidoPronto(pedido);
                break;
            
            case 'Entregue':
                console.log(`📱 Enviando notificação de pedido entregue para ${cliente.telefone}`);
                await whatsappService.enviarAgradecimento(pedido);
                break;
            
            case 'Cancelado':
                console.log(`📱 Enviando notificação de cancelamento para ${cliente.telefone}`);
                await whatsappService.notificarCancelamento(pedido, 'Solicitado pelo cliente ou estabelecimento');
                break;
            
            default:
                console.log(`Status ${novoStatus} não requer notificação`);
        }
        
        console.log(`✅ Notificação de status ${novoStatus} processada para reserva ${idReserva}`);
        
    } catch (error) {
        console.error(`❌ Erro ao enviar notificação para reserva ${idReserva}:`, error.message);
        throw error;
    }
}
```

**📌 Notificações Automáticas Implementadas:**
- ✅ **Confirmado** → `notificarPagamentoConfirmado()`
- ✅ **Preparando** → Mensagem personalizada
- ✅ **Pronto** → `notificarPedidoPronto()`
- ✅ **Entregue** → `enviarAgradecimento()`
- ✅ **Cancelado** → `notificarCancelamento()`

---

### 3. **Variáveis de Ambiente Atualizadas**

**Arquivo:** `backend/.env`

#### ✅ **Mudança Aplicada:**

```diff
  # WhatsApp com Evolution API (Recomendado - Gratuito)
  WHATSAPP_PROVIDER=evolution
  EVOLUTION_API_URL=http://localhost:8080
  EVOLUTION_API_KEY=COLE_SUA_API_KEY_AQUI
- EVOLUTION_INSTANCE=segredodosabor
+ EVOLUTION_INSTANCE_NAME=segredodosabor
```

**📌 Motivo:** Consistência com o código que usa `process.env.EVOLUTION_INSTANCE_NAME`.

---

## 🎨 Frontend - Sem Mudanças Necessárias

### ✅ **Verificação Realizada:**

- ✅ Todos os arquivos do frontend local **JÁ** usam `http://localhost:5000`
- ✅ Não há referências hardcoded a URLs da Azure
- ✅ Estrutura de pastas e componentes idêntica

**Arquivos Verificados:**
- `frontend/src/context/AuthContext.js`
- `frontend/src/pages/catalogo/index.js`
- `frontend/src/pages/checkout/index.js`
- `frontend/src/pages/meusPedidos/index.js`
- `frontend/src/components/reservasAndamentos/index.js`
- E mais 50+ arquivos

**Resultado:** Nenhuma alteração necessária no frontend! ✅

---

## 🧪 Como Testar as Atualizações

### 1️⃣ **Iniciar Backend**

```bash
cd backend
npm start
```

**Saída esperada:**
```
✅ WhatsApp conectado via Evolution API
Servidor rodando na porta 5000
```

### 2️⃣ **Testar Notificações Automáticas**

#### **Via Painel Admin:**
1. Acesse http://localhost:3000/login
2. Login: `admin@segredodosabor.com` / `admin123`
3. Vá para "Reservas em Andamento"
4. Mude o status de um pedido (ex: Pendente → Confirmado)
5. Verifique os logs do backend no terminal

**Logs esperados:**
```
📱 Enviando notificação de pagamento confirmado para 5511946263047
✅ Mensagem WhatsApp enviada para 5511946263047
✅ Notificação de status Confirmado processada para reserva 43
```

#### **Via API (Postman/cURL):**

```bash
curl -X PUT http://localhost:5000/reserva/43/status \
  -H "Content-Type: application/json" \
  -d '{"status": "Pronto"}'
```

**Resposta esperada:**
```json
{
  "message": "Status atualizado com sucesso",
  "linhasAfetadas": 1
}
```

### 3️⃣ **Verificar Evolution API (Se Configurada)**

```bash
curl http://localhost:8080/instance/connectionState/segredodosabor \
  -H "apikey: SUA_API_KEY_AQUI"
```

**Resposta esperada:**
```json
{
  "instance": {
    "instanceName": "segredodosabor",
    "state": "open"
  }
}
```

---

## 📊 Comparação de Funcionalidades

| Funcionalidade | Antes (Azure) | Depois (Local) |
|----------------|---------------|----------------|
| **WhatsApp API** | ✅ Evolution API | ✅ Evolution API |
| **Notificações Automáticas** | ✅ 5 status | ✅ 5 status |
| **Endpoint API** | Azure DNS | `localhost:5000` |
| **Evolution API URL** | Azure VM | `localhost:8080` |
| **Modo Demo** | ❌ Desabilitado | ⚠️ Habilitado se sem API Key |
| **PM2** | ✅ Ativo | ⚙️ Opcional (desenvolvimento) |
| **Nginx** | ✅ Reverse Proxy | ⚙️ Opcional (desenvolvimento) |
| **SSL/HTTPS** | ✅ Let's Encrypt | ⚙️ Não necessário (localhost) |

---

## 🔐 Configuração da Evolution API Localmente

### **Opção 1: Docker (Recomendado)**

```bash
# Baixar e executar Evolution API
docker run -d \
  --name evolution-api \
  -p 8080:8080 \
  -e AUTHENTICATION_API_KEY=sua_chave_secreta_aqui \
  atendai/evolution-api:v1.8.0
```

### **Opção 2: Usar instância Azure (Temporário)**

```bash
# No .env local, aponte para a VM Azure
EVOLUTION_API_URL=http://20.168.13.56:8080
EVOLUTION_API_KEY=brc5k8t31uog0dvc8lbb5p
EVOLUTION_INSTANCE_NAME=segredodosabor
```

---

## ✅ Checklist de Validação

- [x] WhatsAppService migrado para Evolution API
- [x] Método `enviarMensagem()` atualizado com novo formato
- [x] ReservaService com notificações automáticas
- [x] Função `enviarNotificacaoMudancaStatus()` implementada
- [x] Variável `EVOLUTION_INSTANCE_NAME` corrigida no .env
- [x] Frontend verificado (sem mudanças necessárias)
- [x] Documentação completa criada

---

## 📚 Documentos Relacionados

- **ROTEIRO_VIDEO_AZURE.md** - Guia de demonstração da VM Azure
- **README.md** - Documentação principal atualizada
- **TUTORIAL_EVOLUTION_API_DOCKER_AZURE.md** - Tutorial completo Evolution API
- **ANALISE_REQUISITOS_FUNCIONAIS.md** - 65 RFs implementados

---

## 🎯 Próximos Passos

1. **Instalar Evolution API localmente via Docker**
2. **Conectar WhatsApp pessoal para testes**
3. **Testar todas as 5 notificações de status**
4. **Validar histórico de mensagens no banco**
5. **Documentar casos de uso e exemplos**

---

## 💡 Dicas de Desenvolvimento

### **Modo Demo (Sem Evolution API):**
- Sistema funciona normalmente
- Mensagens são logadas no console ao invés de enviadas
- Útil para desenvolvimento frontend

### **Logs Detalhados:**
```javascript
// No whatsappService.js, todas as mensagens têm logs:
console.log(`✅ Mensagem WhatsApp enviada para ${telefone}`);
console.error(`❌ Erro ao enviar WhatsApp:`, error);
```

### **Testar Sem Número Real:**
- Use telefones fictícios no banco
- Evolution API em modo demo retorna sucesso simulado
- Histórico de mensagens é gravado normalmente

---

## 🐛 Problemas Conhecidos e Soluções

### **1. Evolution API não conecta**

**Sintoma:**
```
⚠️  WhatsApp Service rodando em MODO DEMO
```

**Solução:**
```bash
# Verificar se Evolution API está rodando
docker ps | grep evolution

# Se não estiver, iniciar:
docker start evolution-api

# Verificar logs:
docker logs evolution-api
```

### **2. Notificações não chegam**

**Sintomas:**
- Status atualiza, mas sem notificação
- Logs mostram "Cliente sem telefone"

**Solução:**
```sql
-- Verificar telefones no banco
SELECT id, nome, telefone FROM clientes WHERE id IN (
    SELECT idcliente FROM reserva WHERE id = 43
);

-- Se telefone estiver NULL ou vazio, atualizar:
UPDATE clientes SET telefone = '5511946263047' WHERE id = X;
```

### **3. Erro "Bad Request 400"**

**Sintoma:**
```
❌ Erro ao enviar WhatsApp: Bad Request
```

**Solução:** Verificar formato da mensagem no código:
```javascript
// ✅ CORRETO (Evolution API)
{
    number: "5511946263047",
    textMessage: {
        text: "Sua mensagem aqui"
    }
}

// ❌ ERRADO (WhatsApp Business API)
{
    to: "5511946263047",
    text: { body: "Sua mensagem aqui" }
}
```

---

## 📞 Suporte

**Dúvidas sobre as atualizações?**
- Consulte o README.md principal
- Verifique os logs do backend (`npm start`)
- Teste com `curl` para isolar problemas
- Compare com código da pasta `backend-azure/`

---

**✅ Atualização concluída com sucesso!**

*Todas as melhorias da VM Azure agora estão disponíveis no ambiente local de desenvolvimento, totalmente adaptadas para `localhost`.*

---

**📅 Última atualização:** 25 de novembro de 2025  
**🔖 Versão:** 5.0.0  
**📜 Status:** Produção-Ready ✅
