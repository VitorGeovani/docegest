# ❓ FAQ - Evolution API + Docegest

## Perguntas Frequentes sobre Integração WhatsApp

---

## 📱 Sobre WhatsApp e Evolution API

### 1. O que é Evolution API?

Evolution API é uma solução open-source que permite integrar o WhatsApp ao seu sistema sem precisar pagar pela API oficial da Meta. Funciona conectando-se ao WhatsApp Web, similar a quando você usa WhatsApp no navegador.

### 2. É legal usar Evolution API?

Sim, é legal. Você está usando sua própria conta WhatsApp Business, conectada via WhatsApp Web. Não há violação de termos de serviço, pois é como usar WhatsApp Web em um navegador automatizado.

### 3. Qual a diferença entre Evolution API e WhatsApp Business API oficial?

| Característica | Evolution API | WhatsApp Business API (Meta) |
|---------------|---------------|------------------------------|
| Custo | Gratuito | Pago (taxa por mensagem) |
| Setup | Simples (QR Code) | Complexo (aprovação Meta) |
| Limite de envio | Ilimitado* | Definido por tier |
| Suporte oficial | Comunidade | Meta/Facebook |
| Conexão | WhatsApp Web | API oficial |

*Limite natural do WhatsApp (não spam)

### 4. Preciso de um número exclusivo?

**Sim!** O número não pode estar:
- Conectado em outro WhatsApp Web
- Em uso no WhatsApp Desktop
- Em múltiplos dispositivos Evolution

Recomendamos um chip exclusivo para o sistema.

### 5. Posso usar WhatsApp comum ou precisa ser Business?

**Recomendamos WhatsApp Business**, mas funciona com ambos. O Business oferece:
- Perfil profissional
- Catálogo de produtos
- Mensagens automáticas
- Estatísticas

### 6. Quantas mensagens posso enviar por dia?

O WhatsApp não divulga um limite oficial, mas recomendações:
- **Novos números:** ~50-100 mensagens/dia nos primeiros dias
- **Números estabelecidos:** ~1000+ mensagens/dia
- **Evite spam:** Sempre mensagens relevantes aos clientes

Se enviar muitas mensagens muito rápido, o WhatsApp pode banir temporariamente.

---

## 🏗️ Sobre Instalação

### 7. Qual VM Azure devo usar?

**Recomendado:** Standard_B2s (2 vCPUs, 4 GB RAM)

| Tamanho | vCPUs | RAM | Disco | Recomendação |
|---------|-------|-----|-------|--------------|
| B1s | 1 | 1 GB | 20 GB | ❌ Insuficiente |
| B1ms | 1 | 2 GB | 20 GB | ⚠️ Justo (pode travar) |
| **B2s** | **2** | **4 GB** | **30 GB** | ✅ **Recomendado** |
| B2ms | 2 | 8 GB | 40 GB | ✅ Ideal (mais caro) |

### 8. Quanto custa rodar no Azure?

**Com crédito Azure Education ($100 USD):**
- ✅ Primeiros 12 meses: **GRÁTIS**
- B2s: ~R$ 60-80/mês (após crédito acabar)
- Total pode durar ~12-18 meses com crédito

**Alternativas gratuitas permanentes:**
- Oracle Cloud (Free Tier permanente)
- Google Cloud (Free Tier 90 dias)
- AWS (Free Tier 12 meses)

### 9. Demora quanto tempo para instalar?

- ⏱️ **VM Azure:** ~5 minutos
- ⏱️ **Script instalação:** ~10-15 minutos
- ⏱️ **Conectar WhatsApp:** ~2 minutos
- ⏱️ **Testes e validação:** ~5 minutos

**Total:** ~30-45 minutos

### 10. Posso instalar localmente (Windows/Mac)?

**Sim!** Mas não recomendado para produção:

**Windows:**
```powershell
# Instalar Docker Desktop
# Depois:
docker run -d -p 8080:8080 atendai/evolution-api
```

**Mac:**
```bash
# Instalar Docker Desktop
# Depois:
docker run -d -p 8080:8080 atendai/evolution-api
```

