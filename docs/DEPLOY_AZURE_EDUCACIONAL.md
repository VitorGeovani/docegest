# 🎓 DEPLOY AZURE - CONTA EDUCACIONAL

## Segredo do Sabor v5.0 UNIFICADA - Deploy Gratuito para Apresentação Acadêmica

**Crédito disponível**: $100 USD  
**Objetivo**: Deploy 100% GRATUITO usando Azure for Students  
**Duração da apresentação**: Temporário (apresentação + avaliação)  
**Última atualização**: 09/11/2025 ✅ **NOVA VERSÃO COM BANCO UNIFICADO**

---

## 🆓 RECURSOS GRATUITOS AZURE FOR STUDENTS

### ✅ O que você tem de GRATUITO:

1. **Máquinas Virtuais**
   - 750 horas/mês de B1s Linux (1 vCPU, 1GB RAM) - **12 meses grátis**
   - Perfeito para apresentação!

2. **Armazenamento**
   - 2x Discos Gerenciados SSD de 64GB - **12 meses grátis**
   - 5GB de armazenamento de blobs - **12 meses grátis**

3. **Rede**
   - 1 IP público estático - **GRÁTIS permanente**
   - 100 GB de tráfego de saída/mês - **12 meses grátis**

4. **Banco de Dados**
   - MySQL local (não Azure Database) - **GRÁTIS permanente**

5. **Outros**
   - Azure DNS - **GRÁTIS permanente**
   - Primeiras 5 milhões de requisições Azure Functions - **GRÁTIS permanente**

### 💰 Custo Total do Deploy:

```
VM B1s (750h grátis)           = $0,00
Disco 64GB SSD (2x grátis)     = $0,00
IP Público (1x grátis)         = $0,00
Tráfego 100GB (grátis)         = $0,00
MySQL local                    = $0,00
─────────────────────────────────────
TOTAL MENSAL                   = $0,00 ✅
CRÉDITO RESTANTE               = $100,00 💰
```

**Seus $100 de crédito ficam INTACTOS!** 🎉

---

## 🚀 DEPLOY RÁPIDO - 30 MINUTOS

### Passo 1: Criar VM no Portal Azure (5 min)

**Link direto**: https://portal.azure.com

1. Clicar em **"Criar um recurso"**
2. Selecionar **"Máquina Virtual"**
3. Preencher:

```yaml
# ABA: BÁSICO
Assinatura: Azure for Students
Grupo de recursos: [Criar novo] "segredo-sabor-rg"
Nome da VM: segredo-sabor-vm
Região: Brazil South (São Paulo) ⭐
Imagem: Ubuntu Server 22.04 LTS - Gen2
Tamanho: Standard_B1s ⭐ GRÁTIS (1 vCPU, 1GB RAM)

# Autenticação
Tipo: Chave pública SSH
Usuário: azureuser
Chave: [Gerar novo] "segredo-sabor-key"

# Portas
☑️ HTTP (80)
☑️ HTTPS (443)  
☑️ SSH (22)
```

4. **ABA: DISCOS**
```yaml
Tipo do disco: SSD Standard ⭐ GRÁTIS
Tamanho: 64 GiB (máximo grátis)
```

5. **ABA: REDE**
```yaml
Rede virtual: [Nova] segredo-sabor-vnet
IP público: [Novo] segredo-sabor-ip ⭐ GRÁTIS
```

6. Clicar **"Revisar + criar"**
7. **BAIXAR** a chave `.pem` quando solicitado!
8. Aguardar provisionamento (3-5 min)

### Passo 2: Anotar IP Público (1 min)

1. Ir para **"Todos os recursos"**
2. Clicar em `segredo-sabor-vm`
3. Copiar **"Endereço IP público"**
4. Exemplo: `20.206.123.45`

### Passo 3: Conectar via SSH (2 min)

**Windows PowerShell:**

```powershell
# Ir para pasta da chave
cd C:\Users\SeuUsuario\Downloads

# Corrigir permissões
icacls "segredo-do-sabor-key.pem" /inheritance:r
icacls "segredo-do-sabor-key.pem" /grant:r "%username%:R"

# Conectar (trocar IP)
ssh -i segredo-do-sabor-key.pem azureuser@20.206.123.45
```

