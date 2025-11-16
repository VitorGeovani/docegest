# ✅ Checklist Rápido - Evolution API + Azure

## 📋 Preparação (10 min)

- [ ] Conta Azure Education criada
- [ ] Crédito $100 USD disponível
- [ ] VM criada (B2s, Ubuntu 22.04)
- [ ] Portas abertas: 22, 80, 443, 8080, 5000, 3306
- [ ] IP público anotado: `____________`
- [ ] Chave SSH baixada: `.pem`
- [ ] WhatsApp Business instalado no celular
- [ ] Número exclusivo disponível: `____________`

---

## 🚀 Instalação Rápida (30 min)

### 1. Conectar na VM

```bash
# Windows PowerShell
ssh -i docegest-key.pem azureuser@SEU_IP
```

### 2. Fazer Upload do Script

```bash
# No seu PC
scp -i docegest-key.pem install-evolution-docegest.sh azureuser@SEU_IP:~/
```

### 3. Executar Instalação

```bash
# Na VM
chmod +x install-evolution-docegest.sh
./install-evolution-docegest.sh
```

**Responder perguntas:**
- Porta Evolution: `8080` ✅
- Porta Backend: `5000` ✅
- Nome instância: `docegest-whatsapp` ✅
- Seu WhatsApp: `55119XXXXXXXX` ⚠️
- Senha MySQL root: `P@$$w0rd` ✅
- Senha MySQL docegest: `Docegest@2025` ✅

### 4. Conectar WhatsApp

- [ ] Acessar: `http://SEU_IP:8080`
- [ ] Manager → Create Instance → Nome: `docegest-whatsapp`
- [ ] Escanear QR Code com WhatsApp Business
- [ ] Aguardar status: ✅ **Connected**

### 5. Testar Envio

```bash
# Enviar mensagem teste
curl -X POST http://localhost:8080/message/sendText/docegest-whatsapp \
  -H "Content-Type: application/json" \
  -H "apikey: SUA_API_KEY" \
  -d '{"number":"SEU_NUMERO","text":"✅ Evolution API funcionando!"}'
```

- [ ] Mensagem recebida no WhatsApp

---

## 📦 Deploy Backend (15 min)

### 6. Upload Projeto

**Opção A - Git:**
```bash
cd ~
git clone https://github.com/VitorGeovani/docegest.git
```

**Opção B - SCP (no seu PC):**
```bash
scp -i docegest-key.pem -r D:\Downloads\Segredo-do-Sabor azureuser@SEU_IP:~/docegest
```

### 7. Configurar Backend

```bash
cd ~/docegest/backend
cp ~/.env-docegest .env
npm install
```

### 8. Importar Banco

```bash
mysql -u docegest -p segredodosabor < ~/docegest/BANCO_DADOS_COMPLETO.sql
# Senha: Docegest@2025
```

### 9. Criar Admin

```bash
node criar-admin.js
```

### 10. Iniciar Backend

```bash
pm2 start npm --name "docegest-backend" -- start
pm2 save
pm2 startup
```

---

## 🎨 Deploy Frontend (10 min)

### 11. Instalar Nginx

```bash
sudo apt install -y nginx
```

### 12. Build Frontend

```bash
cd ~/docegest/frontend
npm install
echo "REACT_APP_API_URL=http://SEU_IP:5000" > .env
npm run build
```

### 13. Configurar Nginx

```bash
sudo cp -r build/* /var/www/html/
sudo systemctl restart nginx
```

### 14. Testar Acesso

- [ ] Frontend: `http://SEU_IP`
- [ ] Backend: `http://SEU_IP:5000`
- [ ] Evolution: `http://SEU_IP:8080`

---

## 🔒 Segurança (5 min)

### 15. Configurar Firewall

```bash
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw allow 8080/tcp
sudo ufw allow 5000/tcp
sudo ufw enable
```

### 16. Proteger Evolution API

```bash
sudo apt install -y apache2-utils
sudo htpasswd -c /etc/nginx/.htpasswd admin
# Digite senha forte
```

---

## ✅ Validação Final

### Status dos Serviços

```bash
~/status.sh
```

