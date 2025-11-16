# ⚡ COMANDOS COMPLETOS - COPIAR E COLAR

## Deploy Segredo do Sabor - Azure Educacional

**Tempo total**: ~30 minutos  
**Crédito usado**: $0,00 de $100,00 ✅

---

## 📋 PRÉ-REQUISITOS

- ✅ VM Azure B1s criada (grátis)
- ✅ Chave SSH baixada (`.pem`)
- ✅ IP público anotado

---

## 🚀 PASSO 1: CONECTAR VIA SSH (2 min)

### Windows PowerShell:

```powershell
# Ir para pasta da chave
cd C:\Users\SeuUsuario\Downloads

# Corrigir permissões
icacls "segredo-do-sabor-key.pem" /inheritance:r
icacls "segredo-do-sabor-key.pem" /grant:r "%username%:R"

# Conectar (TROCAR 20.206.123.45 pelo seu IP!)
ssh -i segredo-do-sabor-key.pem azureuser@20.206.123.45
```

**Aceitar fingerprint:**
```
yes
```

---

## 🚀 PASSO 2: FAZER UPLOAD DO SCRIPT (1 min)

### No seu PC (PowerShell):

```powershell
# Ir para pasta do projeto
cd D:\Downloads\Segredo-do-Sabor

# Enviar script (TROCAR IP!)
scp -i segredo-do-sabor-key.pem deploy-rapido.sh azureuser@20.206.123.45:~/
```

---

## 🚀 PASSO 3: EXECUTAR DEPLOY AUTOMÁTICO (15 min)

### Na VM (SSH):

```bash
# Dar permissão
chmod +x ~/deploy-rapido.sh

# Executar (TROCAR pelo seu IP!)
sudo bash ~/deploy-rapido.sh 20.206.123.45
```

**Aguardar instalação automática...**

✅ Instala: Node.js, MySQL, Nginx, Docker, PM2

---

## 🚀 PASSO 4: ENVIAR CÓDIGO (3 min)

### No seu PC (PowerShell):

```powershell
# Compactar projeto
cd D:\Downloads\Segredo-do-Sabor
tar -czf app.tar.gz backend frontend *.sql

# Enviar (TROCAR IP!)
scp -i segredo-do-sabor-key.pem app.tar.gz azureuser@20.206.123.45:~/
```

---

## 🚀 PASSO 5: EXTRAIR CÓDIGO (1 min)

### Na VM (SSH):

```bash
# Extrair
cd /var/www/segredodosabor
sudo tar -xzf ~/app.tar.gz
sudo chown -R azureuser:azureuser .
```

---

## 🚀 PASSO 6: CONFIGURAR BACKEND (3 min)

### Na VM (SSH):

```bash
# Copiar .env
cd /var/www/segredodosabor/backend
cp /var/www/segredodosabor/.env.backend .env

# Instalar dependências
npm install
```

---

## 🚀 PASSO 7: IMPORTAR BANCO DE DADOS (2 min)

### Na VM (SSH):

```bash
# Importar estrutura
cd /var/www/segredodosabor
sudo mysql -u segredo_user -pP@\$\$w0rd segredodosabor < BANCO_DADOS_COMPLETO.sql

# Importar tabela WhatsApp
sudo mysql -u segredo_user -pP@\$\$w0rd segredodosabor < criar-tabela-mensagens-whatsapp-completa.sql
```

---

## 🚀 PASSO 8: CRIAR USUÁRIO ADMIN (1 min)

### Na VM (SSH):

```bash
sudo mysql -u segredo_user -pP@\$\$w0rd segredodosabor << 'SQL'
INSERT INTO cliente (nome, telefone, email, senha, tipo, ativo, criado_em) VALUES
('Administrador', '5511967696744', 'admin@segredodosabor.com', 
'$2b$10$rKJZQY9K5F8vXr5h.X6t3.jN1ZGy7hD8kP0mNxQ6fW8zL9vE4tC2S', 
'admin', 1, NOW());
SQL
```

---

## 🚀 PASSO 9: INICIAR BACKEND (2 min)

### Na VM (SSH):

```bash
# Iniciar com PM2
cd /var/www/segredodosabor/backend
pm2 start src/server.js --name segredo-backend

# Salvar configuração
pm2 save

# Configurar auto-start
pm2 startup
```

**Copiar e executar o comando que aparecer!**

Exemplo:
```bash
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u azureuser --hp /home/azureuser
```

---

## 🚀 PASSO 10: CONFIGURAR FRONTEND (5 min)

### Na VM (SSH):

```bash
# Copiar .env
cd /var/www/segredodosabor/frontend
cp /var/www/segredodosabor/.env.frontend .env

# Instalar dependências
npm install

# Criar build de produção
npm run build

# Ajustar permissões
sudo chown -R www-data:www-data build/
```

---

## ✅ PASSO 11: TESTAR SISTEMA (2 min)

### Na VM (SSH):

```bash
# Verificar serviços
pm2 status
sudo systemctl status nginx
sudo systemctl status mysql

# Testar backend
curl http://localhost:5000/

# Testar API via Nginx
curl http://localhost/api/
```

### No navegador do seu PC:

**TROCAR pelo seu IP!**
```
http://20.206.123.45
```

✅ **Sistema funcionando!**

---

## 📱 BONUS: CONFIGURAR WHATSAPP (Opcional - 5 min)

### Passo 1: Instalar Evolution API