**Aceitar fingerprint:**
```bash
yes
```

✅ **Conectado!**

### Passo 4: Executar Script de Deploy (15 min)

**Fazer upload do script:**

```powershell
# No seu PC (PowerShell):
cd D:\Downloads\Segredo-do-Sabor
scp -i segredo-do-sabor-key.pem deploy-azure.sh azureuser@20.206.123.45:~/
```

**Na VM (executar como root):**

```bash
# Dar permissão
chmod +x ~/deploy-azure.sh

# Executar
sudo bash ~/deploy-azure.sh
```

**O script vai perguntar:**
```
Digite seu email: seu-email@exemplo.com
Digite o domínio: [ENTER para usar IP]
```

**Aguardar instalação automática (~10 min):**
- ✅ Node.js 18
- ✅ MySQL 8.0 (senha: P@$$w0rd)
- ✅ Nginx
- ✅ Docker + Evolution API
- ✅ PM2
- ✅ Firewall configurado
- ✅ Backup automático

### Passo 5: Fazer Upload do Código (5 min)

**No seu PC:**

```powershell
# Compactar projeto
cd D:\Downloads\Segredo-do-Sabor
tar -czf app.tar.gz backend frontend *.sql

# Enviar para servidor
scp -i segredo-do-sabor-key.pem app.tar.gz azureuser@20.206.123.45:~/
```

**Na VM:**

```bash
# Extrair
cd /var/www/segredodosabor
sudo tar -xzf ~/app.tar.gz
sudo chown -R azureuser:azureuser /var/www/segredodosabor
```

### Passo 6: Configurar Backend (3 min)

```bash
cd /var/www/segredodosabor/backend

# Copiar .env
cp /var/www/segredodosabor/.env.backend .env

# Instalar dependências
npm install

# ✅ NOVO: Importar banco de dados UNIFICADO (tudo em 1 arquivo!)
cd /var/www/segredodosabor
sudo mysql -u segredo_user -pP@\$\$w0rd < INSTALACAO_BANCO_COMPLETO.sql

# ✅ Banco criado com TUDO incluído:
# • Todas as 21 tabelas
# • Todos os relacionamentos
# • Todas as 7 views
# • Todas as 5 procedures
# • Todos os 5 triggers
# • Todas as 2 events (limpeza automática)
# • Dados iniciais (categorias, ingredientes, configurações)
# • Administrador padrão (admin@segredodosabor.com / Admin@123)
# • Bot WhatsApp configurado
# • Sistema de personalização completo
# • Sistema de preferências de clientes

# Verificar instalação
sudo mysql -u segredo_user -pP@\$\$w0rd segredodosabor -e "SHOW TABLES;"

# Deve mostrar 21 tabelas:
# administrador, cliente, refresh_tokens, categoria, produto, 
# produto_imagens, reserva, ingrediente, receita, movimentacao_estoque,
# personalizacao_produto, personalizacao_ingredientes, 
# cliente_preferencias, cliente_preferencias_historico,
# tb_mensagens_whatsapp, tb_whatsapp_webhooks, tb_whatsapp_bot_config,
# tb_whatsapp_comandos, tb_whatsapp_estatisticas, custo_indireto, configuracao

# Iniciar backend com PM2
pm2 start src/server.js --name segredo-backend
pm2 save
pm2 startup
# Executar comando que aparecer (copiar e colar)
```

### Passo 7: Configurar Frontend (3 min)

```bash
cd /var/www/segredodosabor/frontend

# Copiar .env
cp /var/www/segredodosabor/.env.frontend .env

# Editar para usar IP público
nano .env
```

**Alterar para:**
```env
REACT_APP_API_URL=http://SEU_IP_AQUI/api
NODE_ENV=production
```

**Salvar**: `Ctrl+O`, `Enter`, `Ctrl+X`

```bash
# Instalar e buildar
npm install
npm run build

# Ajustar permissões
sudo chown -R www-data:www-data build/
```

### Passo 8: Testar Sistema (2 min)

```bash
# Verificar serviços
pm2 status
sudo systemctl status nginx
sudo systemctl status mysql
docker ps

# Testar backend
curl http://localhost:5000/

# Testar via Nginx
curl http://SEU_IP/api/
```

