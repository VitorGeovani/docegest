# 🚀 TUTORIAL COMPLETO: Deploy no Microsoft Azure

## Sistema Segredo do Sabor v5.0 - Deploy em Produção

**Objetivo**: Instalar frontend, backend, banco de dados e Evolution API em uma VM Azure

---

## 📋 SUMÁRIO

1. [Requisitos e Custos](#1-requisitos-e-custos)
2. [Criar Máquina Virtual no Azure](#2-criar-máquina-virtual-no-azure)
3. [Configurar Firewall e Portas](#3-configurar-firewall-e-portas)
4. [Conectar à VM via SSH](#4-conectar-à-vm-via-ssh)
5. [Instalar Dependências (Node, MySQL, Nginx)](#5-instalar-dependências)
6. [Configurar MySQL e Banco de Dados](#6-configurar-mysql)
7. [Instalar e Configurar Backend](#7-instalar-backend)
8. [Instalar e Configurar Frontend](#8-instalar-frontend)
9. [Configurar Nginx como Reverse Proxy](#9-configurar-nginx)
10. [Instalar Evolution API (Docker)](#10-instalar-evolution-api)
11. [Configurar SSL/HTTPS (Let's Encrypt)](#11-configurar-ssl)
12. [Configurar PM2 (Process Manager)](#12-configurar-pm2)
13. [Testar Sistema Completo](#13-testar-sistema)
14. [Monitoramento e Logs](#14-monitoramento)
15. [Backup Automático](#15-backup)
16. [Solução de Problemas](#16-solução-de-problemas)

---

## 1️⃣ REQUISITOS E CUSTOS

### 💰 Estimativa de Custos (Azure - Conta Educacional)

**🎓 CONTA EDUCACIONAL: $100 de crédito grátis!**

**VM Recomendada para Apresentação**: Standard B1s (1 vCPU, 1 GB RAM) - **GRÁTIS**
- **Custo**: $0,00/mês (750 horas grátis por 12 meses)
- **Disco**: 64 GB SSD Gerenciado - **GRÁTIS** (2x discos grátis)
- **IP Público**: **GRÁTIS** (1 IP estático incluído)
- **Tráfego**: Primeiros 100 GB de saída **GRÁTIS**
- **Banco de Dados Azure SQL**: Não usado (MySQL local é GRÁTIS)

**Total estimado**: **$0,00/mês** ✅

> 💡 **Ideal para apresentação acadêmica!** A VM B1s é suficiente para demonstração e não consome seus créditos.

**Alternativa se precisar mais RAM**: Standard B1ms (1 vCPU, 2 GB RAM) - ~$15/mês
- Use apenas se B1s não for suficiente
- Ainda sobrará $85 dos seus créditos

### 🔧 Especificações Mínimas

| Componente | Azure Free Tier | Recomendado (se precisar) |
|------------|-----------------|---------------------------|
| vCPU | 1 core (B1s) | 2 cores (B1ms) |
| RAM | 1 GB | 2 GB |
| Disco | 64 GB SSD (grátis) | 64 GB SSD (grátis) |
| Sistema | Ubuntu 22.04 LTS | Ubuntu 22.04 LTS |

**🎯 Para apresentação acadêmica: B1s é suficiente e 100% GRÁTIS!**

### 📦 Softwares que serão instalados

- ✅ **Node.js** v18 LTS
- ✅ **MySQL** 8.0
- ✅ **Nginx** (servidor web)
- ✅ **Docker** + Docker Compose
- ✅ **PM2** (gerenciador de processos)
- ✅ **Certbot** (SSL gratuito)
- ✅ **Git**

### 🌐 Domínio (Opcional mas Recomendado)

- Registrar domínio: **www.registro.br** (R$ 40/ano)
- Exemplo: `segredodosabor.com.br`
- Necessário para SSL/HTTPS

---

## 2️⃣ CRIAR MÁQUINA VIRTUAL NO AZURE

### Passo 1: Acessar Portal Azure

1. Ir para: https://portal.azure.com
2. Fazer login com conta Microsoft
3. Clicar em **"Criar um recurso"**

### Passo 2: Criar VM

**2.1 - Informações Básicas:**

```yaml
Assinatura: Azure for Students (ou sua assinatura educacional)
Grupo de recursos: segredo-do-sabor-rg (criar novo)
Nome da VM: segredo-do-sabor-vm
Região: Brazil South (São Paulo) - IMPORTANTE!
Opções de disponibilidade: Nenhuma redundância necessária
Tipo de segurança: Standard
Imagem: Ubuntu Server 22.04 LTS - Gen2
Tamanho: Standard_B1s (1 vCPU, 1 GB RAM) ⭐ GRÁTIS
```

> 💡 **Dica**: Na seleção de tamanho, filtrar por "Série B" e escolher **B1s** para usar o free tier!

**Se B1s não aparecer:**
1. Clicar em "Ver todos os tamanhos"
2. Filtrar por "Série: B"
3. Selecionar "B1s - Uso geral" (750h grátis/mês)

**2.2 - Conta de Administrador:**

```yaml
Tipo de autenticação: Chave pública SSH (RECOMENDADO)
Nome de usuário: azureuser
Origem da chave pública SSH: Gerar novo par de chaves
Nome do par de chaves: segredo-do-sabor-key
```

> ⚠️ **IMPORTANTE**: Baixe e guarde a chave privada `.pem` - você precisará dela!

**Alternativa (menos seguro):**
```yaml
Tipo de autenticação: Senha
Nome de usuário: azureuser
Senha: Cr!3umAS3nh@F0rt3
```

**2.3 - Portas de Entrada Públicas:**

Selecionar:
- ☑️ HTTP (80)
- ☑️ HTTPS (443)
- ☑️ SSH (22)

### Passo 3: Discos

```yaml
Tipo de disco do SO: SSD Standard (grátis no free tier)
Tamanho: 64 GiB (máximo gratuito)
Criptografia: Padrão
Excluir com VM: ☑️ Sim
```

> 💰 **Economia**: O Azure oferece 2 discos gerenciados SSD de 64GB GRÁTIS!

### Passo 4: Rede

```yaml
Rede virtual: (nova) segredo-do-sabor-vnet
Sub-rede: (nova) default (10.0.0.0/24)
IP público: (novo) segredo-do-sabor-ip
Grupo de segurança de rede NIC: Básico
Portas de entrada públicas: Permitir portas selecionadas
Selecionar portas: 22, 80, 443
```

### Passo 5: Gerenciamento

```yaml
Desligamento automático: Desabilitado
Backup: Desabilitado (configuraremos manual)
```

### Passo 6: Revisar + Criar

1. Revisar todas as configurações
2. Clicar em **"Criar"**
3. **BAIXAR** a chave privada `.pem` quando solicitado
4. Aguardar 3-5 minutos para provisionamento

### Passo 7: Anotar IP Público

1. Ir para **"Todos os recursos"**
2. Clicar na VM `segredo-do-sabor-vm`
3. Copiar o **Endereço IP público**
4. Exemplo: `20.201.45.123`

---

## 3️⃣ CONFIGURAR FIREWALL E PORTAS

### Portas que precisam estar abertas:

| Porta | Serviço | Protocolo | Origem |
|-------|---------|-----------|--------|
| 22 | SSH | TCP | Seu IP (ou 0.0.0.0/0) |
| 80 | HTTP | TCP | 0.0.0.0/0 (qualquer) |
| 443 | HTTPS | TCP | 0.0.0.0/0 (qualquer) |
| 3306 | MySQL | TCP | Localhost apenas |
| 5000 | Backend API | TCP | Localhost apenas |
| 3000 | Frontend Dev | TCP | Localhost apenas |
| 8080 | Evolution API | TCP | Localhost apenas |

### Configurar Grupo de Segurança de Rede (NSG)

**No Portal Azure:**

1. Ir para **"Grupos de segurança de rede"**
2. Clicar em `segredo-do-sabor-vm-nsg`
3. Clicar em **"Regras de segurança de entrada"**

**Adicionar regras:**

**Regra 1 - SSH:**
```yaml
Origem: Qualquer (ou seu IP para maior segurança)
Intervalos de portas de origem: *
Destino: Qualquer
Intervalos de portas de destino: 22
Protocolo: TCP
Ação: Permitir
Prioridade: 100
Nome: Allow-SSH
```

**Regra 2 - HTTP:**
```yaml
Origem: Qualquer
Intervalos de portas de origem: *
Destino: Qualquer
Intervalos de portas de destino: 80
Protocolo: TCP
Ação: Permitir
Prioridade: 200
Nome: Allow-HTTP
```

**Regra 3 - HTTPS:**
```yaml
Origem: Qualquer
Intervalos de portas de origem: *
Destino: Qualquer
Intervalos de portas de destino: 443
Protocolo: TCP
Ação: Permitir
Prioridade: 300
Nome: Allow-HTTPS
```

> ⚠️ **Segurança**: NÃO abra as portas 3306, 5000, 3000, 8080 para internet!

---

## 4️⃣ CONECTAR À VM VIA SSH

### Opção A: Windows (PowerShell)

```powershell
# 1. Ir para pasta onde salvou a chave .pem
cd C:\Users\SeuUsuario\Downloads

# 2. Configurar permissões da chave (Windows 10+)
icacls "segredo-do-sabor-key.pem" /inheritance:r
icacls "segredo-do-sabor-key.pem" /grant:r "%username%:R"

# 3. Conectar
ssh -i segredo-do-sabor-key.pem azureuser@20.201.45.123
```

### Opção B: Windows (PuTTY)

1. Baixar PuTTY: https://www.putty.org/
2. Converter `.pem` para `.ppk`:
   - Abrir PuTTYgen
   - Load → Selecionar arquivo `.pem`
   - Save private key → Salvar como `.ppk`
3. No PuTTY:
   - Host: `azureuser@20.201.45.123`
   - Connection → SSH → Auth → Browse → Selecionar `.ppk`
   - Open

### Opção C: Linux/Mac

```bash
# 1. Configurar permissões
chmod 400 ~/Downloads/segredo-do-sabor-key.pem

# 2. Conectar
ssh -i ~/Downloads/segredo-do-sabor-key.pem azureuser@20.201.45.123
```

### Primeira Conexão

```bash
# Aceitar fingerprint
The authenticity of host '20.201.45.123' can't be established.
Are you sure you want to continue connecting (yes/no)? yes

# Você verá:
azureuser@segredo-do-sabor-vm:~$
```

✅ **Conectado com sucesso!**

---

## 5️⃣ INSTALAR DEPENDÊNCIAS

### Atualizar Sistema

```bash
# Atualizar lista de pacotes
sudo apt update

# Atualizar pacotes instalados
sudo apt upgrade -y

# Instalar ferramentas básicas
sudo apt install -y curl wget git unzip software-properties-common
```

### Instalar Node.js 18 LTS

```bash
# Adicionar repositório NodeSource
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# Instalar Node.js e npm
sudo apt install -y nodejs

# Verificar instalação
node --version  # Deve mostrar: v18.x.x
npm --version   # Deve mostrar: 9.x.x
```

### Instalar MySQL 8.0

```bash
# Instalar MySQL Server
sudo apt install -y mysql-server

# Verificar status
sudo systemctl status mysql

# Iniciar MySQL (se não estiver rodando)
sudo systemctl start mysql

# Habilitar inicialização automática
sudo systemctl enable mysql
```

### Instalar Nginx

```bash
# Instalar Nginx
sudo apt install -y nginx

# Verificar status
sudo systemctl status nginx

# Iniciar Nginx
sudo systemctl start nginx

# Habilitar inicialização automática
sudo systemctl enable nginx
```

### Instalar Docker

```bash
# Remover versões antigas
sudo apt remove docker docker-engine docker.io containerd runc

# Instalar dependências
sudo apt install -y apt-transport-https ca-certificates curl gnupg lsb-release

# Adicionar chave GPG do Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Adicionar repositório
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Atualizar e instalar
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Adicionar usuário ao grupo docker
sudo usermod -aG docker $USER

# Aplicar mudanças de grupo (ou fazer logout/login)
newgrp docker

# Verificar instalação
docker --version
docker compose version
```

### Instalar PM2

```bash
# Instalar PM2 globalmente
sudo npm install -g pm2

# Verificar instalação
pm2 --version
```

### ✅ Verificar Todas as Instalações

```bash
echo "Node.js: $(node --version)"
echo "npm: $(npm --version)"
echo "MySQL: $(mysql --version)"
echo "Nginx: $(nginx -v 2>&1)"
echo "Docker: $(docker --version)"
echo "PM2: $(pm2 --version)"
```

---

## 6️⃣ CONFIGURAR MYSQL

### Segurança do MySQL

```bash
# Executar script de segurança
sudo mysql_secure_installation
```

**Responder às perguntas:**

```
Validate password component? n
New password: P@$$w0rd
Re-enter password: P@$$w0rd
Remove anonymous users? Y
Disallow root login remotely? Y
Remove test database? Y
Reload privilege tables? Y
```

### Criar Banco de Dados e Usuário

```bash
# Conectar ao MySQL como root
sudo mysql -u root -p
```

**No prompt do MySQL:**

```sql
-- Criar banco de dados
CREATE DATABASE segredodosabor CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Criar usuário específico
CREATE USER 'segredo_user'@'localhost' IDENTIFIED BY 'P@$$w0rd';

-- Conceder privilégios
GRANT ALL PRIVILEGES ON segredodosabor.* TO 'segredo_user'@'localhost';
FLUSH PRIVILEGES;

-- Verificar
SHOW DATABASES;
SELECT user, host FROM mysql.user WHERE user = 'segredo_user';

-- Sair
EXIT;
```

### Testar Conexão

```bash
# Conectar com novo usuário
mysql -u segredo_user -p segredodosabor

# Senha: P@$$w0rd
```

Se conectou, está OK! ✅

```sql
EXIT;
```

### Configurar MySQL para Produção

```bash
# Editar configuração
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf
```

**Adicionar/modificar:**

```ini
[mysqld]
# Segurança
bind-address = 127.0.0.1
skip-networking = 0

# Performance
max_connections = 100
innodb_buffer_pool_size = 512M
innodb_log_file_size = 128M

# Charset
character-set-server = utf8mb4
collation-server = utf8mb4_unicode_ci

# Logs
log_error = /var/log/mysql/error.log
slow_query_log = 1
slow_query_log_file = /var/log/mysql/slow.log
long_query_time = 2
```

**Salvar**: `Ctrl+O`, `Enter`, `Ctrl+X`

```bash
# Reiniciar MySQL
sudo systemctl restart mysql
```

---

## 7️⃣ INSTALAR BACKEND

### Criar Estrutura de Diretórios

```bash
# Criar diretório para aplicação
sudo mkdir -p /var/www/segredodosabor
sudo chown -R $USER:$USER /var/www/segredodosabor
cd /var/www/segredodosabor
```

### Clonar ou Fazer Upload do Código

**Opção A: Via Git (Recomendado)**

```bash
# Se tiver repositório Git
git clone https://github.com/seu-usuario/Segredo-do-Sabor.git .

# Ou criar repositório e fazer push do local
```

**Opção B: Upload via SCP (do seu PC local)**

**No seu PC (Windows PowerShell):**

```powershell
# Compactar projeto
cd D:\Downloads\Segredo-do-Sabor
tar -czf segredo-do-sabor.tar.gz backend frontend *.sql *.md

# Enviar para servidor
scp -i segredo-do-sabor-key.pem segredo-do-sabor.tar.gz azureuser@20.201.45.123:~/
```

**Na VM:**

```bash
# Extrair arquivo
cd /var/www/segredodosabor
tar -xzf ~/segredo-do-sabor.tar.gz
ls -la  # Verificar se extraiu
```

**Opção C: Upload via WinSCP (Windows)**

1. Baixar WinSCP: https://winscp.net/
2. Conectar com chave `.ppk`
3. Arrastar pasta `backend` para `/var/www/segredodosabor/`

### Instalar Dependências do Backend

```bash
cd /var/www/segredodosabor/backend

# Instalar dependências
npm install

# Verificar node_modules
ls -la node_modules | wc -l  # Deve ter várias pastas
```

### Configurar Variáveis de Ambiente

```bash
# Copiar exemplo
cp .env.example .env

# Editar .env
nano .env
```

**Configuração de Produção:**

```env
# Ambiente
NODE_ENV=production

# Servidor
PORT=5000
HOST=0.0.0.0

# Banco de Dados
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=segredodosabor
DB_USER=segredo_user
DB_PASSWORD=P@$$w0rd

# JWT
JWT_SECRET=s3gr3d0-d0-s@b0r-pr0duc@0-2025-@zur3-s3cur3-k3y-ch@ng3-th1s
JWT_REFRESH_SECRET=r3fr3sh-s3gr3d0-2025-@nur3-pr0d-s3cur3-r3fr3sh-t0k3n
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=https://seudominio.com.br

# Upload
UPLOAD_DIR=./storage
MAX_FILE_SIZE=5242880

# WhatsApp - Evolution API
WHATSAPP_PROVIDER=evolution
EVOLUTION_API_URL=http://localhost:8080
EVOLUTION_API_KEY=segredodosabor2025
EVOLUTION_INSTANCE=segredodosabor
WHATSAPP_BUSINESS_PHONE=5511967696744
```

**Salvar**: `Ctrl+O`, `Enter`, `Ctrl+X`

### Importar Banco de Dados

```bash
cd /var/www/segredodosabor

# Importar estrutura completa
sudo mysql -u segredo_user -p segredodosabor < BANCO_DADOS_COMPLETO.sql

# Importar tabela de mensagens WhatsApp
sudo mysql -u segredo_user -p segredodosabor < criar-tabela-mensagens-whatsapp-completa.sql

# Verificar tabelas
sudo mysql -u segredo_user -p segredodosabor -e "SHOW TABLES;"
```

**Deve mostrar 20 tabelas:**
- avisos
- categoria
- cliente
- **mensagens_whatsapp** ← NOVA
- despesas
- ingrediente
- item_reserva
- personalizacao_disponivel
- personalizacao_selecionada
- preferencias_cliente
- produto
- receita
- receita_ingrediente
- reserva
- sessoes
- e outras...

### Criar Usuário Admin

```bash
cd /var/www/segredodosabor/backend

# Criar admin (se script existir)
node criar-admin.js
```

**Ou manualmente:**

```bash
sudo mysql -u segredo_user -p segredodosabor
```

```sql
-- Hash da senha "Admin@2025"
INSERT INTO cliente (nome, telefone, email, senha, tipo, ativo, criado_em) VALUES
('Administrador', '5511967696744', 'admin@segredodosabor.com', 
'$2b$10$rKJZQY9K5F8vXr5h.X6t3.jN1ZGy7hD8kP0mNxQ6fW8zL9vE4tC2S', 
'admin', 1, NOW());

-- Verificar
SELECT idcliente, nome, email, tipo FROM cliente WHERE tipo = 'admin';
EXIT;
```

### Testar Backend Localmente

```bash
cd /var/www/segredodosabor/backend

# Testar startup
npm start
```

**Deve aparecer:**

```
✅ Servidor rodando na porta 5000
✅ Banco de dados conectado
🚀 API disponível em: http://0.0.0.0:5000
```

**Em outro terminal:**

```bash
# Testar endpoint
curl http://localhost:5000/

# Deve retornar JSON com informações da API
```

**Parar**: `Ctrl+C`

---

## 8️⃣ INSTALAR FRONTEND

### Configurar Frontend

```bash
cd /var/www/segredodosabor/frontend

# Instalar dependências
npm install
```

### Configurar Variáveis de Ambiente

```bash
# Criar arquivo .env
nano .env
```

**Configuração:**

```env
# API Backend
REACT_APP_API_URL=https://seudominio.com.br/api

# Ou se não tiver domínio ainda:
REACT_APP_API_URL=http://20.201.45.123/api

# Ambiente
NODE_ENV=production
```

**Salvar**: `Ctrl+O`, `Enter`, `Ctrl+X`

### Build de Produção

```bash
# Criar build otimizado
npm run build
```

**Aguardar 2-5 minutos...**

```
Creating an optimized production build...
Compiled successfully!

File sizes after gzip:

  150.23 KB  build/static/js/main.a1b2c3d4.js
  45.67 KB   build/static/css/main.e5f6g7h8.css
  ...

The build folder is ready to be deployed.
```

✅ **Build criado em:** `/var/www/segredodosabor/frontend/build`

### Verificar Build

```bash
ls -lh /var/www/segredodosabor/frontend/build/

# Deve ter:
# - index.html
# - static/ (pasta com JS e CSS)
# - imgs/
# - manifest.json
```

---

## 9️⃣ CONFIGURAR NGINX

### Criar Configuração do Site

```bash
# Criar arquivo de configuração
sudo nano /etc/nginx/sites-available/segredodosabor
```

**Configuração Completa:**

```nginx
# Upstream para Backend
upstream backend_api {
    server localhost:5000;
    keepalive 64;
}

# Redirecionar HTTP para HTTPS (depois que configurar SSL)
# server {
#     listen 80;
#     server_name seudominio.com.br www.seudominio.com.br;
#     return 301 https://$server_name$request_uri;
# }

# Servidor Principal
server {
    listen 80;
    listen [::]:80;
    
    # Trocar pelo seu domínio ou IP
    server_name seudominio.com.br www.seudominio.com.br;
    # server_name 20.201.45.123;  # Usar se não tiver domínio
    
    # Logs
    access_log /var/log/nginx/segredodosabor-access.log;
    error_log /var/log/nginx/segredodosabor-error.log;
    
    # Tamanho máximo de upload (5MB)
    client_max_body_size 5M;
    
    # Root do Frontend (build do React)
    root /var/www/segredodosabor/frontend/build;
    index index.html;
    
    # Headers de Segurança
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    
    # Proxy para Backend API
    location /api {
        # Remover /api do path antes de enviar ao backend
        rewrite ^/api/(.*)$ /$1 break;
        
        proxy_pass http://backend_api;
        proxy_http_version 1.1;
        
        # Headers
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # Cache
        proxy_cache_bypass $http_upgrade;
    }
    
    # Servir arquivos estáticos com cache
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # React Router - SPA
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Health check
    location /health {
        access_log off;
        return 200 "OK";
        add_header Content-Type text/plain;
    }
}
```

**Salvar**: `Ctrl+O`, `Enter`, `Ctrl+X`

### Ativar Configuração

```bash
# Criar link simbólico
sudo ln -s /etc/nginx/sites-available/segredodosabor /etc/nginx/sites-enabled/

# Remover site padrão
sudo rm /etc/nginx/sites-enabled/default

# Testar configuração
sudo nginx -t
```

**Deve mostrar:**

```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

### Reiniciar Nginx

```bash
# Reiniciar
sudo systemctl restart nginx

# Verificar status
sudo systemctl status nginx

# Ver logs em tempo real (opcional)
sudo tail -f /var/log/nginx/segredodosabor-access.log
```

---

## 🔟 INSTALAR EVOLUTION API

### Executar Container Docker

```bash
# Criar diretório para dados persistentes
mkdir -p ~/evolution-data

# Executar Evolution API
docker run -d \
  --name evolution-api \
  --restart unless-stopped \
  -p 8080:8080 \
  -e AUTHENTICATION_API_KEY=segredodosabor2025 \
  -e DATABASE_ENABLED=true \
  -e DATABASE_PROVIDER=postgresql \
  -e DATABASE_CONNECTION_URI="postgresql://postgres:password@localhost:5432/evolution" \
  -v ~/evolution-data:/evolution/instances \
  atendai/evolution-api:latest
```

### Verificar Container

```bash
# Ver logs
docker logs evolution-api

# Verificar se está rodando
docker ps | grep evolution

# Testar API
curl http://localhost:8080
```

### Configurar Instância WhatsApp

```bash
# Acessar via navegador (criar túnel SSH primeiro)
```

**No seu PC local:**

```powershell
# Criar túnel SSH para acessar porta 8080
ssh -i segredo-do-sabor-key.pem -L 8080:localhost:8080 azureuser@20.201.45.123
```

**Agora no navegador local:**

1. Abrir: `http://localhost:8080`
2. Swagger da Evolution API abrirá
3. Criar instância:
   - POST `/instance/create`
   - Body:
   ```json
   {
     "instanceName": "segredodosabor",
     "token": "segredodosabor2025",
     "qrcode": true,
     "webhooks": [
       {
         "url": "http://localhost:5000/whatsapp/webhook",
         "events": ["messages.upsert"]
       }
     ]
   }
   ```
4. Copiar QR Code gerado
5. Escanear com WhatsApp (número: 5511967696744)

### Configurar Webhook

**Via cURL na VM:**

```bash
curl -X POST http://localhost:8080/webhook/set/segredodosabor \
  -H "Content-Type: application/json" \
  -H "apikey: segredodosabor2025" \
  -d '{
    "url": "http://localhost:5000/whatsapp/webhook",
    "webhook_by_events": false,
    "webhook_base64": false,
    "events": [
      "messages.upsert"
    ]
  }'
```

### Persistir Container

```bash
# Container já está com --restart unless-stopped
# Verificar política de restart
docker inspect evolution-api | grep -A 5 RestartPolicy
```

---

## 1️⃣1️⃣ CONFIGURAR SSL/HTTPS

### Pré-requisitos

- ✅ Domínio registrado (ex: `segredodosabor.com.br`)
- ✅ DNS apontando para IP da VM
- ✅ Portas 80 e 443 abertas

### Verificar DNS

```bash
# Na VM, verificar se domínio resolve para IP correto
dig seudominio.com.br +short

# Deve mostrar o IP da sua VM: 20.201.45.123
```

### Instalar Certbot

```bash
# Instalar Certbot e plugin Nginx
sudo apt install -y certbot python3-certbot-nginx
```

### Obter Certificado SSL

```bash
# Obter certificado (trocar pelo seu domínio)
sudo certbot --nginx -d seudominio.com.br -d www.seudominio.com.br
```

**Responder às perguntas:**

```
Enter email address: seu-email@example.com
Agree to terms: Y
Share email: N
```

**Certbot irá:**
1. ✅ Validar domínio
2. ✅ Gerar certificado
3. ✅ Configurar Nginx automaticamente
4. ✅ Configurar renovação automática

### Verificar Configuração SSL

```bash
# Ver configuração modificada
sudo cat /etc/nginx/sites-available/segredodosabor

# Testar
curl https://seudominio.com.br
```

### Renovação Automática

```bash
# Testar renovação (dry-run)
sudo certbot renew --dry-run

# Verificar timer de renovação automática
sudo systemctl status certbot.timer
```

✅ **Certificado válido por 90 dias e renova automaticamente!**

---

## 1️⃣2️⃣ CONFIGURAR PM2

### Criar Arquivo Ecosystem

```bash
cd /var/www/segredodosabor/backend

# Criar configuração PM2
nano ecosystem.config.js
```

**Configuração:**

```javascript
module.exports = {
  apps: [
    {
      name: 'segredo-backend',
      script: './src/server.js',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      error_file: '/var/log/pm2/segredo-backend-error.log',
      out_file: '/var/log/pm2/segredo-backend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      max_memory_restart: '500M',
      autorestart: true,
      watch: false,
      max_restarts: 10,
      min_uptime: '10s'
    }
  ]
};
```

**Salvar**: `Ctrl+O`, `Enter`, `Ctrl+X`

### Criar Diretório de Logs

```bash
sudo mkdir -p /var/log/pm2
sudo chown -R $USER:$USER /var/log/pm2
```

### Iniciar Backend com PM2

```bash
cd /var/www/segredodosabor/backend

# Iniciar aplicação
pm2 start ecosystem.config.js

# Ver status
pm2 status

# Ver logs em tempo real
pm2 logs segredo-backend

# Monitoramento
pm2 monit
```

### Configurar Inicialização Automática

```bash
# Salvar lista de processos
pm2 save

# Gerar script de startup
pm2 startup

# Copiar e executar o comando que aparecer, exemplo:
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u azureuser --hp /home/azureuser
```

### Comandos Úteis PM2

```bash
# Reiniciar
pm2 restart segredo-backend

# Parar
pm2 stop segredo-backend

# Remover
pm2 delete segredo-backend

# Ver logs
pm2 logs segredo-backend --lines 100

# Limpar logs
pm2 flush

# Ver informações detalhadas
pm2 show segredo-backend

# Monitorar CPU/RAM
pm2 monit
```

---

## 1️⃣3️⃣ TESTAR SISTEMA COMPLETO

### Checklist de Testes

#### 1. Testar Nginx

```bash
# Status
sudo systemctl status nginx

# Teste HTTP
curl -I http://20.201.45.123

# Deve retornar: HTTP/1.1 200 OK
```

#### 2. Testar Backend

```bash
# Direto
curl http://localhost:5000/

# Via Nginx
curl http://20.201.45.123/api/

# Listar produtos
curl http://20.201.45.123/api/produto/listar
```

#### 3. Testar Frontend

**No navegador:**

1. Abrir: `http://20.201.45.123` (ou `https://seudominio.com.br`)
2. Deve carregar página inicial ✅
3. Testar navegação:
   - Ir para `/catalogo`
   - Adicionar produto ao carrinho
   - Ir para `/login`
   - Fazer login com admin

#### 4. Testar MySQL

```bash
mysql -u segredo_user -p segredodosabor -e "SELECT COUNT(*) as total_produtos FROM produto;"

# Deve retornar número de produtos
```

#### 5. Testar Evolution API

```bash
# Status do container
docker ps | grep evolution

# Testar API
curl http://localhost:8080

# Ver logs
docker logs evolution-api --tail 50
```

#### 6. Testar WhatsApp (se configurado)

**Enviar mensagem de teste:**

```bash
curl -X POST http://localhost:5000/api/whatsapp/enviar-mensagem-manual \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -d '{
    "telefone": "5511999999999",
    "mensagem": "Teste de envio via API!"
  }'
```

#### 7. Testar Simulador de Custos

```bash
curl -X POST http://20.201.45.123/api/simulacao/custo \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -d '{
    "idproduto": 1,
    "receita_simulada": [
      {"idingrediente": 1, "quantidade": 250}
    ]
  }'
```

### Testes de Carga (Opcional)

```bash
# Instalar Apache Bench
sudo apt install -y apache2-utils

# Teste de carga (100 requisições, 10 concorrentes)
ab -n 100 -c 10 http://localhost:5000/produto/listar
```

---

## 1️⃣4️⃣ MONITORAMENTO E LOGS

### Ver Logs em Tempo Real

```bash
# Backend (PM2)
pm2 logs segredo-backend

# Nginx - Access
sudo tail -f /var/log/nginx/segredodosabor-access.log

# Nginx - Error
sudo tail -f /var/log/nginx/segredodosabor-error.log

# MySQL - Error
sudo tail -f /var/log/mysql/error.log

# Evolution API
docker logs -f evolution-api

# Sistema
sudo journalctl -f
```

### Monitorar Recursos

```bash
# CPU e Memória
htop

# Instalar se não tiver:
sudo apt install -y htop

# Espaço em disco
df -h

# Uso de disco por diretório
du -sh /var/www/segredodosabor/*

# Conexões de rede
sudo netstat -tlnp
```

### Verificar Status dos Serviços

```bash
# Status geral
sudo systemctl status nginx
sudo systemctl status mysql
docker ps

# PM2
pm2 status

# Processos
ps aux | grep node
ps aux | grep nginx
```

### Configurar Monitoramento Avançado (Opcional)

**Instalar Netdata:**

```bash
# Instalar
bash <(curl -Ss https://my-netdata.io/kickstart.sh)

# Acessar dashboard (criar túnel SSH)
# http://localhost:19999
```

---

## 1️⃣5️⃣ BACKUP AUTOMÁTICO

### Criar Script de Backup

```bash
# Criar diretório
sudo mkdir -p /opt/backups
sudo chown $USER:$USER /opt/backups

# Criar script
nano /opt/backups/backup-segredo.sh
```

**Script:**

```bash
#!/bin/bash

# Configurações
BACKUP_DIR="/opt/backups"
DB_NAME="segredodosabor"
DB_USER="segredo_user"
DB_PASS="S3gr3d0MySQL@2025"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=7

# Criar diretório do dia
mkdir -p "$BACKUP_DIR/$DATE"

# Backup do Banco de Dados
echo "Fazendo backup do banco de dados..."
mysqldump -u $DB_USER -p$DB_PASS $DB_NAME | gzip > "$BACKUP_DIR/$DATE/database_$DATE.sql.gz"

# Backup dos arquivos (uploads, etc)
echo "Fazendo backup dos arquivos..."
tar -czf "$BACKUP_DIR/$DATE/files_$DATE.tar.gz" /var/www/segredodosabor/backend/storage

# Backup da configuração
echo "Fazendo backup das configurações..."
cp /var/www/segredodosabor/backend/.env "$BACKUP_DIR/$DATE/backend.env"
cp /var/www/segredodosabor/frontend/.env "$BACKUP_DIR/$DATE/frontend.env"
cp /etc/nginx/sites-available/segredodosabor "$BACKUP_DIR/$DATE/nginx.conf"

# Remover backups antigos
echo "Removendo backups com mais de $RETENTION_DAYS dias..."
find $BACKUP_DIR -type d -mtime +$RETENTION_DAYS -exec rm -rf {} +

# Listar backups
echo "Backups disponíveis:"
ls -lh $BACKUP_DIR/

echo "Backup concluído: $BACKUP_DIR/$DATE"
```

**Salvar**: `Ctrl+O`, `Enter`, `Ctrl+X`

### Dar Permissão de Execução

```bash
chmod +x /opt/backups/backup-segredo.sh
```

### Agendar Backup Diário

```bash
# Editar crontab
crontab -e

# Adicionar linha (backup todo dia às 3h da manhã):
0 3 * * * /opt/backups/backup-segredo.sh >> /var/log/backup-segredo.log 2>&1
```

### Testar Backup

```bash
# Executar manualmente
/opt/backups/backup-segredo.sh

# Ver resultado
ls -lh /opt/backups/
```

### Restaurar Backup

```bash
# Escolher backup
cd /opt/backups/20250101_030000

# Restaurar banco
gunzip < database_20250101_030000.sql.gz | mysql -u segredo_user -p segredodosabor

# Restaurar arquivos
tar -xzf files_20250101_030000.tar.gz -C /
```

### Backup na Nuvem (Opcional)

**Usar Azure Blob Storage:**

```bash
# Instalar Azure CLI
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

# Login
az login

# Enviar backup
az storage blob upload \
  --account-name seuaccount \
  --container-name backups \
  --file /opt/backups/20250101_030000/database_20250101_030000.sql.gz \
  --name segredodosabor/database_20250101_030000.sql.gz
```

---

## 1️⃣6️⃣ SOLUÇÃO DE PROBLEMAS

### Backend não inicia

**Sintoma:** PM2 mostra status "errored"

```bash
# Ver logs de erro
pm2 logs segredo-backend --err

# Possíveis causas:

# 1. Erro no .env
cat /var/www/segredodosabor/backend/.env
# Verificar se todas as variáveis estão corretas

# 2. Banco não conecta
mysql -u segredo_user -p segredodosabor
# Se não conectar, verificar senha e permissões

# 3. Porta em uso
sudo netstat -tlnp | grep 5000
# Se aparecer processo, matar:
sudo kill -9 PID

# 4. Dependências faltando
cd /var/www/segredodosabor/backend
npm install

# Reiniciar
pm2 restart segredo-backend
```

### Frontend mostra página em branco

**Sintoma:** Navegador carrega mas tela fica branca

```bash
# 1. Ver console do navegador (F12)
# Procurar erros de API

# 2. Verificar build
ls -la /var/www/segredodosabor/frontend/build/
# Deve ter index.html e pasta static/

# 3. Verificar variável de ambiente
cat /var/www/segredodosabor/frontend/.env
# REACT_APP_API_URL deve estar correto

# 4. Rebuild
cd /var/www/segredodosabor/frontend
rm -rf build
npm run build

# 5. Limpar cache do navegador
# Ctrl+Shift+Delete
```

### Nginx retorna 502 Bad Gateway

**Sintoma:** Erro 502 ao acessar site

```bash
# 1. Backend está rodando?
pm2 status

# 2. Backend responde?
curl http://localhost:5000/

# 3. Ver logs do Nginx
sudo tail -f /var/log/nginx/segredodosabor-error.log

# 4. Testar configuração
sudo nginx -t

# 5. Reiniciar Nginx
sudo systemctl restart nginx
```

### MySQL não conecta

```bash
# 1. MySQL está rodando?
sudo systemctl status mysql

# 2. Iniciar se estiver parado
sudo systemctl start mysql

# 3. Testar conexão
mysql -u segredo_user -p segredodosabor

# 4. Ver logs de erro
sudo tail -f /var/log/mysql/error.log

# 5. Verificar bind-address
sudo grep bind-address /etc/mysql/mysql.conf.d/mysqld.cnf
# Deve ser: 127.0.0.1

# 6. Reiniciar
sudo systemctl restart mysql
```

### Evolution API não conecta WhatsApp

```bash
# 1. Container rodando?
docker ps | grep evolution

# 2. Ver logs
docker logs evolution-api

# 3. Reiniciar container
docker restart evolution-api

# 4. Recriar instância
# Acessar http://localhost:8080 e criar nova instância

# 5. Verificar webhook
curl http://localhost:8080/webhook/find/segredodosabor \
  -H "apikey: segredodosabor2025"
```

### Disco cheio

```bash
# Ver uso de disco
df -h

# Encontrar arquivos grandes
sudo du -sh /* | sort -h

# Limpar logs antigos
sudo journalctl --vacuum-time=7d

# Limpar cache do sistema
sudo apt clean
sudo apt autoclean

# Limpar logs do Nginx
sudo truncate -s 0 /var/log/nginx/*.log

# Limpar logs do PM2
pm2 flush
```

### SSL não funciona

```bash
# 1. Certificado existe?
sudo certbot certificates

# 2. Renovar certificado
sudo certbot renew

# 3. Verificar configuração Nginx
sudo nginx -t

# 4. Ver logs do Certbot
sudo cat /var/log/letsencrypt/letsencrypt.log

# 5. DNS correto?
dig seudominio.com.br +short
```

### Performance ruim

```bash
# 1. Ver uso de recursos
htop

# 2. Ver processos mais pesados
top -o %CPU

# 3. Ver conexões
sudo netstat -ant | wc -l

# 4. Aumentar workers do PM2
pm2 scale segredo-backend +1

# 5. Otimizar MySQL
sudo mysqltuner

# 6. Ativar cache no Nginx
# Adicionar em /etc/nginx/sites-available/segredodosabor:
# proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=api_cache:10m;
```

---

## 📝 CHECKLIST FINAL

### Antes de ir para produção:

- [ ] ✅ VM criada e provisionada
- [ ] ✅ Portas configuradas (22, 80, 443)
- [ ] ✅ Node.js instalado
- [ ] ✅ MySQL instalado e configurado
- [ ] ✅ Nginx instalado
- [ ] ✅ Docker instalado
- [ ] ✅ PM2 instalado
- [ ] ✅ Banco de dados importado
- [ ] ✅ Backend configurado e rodando (PM2)
- [ ] ✅ Frontend buildado e servido (Nginx)
- [ ] ✅ Evolution API rodando (Docker)
- [ ] ✅ SSL configurado (HTTPS)
- [ ] ✅ Domínio apontando para VM
- [ ] ✅ Backup automático configurado
- [ ] ✅ Monitoramento configurado
- [ ] ✅ Todos os endpoints testados
- [ ] ✅ WhatsApp conectado e testado
- [ ] ✅ Usuário admin criado
- [ ] ✅ Logs verificados (sem erros)

### Testes finais:

- [ ] ✅ Site carrega (frontend)
- [ ] ✅ Login funciona
- [ ] ✅ Catálogo mostra produtos
- [ ] ✅ Adicionar ao carrinho funciona
- [ ] ✅ Checkout completo funciona
- [ ] ✅ Painel admin acessível
- [ ] ✅ CRUD de produtos funciona
- [ ] ✅ Upload de imagens funciona
- [ ] ✅ Simulador de custos funciona
- [ ] ✅ WhatsApp envia mensagens
- [ ] ✅ Bot responde automaticamente
- [ ] ✅ Relatórios geram PDF
- [ ] ✅ Sistema responsivo (mobile)
- [ ] ✅ Acessibilidade funciona (VLibras)

---

## 🎉 CONCLUSÃO

### URLs do Sistema:

```
Frontend: https://seudominio.com.br
Backend API: https://seudominio.com.br/api
Painel Admin: https://seudominio.com.br/gerenciamentos
Evolution API: http://localhost:8080 (apenas via SSH tunnel)
```

### Credenciais Padrão:

```
Admin:
Email: admin@segredodosabor.com
Senha: Admin@2025

MySQL:
User: segredo_user
Password: S3gr3d0MySQL@2025
Database: segredodosabor

Evolution API:
API Key: segredodosabor2025
Instance: segredodosabor
```

### Comandos Úteis:

```bash
# Ver status geral
pm2 status
sudo systemctl status nginx
sudo systemctl status mysql
docker ps

# Reiniciar tudo
pm2 restart all
sudo systemctl restart nginx
sudo systemctl restart mysql
docker restart evolution-api

# Ver logs
pm2 logs
sudo tail -f /var/log/nginx/segredodosabor-access.log
docker logs -f evolution-api

# Backup manual
/opt/backups/backup-segredo.sh

# Atualizar código
cd /var/www/segredodosabor
git pull
cd backend && npm install && pm2 restart segredo-backend
cd frontend && npm install && npm run build
```

### Suporte e Documentação:

- 📚 API: `/api-docs` (se configurado Swagger)
- 📖 Docs: `/var/www/segredodosabor/*.md`
- 🐛 Logs: `/var/log/pm2/` e `/var/log/nginx/`
- 💾 Backups: `/opt/backups/`

---

## 🔐 SEGURANÇA - CHECKLIST

- [ ] ✅ Senha forte no MySQL
- [ ] ✅ Firewall configurado (apenas portas necessárias)
- [ ] ✅ SSH com chave (sem senha)
- [ ] ✅ JWT_SECRET alterado
- [ ] ✅ SSL/HTTPS ativo
- [ ] ✅ Headers de segurança no Nginx
- [ ] ✅ Usuário não-root para aplicação
- [ ] ✅ Backup automático funcionando
- [ ] ✅ Logs sendo monitorados
- [ ] ✅ Portas internas não expostas (3306, 5000, 8080)

---

## 📞 PRÓXIMOS PASSOS

1. **Configurar domínio personalizado**
2. **Ativar SSL/HTTPS**
3. **Conectar WhatsApp Business**
4. **Configurar Google Analytics** (opcional)
5. **Integrar pagamentos** (PagSeguro, Mercado Pago, etc)
6. **Configurar email transacional** (SendGrid, AWS SES)
7. **Monitoramento avançado** (Datadog, New Relic)
8. **CDN** (Cloudflare, Azure CDN)

---

**Sistema**: Segredo do Sabor v5.0  
**Deploy**: Microsoft Azure  
**Status**: 100% Completo e Pronto para Produção  
**Data**: 01/11/2025  

🚀 **BOA SORTE COM O DEPLOY!** 🚀
