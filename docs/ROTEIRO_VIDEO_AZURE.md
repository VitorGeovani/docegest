# 🎬 ROTEIRO DE VÍDEO - DoceGest na Azure VM
**Duração estimada: 5-8 minutos**

---

## PARTE 1: PORTAL AZURE (2-3 min)

### 1.1 - Visão Geral dos Recursos
```
📍 Navegue: Portal Azure → Resource Groups → segredo-do-sabor-rg
```

**O que mostrar:**
- Nome do Resource Group
- Região: West US 3
- Lista de recursos criados

**Narração sugerida:**
> "Aqui temos o Resource Group do projeto DoceGest, hospedado no Azure. Todos os recursos estão centralizados neste grupo."

---

### 1.2 - Máquina Virtual
```
📍 Clique no recurso: segredo-sabor-vm
```

**O que mostrar na tela de Overview:**
- Status: Running ✅
- Tamanho: Standard D2s v3 (2 vCPUs, 8GB RAM)
- Sistema Operacional: Ubuntu 22.04 LTS
- IP Público: 20.168.13.56
- DNS: segredodosabor.westus3.cloudapp.azure.com

**Narração sugerida:**
> "A VM está rodando Ubuntu 22.04 com 2 CPUs e 8GB de RAM. Configuramos um DNS público para facilitar o acesso."

---

### 1.3 - Networking / NSG Rules
```
📍 Navegue: VM → Networking → Network Security Group
```

**O que mostrar:**
- Regra SSH (porta 22)
- Regra HTTP (porta 80)
- Regra HTTPS (porta 443)
- Portas customizadas: 5000 (backend), 8080 (Evolution API)

**Narração sugerida:**
> "Configuramos as regras de firewall permitindo SSH, HTTP, HTTPS e portas específicas para nossa aplicação."

---

### 1.4 - Discos e Armazenamento
```
📍 VM → Disks
```

**O que mostrar:**
- Disco do SO: 30GB Premium SSD
- Tipo: Managed Disk

---

## PARTE 2: CONEXÃO SSH E ESTRUTURA DO PROJETO (3-5 min)

### 2.1 - Conectar via SSH
```bash
# No PowerShell/Terminal local:
ssh -i D:\Downloads\segredo-sabor-key.pem azureuser@20.168.13.56
```

**Narração:**
> "Vamos nos conectar à VM via SSH usando a chave privada gerada durante a criação."

---

### 2.2 - Visão Geral do Sistema
```bash
# Mostrar informações do sistema
echo "=== INFORMAÇÕES DO SISTEMA ===" && \
uname -a && \
echo "" && \
echo "=== UPTIME ===" && \
uptime && \
echo "" && \
echo "=== MEMÓRIA ===" && \
free -h && \
echo "" && \
echo "=== ESPAÇO EM DISCO ===" && \
df -h /
```

**Narração:**
> "Aqui temos as informações básicas do sistema: versão do Ubuntu, uptime, uso de memória e espaço em disco."

---

### 2.3 - Estrutura de Diretórios do Projeto
```bash
# Mostrar estrutura principal
echo "=== ESTRUTURA DO PROJETO ===" && \
tree -L 2 -d /var/www/segredodosabor
```

**Se tree não estiver instalado, use:**
```bash
ls -la /var/www/segredodosabor/
```

**Narração:**
> "O projeto está organizado em três diretórios principais: backend (Node.js), frontend (React) e dados (certificados SSL)."

---

### 2.4 - Backend (Node.js)
```bash
# Navegar para backend
cd /var/www/segredodosabor/backend

# Mostrar estrutura
echo "=== ESTRUTURA DO BACKEND ===" && \
ls -la

# Mostrar package.json
echo "" && echo "=== DEPENDÊNCIAS PRINCIPAIS ===" && \
cat package.json | grep -A 20 '"dependencies"'

# Mostrar variáveis de ambiente (sem expor senhas)
echo "" && echo "=== CONFIGURAÇÃO (.env) ===" && \
cat .env | grep -E "PORT|DB_HOST|EVOLUTION" | head -10
```

**Narração:**
> "O backend é uma API RESTful em Node.js com Express. Aqui temos todas as rotas, serviços e integração com banco de dados MySQL e Evolution API para WhatsApp."

---

### 2.5 - Frontend (React)
```bash
# Navegar para frontend
cd /var/www/segredodosabor/frontend

# Mostrar estrutura
echo "=== ESTRUTURA DO FRONTEND ===" && \
ls -la

# Mostrar build info
echo "" && echo "=== BUILD ATUALIZADO ===" && \
ls -lh static/js/main*.js
```