**Linux:**
```bash
sudo apt install docker.io
docker run -d -p 8080:8080 atendai/evolution-api
```

**Problema local:** PC precisa ficar ligado 24/7. Melhor usar VM na nuvem.

---

## 🔧 Sobre Configuração

### 11. Como gero uma API Key segura?

```bash
# Opção 1: OpenSSL
openssl rand -base64 32

# Opção 2: Online
# https://www.uuidgenerator.net/

# Opção 3: No script
cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1
```

Exemplo de boa API Key:
```
docegest_evolution_Kx9mP2vR8nL4qT6wY3hJ5zB7cF9gD1eN
```

### 12. Preciso configurar DNS/Domínio?

**Não é obrigatório!** Pode usar apenas IP público:
```
http://20.206.123.45:8080
```

**Mas é recomendado** ter domínio para:
- ✅ URL amigável (app.seusite.com.br)
- ✅ Certificado SSL/HTTPS
- ✅ Mais profissional

### 13. Como configuro SSL/HTTPS?

```bash
# 1. Ter um domínio apontando para IP da VM

# 2. Instalar Certbot
sudo apt install certbot python3-certbot-nginx

# 3. Obter certificado
sudo certbot --nginx -d seu-dominio.com.br

# 4. Renovação automática já vem configurada
sudo certbot renew --dry-run
```

### 14. Como abro as portas no Azure?

```
Portal Azure → Sua VM → Rede → Adicionar regra de porta de entrada

Portas necessárias:
- 22 (SSH)
- 80 (HTTP)
- 443 (HTTPS)
- 8080 (Evolution API)
- 5000 (Backend)
- 3306 (MySQL - opcional, só se acesso externo)
```

---

## 🚀 Sobre Uso

### 15. Como conecto o WhatsApp?

```bash
# 1. Acesse interface web
http://SEU_IP:8080

# 2. Manager → Create Instance → Nome: docegest-whatsapp

# 3. Escaneie QR Code com WhatsApp Business
# No celular:
#   WhatsApp → ⋮ → Aparelhos conectados → Conectar aparelho

# 4. Aguarde status: Connected
```

### 16. O que acontece se meu celular ficar sem internet?

**WhatsApp desconecta!** Evolution API precisa que o celular esteja:
- ✅ Ligado
- ✅ Com internet (Wi-Fi ou dados)
- ✅ WhatsApp aberto (pode estar em segundo plano)

**Dica:** Deixe celular sempre conectado em Wi-Fi e carregando.

### 17. Perco as conversas se reiniciar o servidor?

**Não!** Se configurou volumes corretamente no Docker:

```yaml
volumes:
  - ./instances:/evolution/instances
  - ./store:/evolution/store
```

As conversas, contatos e conexão são mantidos.

### 18. Como envio uma mensagem de teste?

```bash
curl -X POST http://SEU_IP:8080/message/sendText/docegest-whatsapp \
  -H "Content-Type: application/json" \
  -H "apikey: SUA_API_KEY" \
  -d '{
    "number": "5511967696744",
    "text": "Teste de mensagem!"
  }'
```

### 19. Qual formato usar para o número de telefone?

**Formato correto:**
```
5511967696744
└┬┘└┬┘└──┬────┘
 │  │    │
 │  │    └─ Número (9 dígitos)
 │  └────── DDD (2 dígitos)
 └─────────── Código país (55 = Brasil)
```

**Exemplos:**
- ✅ Correto: `5511967696744`
- ❌ Errado: `11967696744` (falta código país)
- ❌ Errado: `+5511967696744` (não usar +)
- ❌ Errado: `(11) 96769-6744` (não usar formatação)

---

## 🐛 Sobre Problemas

### 20. "Connection refused" ao acessar http://SEU_IP:8080

**Possíveis causas:**

1. **Porta não aberta no Azure**
   ```bash
   # Verificar se porta está ouvindo
   sudo netstat -tulpn | grep 8080
   ```
   Se não aparecer, Evolution não está rodando.