**No navegador do seu PC:**
```
http://SEU_IP_AQUI
```

✅ **Sistema funcionando!**

---

## 📱 CONFIGURAR WHATSAPP (OPCIONAL - 5 MIN)

### Criar Túnel SSH (do seu PC)

```powershell
ssh -i segredo-do-sabor-key.pem -L 8080:localhost:8080 azureuser@SEU_IP
```

### Acessar Evolution API

**No navegador:** `http://localhost:8080`

### Criar Instância

1. POST `/instance/create`
2. Corpo:
```json
{
  "instanceName": "segredodosabor",
  "token": "segredodosabor2025",
  "qrcode": true
}
```

3. Escanear QR Code com WhatsApp (+55 11 96769-6744)

### Configurar Webhook

```bash
# Na VM:
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

## 🎬 PREPARAR PARA APRESENTAÇÃO

### Checklist Antes da Apresentação

```bash
# 1. Verificar todos os serviços
pm2 status
sudo systemctl status nginx mysql
docker ps

# 2. Ver logs para garantir que não há erros
pm2 logs segredo-backend --lines 20
sudo tail -20 /var/log/nginx/segredodosabor-error.log

# 3. Testar endpoints principais
curl http://localhost:5000/
curl http://localhost:5000/produto/listar
curl http://localhost:5000/categoria

