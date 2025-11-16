# 📱 Evolution API - WhatsApp Integration for Docegest

<div align="center">

![Evolution API](https://img.shields.io/badge/Evolution-API-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Azure](https://img.shields.io/badge/Azure-Ready-0078D4?style=for-the-badge&logo=microsoft-azure&logoColor=white)
![Status](https://img.shields.io/badge/Status-Production%20Ready-success?style=for-the-badge)

**Automação completa de WhatsApp para notificações de pedidos do sistema Docegest**

[📖 Tutorial Completo](#tutorial-completo) • [🚀 Quick Start](#quick-start) • [📚 Documentação](#documentação) • [🐛 Troubleshooting](#troubleshooting)

</div>

---

## 🎯 O que é Evolution API?

**Evolution API** é uma solução open-source que permite integrar o WhatsApp ao seu sistema sem custos de API oficial da Meta. Conecta-se via WhatsApp Web e oferece:

- ✅ **100% Gratuito** - Sem custos de API
- ✅ **Fácil Setup** - QR Code para conectar
- ✅ **Docker Ready** - Deploy em containers
- ✅ **Multi-Instância** - Múltiplos números WhatsApp
- ✅ **Webhook Support** - Receber mensagens
- ✅ **Rich Media** - Texto, imagem, áudio, vídeo, documentos
- ✅ **Persistente** - Mantém conexão após restart

---

## 🌟 Features do Docegest + Evolution API

### Notificações Automáticas

- 📦 **Confirmação de Pedido** - Cliente recebe confirmação instantânea
- 💰 **Resumo de Compra** - Itens, valores, forma de pagamento
- 🔢 **Código de Rastreamento** - Código único do pedido (ex: #PED000123)
- ⏰ **Previsão de Entrega** - Tempo estimado
- 📍 **Status de Entrega** - Atualizações em tempo real
- 🎂 **Reservas** - Confirmação de reservas de produtos

### Notificações para Negócio

- 🔔 **Novo Pedido** - Alerta instantâneo para loja
- 📊 **Relatório Diário** - Resumo de vendas
- ⚠️ **Alertas de Estoque** - Produtos acabando
- 💳 **Confirmação de Pagamento** - PIX recebido

---

## 🚀 Quick Start

### Pré-requisitos

- ✅ VM Azure (B2s recomendado, Ubuntu 22.04)
- ✅ Docker instalado
- ✅ Número WhatsApp Business exclusivo
- ✅ 10 minutos do seu tempo

### Instalação em 3 Passos

```bash
# 1. Conectar na VM
ssh -i sua-chave.pem azureuser@SEU_IP

# 2. Baixar e executar script
curl -sSL https://raw.githubusercontent.com/VitorGeovani/docegest/main/install-evolution-docegest.sh -o install.sh
chmod +x install.sh
./install.sh

# 3. Conectar WhatsApp
# Acesse: http://SEU_IP:8080
# Manager → Create Instance → Scan QR Code
```

✅ **Pronto!** WhatsApp conectado e funcionando.

---

## 📖 Tutorial Completo

Temos 4 guias completos para você:

### 1. 📘 [TUTORIAL_EVOLUTION_API_DOCKER_AZURE.md](./TUTORIAL_EVOLUTION_API_DOCKER_AZURE.md)
**Tutorial passo a passo completo (45 min)**
- Criar VM no Azure Education
- Instalar Docker e dependências
- Configurar Evolution API
- Integrar com Docegest
- Setup de produção completo

### 2. ✅ [CHECKLIST_EVOLUTION_API_AZURE.md](./CHECKLIST_EVOLUTION_API_AZURE.md)
**Checklist prático de validação**
- Lista de verificação passo a passo
- Validação de cada etapa
- Testes E2E
- Monitoramento

### 3. ⚡ [COMANDOS_RAPIDOS_EVOLUTION.md](./COMANDOS_RAPIDOS_EVOLUTION.md)
**Referência rápida de comandos**
- Comandos Docker
- Gerenciamento Evolution API
- Backup e restore
- Troubleshooting

### 4. 🐳 [docker-compose-completo.yml](./docker-compose-completo.yml)
**Docker Compose pronto para usar**
- Evolution API + MySQL + Backend + Frontend
- Tudo em containers
- Deploy com 1 comando

---

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────────────────┐
│                         VM Azure (Ubuntu 22.04)                  │
│                                                                   │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │  Evolution API  │  │  Backend Node   │  │   MySQL 8.0     │ │
│  │   Docker :8080  │←→│   PM2 :5000     │←→│   :3306         │ │
│  └────────┬────────┘  └─────────────────┘  └─────────────────┘ │
│           │                                                       │
│           │ WhatsApp Web Protocol                                │
│           ↓                                                       │
│  ┌─────────────────┐                                             │
│  │  WhatsApp Web   │                                             │
│  │   Connection    │                                             │
│  └─────────────────┘                                             │
└───────────────────────────────────────────────────────────────────┘
                         │
                         ↓
                ┌────────────────┐
                │  WhatsApp      │
                │  Business      │
                │  (Celular)     │
                └────────────────┘
```

---

## 📦 Estrutura de Arquivos

```
docegest/
├── 📄 TUTORIAL_EVOLUTION_API_DOCKER_AZURE.md    # Tutorial completo
├── ✅ CHECKLIST_EVOLUTION_API_AZURE.md          # Checklist validação
├── ⚡ COMANDOS_RAPIDOS_EVOLUTION.md             # Comandos úteis
├── 🐳 docker-compose-completo.yml               # Docker Compose
├── 🔧 install-evolution-docegest.sh             # Script instalação
│
├── backend/
│   ├── 🐳 Dockerfile                            # Backend container
│   ├── .env.example                             # Variáveis ambiente
│   ├── src/
│   │   ├── services/
│   │   │   ├── whatsappService_EVOLUTION.js    # Service Evolution
│   │   │   └── whatsappService.js              # Service abstrato
│   │   └── controller/
│   │       └── whatsappController.js           # Controller WhatsApp
│   └── testar-evolution-api.js                 # Script de teste
│
└── frontend/
    ├── 🐳 Dockerfile                            # Frontend container
    ├── nginx.conf                               # Nginx config
    └── ...
```

---

## ⚙️ Configuração

### Variáveis de Ambiente (.env)

```env
# WhatsApp com Evolution API
WHATSAPP_PROVIDER=evolution
EVOLUTION_API_URL=http://localhost:8080
EVOLUTION_API_KEY=sua_api_key_super_secreta_aqui
EVOLUTION_INSTANCE=docegest-whatsapp

# Configuração Geral
WHATSAPP_BUSINESS_PHONE=5511967696744
```

### Docker Compose Mínimo

```yaml
version: '3.8'
services:
  evolution-api:
    image: atendai/evolution-api:latest
    ports:
      - "8080:8080"
    environment:
      - AUTHENTICATION_API_KEY=sua_chave_aqui
      - SERVER_URL=http://SEU_IP:8080
    volumes:
      - ./instances:/evolution/instances
      - ./store:/evolution/store
```

---

## 🧪 Testando a Integração

### 1. Via curl

```bash
# Enviar mensagem teste
curl -X POST http://localhost:8080/message/sendText/docegest-whatsapp \
  -H "Content-Type: application/json" \
  -H "apikey: SUA_API_KEY" \
  -d '{
    "number": "5511967696744",
    "text": "🎉 Teste Evolution API - Docegest"
  }'
```

### 2. Via Backend Docegest

```bash
cd backend
node testar-evolution-api.js
```

### 3. Via Interface Web

```
http://SEU_IP:8080/manager
```

---

## 📊 Monitoramento

### Status Dashboard

```bash
# Executar script de status
~/status.sh
```

**Output esperado:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   📊 STATUS DOCEGEST + EVOLUTION API
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🐳 DOCKER:
evolution-api   Up 2 days   0.0.0.0:8080->8080/tcp

⚙️  PM2:
docegest-backend  online    1       0s      0%      45.2mb

🗄️  MYSQL:
active

💾 DISCO:
Usado: 8.2G de 30G (28%)

🧠 MEMÓRIA:
Usado: 2.1G de 4.0G
```

### Healthchecks

```bash
# Evolution API
curl http://localhost:8080

# Backend
curl http://localhost:5000/api/health

# WhatsApp Status
curl -X GET http://localhost:8080/instance/connectionState/docegest-whatsapp \
  -H "apikey: SUA_API_KEY"
```

### Logs

```bash
# Evolution API
docker logs -f evolution-api

# Backend
pm2 logs docegest-backend

# Sistema
sudo journalctl -f
```

---

## 💾 Backup e Restore

### Backup Automático (Diário às 2h)

```bash
# Ver backups
ls -lh ~/backups/

# Backup manual
~/backup-evolution.sh
```

### Restore

```bash
# Parar serviços
cd ~/evolution-api && docker compose down

# Restaurar Evolution API
tar -xzf ~/backups/evolution_20250116.tar.gz -C ~/evolution-api/

# Restaurar MySQL
mysql -u docegest -p segredodosabor < ~/backups/database_20250116.sql

# Reiniciar
docker compose up -d
pm2 restart all
```

---

## 🐛 Troubleshooting

### Problema: Evolution API não inicia

**Solução:**
```bash
# Ver logs
docker logs evolution-api

# Verificar porta
sudo lsof -i :8080

# Reiniciar
cd ~/evolution-api && docker compose restart
```

### Problema: WhatsApp desconecta

**Causas comuns:**
- WhatsApp aberto em outro dispositivo
- Celular sem internet
- QR Code expirado

**Solução:**
```bash
# Reconectar
curl -X GET http://localhost:8080/instance/connect/docegest-whatsapp \
  -H "apikey: SUA_API_KEY"

# Se não resolver, deletar e recriar instância
```

### Problema: Mensagens não chegam

**Verificações:**
```bash
# 1. Status da conexão
curl -X GET http://localhost:8080/instance/connectionState/docegest-whatsapp \
  -H "apikey: SUA_API_KEY"

# 2. Formato do número (correto: 5511967696744)
# 3. Backend conectado no Evolution?
cat ~/docegest/backend/.env | grep EVOLUTION
```

### Mais Troubleshooting

📖 Ver guia completo: [COMANDOS_RAPIDOS_EVOLUTION.md](./COMANDOS_RAPIDOS_EVOLUTION.md#troubleshooting)

---

## 🔒 Segurança

### Recomendações

- ✅ **API Key Forte** - Mínimo 32 caracteres aleatórios
- ✅ **Firewall Ativo** - UFW configurado
- ✅ **Acesso Restrito** - Evolution API atrás de Nginx com autenticação
- ✅ **SSL/HTTPS** - Certificado Let's Encrypt
- ✅ **Backups Diários** - Automatizados
- ✅ **Monitoramento** - Healthchecks ativos

### Gerar API Key Segura

```bash
# Gerar chave aleatória
openssl rand -base64 32

# Ou
openssl rand -hex 32
```

---

## 📈 Performance

### Recursos Recomendados

| Componente | CPU | RAM | Disco | Observação |
|------------|-----|-----|-------|------------|
| Evolution API | 1 vCPU | 1 GB | 10 GB | Mínimo |
| Backend Node | 1 vCPU | 512 MB | 5 GB | Mínimo |
| MySQL | 1 vCPU | 1 GB | 20 GB | Mínimo |
| **Total VM** | **2 vCPUs** | **4 GB** | **50 GB** | **Recomendado** |

**VM Azure:** Standard_B2s (2 vCPUs, 4 GB RAM) - ~R$ 60/mês

---

## 🆙 Atualizações

### Atualizar Evolution API

```bash
cd ~/evolution-api

# Baixar versão mais recente
docker compose pull

# Recriar container
docker compose up -d --force-recreate

# Verificar versão
docker logs evolution-api | grep "version"
```

### Atualizar Backend

```bash
cd ~/docegest
git pull origin main

cd backend
npm install
pm2 restart docegest-backend
```

---

## 🤝 Contribuindo

Encontrou um bug? Tem uma sugestão? Abra uma issue ou pull request!

- **Issues:** https://github.com/VitorGeovani/docegest/issues
- **Evolution API Issues:** https://github.com/EvolutionAPI/evolution-api/issues

---

## 📚 Recursos Adicionais

### Documentação Oficial

- **Evolution API:** https://doc.evolution-api.com/
- **Evolution GitHub:** https://github.com/EvolutionAPI/evolution-api
- **Docker:** https://docs.docker.com/
- **Azure VM:** https://learn.microsoft.com/azure/virtual-machines/

### Comunidade

- **Discord Evolution API:** https://evolution-api.com/discord
- **Stack Overflow:** Tag `evolution-api`

### Vídeos e Tutoriais

- Tutorial em vídeo (em breve)
- Playlist YouTube (em breve)

---

## 📝 Licença

Este projeto está sob a licença MIT.

---

## 💬 Suporte

**Precisa de ajuda?**

1. 📖 Consulte a [documentação completa](./TUTORIAL_EVOLUTION_API_DOCKER_AZURE.md)
2. 🔍 Verifique [troubleshooting](./COMANDOS_RAPIDOS_EVOLUTION.md#troubleshooting)
3. 🐛 Abra uma [issue no GitHub](https://github.com/VitorGeovani/docegest/issues)

---

<div align="center">

**Desenvolvido com ❤️ para o Docegest**

[⬆ Voltar ao topo](#-evolution-api---whatsapp-integration-for-docegest)

</div>