**Deve mostrar:**
- [ ] ✅ Docker: evolution-api (Up)
- [ ] ✅ PM2: docegest-backend (online)
- [ ] ✅ MySQL: active
- [ ] ✅ Nginx: active

### Teste Completo E2E

1. **Acessar Frontend:**
   - [ ] Abrir: `http://SEU_IP`
   - [ ] Fazer login: `admin@segredodosabor.com` / `admin123`

2. **Criar Pedido Teste:**
   - [ ] Catálogo → Adicionar produto
   - [ ] Carrinho → Finalizar
   - [ ] Informar telefone com DDD
   - [ ] Confirmar pedido

3. **Verificar WhatsApp:**
   - [ ] Mensagem de confirmação recebida
   - [ ] Código do pedido presente
   - [ ] Valor e itens corretos

---

## 📊 Monitoramento

### Comandos Úteis

```bash
# Ver logs Evolution
docker logs -f evolution-api

# Ver logs Backend
pm2 logs docegest-backend

# Reiniciar Evolution
cd ~/evolution-api && docker compose restart

# Reiniciar Backend
pm2 restart docegest-backend

# Backup manual
~/backup-evolution.sh

# Status geral
~/status.sh
```

### Crons Configurados

- [ ] Backup diário (2h): `/home/azureuser/backup-evolution.sh`
- [ ] Healthcheck (5min): `/home/azureuser/healthcheck-evolution.sh`

```bash
# Ver crons
crontab -l
```

---

## 🐛 Troubleshooting Rápido

### Evolution API não inicia
```bash
docker logs evolution-api
cd ~/evolution-api && docker compose restart
```

### WhatsApp desconecta
```bash
# Reconectar
curl -X GET http://localhost:8080/instance/connect/docegest-whatsapp \
  -H "apikey: SUA_API_KEY"
```

### Backend não conecta
```bash
# Verificar .env
cat ~/docegest/backend/.env | grep EVOLUTION

# Testar Evolution
curl http://localhost:8080
```

### Mensagens não chegam
```bash
# Verificar status WhatsApp
curl -X GET http://localhost:8080/instance/connectionState/docegest-whatsapp \
  -H "apikey: SUA_API_KEY"

# Formato número: 5511967696744 (código país + DDD + número)
```

---

## 📝 Dados de Acesso

**Anote aqui suas credenciais:**

```
IP Público Azure: _______________

Evolution API:
- URL: http://_______________:8080
- API Key: _______________________________
- Instância: docegest-whatsapp

MySQL:
- Host: localhost
- Database: segredodosabor
- User: docegest
- Password: Docegest@2025

Backend:
- URL: http://_______________:5000
- Admin Email: admin@segredodosabor.com
- Admin Password: admin123

WhatsApp:
- Número: _______________
- Status: ☐ Conectado  ☐ Desconectado

Frontend:
- URL: http://_______________
```

---

## 🎯 Próximos Passos

- [ ] Registrar domínio personalizado
- [ ] Configurar SSL/HTTPS com Certbot
- [ ] Configurar webhooks para receber mensagens
- [ ] Implementar respostas automáticas
- [ ] Integrar ChatBot/IA
- [ ] Configurar múltiplas instâncias WhatsApp
- [ ] Migrar para Azure MySQL (opcional)
- [ ] Configurar load balancer (opcional)

---

## 📚 Documentação Completa

- [TUTORIAL_EVOLUTION_API_DOCKER_AZURE.md](./TUTORIAL_EVOLUTION_API_DOCKER_AZURE.md) - Tutorial completo passo a passo
- [CONFIGURACAO_WHATSAPP.md](./CONFIGURACAO_WHATSAPP.md) - Configurações WhatsApp
- [API_DOCUMENTATION.md](./backend/API_DOCUMENTATION.md) - Documentação da API
- [COMANDOS_DEPLOY_AZURE.md](./COMANDOS_DEPLOY_AZURE.md) - Comandos Azure

---

**✅ Lista completada em:** ___/___/2025

**👤 Responsável:** _________________

**📧 Suporte:** https://github.com/EvolutionAPI/evolution-api/issues
