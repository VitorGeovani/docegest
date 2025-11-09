# 🔄 GUIA DE ATUALIZAÇÃO v5.0 UNIFICADA

## Atualização do Segredo do Sabor para a Versão Unificada

**Versão Anterior**: v4.0  
**Versão Nova**: v5.0 UNIFICADA  
**Data**: 09/11/2025  
**Tempo estimado**: 15 minutos  

---

## 📋 O QUE MUDOU

### ✨ Principais Melhorias

1. **Banco de Dados Unificado**
   - ✅ Agora tudo em 1 arquivo: `INSTALACAO_BANCO_COMPLETO.sql`
   - ✅ Inclui estrutura + dados + procedures + triggers + events
   - ✅ Administrador já incluído
   - ✅ Bot WhatsApp pré-configurado

2. **Pool de Conexões MySQL**
   - ✅ 10 conexões simultâneas
   - ✅ Keep-alive habilitado
   - ✅ Eventos de monitoramento
   - ✅ Helper functions prontas

3. **Novas Funcionalidades**
   - ✅ Sistema de personalização completo
   - ✅ Preferências de clientes com histórico
   - ✅ Refresh tokens (sessão persistente)
   - ✅ Múltiplas imagens por produto
   - ✅ Estatísticas WhatsApp
   - ✅ Limpeza automática (MySQL Events)

4. **Correções Importantes**
   - ✅ Warnings do MySQL2 eliminados
   - ✅ Top-level await corrigido
   - ✅ Opções inválidas removidas
   - ✅ Logs melhorados

---

## 🚀 CENÁRIO 1: Sistema Novo (não deployado)

**Se você ainda não fez o deploy**, simplesmente siga o tutorial atualizado:

📄 **DEPLOY_AZURE_EDUCACIONAL.md** (já atualizado)

O processo é o mesmo, mas agora mais simples:
- 1 arquivo SQL em vez de múltiplos
- Admin já incluído
- Menos comandos para executar

---

## 🔄 CENÁRIO 2: Sistema Já Deployado no Azure

**Se você já tem o sistema rodando no Azure**, siga estes passos:

### Passo 1: Backup do Sistema Atual (5 min)

```bash
# Conectar na VM
ssh -i segredo-do-sabor-key.pem azureuser@SEU_IP

# Fazer backup do banco atual
sudo mysqldump -u segredo_user -pP@\$\$w0rd segredodosabor > ~/backup_v4.sql

# Backup dos arquivos
cd /var/www
sudo tar -czf ~/backup_v4.tar.gz segredodosabor/

# Verificar backups
ls -lh ~/backup_v4.*

# Copiar para seu PC (opcional, mas recomendado)
# No seu PC:
# scp -i segredo-do-sabor-key.pem azureuser@SEU_IP:~/backup_v4.* ~/Desktop/
```

### Passo 2: Atualizar Código do Backend (3 min)

```bash
# Parar backend
pm2 stop segredo-backend

# Ir para pasta do backend
cd /var/www/segredodosabor/backend

# Fazer backup do connection.js atual
cp src/repository/connection.js src/repository/connection.js.bak

# Baixar novo connection.js (do seu PC)
# No seu PC, enviar o arquivo atualizado:
# scp -i segredo-do-sabor-key.pem backend/src/repository/connection.js azureuser@SEU_IP:~/

# Na VM, mover para pasta correta:
sudo mv ~/connection.js src/repository/connection.js

# Ajustar permissões
sudo chown azureuser:azureuser src/repository/connection.js
```

### Passo 3: Atualizar Banco de Dados (5 min)

**OPÇÃO A: Reinstalação Completa (recomendado para atualização limpa)**

```bash
# ⚠️ ATENÇÃO: Isso vai apagar o banco atual!
# Certifique-se de que fez backup no Passo 1

# Dropar banco atual
sudo mysql -u segredo_user -pP@\$\$w0rd -e "DROP DATABASE IF EXISTS segredodosabor;"

# Enviar novo SQL do seu PC:
# scp -i segredo-do-sabor-key.pem INSTALACAO_BANCO_COMPLETO.sql azureuser@SEU_IP:~/

# Importar banco unificado
sudo mysql -u segredo_user -pP@\$\$w0rd < ~/INSTALACAO_BANCO_COMPLETO.sql

# Verificar instalação
sudo mysql -u segredo_user -pP@\$\$w0rd segredodosabor -e "SHOW TABLES;"

# Deve mostrar 21 tabelas
```

**OPÇÃO B: Atualização Incremental (preservar dados existentes)**