2. **Firewall bloqueando**
   ```bash
   # Verificar UFW
   sudo ufw status
   
   # Permitir porta
   sudo ufw allow 8080/tcp
   ```

3. **Evolution API não iniciou**
   ```bash
   # Ver logs
   docker logs evolution-api
   
   # Reiniciar
   cd ~/evolution-api
   docker compose restart
   ```

### 21. QR Code não aparece ou expira

**Soluções:**

```bash
# 1. Reconectar
curl -X GET http://localhost:8080/instance/connect/docegest-whatsapp \
  -H "apikey: SUA_API_KEY"

# 2. Se não resolver, deletar e recriar instância
curl -X DELETE http://localhost:8080/instance/delete/docegest-whatsapp \
  -H "apikey: SUA_API_KEY"

# Depois criar nova instância pela interface web
```

### 22. WhatsApp desconecta sozinho

**Causas comuns:**

1. **WhatsApp aberto em outro lugar**
   - Feche WhatsApp Desktop
   - Desconecte outros WhatsApp Web
   
2. **Celular sem internet**
   - Verifique conexão Wi-Fi/dados
   
3. **Reiniciou Evolution sem volumes**
   - Verifique `docker-compose.yml` tem volumes configurados

4. **WhatsApp banimento temporário**
   - Enviou muitas mensagens muito rápido
   - Aguarde 24-48h

### 23. "Invalid API Key" ao enviar mensagem

**Verificar:**

```bash
# 1. API Key no docker-compose.yml
cd ~/evolution-api
cat docker-compose.yml | grep AUTHENTICATION_API_KEY

# 2. API Key no .env do backend
cd ~/docegest/backend
cat .env | grep EVOLUTION_API_KEY

# DEVEM SER IGUAIS!
```

**Corrigir:**

```bash
# Editar .env
nano ~/docegest/backend/.env

# Trocar API Key
EVOLUTION_API_KEY=mesma_chave_do_docker_compose

# Reiniciar backend
pm2 restart docegest-backend
```

### 24. Mensagens não chegam mas API retorna sucesso

**Verificações:**

```bash
# 1. WhatsApp está conectado?
curl -X GET http://localhost:8080/instance/connectionState/docegest-whatsapp \
  -H "apikey: SUA_API_KEY"
# Deve retornar: "state": "open"

# 2. Formato do número está correto?
# Correto: 5511967696744

# 3. Número está bloqueado?
# Teste enviando para seu próprio número primeiro

# 4. Ver logs Evolution
docker logs evolution-api --tail 50
```

### 25. VM Azure ficou sem espaço

**Limpar:**

```bash
# Ver uso atual
df -h

# Limpar Docker
docker system prune -a -f --volumes

# Limpar apt
sudo apt clean
sudo apt autoremove -y

# Limpar logs
pm2 flush
sudo journalctl --vacuum-time=7d

# Remover backups antigos
find ~/backups -mtime +30 -delete

# Ver maiores arquivos
du -ah ~ | sort -rh | head -20
```

---

## 💾 Sobre Backup

### 26. Como faço backup manual?

```bash
# Executar script de backup
~/backup-evolution.sh

# Ou manualmente:
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p ~/backups

# Backup Evolution
cd ~/evolution-api
tar -czf ~/backups/evolution_$DATE.tar.gz instances store

# Backup MySQL
mysqldump -u docegest -p'Docegest@2025' segredodosabor > ~/backups/database_$DATE.sql

# Backup .env
cp ~/.env-docegest ~/backups/env_$DATE.txt
```

### 27. Como baixo backup para meu PC?

```bash
# No seu PC (Windows PowerShell)
scp -i docegest-key.pem azureuser@SEU_IP:~/backups/evolution_20250116.tar.gz ./

# No seu PC (Linux/Mac)
scp -i docegest-key.pem azureuser@SEU_IP:~/backups/evolution_20250116.tar.gz ./
```

### 28. Como restauro um backup?