```bash
# Na VM:
sudo docker run -d \
  --name evolution-api \
  --restart unless-stopped \
  -p 8080:8080 \
  -e AUTHENTICATION_API_KEY=segredodosabor2025 \
  atendai/evolution-api:latest
```

### Passo 2: Criar Túnel SSH (do seu PC)

```powershell
# PowerShell (TROCAR IP!):
ssh -i segredo-do-sabor-key.pem -L 8080:localhost:8080 azureuser@20.206.123.45
```

### Passo 3: Acessar Evolution API

**No navegador:** `http://localhost:8080`

### Passo 4: Criar Instância (via Swagger)

**POST** `/instance/create`

**Body:**
```json
{
  "instanceName": "segredodosabor",
  "token": "segredodosabor2025",
  "qrcode": true
}
```

### Passo 5: Escanear QR Code

Usar WhatsApp no celular: **+55 11 96769-6744**

### Passo 6: Configurar Webhook (na VM)

```bash
curl -X POST http://localhost:8080/webhook/set/segredodosabor \
  -H "apikey: segredodosabor2025" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "http://localhost:5000/whatsapp/webhook",
    "events": ["messages.upsert"]
  }'
```

✅ **WhatsApp conectado!**

---

## 🎬 PREPARAR APRESENTAÇÃO

### Checklist Final:

```bash
# Na VM:

# 1. Verificar tudo rodando
pm2 status
sudo systemctl status nginx mysql
docker ps

# 2. Ver logs
pm2 logs segredo-backend --lines 20

# 3. Limpar logs (apresentação limpa)
pm2 flush
sudo truncate -s 0 /var/log/nginx/*.log

# 4. Fazer backup
sudo /opt/backups/backup.sh
```

---

## 📊 CREDENCIAIS

### Sistema:

```
URL: http://SEU_IP

Admin:
Email: admin@segredodosabor.com
Senha: Admin@2025

MySQL:
User: segredo_user
Pass: P@$$w0rd

WhatsApp: +55 11 96769-6744
```

---

## 🆘 TROUBLESHOOTING RÁPIDO

### Backend não inicia:

```bash
pm2 logs segredo-backend --err
cd /var/www/segredodosabor/backend
npm install
pm2 restart segredo-backend
```

### Frontend página branca:

```bash
cd /var/www/segredodosabor/frontend
npm run build
sudo chown -R www-data:www-data build/
```

### Erro 502:

```bash
pm2 restart all
sudo systemctl restart nginx
```

### MySQL não conecta:

```bash
sudo systemctl restart mysql
sudo mysql -u segredo_user -pP@\$\$w0rd segredodosabor
```

---

## 💾 COMANDOS ÚTEIS

### Ver status geral:

```bash
pm2 status
sudo systemctl status nginx mysql
docker ps
```

### Ver logs em tempo real:

```bash
# Backend
pm2 logs

# Nginx
sudo tail -f /var/log/nginx/segredodosabor-access.log

# Recursos
htop
```

### Reiniciar tudo:

```bash
pm2 restart all
sudo systemctl restart nginx mysql
docker restart evolution-api
```

### Fazer backup manual:

```bash
sudo /opt/backups/backup.sh
ls -lh /opt/backups/
```

---

## 📈 VERIFICAR CUSTOS

**Portal Azure:**
1. Gerenciamento de Custos
2. Análise de custos
3. Filtrar: `segredo-sabor-rg`

**Esperado**: $0,00 ✅

---

## 🎯 RESUMO DOS COMANDOS

```bash
# 1. Conectar SSH
ssh -i chave.pem azureuser@IP

# 2. Upload e executar script
scp -i chave.pem deploy-rapido.sh azureuser@IP:~/
sudo bash ~/deploy-rapido.sh IP

# 3. Enviar código
tar -czf app.tar.gz backend frontend *.sql
scp -i chave.pem app.tar.gz azureuser@IP:~/

# 4. Extrair
cd /var/www/segredodosabor
sudo tar -xzf ~/app.tar.gz
sudo chown -R azureuser:azureuser .

# 5. Backend
cd backend
cp ../.env.backend .env
npm install

# 6. Banco
cd ..
sudo mysql -u segredo_user -pP@\$\$w0rd segredodosabor < BANCO_DADOS_COMPLETO.sql
sudo mysql -u segredo_user -pP@\$\$w0rd segredodosabor < criar-tabela-mensagens-whatsapp-completa.sql

# 7. Admin
sudo mysql -u segredo_user -pP@\$\$w0rd segredodosabor << 'SQL'
INSERT INTO cliente VALUES (NULL, 'Administrador', '5511967696744', 'admin@segredodosabor.com', '$2b$10$rKJZQY9K5F8vXr5h.X6t3.jN1ZGy7hD8kP0mNxQ6fW8zL9vE4tC2S', 'admin', 1, NOW(), NOW());
SQL

# 8. Iniciar backend
cd backend
pm2 start src/server.js --name segredo-backend
pm2 save
pm2 startup

# 9. Frontend
cd ../frontend
cp ../.env.frontend .env
npm install
npm run build
sudo chown -R www-data:www-data build/

# 10. Testar
curl http://localhost:5000/
curl http://localhost/api/
```

**Acessar**: `http://SEU_IP` ✅

---

**Versão**: 5.0 Educacional  
**Tempo**: ~30 minutos  
**Custo**: $0,00 (Free Tier)  

🎓 **SUCESSO NA APRESENTAÇÃO!** 🎓