```bash
# Se você quer manter os dados atuais e apenas adicionar novas estruturas:

# Enviar script de correção do seu PC:
# scp -i segredo-do-sabor-key.pem CORRECAO_BANCO_DADOS.sql azureuser@SEU_IP:~/

# Executar correções
sudo mysql -u segredo_user -pP@\$\$w0rd segredodosabor < ~/CORRECAO_BANCO_DADOS.sql

# Verificar estrutura
sudo mysql -u segredo_user -pP@\$\$w0rd segredodosabor << 'EOF'
-- Verificar tabelas novas
SHOW TABLES LIKE '%personalizacao%';
SHOW TABLES LIKE '%preferencias%';
SHOW TABLES LIKE '%whatsapp%';

-- Verificar procedures
SHOW PROCEDURE STATUS WHERE Db = 'segredodosabor';

-- Verificar triggers
SHOW TRIGGERS FROM segredodosabor;

-- Verificar events
SHOW EVENTS FROM segredodosabor;
EOF
```

### Passo 4: Reiniciar Backend (1 min)

```bash
# Reiniciar backend com novo código
pm2 restart segredo-backend

# Verificar logs
pm2 logs segredo-backend --lines 50

# Deve ver:
# ✅ Pool de conexões criado com sucesso!
# ✅ Conexão com banco realizada!
# (SEM warnings de acquireTimeout ou timeout)
```

### Passo 5: Testar Sistema (3 min)

```bash
# Testar endpoints
curl http://localhost:5000/
curl http://localhost:5000/produto/listar
curl http://localhost:5000/categoria

# Verificar MySQL Events
sudo mysql -u segredo_user -pP@\$\$w0rd segredodosabor -e "SHOW EVENTS;"

# Testar admin (no navegador)
# http://SEU_IP/login
# Email: admin@segredodosabor.com
# Senha: Admin@123
```

### Passo 6: Validação Final (2 min)

```bash
# Verificar que tudo está funcionando
pm2 status
sudo systemctl status nginx mysql

# Verificar estrutura completa
sudo mysql -u segredo_user -pP@\$\$w0rd segredodosabor << 'EOF'
SELECT 
    (SELECT COUNT(*) FROM information_schema.TABLES 
     WHERE TABLE_SCHEMA = 'segredodosabor' AND TABLE_TYPE = 'BASE TABLE') AS tabelas,
    (SELECT COUNT(*) FROM information_schema.VIEWS 
     WHERE TABLE_SCHEMA = 'segredodosabor') AS views,
    (SELECT COUNT(*) FROM information_schema.ROUTINES 
     WHERE ROUTINE_SCHEMA = 'segredodosabor' AND ROUTINE_TYPE = 'PROCEDURE') AS procedures,
    (SELECT COUNT(*) FROM information_schema.TRIGGERS 
     WHERE TRIGGER_SCHEMA = 'segredodosabor') AS triggers,
    (SELECT COUNT(*) FROM information_schema.EVENTS 
     WHERE EVENT_SCHEMA = 'segredodosabor') AS events;
EOF

# Resultado esperado:
# tabelas: 21
# views: 7
# procedures: 5
# triggers: 5
# events: 2
```

✅ **Atualização completa!**

---

## 🆘 TROUBLESHOOTING

### Erro: "Cannot read properties of undefined"

**Solução**: Arquivo `connection.js` não foi atualizado corretamente.

```bash
# Verificar conteúdo
cat /var/www/segredodosabor/backend/src/repository/connection.js | grep -A 5 "createPool"

# Não deve ter acquireTimeout nem timeout
# Deve ter apenas connectTimeout
```

### Erro: "Ignoring invalid configuration option"

**Solução**: Mesmo problema acima. Baixar o `connection.js` atualizado do repositório.

### Banco não importa

**Solução**: Verificar sintaxe do SQL.

```bash
# Testar sintaxe
sudo mysql -u segredo_user -pP@\$\$w0rd < ~/INSTALACAO_BANCO_COMPLETO.sql 2>&1 | tee ~/import_log.txt

# Ver erros
cat ~/import_log.txt
```

### Admin não loga

**Solução**: Verificar se admin foi criado.

```bash
sudo mysql -u segredo_user -pP@\$\$w0rd segredodosabor -e "SELECT * FROM administrador;"

# Se não existir:
sudo mysql -u segredo_user -pP@\$\$w0rd segredodosabor << 'EOF'
INSERT INTO administrador (nome, email, cpf, senha, ativo) VALUES 
('Administrador', 'admin@segredodosabor.com', '000.000.000-00', 
'$2b$10$g/IYyuSsGc45zlkNVhlXAeFLYijABRXzYOSWjCe1DRTTO6.AQHSQy', 1);
EOF
```

### Events não estão rodando

**Solução**: Habilitar event scheduler.

```bash
sudo mysql -u segredo_user -pP@\$\$w0rd segredodosabor -e "SET GLOBAL event_scheduler = ON;"

# Verificar
sudo mysql -u segredo_user -pP@\$\$w0rd segredodosabor -e "SHOW VARIABLES LIKE 'event_scheduler';"
# Deve retornar: ON
```

---

## 📊 COMPARAÇÃO v4.0 vs v5.0

