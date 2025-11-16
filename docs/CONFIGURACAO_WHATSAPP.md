# 📱 Configuração WhatsApp Business API

## 🔍 **PROBLEMA IDENTIFICADO**

O sistema está enviando notificações via WhatsApp mas **rodando em MODO DEMO** porque as credenciais da WhatsApp Business API não estão configuradas no arquivo `.env`.

### Status Atual:
- ✅ Código de integração implementado
- ✅ Notificações configuradas para clientes e negócio
- ❌ **Credenciais da API não configuradas**
- ❌ Mensagens não estão sendo enviadas de verdade

---

## 🚀 **SOLUÇÃO: Como Ativar o WhatsApp Real**

### **Opção 1: WhatsApp Business API Oficial (Meta)**

#### Passo 1: Criar Conta Meta for Developers
1. Acesse: https://developers.facebook.com/
2. Crie uma conta ou faça login
3. Vá em **"Meus Aplicativos"** > **"Criar Aplicativo"**
4. Selecione **"Negócio"** como tipo
5. Preencha os dados da sua empresa

#### Passo 2: Adicionar WhatsApp Business
1. No painel do aplicativo, clique em **"Adicionar Produto"**
2. Selecione **"WhatsApp"** e clique em **"Configurar"**
3. Siga o assistente de configuração
4. Conecte ou crie um número de telefone comercial

#### Passo 3: Obter Credenciais
1. Na seção WhatsApp, vá em **"Início Rápido"**
2. Copie o **Token de Acesso** (temporário)
3. Copie o **ID do Número de Telefone**
4. Para token permanente:
   - Vá em **"Configurações"** > **"Básico"**
   - Crie um **Token de Acesso de Sistema**

#### Passo 4: Configurar no Projeto
Edite o arquivo `backend/.env`:

```env
# WhatsApp Business API (Meta)
WHATSAPP_API_TOKEN=seu_token_aqui
WHATSAPP_PHONE_NUMBER_ID=seu_phone_number_id_aqui
WHATSAPP_BUSINESS_PHONE=5511967696744
WHATSAPP_VERIFY_TOKEN=segredodosabor2025
```

#### Passo 5: Reiniciar o Backend
```bash
cd backend
npm start
```

---

### **Opção 2: Evolution API (Alternativa Gratuita)**

A **Evolution API** permite usar WhatsApp Web sem custos:

#### Passo 1: Instalar Evolution API
```bash
# Via Docker
docker run -d \
  --name evolution-api \
  -p 8080:8080 \
  atendai/evolution-api
```

Ou instalar manualmente: https://github.com/EvolutionAPI/evolution-api

#### Passo 2: Conectar WhatsApp
1. Acesse: http://localhost:8080
2. Crie uma instância
3. Escaneie o QR Code com o WhatsApp Business
4. Anote a **API Key** gerada

#### Passo 3: Atualizar o Código
Edite `backend/src/services/whatsappService.js`:

```javascript
// Substituir a classe WhatsAppService por:
import axios from 'axios';

class WhatsAppService {
    constructor() {
        // Evolution API
        this.apiUrl = process.env.EVOLUTION_API_URL || 'http://localhost:8080';
        this.apiKey = process.env.EVOLUTION_API_KEY || '';
        this.instanceName = process.env.EVOLUTION_INSTANCE || 'segredodosabor';
        
        this.demoMode = !this.apiKey;
        
        if (this.demoMode) {
            console.warn('⚠️  WhatsApp rodando em MODO DEMO');
        }
    }

    async enviarMensagem(telefone, mensagem) {
        if (this.demoMode) {
            console.log(`📱 [DEMO] WhatsApp para ${telefone}: ${mensagem}`);
            return { success: true, demo: true };
        }

        try {
            const response = await axios.post(
                `${this.apiUrl}/message/sendText/${this.instanceName}`,
                {
                    number: telefone,
                    text: mensagem
                },
                {
                    headers: {
                        'apikey': this.apiKey
                    }
                }
            );

            return { success: true, data: response.data };
        } catch (error) {
            console.error('Erro ao enviar WhatsApp:', error.message);
            throw new Error('Falha ao enviar mensagem WhatsApp');
        }
    }
    
    // Manter os outros métodos...
}

export default new WhatsAppService();
```

#### Passo 4: Configurar .env
```env
# Evolution API
EVOLUTION_API_URL=http://localhost:8080
EVOLUTION_API_KEY=sua_api_key_aqui
EVOLUTION_INSTANCE=segredodosabor
WHATSAPP_BUSINESS_PHONE=5511967696744
```

---

### **Opção 3: Twilio WhatsApp (Pago mas Fácil)**