**Narração:**
> "O frontend é uma aplicação React compilada e servida pelo Nginx. O build está otimizado para produção."

---

### 2.6 - Docker (Evolution API)
```bash
# Verificar containers Docker
echo "=== CONTAINERS DOCKER ===" && \
sudo docker ps -a

# Ver detalhes do Evolution API
echo "" && echo "=== EVOLUTION API INFO ===" && \
sudo docker inspect evolution-api | grep -E "IPAddress|Status" | head -5

# Ver logs recentes
echo "" && echo "=== LOGS EVOLUTION API (últimas 10 linhas) ===" && \
sudo docker logs evolution-api --tail 10
```

**Narração:**
> "Usamos Docker para rodar a Evolution API, que gerencia a conexão com o WhatsApp Web. O container está configurado com restart automático."

---

### 2.7 - PM2 (Gerenciador de Processos)
```bash
# Mostrar processos gerenciados pelo PM2
echo "=== PROCESSOS PM2 ===" && \
pm2 list

# Mostrar detalhes do backend
echo "" && echo "=== DETALHES DO BACKEND ===" && \
pm2 describe segredo-backend

# Mostrar logs recentes (últimas 20 linhas)
echo "" && echo "=== LOGS DO BACKEND ===" && \
pm2 logs segredo-backend --lines 20 --nostream
```

**Narração:**
> "O PM2 gerencia o processo do backend Node.js, garantindo restart automático em caso de falhas e monitoramento contínuo."

---

### 2.8 - Nginx (Servidor Web)
```bash
# Verificar status do Nginx
echo "=== STATUS DO NGINX ===" && \
sudo systemctl status nginx --no-pager | head -15

# Mostrar configuração principal
echo "" && echo "=== CONFIGURAÇÃO DO SITE ===" && \
sudo cat /etc/nginx/sites-available/segredodosabor

# Testar configuração
echo "" && echo "=== TESTE DE CONFIGURAÇÃO ===" && \
sudo nginx -t
```

**Narração:**
> "O Nginx atua como reverse proxy, servindo o frontend e redirecionando requisições /api para o backend na porta 5000."

---

### 2.9 - Certificado SSL (Let's Encrypt)
```bash
# Ver certificados instalados
echo "=== CERTIFICADOS SSL ===" && \
sudo certbot certificates

# Mostrar configuração de renovação automática
echo "" && echo "=== RENOVAÇÃO AUTOMÁTICA ===" && \
sudo cat /etc/letsencrypt/renewal/segredodosabor.westus3.cloudapp.azure.com.conf | head -15
```

**Narração:**
> "Configuramos certificado SSL gratuito via Let's Encrypt com renovação automática a cada 90 dias."

---

### 2.10 - Banco de Dados MySQL
```bash
# Conectar ao MySQL e mostrar databases
echo "=== BANCO DE DADOS MYSQL ===" && \
mysql -u root -p'root' -e "SHOW DATABASES;"

# Mostrar tabelas principais
echo "" && echo "=== TABELAS DO PROJETO ===" && \
mysql -u root -p'root' segredo_do_sabor -e "SHOW TABLES;" | head -20

# Contar registros principais
echo "" && echo "=== ESTATÍSTICAS ===" && \
mysql -u root -p'root' segredo_do_sabor -e "
SELECT 'Produtos' as Tabela, COUNT(*) as Total FROM produto
UNION ALL
SELECT 'Pedidos', COUNT(*) FROM reserva
UNION ALL
SELECT 'Clientes', COUNT(*) FROM cliente
UNION ALL
SELECT 'Mensagens WhatsApp', COUNT(*) FROM mensagem_whatsapp;"
```

**Narração:**
> "O banco MySQL armazena todos os dados: produtos, pedidos, clientes e histórico de mensagens WhatsApp."

---

### 2.11 - Teste de Conectividade
```bash
# Testar WhatsApp (Evolution API)
echo "=== TESTE EVOLUTION API ===" && \
curl -s http://localhost:8080/instance/connectionState/segredodosabor \
  -H "apikey: segredodosabor2025" | jq

# Testar Backend
echo "" && echo "=== TESTE BACKEND API ===" && \
curl -s http://localhost:5000/produto | jq '. | length' && \
echo "produtos encontrados"

# Testar Frontend via Nginx
echo "" && echo "=== TESTE FRONTEND ===" && \
curl -I https://segredodosabor.westus3.cloudapp.azure.com 2>&1 | grep -E "HTTP|Server"
```

**Narração:**
> "Vamos testar a conectividade: Evolution API conectado, Backend respondendo com produtos, e Frontend acessível via HTTPS."

---