# 4. Limpar logs (apresentação limpa)
pm2 flush
sudo truncate -s 0 /var/log/nginx/*.log
```

### URLs para Apresentação

```
🌐 Sistema: http://SEU_IP
👨‍💼 Admin: http://SEU_IP/gerenciamentos
🛒 Catálogo: http://SEU_IP/catalogo
📱 Login: http://SEU_IP/login
📊 API Docs: http://SEU_IP/api/
```

### Credenciais

```
✅ Admin (NOVO - já incluído no banco):
Email: admin@segredodosabor.com
Senha: Admin@123

MySQL:
User: segredo_user
Password: P@$$w0rd
Database: segredodosabor

WhatsApp:
Número: +55 11 96769-6744
Status: Bot pré-configurado (inativo até conectar)
```

---

## 💡 DICAS PARA APRESENTAÇÃO

### 1. Demonstração Recomendada (15 min)

1. **Tela Inicial** (1 min)
   - Mostrar design responsivo
   - Acessibilidade (VLibras + botão A+)

2. **Catálogo de Produtos** (2 min)
   - Filtros por categoria
   - Adicionar ao carrinho
   - Favoritar produto

3. **Checkout Completo** (3 min)
   - Personalização de produtos
   - Seleção de ingredientes extras
   - Confirmar pedido

4. **Painel Administrativo** (6 min)
   - Login como admin
   - Dashboard com métricas em tempo real
   - CRUD de produtos
   - Gestão de pedidos e status
   - **✅ NOVO: Sistema de Receitas (BOM)**
   - **✅ NOVO: Gestão de Ingredientes**
   - **✅ NOVO: Cálculo Automático de Custos**
   - **✅ NOVO: Movimentação de Estoque**
   - **✅ NOVO: Relatórios Financeiros**
   - **✅ NOVO: Bot WhatsApp Integrado**
   - **✅ NOVO: Sistema de Personalização**
   - **✅ NOVO: Preferências de Clientes**

5. **Recursos Técnicos** (3 min)
   - Arquitetura 3 camadas
   - API RESTful (mostrar Postman)
   - Banco de dados (mostrar diagrama)
   - WhatsApp Business integrado

### 2. Pontos Fortes para Destacar

✅ **100% Completo** - 65/65 requisitos implementados  
✅ **Acessibilidade WCAG 2.2 AAA** - VLibras + controles + skip links  
✅ **Arquitetura Profissional** - MVC + Repository Pattern + Pool de Conexões  
✅ **Segurança Enterprise** - JWT + Bcrypt + Refresh Tokens + HTTPS  
✅ **Inovação** - Bot WhatsApp inteligente com comandos  
✅ **Gestão Inteligente** - BOM (Bill of Materials) completo  
✅ **Cálculo Automático** - Custos calculados com triggers  
✅ **Deploy Profissional** - Azure Cloud + PM2 + Nginx  
✅ **✨ NOVO: Banco Unificado** - 1 arquivo SQL com tudo  
✅ **✨ NOVO: Pool de Conexões** - 10 conexões simultâneas  
✅ **✨ NOVO: Limpeza Automática** - Events MySQL para tokens e histórico  
✅ **✨ NOVO: 21 Tabelas Completas** - Sistema empresarial robusto  
✅ **✨ NOVO: 7 Views de Relatórios** - Dashboards automáticos  
✅ **✨ NOVO: 5 Procedures** - Lógica de negócio no banco  
✅ **✨ NOVO: 5 Triggers** - Automação total  

### 3. Preparar Backup

```bash
# Fazer backup antes da apresentação
/opt/backups/backup-segredo.sh

# Verificar
ls -lh /opt/backups/
```

### 4. Ter Plano B

- Gravar vídeo da demonstração
- Screenshots das telas principais
- PDF com fluxo completo
- Apresentação PowerPoint com prints

---

## 📊 MONITORAMENTO DURANTE APRESENTAÇÃO

### Terminal 1: Logs Backend

```bash
pm2 logs segredo-backend
```

### Terminal 2: Logs Nginx

```bash
sudo tail -f /var/log/nginx/segredodosabor-access.log
```

### Terminal 3: Recursos

```bash
watch -n 2 'free -h && echo && df -h && echo && pm2 status'
```

---

## 🆘 TROUBLESHOOTING RÁPIDO

### Sistema não carrega

```bash
# Reiniciar tudo
pm2 restart all
sudo systemctl restart nginx
```

### Erro 502 Bad Gateway

```bash
# Backend rodando?
pm2 status

# Se não estiver:
cd /var/www/segredodosabor/backend
pm2 start src/server.js --name segredo-backend
```

### Página em branco

```bash
# Verificar build
ls -la /var/www/segredodosabor/frontend/build/

# Se não tiver, rebuildar:
cd /var/www/segredodosabor/frontend
npm run build
sudo chown -R www-data:www-data build/
```

### MySQL não conecta

```bash
sudo systemctl restart mysql
sudo mysql -u segredo_user -pP@\$\$w0rd segredodosabor
```

---

## 💾 APÓS A APRESENTAÇÃO

### Manter VM ligada?

**Se apresentação durar vários dias:**
```bash
# VM desliga automaticamente? NÃO
# Custos extras? NÃO (dentro do free tier)
# Pode deixar ligada? SIM
```

**Após finalizar apresentações:**
```bash
# Fazer backup final
/opt/backups/backup-segredo.sh

# Baixar backup para seu PC
scp -i segredo-do-sabor-key.pem -r azureuser@SEU_IP:/opt/backups ~/Desktop/
```

### Desligar VM (economizar créditos)

**No Portal Azure:**
1. Ir para VM `segredo-sabor-vm`
2. Clicar em **"Parar"**
3. Confirmar

**Custos quando desligada:**
- VM parada: $0,00 (não consome horas)
- Disco: $0,00 (dentro dos 2 discos grátis)
- IP: $0,00 (1 IP grátis)

**Religar quando precisar:**
1. Portal Azure → VM → **"Iniciar"**
2. Aguardar 2-3 minutos
3. Acessar via SSH novamente

---

## 📈 USO DOS CRÉDITOS

### Dashboard de Custos

**Portal Azure:**
1. Pesquisar "Gerenciamento de Custos"
2. Ver "Análise de custos"
3. Filtrar por "Grupo de recursos: segredo-sabor-rg"

**Esperado:**
```
Custos mensais: $0,00
Crédito usado: $0,00
Crédito restante: $100,00 ✅
```

### Alertas de Custo (Opcional)

```
1. Portal Azure → Gerenciamento de Custos
2. Orçamentos → Criar orçamento
3. Nome: "Alerta Segredo do Sabor"
4. Valor: $10,00
5. Email de alerta: seu-email@exemplo.com
```

---

## 🎓 DOCUMENTAÇÃO PARA BANCA

### Arquivos para Entregar

1. **✅ INSTALACAO_BANCO_COMPLETO.sql** - Banco unificado v5.0
2. **TUTORIAL_DEPLOY_AZURE.md** - Tutorial completo
3. **DEPLOY_AZURE_EDUCACIONAL.md** - Este guia (estudantes)
4. **ARQUITETURA_SISTEMA.md** - Arquitetura técnica
5. **ANALISE_REQUISITOS_FUNCIONAIS.md** - 65/65 RFs
6. **ROTEIRO_VIDEO_DEMONSTRACAO.md** - Roteiro completo
7. **README.md** - Visão geral do projeto
8. **✅ NOVO: CORRECAO_BANCO_DADOS.sql** - Script de correções
9. **✅ NOVO: GUIA_EXECUCAO_CORRECOES.md** - Guia de manutenção

### Prints Importantes

1. Dashboard Azure mostrando $0,00 de custo
2. VM rodando (status: "Em execução")
3. Sistema funcionando (home page)
4. Painel admin (dashboard)
5. Logs do PM2 (sistema estável)

---

## 🌟 VANTAGENS COMPETITIVAS

### Diferenciais Técnicos

1. ✅ Deploy profissional em cloud (Azure)
2. ✅ Uso inteligente de recursos gratuitos
3. ✅ Arquitetura escalável (pronta para produção)
4. ✅ Monitoramento automatizado (PM2)
5. ✅ Backup automático diário
6. ✅ Segurança enterprise (JWT + Refresh Tokens + SSL pronto)
7. ✅ CI/CD ready (estrutura preparada)
8. ✅ **✨ NOVO: Pool de Conexões MySQL** (10 conexões simultâneas)
9. ✅ **✨ NOVO: Banco Unificado** (deploy em 1 comando)
10. ✅ **✨ NOVO: Limpeza Automática** (MySQL Events)
11. ✅ **✨ NOVO: Triggers Inteligentes** (automação total)
12. ✅ **✨ NOVO: Views de Relatórios** (dashboards prontos)

### Diferenciais Funcionais

1. ✅ Bot WhatsApp inteligente (reconhece intenções)
2. ✅ Sistema BOM completo (Bill of Materials)
3. ✅ Cálculo automático de custos (triggers)
4. ✅ Acessibilidade AAA (inclusão digital)
5. ✅ Gestão completa de estoque com histórico
6. ✅ Relatórios exportáveis (PDF + Excel)
7. ✅ Sistema de favoritos persistente
8. ✅ **✨ NOVO: Personalização de Produtos** (ingredientes extras)
9. ✅ **✨ NOVO: Preferências de Clientes** (histórico completo)
10. ✅ **✨ NOVO: Refresh Tokens** (sessão persistente)
11. ✅ **✨ NOVO: Múltiplas Imagens por Produto**
12. ✅ **✨ NOVO: Sistema de Reservas Avançado** (JSON otimizado)
13. ✅ **✨ NOVO: Estatísticas WhatsApp** (métricas detalhadas)
14. ✅ **✨ NOVO: Webhook WhatsApp** (integração real-time)

---

## 🎯 RESUMO EXECUTIVO

```
Projeto: Segredo do Sabor v5.0 UNIFICADA
Tipo: Sistema de Gestão para Confeitarias (ERP + E-commerce)
Status: 100% Completo (65/65 RFs implementados)

Deploy:
• Plataforma: Microsoft Azure
• Tipo: Azure for Students (Free Tier)
• VM: B1s (1 vCPU, 1GB RAM) - GRÁTIS
• Custo: $0,00/mês
• Crédito usado: $0,00 de $100,00

Tecnologias:
• Frontend: React 18 + SCSS + WCAG AAA
• Backend: Node.js 18 + Express + Pool MySQL2
• Banco: MySQL 8.0 (21 tabelas, 7 views, 5 procedures, 5 triggers, 2 events)
• Cloud: Azure (VM + Disco SSD + IP Público)
• Containers: Docker (Evolution API WhatsApp)
• Process Manager: PM2
• Reverse Proxy: Nginx
• Autenticação: JWT + Refresh Tokens + Bcrypt

✨ NOVIDADES v5.0 UNIFICADA:
• ✅ Banco de dados em 1 arquivo único (INSTALACAO_BANCO_COMPLETO.sql)
• ✅ Pool de conexões MySQL (10 simultâneas)
• ✅ Sistema de personalização completo
• ✅ Preferências de clientes com histórico
• ✅ Refresh tokens para sessão persistente
• ✅ Bot WhatsApp pré-configurado
• ✅ Limpeza automática (MySQL Events)
• ✅ Múltiplas imagens por produto
• ✅ Estatísticas WhatsApp detalhadas
• ✅ 7 views de relatórios prontas
• ✅ Triggers automáticos de custos
• ✅ Administrador já incluído no banco

Banco de Dados Completo:
• 21 Tabelas (todas as funcionalidades)
• 7 Views (dashboards e relatórios)
• 5 Stored Procedures (lógica de negócio)
• 5 Triggers (automação)
• 2 Events (limpeza automática)
• Dados Iniciais:
  - 9 categorias de produtos
  - 24 ingredientes cadastrados
  - 21 configurações do sistema
  - 6 custos indiretos
  - 1 administrador (admin@segredodosabor.com / Admin@123)
  - Bot WhatsApp configurado
  - 5 comandos do bot

Tempo de Deploy: ~30 minutos
Complexidade: Média
Resultado: Sistema empresarial completo pronto para demonstração

Links Importantes:
• Banco Unificado: INSTALACAO_BANCO_COMPLETO.sql ⭐ NOVO
• Tutorial: TUTORIAL_DEPLOY_AZURE.md
• Guia Rápido: GUIA_RAPIDO_DEPLOY.md
• Troubleshooting: TROUBLESHOOTING_AZURE.md
• Análise Banco: ANALISE_BANCO_DADOS_COMPLETA.md ⭐ NOVO
• Correções: CORRECAO_BANCO_DADOS.sql ⭐ NOVO
```

---

**Versão**: 5.0 UNIFICADA 🚀  
**Atualizado**: 09/11/2025 ✅  
**Alvo**: Apresentação Acadêmica  
**Custo**: $0,00 (Free Tier)  
**Novidade**: Banco de dados completo em 1 arquivo!  

---

## 🆕 CHANGELOG v5.0 UNIFICADA (09/11/2025)

### ✨ Melhorias Implementadas

**Banco de Dados:**
- ✅ Arquivo SQL unificado (INSTALACAO_BANCO_COMPLETO.sql)
- ✅ 21 tabelas em ordem correta de dependência
- ✅ Todas as foreign keys configuradas
- ✅ 7 views de relatórios (custos, estoque, vendas, clientes)
- ✅ 5 procedures (cálculos, limpeza, geração de códigos)
- ✅ 5 triggers (custos automáticos, códigos, histórico)
- ✅ 2 events (limpeza tokens diários, histórico mensal)
- ✅ Dados iniciais completos
- ✅ Administrador padrão incluído
- ✅ Bot WhatsApp pré-configurado

**Backend:**
- ✅ Pool de conexões MySQL (10 simultâneas)
- ✅ Eventos do pool (connection, acquire, release, error)
- ✅ Helper functions (executeQuery, executeTransaction, closePool)
- ✅ Correção de opções inválidas (acquireTimeout, timeout)
- ✅ Top-level await corrigido (IIFE assíncrona)

**Funcionalidades Novas:**
- ✅ Sistema de personalização de produtos
- ✅ Ingredientes extras customizáveis
- ✅ Preferências de clientes com histórico
- ✅ Refresh tokens para sessão persistente
- ✅ Múltiplas imagens por produto
- ✅ Estatísticas WhatsApp detalhadas
- ✅ Webhook WhatsApp com eventos
- ✅ Comandos do bot configuráveis

**Deploy:**
- ✅ Instalação simplificada (1 arquivo SQL)
- ✅ Sem necessidade de múltiplos scripts
- ✅ Admin já criado (não precisa criar manualmente)
- ✅ Banco completo em 1 comando
- ✅ Validação automática após instalação

### 🔧 Correções

- ✅ Opções inválidas do MySQL2 removidas
- ✅ Top-level await corrigido
- ✅ Pool de conexões otimizado
- ✅ Warnings do MySQL eliminados
- ✅ Mensagens de log melhoradas
- ✅ Tratamento de erros aprimorado

---

🎓 **BOA SORTE NA APRESENTAÇÃO!** 🎓
