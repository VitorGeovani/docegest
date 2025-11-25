# 🚀 GUIA RÁPIDO DE DEPLOY - PASSO A PASSO MANUAL

## IP do seu servidor: **20.163.57.236**
## Chave SSH: **D:\Downloads\segredo-sabor-key.pem**

---

## ✅ PASSO 1: Verificar se o script base rodou

```powershell
ssh -i D:\Downloads\segredo-sabor-key.pem azureuser@20.163.57.236
```

Dentro do servidor, execute:
```bash
node --version
npm --version
mysql --version
nginx -v
pm2 --version
```

**Se algum não estiver instalado**, execute:
```bash
sudo bash ~/deploy-azure-completo.sh
```

Aguarde ~10 minutos até concluir. Depois digite `exit` para sair.

---

## ✅ PASSO 2: Enviar configurar-nginx.sh para o servidor

No PowerShell do Windows:

```powershell
cd D:\Downloads\Segredo-do-Sabor
scp -i D:\Downloads\segredo-sabor-key.pem configurar-nginx.sh azureuser@20.163.57.236:~/
```

---

## ✅ PASSO 3: Criar arquivo compactado do projeto

### Opção A: Usando 7-Zip (se tiver instalado)

```powershell
cd D:\Downloads\Segredo-do-Sabor
7z a -tzip app.zip backend frontend *.sql
```

### Opção B: Usando PowerShell Compress (mais lento)

```powershell
cd D:\Downloads\Segredo-do-Sabor

# Criar lista de arquivos
$files = @()
$files += Get-ChildItem -Path "backend" -Recurse
$files += Get-ChildItem -Path "frontend" -Recurse
$files += Get-ChildItem -Path "*.sql"

# Compactar
Compress-Archive -Path backend,frontend,*.sql -DestinationPath app.zip -Force
```

### Opção C: Enviar pasta por pasta (RECOMENDADO - mais rápido)

**Não precisa compactar! Vamos enviar diretamente:**

---

## ✅ PASSO 4: Enviar arquivos para o servidor

### 4.1. Enviar backend

```powershell
cd D:\Downloads\Segredo-do-Sabor
scp -i D:\Downloads\segredo-sabor-key.pem -r backend azureuser@20.163.57.236:~/
```

### 4.2. Enviar frontend

```powershell
scp -i D:\Downloads\segredo-sabor-key.pem -r frontend azureuser@20.163.57.236:~/
```

### 4.3. Enviar arquivo SQL principal

```powershell
scp -i D:\Downloads\segredo-sabor-key.pem INSTALACAO_BANCO_COMPLETO.sql azureuser@20.163.57.236:~/
```

---

## ✅ PASSO 5: Conectar ao servidor e configurar

```powershell
ssh -i D:\Downloads\segredo-sabor-key.pem azureuser@20.163.57.236
```

Agora você está **DENTRO do servidor Azure**. Execute os comandos abaixo:

### 5.1. Mover arquivos para pasta correta

```bash
sudo mv ~/backend /var/www/segredodosabor/
sudo mv ~/frontend /var/www/segredodosabor/
sudo mv ~/INSTALACAO_BANCO_COMPLETO.sql /var/www/segredodosabor/
sudo mv ~/configurar-nginx.sh /var/www/segredodosabor/
sudo chown -R azureuser:azureuser /var/www/segredodosabor
```

---

## ✅ PASSO 6: Importar banco de dados

```bash
cd /var/www/segredodosabor
mysql -usegredo_user -p'P@$$w0rd' segredodosabor < INSTALACAO_BANCO_COMPLETO.sql
```

Verificar se importou corretamente:

```bash
mysql -usegredo_user -p'P@$$w0rd' segredodosabor -e "SHOW TABLES;"
```

**Deve mostrar 21 tabelas!**

---

## ✅ PASSO 7: Configurar Backend

```bash
cd /var/www/segredodosabor/backend

# Copiar .env
cp /var/www/segredodosabor/.env.backend .env

# Instalar dependências
npm install

# Criar pasta de uploads
mkdir -p uploads

# Iniciar com PM2
pm2 start src/server.js --name segredo-backend

# Salvar configuração
pm2 save

# Configurar auto-start
pm2 startup

# Copiar e colar o comando que aparecer (sudo env PATH...)
```

Verificar se está rodando:

```bash
pm2 status
pm2 logs segredo-backend --lines 20
```

---

## ✅ PASSO 8: Configurar Frontend

```bash
cd /var/www/segredodosabor/frontend

# Copiar .env
cp /var/www/segredodosabor/.env.frontend .env

# Instalar dependências
npm install

# Buildar para produção
npm run build

# Dar permissão ao Nginx
sudo chown -R www-data:www-data build/
```

---

## ✅ PASSO 9: Configurar Nginx

```bash
cd /var/www/segredodosabor
sudo bash configurar-nginx.sh
```

---

## ✅ PASSO 10: Verificar Status

```bash
# Status do PM2
pm2 status

# Status do Nginx
sudo systemctl status nginx

# Status do MySQL
sudo systemctl status mysql

# Testar backend
curl http://localhost:5000/

# Testar via Nginx
curl http://20.163.57.236/api/
```

---

## ✅ PASSO 11: Testar no Navegador

No seu navegador Windows, acesse:

- **Frontend**: http://20.163.57.236
- **Admin**: http://20.163.57.236/gerenciamentos
- **API**: http://20.163.57.236/api

### Credenciais Admin:
- **Email**: admin@segredodosabor.com
- **Senha**: Admin@123

---

## 🆘 TROUBLESHOOTING

### Erro: "Cannot connect to backend"

```bash
pm2 restart segredo-backend
pm2 logs segredo-backend
```

### Erro: "502 Bad Gateway"

```bash
cd /var/www/segredodosabor/backend
pm2 restart segredo-backend
sudo systemctl restart nginx
```

### Página em branco

```bash
cd /var/www/segredodosabor/frontend
npm run build
sudo chown -R www-data:www-data build/
sudo systemctl restart nginx
```

### Ver logs do backend

```bash
pm2 logs segredo-backend
```

### Ver logs do Nginx

```bash
sudo tail -50 /var/log/nginx/segredodosabor-error.log
```

---

## 📊 COMANDOS ÚTEIS

### Reiniciar tudo

```bash
pm2 restart all
sudo systemctl restart nginx
sudo systemctl restart mysql
```

### Fazer backup

```bash
sudo /opt/backups/backup-segredo.sh
```

### Ver uso de recursos

```bash
htop
# ou
free -h
df -h
```

---

## 🎬 ANTES DA APRESENTAÇÃO

```bash
# Limpar logs
pm2 flush
sudo truncate -s 0 /var/log/nginx/*.log

# Verificar tudo está rodando
pm2 status
sudo systemctl status nginx
sudo systemctl status mysql

# Testar endpoints
curl http://localhost:5000/
curl http://20.163.57.236/api/
```

---

## 🎉 DEPLOY CONCLUÍDO!

**URLs do Sistema**:
- Frontend: http://20.163.57.236
- Admin: http://20.163.57.236/gerenciamentos
- API: http://20.163.57.236/api

**Credenciais**:
- Admin: admin@segredodosabor.com / Admin@123
- MySQL: segredo_user / P@$$w0rd

---

**Boa sorte na apresentação! 🚀**