### 2.12 - Monitoramento em Tempo Real
```bash
# Abrir htop (ou top se htop não estiver instalado)
htop
# OU
top

# Pressione 'q' para sair após alguns segundos
```

**Narração:**
> "Por fim, vemos o uso de recursos em tempo real: CPU, memória e processos ativos."

---

## PARTE 3: DEMONSTRAÇÃO WEB (1-2 min)

### 3.1 - Acessar o Site
```
🌐 Abra no navegador: https://segredodosabor.westus3.cloudapp.azure.com
```

**O que mostrar:**
1. **Página inicial** - Carregamento rápido
2. **Catálogo** - Produtos carregando do backend
3. **Admin Login** (admin@segredodosabor.com / admin123)
4. **Painel Admin** - Dashboard com métricas
5. **Reservas em Andamento** - Atualizar status de um pedido
6. **Mostrar WhatsApp** - Abrir WhatsApp Web e mostrar mensagem enviada ✅

**Narração:**
> "O sistema está completamente funcional: frontend React, backend Node.js, banco MySQL, e notificações automáticas via WhatsApp."

---

## 📝 RESUMO FINAL (30 seg)

**Narração:**
> "Recapitulando: temos uma infraestrutura completa na Azure com VM Ubuntu, Nginx com SSL, backend Node.js gerenciado por PM2, Evolution API em Docker para WhatsApp, banco MySQL, e tudo integrado e funcionando em produção. Projeto DoceGest - Sistema de Gestão de Confeitaria completo!"

---

## 🎥 DICAS PARA GRAVAÇÃO

1. **Use OBS Studio ou similar** para gravar tela + narração
2. **Prepare um script** com as falas antes de gravar
3. **Teste todos os comandos** antes de iniciar a gravação
4. **Velocidade:** Fale pausadamente, dê tempo para visualização dos comandos
5. **Edição:** Corte pausas longas, adicione zoom em partes importantes
6. **Música de fundo:** Use algo discreto e profissional

---

## 📋 CHECKLIST PRÉ-GRAVAÇÃO

```bash
# Execute estes comandos antes de gravar para garantir que tudo está OK:

# 1. Verificar se todos os serviços estão rodando
pm2 list
sudo docker ps
sudo systemctl status nginx
sudo systemctl status mysql

# 2. Limpar logs antigos para melhor visualização
pm2 flush segredo-backend

# 3. Testar conectividade
curl -s http://localhost:8080/instance/connectionState/segredodosabor -H "apikey: segredodosabor2025"
curl -s http://localhost:5000/produto | head -1

# 4. Preparar terminal
clear
```

---

## 🎬 ESTRUTURA TÉCNICA RESUMIDA

### Infraestrutura Azure
- **VM:** Standard D2s v3 (2 vCPUs, 8GB RAM)
- **SO:** Ubuntu 22.04 LTS
- **Disco:** 30GB Premium SSD
- **Região:** West US 3
- **IP Público:** 20.168.13.56
- **DNS:** segredodosabor.westus3.cloudapp.azure.com

### Stack Tecnológica
- **Frontend:** React 19.1.0 (compilado e otimizado)
- **Backend:** Node.js 20.19.5 + Express 5.1.0
- **Banco de Dados:** MySQL 8.0.44
- **Servidor Web:** Nginx 1.18.0
- **SSL:** Let's Encrypt (renovação automática)
- **Process Manager:** PM2
- **WhatsApp:** Evolution API v1.8.0 (Docker)
- **Containerização:** Docker 24.0.7

### Portas Configuradas
- **22:** SSH
- **80:** HTTP (redirect para HTTPS)
- **443:** HTTPS
- **3306:** MySQL (interno)
- **5000:** Backend API (interno, proxy via Nginx)
- **8080:** Evolution API (interno)

### Recursos Implementados
✅ Sistema completo de gestão de confeitaria
✅ Catálogo de produtos com personalização
✅ Sistema de pedidos e reservas
✅ Painel administrativo completo
✅ Notificações automáticas via WhatsApp
✅ Chatbot inteligente com IA
✅ Dashboard com métricas e relatórios
✅ Gestão de estoque e ingredientes
✅ Cálculo automático de custos de receitas
✅ Sistema de autenticação e autorização
✅ HTTPS com certificado SSL válido
✅ Monitoramento e logs centralizados

---

## 📞 INFORMAÇÕES DE CONTATO

- **Projeto:** DoceGest
- **URL:** https://segredodosabor.westus3.cloudapp.azure.com
- **Repositório:** docegest (VitorGeovani)
- **Tecnologias:** React, Node.js, MySQL, Docker, Nginx, Azure
- **Data de Deploy:** Novembro 2025

---

**Boa sorte com a gravação! 🎬🚀**