#### Passo 1: Criar Conta Twilio
1. Acesse: https://www.twilio.com/
2. Cadastre-se (ganha US$ 15 de crédito grátis)
3. Vá em **"Messaging"** > **"Try it out"** > **"Send a WhatsApp message"**

#### Passo 2: Obter Credenciais
1. Copie **Account SID**
2. Copie **Auth Token**
3. Ative um número WhatsApp (sandbox ou oficial)

#### Passo 3: Atualizar o Código
```javascript
import twilio from 'twilio';

class WhatsAppService {
    constructor() {
        this.client = twilio(
            process.env.TWILIO_ACCOUNT_SID,
            process.env.TWILIO_AUTH_TOKEN
        );
        this.from = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886';
    }

    async enviarMensagem(telefone, mensagem) {
        try {
            const message = await this.client.messages.create({
                from: this.from,
                to: `whatsapp:+${telefone}`,
                body: mensagem
            });

            return { success: true, data: message };
        } catch (error) {
            console.error('Erro Twilio:', error.message);
            throw new Error('Falha ao enviar WhatsApp');
        }
    }
}
```

#### Passo 4: Instalar e Configurar
```bash
npm install twilio
```

```env
# Twilio
TWILIO_ACCOUNT_SID=seu_account_sid
TWILIO_AUTH_TOKEN=seu_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
WHATSAPP_BUSINESS_PHONE=5511967696744
```

---

## 🎯 **RECOMENDAÇÃO**

Para o seu caso (`5511967696744`), recomendo:

### **CURTO PRAZO (Grátis):**
✅ **Evolution API** - Conecta direto com WhatsApp Web
- ✅ Gratuito
- ✅ Fácil de configurar
- ✅ Usa seu próprio número
- ❌ Requer WhatsApp Web conectado

### **LONGO PRAZO (Profissional):**
✅ **WhatsApp Business API (Meta)** - Solução oficial
- ✅ Profissional e confiável
- ✅ Suporta templates aprovados
- ✅ Métricas e analytics
- ❌ Requer aprovação da Meta
- ❌ Pode ter custos (após limite gratuito)

---

## 🔧 **TESTE RÁPIDO (Sem Configurar API)**

Para testar o fluxo sem configurar APIs, o sistema já funciona em **MODO DEMO**:

1. Os logs aparecerão no console do backend:
```
📱 [DEMO] WhatsApp para 5511999999999: 🎉 Pedido Confirmado!
Olá João Silva!
Recebemos seu pedido #PED000123...
```

2. A interface mostrará: **"Notificação enviada via WhatsApp"**

3. Para ativar o envio real, basta configurar uma das opções acima.

---

## 📊 **COMPARAÇÃO DAS OPÇÕES**

| Recurso | Meta API | Evolution API | Twilio |
|---------|----------|---------------|--------|
| **Custo** | Grátis até 1k msgs/mês | Grátis | US$ 0.005/msg |
| **Configuração** | Média | Fácil | Muito Fácil |
| **Confiabilidade** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Aprovação** | Sim (para produção) | Não | Não (sandbox) |
| **Templates** | Sim | Não | Sim |
| **Próprio Número** | Sim | Sim | Não (número Twilio) |

---

## ✅ **CHECKLIST DE ATIVAÇÃO**

- [ ] Escolher opção (Meta, Evolution ou Twilio)
- [ ] Criar conta na plataforma escolhida
- [ ] Obter credenciais (Token, API Key, etc)
- [ ] Atualizar arquivo `backend/.env`
- [ ] Reiniciar o servidor backend
- [ ] Fazer pedido de teste
- [ ] Verificar se WhatsApp chegou no `5511967696744`
- [ ] Verificar se cliente recebeu confirmação

---

## 🆘 **SUPORTE**

Se precisar de ajuda:
1. Verifique os logs do backend (`console.log`)
2. Confirme que o `.env` está configurado
3. Teste primeiro com Evolution API (mais simples)
4. Documente erros e mensagens para análise

---

## 📝 **LOGS IMPORTANTES**

Quando funcionando corretamente, você verá:
```
✅ WhatsApp enviado para 5511999999999 - Pedido PED000123
✅ Notificação enviada para WhatsApp Business: PED000123
```

Quando em modo demo:
```
⚠️  WhatsApp Service rodando em MODO DEMO (variáveis de ambiente não configuradas)
📱 [DEMO] WhatsApp para 5511999999999: 🎉 Pedido Confirmado!...
```

---

**Criado em:** 04/10/2025  
**Status:** Sistema funcionando em MODO DEMO - Aguardando configuração de API