```bash
# 1. Parar serviços
cd ~/evolution-api
docker compose down

# 2. Restaurar Evolution API
tar -xzf ~/backups/evolution_20250116.tar.gz -C ~/evolution-api/

# 3. Restaurar MySQL
mysql -u docegest -p segredodosabor < ~/backups/database_20250116.sql

# 4. Reiniciar tudo
docker compose up -d
pm2 restart all
```

---

## 🔒 Sobre Segurança

### 29. Evolution API está exposto na internet?

**Sim, mas com API Key!** Apenas quem tem a API Key pode usar.

**Para mais segurança:**

```bash
# Colocar atrás do Nginx com senha
sudo apt install nginx apache2-utils
sudo htpasswd -c /etc/nginx/.htpasswd admin

# Configurar Nginx proxy reverso (ver tutorial completo)
```

### 30. Preciso mudar senhas padrão do MySQL?

**SIM!** As senhas de exemplo são públicas:

```bash
# Editar .env
nano ~/docegest/backend/.env

# Trocar:
DB_PASSWORD=SuaSenhaSuperForteAqui2025!
JWT_SECRET=OutroSegredoAleatorioLongo12345!

# Atualizar no MySQL
sudo mysql -u root -p
ALTER USER 'docegest'@'%' IDENTIFIED BY 'SuaSenhaSuperForteAqui2025!';
FLUSH PRIVILEGES;
EXIT;

# Reiniciar backend
pm2 restart docegest-backend
```

### 31. Como protejo minha VM?

```bash
# 1. Firewall
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw allow 8080/tcp

# 2. Fail2Ban (bloqueia tentativas de invasão)
sudo apt install fail2ban
sudo systemctl enable fail2ban

# 3. Desabilitar login root via SSH
sudo nano /etc/ssh/sshd_config
# Mudar: PermitRootLogin no
sudo systemctl restart ssh

# 4. Atualizar sistema
sudo apt update && sudo apt upgrade -y
```

---

## 📈 Sobre Performance

### 32. Sistema está lento, o que fazer?

**Verificar recursos:**

```bash
# CPU e memória
top
htop  # (sudo apt install htop)

# Disco
df -h

# Ver o que está consumindo
docker stats
```

**Otimizações:**

1. **Reduzir logs Evolution API**
   ```yaml
   # docker-compose.yml
   - LOG_LEVEL=ERROR
   - LOG_BAILEYS=false
   ```

2. **Limpar Docker**
   ```bash
   docker system prune -a -f
   ```

3. **Adicionar SWAP**
   ```bash
   sudo fallocate -l 2G /swapfile
   sudo chmod 600 /swapfile
   sudo mkswap /swapfile
   sudo swapon /swapfile
   ```

4. **Aumentar VM** (última opção)
   - Portal Azure → Sua VM → Tamanho → Redimensionar

### 33. Quantos pedidos por hora o sistema aguenta?

**Depende da VM:**

| VM | Pedidos/hora | Pedidos simultâneos | Observação |
|----|--------------|---------------------|------------|
| B1ms | ~50-100 | ~5 | Mínimo |
| **B2s** | **~500-1000** | **~20** | **Recomendado** |
| B2ms | ~2000-3000 | ~50 | Ideal |

**Cada pedido gera:**
- 1 consulta MySQL (~10ms)
- 1 mensagem WhatsApp (~200ms)
- 1 registro log (~5ms)

---

## 🆙 Sobre Atualizações

### 34. Como atualizo Evolution API?

```bash
cd ~/evolution-api

# Baixar versão mais recente
docker compose pull

# Recriar container (mantém dados)
docker compose up -d --force-recreate

# Verificar versão
docker logs evolution-api | grep version
```

### 35. Como atualizo o Docegest?

```bash
cd ~/docegest

# Atualizar código
git pull origin main

# Backend
cd backend
npm install
pm2 restart docegest-backend

# Frontend (se necessário)
cd ../frontend
npm install
npm run build
sudo cp -r build/* /var/www/html/
```

---

## 🌍 Sobre Alternativas

### 36. Posso hospedar fora do Azure?

**Sim!** Funciona em qualquer servidor Linux:

- ✅ AWS EC2
- ✅ Google Cloud Compute
- ✅ DigitalOcean
- ✅ Linode
- ✅ Vultr
- ✅ Oracle Cloud (Free Tier permanente!)
- ✅ Servidor próprio (on-premise)

### 37. Posso usar Heroku/Vercel?

**Não recomendado!**

- ❌ Heroku: Sem IP fixo, containers efêmeros
- ❌ Vercel: Apenas para frontend estático
- ✅ Use: VPS com IP fixo e Docker

### 38. Tem alternativa ao Evolution API?

**Sim, mas Evolution é a melhor gratuita:**

| Solução | Custo | Facilidade | Obs |
|---------|-------|-----------|-----|
| **Evolution API** | Grátis | ⭐⭐⭐⭐⭐ | **Recomendado** |
| Baileys (lib) | Grátis | ⭐⭐⭐ | Mais complexo |
| Venom Bot | Grátis | ⭐⭐⭐⭐ | Similar |
| Meta API Oficial | Pago | ⭐⭐ | Caro |
| Twilio | Pago | ⭐⭐⭐⭐ | Bom suporte |

---

## 📞 Suporte

### 39. Onde consigo ajuda?

1. **Documentação Docegest:**
   - [Tutorial Completo](./TUTORIAL_EVOLUTION_API_DOCKER_AZURE.md)
   - [Comandos Rápidos](./COMANDOS_RAPIDOS_EVOLUTION.md)
   - [Checklist](./CHECKLIST_EVOLUTION_API_AZURE.md)

2. **Documentação Evolution API:**
   - https://doc.evolution-api.com/

3. **Comunidade:**
   - Discord Evolution: https://evolution-api.com/discord
   - GitHub Issues: https://github.com/EvolutionAPI/evolution-api/issues

4. **Problemas com Docegest:**
   - GitHub Issues: https://github.com/VitorGeovani/docegest/issues

### 40. Posso contratar suporte profissional?

Entre em contato para:
- ✅ Instalação completa
- ✅ Migração de servidor
- ✅ Customizações
- ✅ Suporte dedicado
- ✅ Treinamento equipe

---

## 💡 Dicas Extras

### 41. Boas práticas para envio de mensagens

✅ **Faça:**
- Envie apenas para clientes que fizeram pedidos
- Use templates claros e profissionais
- Inclua opt-out (como parar receber)
- Respeite horários (8h-22h)
- Personalize mensagens (nome do cliente)

❌ **Não faça:**
- Spam ou mensagens não solicitadas
- Enviar em madrugada
- Mensagens genéricas demais
- Muitas mensagens seguidas
- Marketing agressivo

### 42. Template de mensagem ideal

```
🎉 Olá, [NOME]!

Seu pedido #[CODIGO] foi confirmado!

📦 Itens:
• [ITEM 1] x [QTD]
• [ITEM 2] x [QTD]

💰 Total: R$ [VALOR]
💳 Pagamento: [FORMA]

⏰ Previsão: [TEMPO] minutos
📍 Endereço: [ENDERECO]

Qualquer dúvida, estamos à disposição!

Segredo do Sabor 🍰
```

### 43. Como sei se mensagem foi entregue?

**Evolution API retorna status:**

```json
{
  "key": {
    "id": "3EB0C123456...",
    "fromMe": true
  },
  "status": "pending"  // pending → sent → delivered → read
}
```

**Implementar webhook** para receber atualizações de status (ver docs).

---

**🎓 Tutorial Completo:** [TUTORIAL_EVOLUTION_API_DOCKER_AZURE.md](./TUTORIAL_EVOLUTION_API_DOCKER_AZURE.md)

**⚡ Comandos Rápidos:** [COMANDOS_RAPIDOS_EVOLUTION.md](./COMANDOS_RAPIDOS_EVOLUTION.md)

**✅ Checklist:** [CHECKLIST_EVOLUTION_API_AZURE.md](./CHECKLIST_EVOLUTION_API_AZURE.md)

---

**Não encontrou sua dúvida?** Abra uma issue: https://github.com/VitorGeovani/docegest/issues
