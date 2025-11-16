# 🚀 Tutorial Completo: Evolution API + WhatsApp + Docker + Azure Education

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Pré-requisitos](#pré-requisitos)
3. [Parte 1: Preparar VM no Azure](#parte-1-preparar-vm-no-azure)
4. [Parte 2: Instalar Docker na VM](#parte-2-instalar-docker-na-vm)
5. [Parte 3: Instalar Evolution API](#parte-3-instalar-evolution-api)
6. [Parte 4: Conectar WhatsApp](#parte-4-conectar-whatsapp)
7. [Parte 5: Integrar com Docegest](#parte-5-integrar-com-docegest)
8. [Parte 6: Configurar Persistência](#parte-6-configurar-persistência)
9. [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

Este tutorial ensina como configurar o **Evolution API** para enviar mensagens WhatsApp automaticamente pelo sistema **Docegest**, rodando em **Docker** dentro de uma **VM Azure Education** (100% gratuito).

### O que você terá ao final:
- ✅ Evolution API rodando em container Docker
- ✅ WhatsApp Business conectado e funcionando
- ✅ Integração completa com sistema Docegest
- ✅ Notificações automáticas de pedidos
- ✅ Dados persistentes (não perde conexão ao reiniciar)
- ✅ Acesso via IP público do Azure

### Tempo estimado: 45 minutos

---

## 📋 Pré-requisitos

### 1. Conta Azure Education
- [ ] Conta criada em: https://azure.microsoft.com/pt-br/free/students/
- [ ] Crédito de $100 USD disponível
- [ ] Acesso ao Portal Azure

### 2. Número WhatsApp Business
- [ ] Um chip/número exclusivo para o sistema
- [ ] WhatsApp Business instalado no celular
- [ ] Número não pode estar em uso em outro WhatsApp Web

### 3. Conhecimentos Básicos
- [ ] Comandos básicos de terminal Linux
- [ ] Conceitos de Docker (não precisa ser expert)
- [ ] SSH (apenas copiar e colar comandos)

---

## 🌐 Parte 1: Preparar VM no Azure

### Passo 1.1: Criar VM no Portal Azure

1. **Acessar Portal Azure**
   - Vá para: https://portal.azure.com
   - Faça login com sua conta educacional

2. **Criar Máquina Virtual**
   ```
   Portal Azure > Criar um recurso > Máquina Virtual
   ```

3. **Configurações Recomendadas**

   **Básico:**
   - **Assinatura:** Azure for Students
   - **Grupo de recursos:** Criar novo → `docegest-rg`
   - **Nome da VM:** `docegest-vm`
   - **Região:** Brazil South (ou mais próxima)
   - **Imagem:** Ubuntu Server 22.04 LTS
   - **Tamanho:** Standard_B2s (2 vCPUs, 4 GB RAM)
     - ⚠️ **Importante:** B1s (1 GB RAM) pode não ser suficiente para Evolution API
   
   **Conta de Administrador:**
   - **Tipo de autenticação:** Chave pública SSH
   - **Nome de usuário:** `azureuser`
   - **Nome da chave:** `docegest-key`
   - ✅ Baixar chave privada (.pem)

   **Regras de porta de entrada:**
   - ✅ SSH (22)
   - ✅ HTTP (80)
   - ✅ HTTPS (443)

4. **Adicionar Portas Personalizadas**
   
   Após criar a VM, vá em:
   ```
   VM > Rede > Adicionar regra de porta de entrada
   ```
   
   Adicione estas portas:
   
   | Nome | Porta | Protocolo | Prioridade |
   |------|-------|-----------|------------|
   | Evolution-API | 8080 | TCP | 1001 |
   | Backend-Node | 5000 | TCP | 1002 |
   | Frontend-React | 3000 | TCP | 1003 |
   | MySQL | 3306 | TCP | 1004 |

5. **Revisar e Criar**
   - Clique em **"Revisar + criar"**
   - Aguarde validação
   - Clique em **"Criar"**
   - ⏳ Aguarde ~5 minutos

6. **Anotar IP Público**
   ```
   VM > Visão Geral > Endereço IP público
   ```
   Exemplo: `20.206.123.45`
   
   📝 **Anote este IP!** Você vai usar muito.

---

### Passo 1.2: Conectar via SSH

#### No Windows (PowerShell):

```powershell
# 1. Ir para pasta da chave baixada
cd C:\Users\SeuUsuario\Downloads

# 2. Configurar permissões da chave
icacls "docegest-key.pem" /inheritance:r
icacls "docegest-key.pem" /grant:r "%username%:R"

# 3. Conectar na VM (TROCAR pelo seu IP!)
ssh -i docegest-key.pem azureuser@20.206.123.45
```

#### No Linux/Mac:

```bash
# 1. Ir para pasta da chave
cd ~/Downloads

# 2. Configurar permissões
chmod 400 docegest-key.pem

# 3. Conectar na VM (TROCAR pelo seu IP!)
ssh -i docegest-key.pem azureuser@20.206.123.45
```

**Aceitar fingerprint:**
```
Are you sure you want to continue connecting? yes
```

✅ **Pronto!** Você está dentro da VM Azure.

---

## 🐳 Parte 2: Instalar Docker na VM

### Passo 2.1: Atualizar Sistema

```bash
# Atualizar lista de pacotes
sudo apt update

# Atualizar pacotes instalados
sudo apt upgrade -y
```

### Passo 2.2: Instalar Docker

```bash
# Instalar dependências
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

# Adicionar chave GPG do Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Adicionar repositório Docker
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Atualizar e instalar Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Verificar instalação
docker --version
```

**Saída esperada:**
```
Docker version 24.0.x, build xxxxx
```

### Passo 2.3: Configurar Permissões Docker

```bash
# Adicionar usuário ao grupo docker
sudo usermod -aG docker $USER

# Ativar grupo (ou relogue via SSH)
newgrp docker

# Testar sem sudo
docker ps
```

**Saída esperada:**
```
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
```

✅ **Docker instalado com sucesso!**

---

## 📱 Parte 3: Instalar Evolution API

### Passo 3.1: Criar Estrutura de Pastas

```bash
# Criar pasta para Evolution API
mkdir -p ~/evolution-api
cd ~/evolution-api

# Criar pastas para dados persistentes
mkdir -p instances
mkdir -p store
```

### Passo 3.2: Criar docker-compose.yml

```bash
# Criar arquivo de configuração
nano docker-compose.yml
```

**Cole este conteúdo:**

```yaml
version: '3.8'

services:
  evolution-api:
    container_name: evolution-api
    image: atendai/evolution-api:latest
    restart: always
    ports:
      - "8080:8080"
    environment:
      # Configurações Básicas
      - SERVER_URL=http://SEU_IP_AZURE:8080
      - CORS_ORIGIN=*
      - CORS_METHODS=GET,POST,PUT,DELETE
      - CORS_CREDENTIALS=true
      
      # Autenticação Global (CRIE UMA SENHA FORTE!)
      - AUTHENTICATION_API_KEY=docegest_evolution_2025_super_secret_key_12345
      
      # Configurações de Instância
      - CONFIG_SESSION_PHONE_CLIENT=Docegest
      - CONFIG_SESSION_PHONE_NAME=Chrome
      
      # Armazenamento Local
      - STORE_MESSAGES=true
      - STORE_MESSAGE_UP=true
      - STORE_CONTACTS=true
      - STORE_CHATS=true
      
      # Database (SQLite local)
      - DATABASE_ENABLED=true
      - DATABASE_CONNECTION=sqlite
      - DATABASE_CONNECTION_SQLITE_DB_NAME=evolution.sqlite3
      
      # Logs
      - LOG_LEVEL=ERROR
      - LOG_COLOR=true
      - LOG_BAILEYS=false
      
      # Webhooks (deixe vazio por enquanto)
      - WEBHOOK_GLOBAL_ENABLED=false
      - WEBHOOK_GLOBAL_URL=
      - WEBHOOK_GLOBAL_WEBHOOK_BY_EVENTS=false
      
      # QR Code
      - QRCODE_LIMIT=30
      - QRCODE_COLOR=#198754
      
      # Configurações de Conexão
      - CONNECTION_TIMEOUT=60000
      
    volumes:
      - ./instances:/evolution/instances
      - ./store:/evolution/store
    
    networks:
      - evolution-network

networks:
  evolution-network:
    driver: bridge
```

**Salvar e sair:**
- Pressione `CTRL + O` (salvar)
- Pressione `ENTER`
- Pressione `CTRL + X` (sair)

**⚠️ IMPORTANTE:** 
- Troque `SEU_IP_AZURE` pelo IP público da sua VM
- Troque a `AUTHENTICATION_API_KEY` por uma senha forte única

### Passo 3.3: Iniciar Evolution API

```bash
# Iniciar container
docker compose up -d

# Verificar se está rodando
docker ps

# Ver logs
docker logs evolution-api -f
```

**Saída esperada:**
```
✓ Container evolution-api  Started
```

**Logs esperados:**
```
🚀 Evolution API is running on port 8080
📱 Access: http://SEU_IP:8080
🔑 API Key: docegest_evolution_2025_super_secret_key_12345
```

✅ **Evolution API instalado!**

### Passo 3.4: Testar Acesso

No seu navegador:
```
http://SEU_IP_AZURE:8080
```

Você deve ver a interface do Evolution API.

---

## 📲 Parte 4: Conectar WhatsApp

### Passo 4.1: Criar Instância WhatsApp

**Via Interface Web:**

1. Acesse: `http://SEU_IP_AZURE:8080`
2. Clique em **"Manager"** no menu superior
3. Clique em **"Create Instance"**

**Configurações da Instância:**
```
Instance Name: docegest-whatsapp
Webhook URL: (deixe vazio por enquanto)
Webhook by Events: false
Reject Call: false
Msg Call: (vazio)
Groups Ignore: false
Always Online: true
Read Messages: true
Read Status: true
Sync Full History: true
```

4. Clique em **"Create"**

**Via API (alternativa):**

```bash
# Criar instância via curl
curl -X POST http://SEU_IP_AZURE:8080/instance/create \
  -H "Content-Type: application/json" \
  -H "apikey: docegest_evolution_2025_super_secret_key_12345" \
  -d '{
    "instanceName": "docegest-whatsapp",
    "qrcode": true,
    "integration": "WHATSAPP-BAILEYS"
  }'
```

### Passo 4.2: Conectar WhatsApp via QR Code

**Via Interface Web:**

1. Na lista de instâncias, clique em **"Connect"** na instância `docegest-whatsapp`
2. Um QR Code aparecerá na tela
3. No seu celular:
   - Abra o **WhatsApp Business**
   - Toque nos **3 pontinhos** > **Aparelhos conectados**
   - Toque em **"Conectar um aparelho"**
   - **Escaneie o QR Code** que apareceu no navegador
4. Aguarde ~10 segundos
5. Status deve mudar para: ✅ **"Connected"**

**Via API (alternativa):**

```bash
# Obter QR Code
curl -X GET http://SEU_IP_AZURE:8080/instance/connect/docegest-whatsapp \
  -H "apikey: docegest_evolution_2025_super_secret_key_12345"
```

O QR Code será exibido no terminal (formato base64). Cole em um decodificador online ou use a interface web.

### Passo 4.3: Verificar Conexão

**Teste enviando mensagem para você mesmo:**

```bash
# Enviar mensagem de teste (TROCAR 5511967696744 pelo seu número!)
curl -X POST http://SEU_IP_AZURE:8080/message/sendText/docegest-whatsapp \
  -H "Content-Type: application/json" \
  -H "apikey: docegest_evolution_2025_super_secret_key_12345" \
  -d '{
    "number": "5511967696744",
    "text": "🎉 Evolution API conectado com sucesso! Sistema Docegest ativo."
  }'
```

**Verificar info da instância:**

```bash
curl -X GET http://SEU_IP_AZURE:8080/instance/connectionState/docegest-whatsapp \
  -H "apikey: docegest_evolution_2025_super_secret_key_12345"
```

**Resposta esperada:**
```json
{
  "instance": {
    "instanceName": "docegest-whatsapp",
    "state": "open"
  }
}
```

✅ **WhatsApp conectado!**

---

## 🔗 Parte 5: Integrar com Docegest

### Passo 5.1: Instalar Backend Docegest

```bash
# Voltar para home
cd ~

# Clonar repositório (ou fazer upload dos arquivos)
# Opção 1: Git
git clone https://github.com/VitorGeovani/docegest.git
cd docegest/backend

# Opção 2: Upload manual via SCP (do seu PC)
# scp -i docegest-key.pem -r D:\Downloads\Segredo-do-Sabor azureuser@SEU_IP:~/
```

### Passo 5.2: Instalar Node.js e MySQL

```bash
# Instalar Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verificar
node --version
npm --version

# Instalar MySQL
sudo apt install -y mysql-server

# Configurar MySQL
sudo mysql_secure_installation
```

**Configuração MySQL:**
```
- Set root password? Y → Digite: P@$$w0rd
- Remove anonymous users? Y
- Disallow root login remotely? N (para acessar de fora)
- Remove test database? Y
- Reload privilege tables? Y
```

### Passo 5.3: Criar Banco de Dados

```bash
# Entrar no MySQL
sudo mysql -u root -p
# Senha: P@$$w0rd
```

**Executar comandos SQL:**

```sql
-- Criar banco
CREATE DATABASE segredodosabor CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Criar usuário
CREATE USER 'docegest'@'%' IDENTIFIED BY 'Docegest@2025';

-- Dar permissões
GRANT ALL PRIVILEGES ON segredodosabor.* TO 'docegest'@'%';
FLUSH PRIVILEGES;

-- Sair
EXIT;
```

### Passo 5.4: Importar Estrutura do Banco

```bash
# Importar schema (ajuste o caminho se necessário)
cd ~/docegest
mysql -u docegest -p segredodosabor < BANCO_DADOS_COMPLETO.sql
# Senha: Docegest@2025
```

### Passo 5.5: Configurar .env do Backend

```bash
cd ~/docegest/backend

# Criar .env baseado no exemplo
cp .env.example .env

# Editar .env
nano .env
```

**Cole esta configuração (ajustar IPs/senhas):**

```env
# Porta do servidor
PORT=5000

# Configurações do banco de dados
DB_HOST=localhost
DB_DATABASE=segredodosabor
DB_USER=docegest
DB_PASSWORD=Docegest@2025

# JWT Authentication
JWT_SECRET=segredodosabor_secret_2025
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=segredodosabor_refresh_2025
JWT_REFRESH_EXPIRES_IN=30d

# WhatsApp com Evolution API
WHATSAPP_PROVIDER=evolution
EVOLUTION_API_URL=http://localhost:8080
EVOLUTION_API_KEY=docegest_evolution_2025_super_secret_key_12345
EVOLUTION_INSTANCE=docegest-whatsapp

# Configuração Geral
WHATSAPP_BUSINESS_PHONE=5511967696744
WHATSAPP_VERIFY_TOKEN=segredodosabor2025
```

**Salvar:** `CTRL + O` → `ENTER` → `CTRL + X`

### Passo 5.6: Instalar Dependências e Iniciar Backend

```bash
# Instalar dependências
npm install

# Criar usuário admin
node criar-admin.js

# Iniciar backend
npm start
```

**Ou rodar em background com PM2:**

```bash
# Instalar PM2
sudo npm install -g pm2

# Iniciar backend
pm2 start npm --name "docegest-backend" -- start

# Ver logs
pm2 logs docegest-backend

# Configurar para iniciar com o sistema
pm2 startup
pm2 save
```

### Passo 5.7: Testar Integração WhatsApp

```bash
# Testar envio via backend
cd ~/docegest/backend
node testar-evolution-api.js
```

**Ou via curl:**

```bash
# Fazer login e pegar token
TOKEN=$(curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@segredodosabor.com","password":"admin123"}' \
  | jq -r '.token')

# Criar pedido de teste (vai enviar WhatsApp)
curl -X POST http://localhost:5000/api/pedidos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "cliente_nome": "Teste Evolution",
    "cliente_telefone": "5511967696744",
    "cliente_email": "teste@email.com",
    "itens": [
      {
        "produto_id": 1,
        "quantidade": 2,
        "valor_unitario": 15.00
      }
    ],
    "valor_total": 30.00,
    "metodo_pagamento": "PIX",
    "tipo_pedido": "delivery",
    "endereco_entrega": "Rua Teste, 123"
  }'
```

✅ Você deve receber um WhatsApp confirmando o pedido!

---

## 💾 Parte 6: Configurar Persistência

### Passo 6.1: Backup Automático

```bash
# Criar script de backup
nano ~/backup-evolution.sh
```

**Cole este conteúdo:**

```bash
#!/bin/bash

# Configurações
BACKUP_DIR="/home/azureuser/backups"
DATE=$(date +%Y%m%d_%H%M%S)
EVOLUTION_DIR="/home/azureuser/evolution-api"

# Criar diretório de backup
mkdir -p "$BACKUP_DIR"

# Backup Evolution API (instâncias + store)
echo "🔄 Iniciando backup Evolution API..."
tar -czf "$BACKUP_DIR/evolution_$DATE.tar.gz" \
  -C "$EVOLUTION_DIR" instances store

# Backup MySQL
echo "🔄 Fazendo backup do banco de dados..."
mysqldump -u docegest -p'Docegest@2025' segredodosabor \
  > "$BACKUP_DIR/database_$DATE.sql"

# Manter apenas últimos 7 backups
echo "🧹 Limpando backups antigos..."
find "$BACKUP_DIR" -name "evolution_*.tar.gz" -mtime +7 -delete
find "$BACKUP_DIR" -name "database_*.sql" -mtime +7 -delete

echo "✅ Backup concluído: $DATE"
```

**Tornar executável:**

```bash
chmod +x ~/backup-evolution.sh
```

**Agendar backup diário (2h da manhã):**

```bash
# Editar crontab
crontab -e

# Adicionar linha:
0 2 * * * /home/azureuser/backup-evolution.sh >> /home/azureuser/backup.log 2>&1
```

### Passo 6.2: Monitoramento com Healthcheck

```bash
# Criar script de verificação
nano ~/healthcheck-evolution.sh
```

**Cole este conteúdo:**

```bash
#!/bin/bash

API_URL="http://localhost:8080"
API_KEY="docegest_evolution_2025_super_secret_key_12345"
INSTANCE="docegest-whatsapp"

# Verificar se Evolution API está respondendo
response=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/instance/connectionState/$INSTANCE" \
  -H "apikey: $API_KEY")

if [ "$response" -ne 200 ]; then
    echo "❌ Evolution API não está respondendo! Reiniciando..."
    cd /home/azureuser/evolution-api
    docker compose restart
    
    # Enviar alerta (opcional)
    # curl -X POST https://api.telegram.org/botTOKEN/sendMessage \
    #   -d "chat_id=SEU_CHAT_ID&text=⚠️ Evolution API reiniciado"
else
    echo "✅ Evolution API funcionando normalmente"
fi
```

**Tornar executável e agendar (a cada 5 minutos):**

```bash
chmod +x ~/healthcheck-evolution.sh

# Editar crontab
crontab -e

# Adicionar:
*/5 * * * * /home/azureuser/healthcheck-evolution.sh >> /home/azureuser/healthcheck.log 2>&1
```

### Passo 6.3: Logs Centralizados

```bash
# Ver logs em tempo real
docker logs -f evolution-api

# Ver últimas 100 linhas
docker logs --tail 100 evolution-api

# Salvar logs em arquivo
docker logs evolution-api > ~/evolution-logs-$(date +%Y%m%d).txt
```

---

## 🎨 Parte 7: Interface Web (Opcional)

### Passo 7.1: Instalar Frontend Docegest

```bash
cd ~/docegest/frontend

# Instalar dependências
npm install

# Configurar .env
nano .env
```

**Conteúdo .env:**

```env
REACT_APP_API_URL=http://SEU_IP_AZURE:5000
REACT_APP_WHATSAPP_NUMBER=5511967696744
```

**Build para produção:**

```bash
npm run build
```

### Passo 7.2: Instalar Nginx

```bash
# Instalar Nginx
sudo apt install -y nginx

# Copiar build para Nginx
sudo cp -r build/* /var/www/html/

# Configurar proxy reverso
sudo nano /etc/nginx/sites-available/docegest
```

**Conteúdo:**

```nginx
server {
    listen 80;
    server_name SEU_IP_AZURE;

    # Frontend
    location / {
        root /var/www/html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Evolution API (protegido)
    location /evolution {
        rewrite ^/evolution/(.*) /$1 break;
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        
        # Autenticação básica
        auth_basic "Restricted Access";
        auth_basic_user_file /etc/nginx/.htpasswd;
    }
}
```

**Ativar configuração:**

```bash
# Criar senha para Evolution API
sudo apt install -y apache2-utils
sudo htpasswd -c /etc/nginx/.htpasswd admin
# Digite uma senha forte

# Ativar site
sudo ln -s /etc/nginx/sites-available/docegest /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

**Acessar:**
- Frontend: `http://SEU_IP_AZURE`
- Backend API: `http://SEU_IP_AZURE/api`
- Evolution API: `http://SEU_IP_AZURE/evolution` (com senha)

---

## 🔒 Parte 8: Segurança

### Passo 8.1: Configurar Firewall

```bash
# Instalar UFW
sudo apt install -y ufw

# Configurar regras
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw allow 8080/tcp comment 'Evolution API'
sudo ufw allow 5000/tcp comment 'Backend Node'
sudo ufw allow 3306/tcp comment 'MySQL'

# Ativar
sudo ufw enable

# Verificar status
sudo ufw status
```

### Passo 8.2: Configurar SSL/HTTPS (Opcional)

```bash
# Instalar Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obter certificado (precisa de domínio)
sudo certbot --nginx -d seu-dominio.com

# Renovação automática já está configurada
```

### Passo 8.3: Proteger Evolution API

No `docker-compose.yml`, adicione autenticação:

```yaml
environment:
  # ... outras configs ...
  - AUTHENTICATION_API_KEY=SUA_CHAVE_SUPER_SECRETA_AQUI_12345
  - AUTHENTICATION_EXPOSE_IN_FETCH_INSTANCES=false
```

E reinicie:

```bash
cd ~/evolution-api
docker compose down
docker compose up -d
```

---

## 🧪 Parte 9: Testes Completos

### Teste 1: Verificar Serviços

```bash
# Status Docker
docker ps

# Status MySQL
sudo systemctl status mysql

# Status Backend
pm2 status

# Status Nginx (se instalado)
sudo systemctl status nginx
```

### Teste 2: Teste de Envio WhatsApp

```bash
# Criar arquivo de teste
nano ~/teste-whatsapp-completo.js
```

**Conteúdo:**

```javascript
const axios = require('axios');

const EVOLUTION_URL = 'http://localhost:8080';
const API_KEY = 'docegest_evolution_2025_super_secret_key_12345';
const INSTANCE = 'docegest-whatsapp';
const TEST_NUMBER = '5511967696744'; // SEU NÚMERO

async function testarWhatsApp() {
    try {
        console.log('🧪 Iniciando teste completo Evolution API...\n');

        // 1. Verificar status da instância
        console.log('1️⃣ Verificando status da instância...');
        const status = await axios.get(
            `${EVOLUTION_URL}/instance/connectionState/${INSTANCE}`,
            { headers: { apikey: API_KEY } }
        );
        console.log('✅ Status:', status.data.instance.state);

        // 2. Enviar mensagem de texto
        console.log('\n2️⃣ Enviando mensagem de texto...');
        const textMsg = await axios.post(
            `${EVOLUTION_URL}/message/sendText/${INSTANCE}`,
            {
                number: TEST_NUMBER,
                text: '🎉 Teste Evolution API - Mensagem de Texto'
            },
            { headers: { apikey: API_KEY, 'Content-Type': 'application/json' } }
        );
        console.log('✅ Mensagem enviada:', textMsg.data.key.id);

        // 3. Enviar mensagem com emoji
        console.log('\n3️⃣ Enviando mensagem com emojis...');
        const emojiMsg = await axios.post(
            `${EVOLUTION_URL}/message/sendText/${INSTANCE}`,
            {
                number: TEST_NUMBER,
                text: '🍰 Pedido confirmado!\n📦 Código: #PED000123\n💰 Valor: R$ 45,90\n⏰ Previsão: 40min'
            },
            { headers: { apikey: API_KEY, 'Content-Type': 'application/json' } }
        );
        console.log('✅ Mensagem com emoji enviada!');

        // 4. Buscar informações do contato
        console.log('\n4️⃣ Buscando informações do contato...');
        const contact = await axios.get(
            `${EVOLUTION_URL}/chat/findContacts/${INSTANCE}`,
            {
                headers: { apikey: API_KEY },
                params: { phone: TEST_NUMBER }
            }
        );
        console.log('✅ Contato encontrado:', contact.data[0]?.pushName || 'Sem nome');

        console.log('\n✅ TODOS OS TESTES PASSARAM! Evolution API funcionando perfeitamente.\n');

    } catch (error) {
        console.error('❌ Erro no teste:', error.response?.data || error.message);
        process.exit(1);
    }
}

testarWhatsApp();
```

**Executar:**

```bash
cd ~
npm install axios
node teste-whatsapp-completo.js
```

### Teste 3: Teste de Carga

```bash
# Enviar 10 mensagens seguidas
for i in {1..10}; do
  curl -X POST http://localhost:8080/message/sendText/docegest-whatsapp \
    -H "Content-Type: application/json" \
    -H "apikey: docegest_evolution_2025_super_secret_key_12345" \
    -d "{\"number\":\"5511967696744\",\"text\":\"Teste $i de 10\"}"
  echo ""
  sleep 2
done
```

---

## 🐛 Troubleshooting

### Problema 1: Evolution API não inicia

**Sintomas:**
- Container não sobe
- Erro de porta já em uso

**Solução:**

```bash
# Verificar o que está usando porta 8080
sudo lsof -i :8080

# Matar processo (se necessário)
sudo kill -9 PID

# Ou usar porta diferente no docker-compose.yml
ports:
  - "8081:8080"
```

### Problema 2: WhatsApp desconecta

**Sintomas:**
- QR Code aparece novamente
- Status: "disconnected"

**Soluções:**

```bash
# 1. Verificar logs
docker logs evolution-api --tail 100

# 2. Recriar instância
curl -X DELETE http://localhost:8080/instance/logout/docegest-whatsapp \
  -H "apikey: SUA_API_KEY"

# 3. Verificar se WhatsApp está aberto em outro lugar

# 4. Reiniciar container
cd ~/evolution-api
docker compose restart
```

### Problema 3: Mensagens não chegam

**Verificações:**

```bash
# 1. Testar conexão
curl -X GET http://localhost:8080/instance/connectionState/docegest-whatsapp \
  -H "apikey: SUA_API_KEY"

# 2. Verificar formato do número
# Correto: 5511967696744 (código país + DDD + número)
# Errado: 11967696744, +5511967696744

# 3. Ver logs do backend
pm2 logs docegest-backend

# 4. Testar envio direto via Evolution
curl -X POST http://localhost:8080/message/sendText/docegest-whatsapp \
  -H "Content-Type: application/json" \
  -H "apikey: SUA_API_KEY" \
  -d '{"number":"5511967696744","text":"Teste direto"}'
```

### Problema 4: Backend não conecta no Evolution

**Verificações:**

```bash
# 1. Ver erro específico
cd ~/docegest/backend
npm start

# 2. Verificar .env
cat .env | grep EVOLUTION

# 3. Testar conectividade
curl http://localhost:8080

# 4. Verificar API Key
# No .env:
EVOLUTION_API_KEY=mesma_chave_do_docker-compose

# No docker-compose.yml:
AUTHENTICATION_API_KEY=mesma_chave_do_env
```

### Problema 5: Docker sem espaço

**Sintomas:**
- "no space left on device"

**Solução:**

```bash
# Limpar containers parados
docker container prune -f

# Limpar imagens não usadas
docker image prune -a -f

# Limpar volumes não usados
docker volume prune -f

# Limpar tudo
docker system prune -a -f --volumes

# Verificar espaço
df -h
```

### Problema 6: Performance lenta

**Otimizações:**

```bash
# 1. Aumentar recursos da VM no Azure (B2s para B2ms)

# 2. Limitar logs do Evolution (docker-compose.yml)
environment:
  - LOG_LEVEL=ERROR
  - LOG_BAILEYS=false

# 3. Desabilitar histórico completo
environment:
  - STORE_MESSAGES=false
  - STORE_MESSAGE_UP=false

# 4. Configurar swap
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

---

## 📊 Monitoramento

### Dashboard Simples

```bash
# Criar script de status
nano ~/status.sh
```

**Conteúdo:**

```bash
#!/bin/bash

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "   📊 STATUS DOCEGEST + EVOLUTION API"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Docker
echo "🐳 DOCKER:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""

# Evolution API
echo "📱 EVOLUTION API:"
curl -s http://localhost:8080/instance/connectionState/docegest-whatsapp \
  -H "apikey: docegest_evolution_2025_super_secret_key_12345" \
  | jq -r '.instance | "Status: \(.state) | Instance: \(.instanceName)"'
echo ""

# Backend
echo "⚙️  BACKEND:"
pm2 list | grep docegest
echo ""

# MySQL
echo "🗄️  DATABASE:"
sudo systemctl is-active mysql
echo ""

# Disco
echo "💾 ESPAÇO EM DISCO:"
df -h / | tail -1 | awk '{print "Usado: " $3 " de " $2 " (" $5 ")"}'
echo ""

# Memória
echo "🧠 MEMÓRIA:"
free -h | grep Mem | awk '{print "Usado: " $3 " de " $2}'
echo ""

# Uptime
echo "⏰ UPTIME:"
uptime -p
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
```

**Usar:**

```bash
chmod +x ~/status.sh
~/status.sh
```

---

## 📚 Recursos Adicionais

### Documentação Oficial

- **Evolution API:** https://doc.evolution-api.com/
- **Evolution GitHub:** https://github.com/EvolutionAPI/evolution-api
- **Docker Docs:** https://docs.docker.com/
- **Azure VM:** https://learn.microsoft.com/azure/virtual-machines/

### Comandos Úteis

```bash
# Reiniciar Evolution API
cd ~/evolution-api && docker compose restart

# Ver logs em tempo real
docker logs -f evolution-api

# Reiniciar backend
pm2 restart docegest-backend

# Backup manual
~/backup-evolution.sh

# Status geral
~/status.sh

# Atualizar Evolution API
cd ~/evolution-api
docker compose pull
docker compose up -d
```

### Estrutura de Arquivos Final

```
/home/azureuser/
├── evolution-api/
│   ├── docker-compose.yml
│   ├── instances/           # Dados das instâncias
│   └── store/              # Mensagens e contatos
├── docegest/
│   ├── backend/
│   │   ├── .env
│   │   └── ...
│   └── frontend/
│       └── ...
├── backups/                # Backups automáticos
├── backup-evolution.sh     # Script de backup
├── healthcheck-evolution.sh # Monitor de saúde
├── status.sh              # Dashboard status
└── teste-whatsapp-completo.js # Testes
```

---

## 🎉 Conclusão

**Parabéns!** 🎊 Você configurou com sucesso:

- ✅ VM Azure com Ubuntu
- ✅ Docker instalado e funcionando
- ✅ Evolution API rodando
- ✅ WhatsApp Business conectado
- ✅ Integração completa com Docegest
- ✅ Backups automáticos
- ✅ Monitoramento ativo
- ✅ Sistema pronto para produção

### Próximos Passos

1. **Domínio Personalizado**
   - Registrar domínio (ex: docegest.com.br)
   - Configurar DNS apontando para IP do Azure
   - Instalar certificado SSL

2. **Webhooks Avançados**
   - Receber mensagens dos clientes
   - Responder automaticamente
   - Integrar com ChatBot/IA

3. **Escalabilidade**
   - Múltiplas instâncias WhatsApp
   - Load balancer
   - Banco de dados externo (Azure MySQL)

4. **Integrações**
   - Telegram Bot
   - Email automático
   - SMS

---

## 💬 Suporte

**Problemas?**

1. Verifique os logs: `docker logs evolution-api`
2. Execute o status: `~/status.sh`
3. Consulte o Troubleshooting acima
4. GitHub Issues: https://github.com/EvolutionAPI/evolution-api/issues

**Documentação Docegest:**
- CONFIGURACAO_WHATSAPP.md
- API_DOCUMENTATION.md
- COMANDOS_DEPLOY_AZURE.md

---

**Desenvolvido com ❤️ para o Docegest**

*Última atualização: 16 de novembro de 2025*