| Recurso | v4.0 | v5.0 UNIFICADA |
|---------|------|----------------|
| **Arquivos SQL** | 3-4 separados | 1 unificado ✨ |
| **Tabelas** | 15 | 21 ✨ |
| **Views** | 5 | 7 ✨ |
| **Procedures** | 3 | 5 ✨ |
| **Triggers** | 3 | 5 ✨ |
| **Events** | 0 | 2 ✨ |
| **Admin Incluído** | ❌ Manual | ✅ Automático ✨ |
| **Pool Conexões** | ❌ Simples | ✅ Pool 10x ✨ |
| **Personalização** | ❌ | ✅ Completo ✨ |
| **Preferências** | ❌ | ✅ Com histórico ✨ |
| **Refresh Tokens** | ❌ | ✅ Persistente ✨ |
| **Múltiplas Imagens** | ❌ | ✅ Produto ✨ |
| **Stats WhatsApp** | ❌ Básico | ✅ Detalhado ✨ |
| **Limpeza Auto** | ❌ Manual | ✅ Events ✨ |
| **Warnings MySQL** | ⚠️ 2 warnings | ✅ Zero ✨ |

---

## 🎯 BENEFÍCIOS DA ATUALIZAÇÃO

### Para Apresentação:

1. ✅ **Deploy mais rápido** (1 arquivo em vez de 3-4)
2. ✅ **Menos erros** (tudo pré-configurado)
3. ✅ **Admin já pronto** (não precisa criar)
4. ✅ **Mais profissional** (pool de conexões, events)
5. ✅ **Mais recursos** (personalização, preferências)
6. ✅ **Logs limpos** (sem warnings)

### Para Avaliação:

1. ✅ **Complexidade aumentada** (21 tabelas, 5 triggers, 2 events)
2. ✅ **Automação** (limpeza, cálculos)
3. ✅ **Arquitetura robusta** (pool, transactions)
4. ✅ **Funcionalidades avançadas** (refresh tokens, histórico)
5. ✅ **Código profissional** (helpers, eventos)

### Para Banca:

1. ✅ **Demonstração mais rica** (mais features)
2. ✅ **Tecnologia avançada** (events, triggers, pool)
3. ✅ **Instalação simples** (impressiona pela facilidade)
4. ✅ **Código limpo** (sem warnings, otimizado)
5. ✅ **Documentação completa** (arquivo SQL auto-documentado)

---

## 📁 ARQUIVOS NECESSÁRIOS

Para atualização, você precisa destes arquivos:

1. **✅ INSTALACAO_BANCO_COMPLETO.sql** (banco unificado)
2. **✅ connection.js** (pool otimizado)
3. **CORRECAO_BANCO_DADOS.sql** (se optar por atualização incremental)
4. **ATUALIZACAO_V5_UNIFICADA.md** (este guia)

Todos disponíveis no repositório atualizado.

---

## ⏱️ TEMPO TOTAL

- **Backup**: 5 minutos
- **Atualizar código**: 3 minutos
- **Atualizar banco**: 5 minutos
- **Reiniciar serviços**: 1 minuto
- **Testes**: 3 minutos
- **Validação**: 2 minutos

**TOTAL**: ~20 minutos (com testes completos)

---

## ✅ CHECKLIST DE ATUALIZAÇÃO

```
[ ] 1. Backup do banco atual (mysqldump)
[ ] 2. Backup dos arquivos (tar.gz)
[ ] 3. Parar backend (pm2 stop)
[ ] 4. Atualizar connection.js
[ ] 5. Importar banco unificado OU executar correções
[ ] 6. Reiniciar backend (pm2 restart)
[ ] 7. Verificar logs (sem warnings)
[ ] 8. Testar endpoints (curl)
[ ] 9. Testar admin (navegador)
[ ] 10. Validar estrutura (21 tabelas, 7 views, etc.)
[ ] 11. Verificar events (SHOW EVENTS)
[ ] 12. Testar personalização (se aplicável)
[ ] 13. Testar WhatsApp (se aplicável)
[ ] 14. Backup da versão nova (segurança)
```

---

## 📞 SUPORTE

**Problemas na atualização?**

1. Consultar **TROUBLESHOOTING_AZURE.md**
2. Verificar logs: `pm2 logs segredo-backend`
3. Checar MySQL: `sudo tail -50 /var/log/mysql/error.log`
4. Reverter para backup se necessário

**Reverter para v4.0:**

```bash
# Parar backend
pm2 stop segredo-backend

# Restaurar banco
sudo mysql -u segredo_user -pP@\$\$w0rd -e "DROP DATABASE segredodosabor;"
sudo mysql -u segredo_user -pP@\$\$w0rd -e "CREATE DATABASE segredodosabor;"
sudo mysql -u segredo_user -pP@\$\$w0rd segredodosabor < ~/backup_v4.sql

# Restaurar arquivos
cd /var/www
sudo rm -rf segredodosabor
sudo tar -xzf ~/backup_v4.tar.gz

# Reiniciar
pm2 restart segredo-backend
```

---

**Versão**: 5.0 UNIFICADA  
**Data**: 09/11/2025  
**Tipo**: Guia de Atualização  
**Dificuldade**: Média  
**Tempo**: 20 minutos  

🚀 **Boa atualização!**
