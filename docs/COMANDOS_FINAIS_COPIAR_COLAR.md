# ⚡ COMANDOS FINAIS - COPIAR E COLAR

## 🔄 AGUARDE OS UPLOADS TERMINAREM

Quando você ver "100%" nos uploads de backend e frontend, execute os comandos abaixo.

---

## 📋 COMANDOS PARA EXECUTAR (COPIE TUDO DE UMA VEZ)

### 1️⃣ Conectar ao Servidor

```powershell
ssh -i D:\Downloads\segredo-sabor-key.pem azureuser@20.163.57.236
```

---

### 2️⃣ Executar Script de Instalação Base (SE AINDA NÃO RODOU)

Dentro do servidor, execute:

```bash
# Verificar se Node.js está instalado
node --version

# Se não aparecer a versão, execute o script:
sudo bash ~/deploy-azure-completo.sh
```

**⏱️ Aguarde ~10 minutos** até aparecer "✅ INSTALAÇÃO BASE CONCLUÍDA!"

---

### 3️⃣ Mover Arquivos para Pasta Correta

```bash
sudo mv ~/backend /var/www/segredodosabor/
sudo mv ~/frontend /var/www/segredodosabor/
sudo mv ~/INSTALACAO_BANCO_COMPLETO.sql /var/www/segredodosabor/
sudo mv ~/configurar-nginx.sh /var/www/segredodosabor/
sudo chown -R azureuser:azureuser /var/www/segredodosabor
```

---

### 4️⃣ Importar Banco de Dados

```bash
cd /var/www/segredodosabor
mysql -usegredo_user -p'P@$$w0rd' segredodosabor < INSTALACAO_BANCO_COMPLETO.sql
```

**Verificar:**

```bash
mysql -usegredo_user -p'P@$$w0rd' segredodosabor -e "SHOW TABLES;"
```

**✅ Deve mostrar 21 tabelas!**

---

### 5️⃣ Configurar e Iniciar Backend

```bash
cd /var/www/segredodosabor/backend
cp /var/www/segredodosabor/.env.backend .env
npm install
mkdir -p uploads
pm2 delete segredo-backend 2>/dev/null || true
pm2 start src/server.js --name segredo-backend
pm2 save
```

**Configurar auto-start:**

```bash
pm2 startup
```

**⚠️ IMPORTANTE**: Copie e cole o comando que aparecer (começa com `sudo env PATH=...`)

**Verificar:**

```bash
pm2 status
pm2 logs segredo-backend --lines 20
```

---

### 6️⃣ Configurar e Buildar Frontend

```bash
cd /var/www/segredodosabor/frontend
cp /var/www/segredodosabor/.env.frontend .env
npm install
npm run build
sudo chown -R www-data:www-data build/
```

---

### 7️⃣ Configurar Nginx

```bash
cd /var/www/segredodosabor
sudo bash configurar-nginx.sh
```

---

### 8️⃣ Verificar Status Final

```bash
echo "=== PM2 Status ==="
pm2 status

echo ""
echo "=== Nginx Status ==="
sudo systemctl status nginx --no-pager | head -10

echo ""
echo "=== MySQL Status ==="
sudo systemctl status mysql --no-pager | head -10

echo ""
echo "=== Testar Backend ==="
curl http://localhost:5000/

echo ""
echo "=== Testar via Nginx ==="
curl http://20.163.57.236/api/
```

---

## 9️⃣ ABRIR NO NAVEGADOR

No seu PC Windows, abra o navegador e acesse:

### 🌐 URLs do Sistema

- **Frontend**: http://20.163.57.236
- **Admin**: http://20.163.57.236/gerenciamentos
- **Catálogo**: http://20.163.57.236/catalogo
- **API**: http://20.163.57.236/api

### 🔐 Credenciais Admin

- **Email**: admin@segredodosabor.com
- **Senha**: Admin@123

---

## 🆘 SE ALGO DER ERRADO

### Backend não inicia

```bash
cd /var/www/segredodosabor/backend
cat .env
pm2 logs segredo-backend
```

### Página em branco

```bash
cd /var/www/segredodosabor/frontend
ls -la build/
cat .env
```

### Erro 502 Bad Gateway

```bash
pm2 restart segredo-backend
sudo systemctl restart nginx
pm2 logs segredo-backend
```

### Ver todos os logs

```bash
# Backend
pm2 logs segredo-backend

# Nginx Access
sudo tail -50 /var/log/nginx/segredodosabor-access.log

# Nginx Error
sudo tail -50 /var/log/nginx/segredodosabor-error.log
```

---

## 📊 COMANDOS ÚTEIS PÓS-DEPLOY

### Reiniciar tudo

```bash
pm2 restart all
sudo systemctl restart nginx
```

### Fazer backup

```bash
sudo /opt/backups/backup-segredo.sh
ls -lh /opt/backups/
```

### Ver recursos do servidor

```bash
free -h
df -h
pm2 monit
```

### Desconectar do SSH

```bash
exit
```

---

## 🎬 ANTES DA APRESENTAÇÃO

```bash
# Conectar ao servidor
ssh -i D:\Downloads\segredo-sabor-key.pem azureuser@20.163.57.236

# Limpar logs
pm2 flush
sudo truncate -s 0 /var/log/nginx/*.log

# Reiniciar tudo
pm2 restart all
sudo systemctl restart nginx

# Verificar status
pm2 status
sudo systemctl status nginx
curl http://20.163.57.236/api/

# Sair
exit
```

---

## 🎉 CHECKLIST FINAL

Antes de apresentar, verifique:

- [ ] Frontend abre: http://20.163.57.236
- [ ] Admin abre: http://20.163.57.236/gerenciamentos
- [ ] Login funciona (admin@segredodosabor.com / Admin@123)
- [ ] Dashboard carrega dados
- [ ] CRUD de produtos funciona
- [ ] Catálogo mostra produtos
- [ ] VLibras aparece no canto inferior direito

---

**✅ TUDO PRONTO PARA A APRESENTAÇÃO!** 🚀

**IP do Sistema**: 20.163.57.236  
**Admin**: admin@segredodosabor.com / Admin@123
