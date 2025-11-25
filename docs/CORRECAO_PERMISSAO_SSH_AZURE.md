# 🔐 CORREÇÃO: Permissões da Chave SSH para Azure

## ❌ Problema Identificado

```
%azureuser%: Não foi feito mapeamento entre os nomes de conta e as identificações de segurança.
```

**Causa:** O Windows não reconhece a variável `%azureuser%` porque ela não existe no sistema local.

---

## ✅ SOLUÇÃO PASSO A PASSO

### **Passo 1: Remover permissões herdadas** (já feito ✅)

```cmd
icacls "segredo-sabor-key.pem" /inheritance:r
```

### **Passo 2: Descobrir seu usuário Windows**

Abra o PowerShell e execute:
```powershell
whoami
```

**Exemplo de saída:**
```
DESKTOP-ABC123\VitorGeovani
```

### **Passo 3: Dar permissão apenas ao SEU usuário**

**Método A - Usando variável do sistema (recomendado):**
```cmd
icacls "segredo-sabor-key.pem" /grant:r "%username%:(R)"
```

**Método B - Usando nome completo do usuário:**
```cmd
icacls "segredo-sabor-key.pem" /grant:r "DESKTOP-ABC123\VitorGeovani:(R)"
```
*(Substitua pelo resultado do `whoami`)*

### **Passo 4: Verificar permissões**

```cmd
icacls "segredo-sabor-key.pem"
```

**Resultado esperado:**
```
segredo-sabor-key.pem DESKTOP-ABC123\VitorGeovani:(R)
                      Processados com sucesso 1 arquivos
```

---

## 🚀 COMANDOS COMPLETOS PARA COPIAR E COLAR

Execute no PowerShell (como Administrador):

```powershell
# Navegar até a pasta da chave
cd D:\Downloads

# Remover herança de permissões
icacls "segredo-sabor-key.pem" /inheritance:r

# Dar permissão de leitura ao usuário atual
icacls "segredo-sabor-key.pem" /grant:r "$env:USERNAME:(R)"

# Verificar permissões
icacls "segredo-sabor-key.pem"
```

---

## 🔌 CONECTAR AO AZURE VIA SSH

Depois de corrigir as permissões:

```powershell
ssh -i segredo-sabor-key.pem azureuser@<IP_PUBLICO_DA_VM>
```

**Exemplo:**
```powershell
ssh -i segredo-sabor-key.pem azureuser@20.123.45.67
```

---

## ⚠️ TROUBLESHOOTING

### Erro: "Unprotected private key file"

**Windows (PowerShell):**
```powershell
icacls "segredo-sabor-key.pem" /reset
icacls "segredo-sabor-key.pem" /inheritance:r
icacls "segredo-sabor-key.pem" /grant:r "$env:USERNAME:(R)"
```

### Erro: "Permission denied (publickey)"

1. **Verifique o nome do usuário na VM:**
   - Entre no Portal Azure
   - Vá em: Virtual Machines > Sua VM > Connect > SSH
   - Copie o comando SSH mostrado (ele tem o usuário correto)

2. **Exemplo:**
   ```
   ssh -i segredo-sabor-key.pem adminuser@20.123.45.67
   ```
   *(Pode ser `adminuser`, `azureuser`, `vitor`, etc)*

### Erro: "Connection timed out"

1. Verifique se o IP está correto
2. Verifique se a porta 22 está aberta no NSG (Network Security Group):
   - Portal Azure > Virtual Machines > Networking
   - Deve ter regra permitindo porta 22 (SSH)

---

## 📋 CHECKLIST PÓS-CONEXÃO

Após conectar via SSH, instale as dependências:

```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar MySQL
sudo apt install mysql-server -y

# Instalar Nginx
sudo apt install nginx -y

# Instalar Git
sudo apt install git -y

# Verificar instalações
node --version
npm --version
mysql --version
nginx -v
git --version
```

---

## 🎯 PRÓXIMOS PASSOS

1. ✅ Corrigir permissões da chave SSH
2. ✅ Conectar à VM Azure via SSH
3. ⬜ Instalar dependências (Node, MySQL, Nginx)
4. ⬜ Clonar repositório do GitHub
5. ⬜ Configurar banco de dados
6. ⬜ Configurar variáveis de ambiente (.env)
7. ⬜ Build do frontend
8. ⬜ Configurar Nginx como reverse proxy
9. ⬜ Configurar SSL (Let's Encrypt)
10. ⬜ Testar sistema em produção

---

## 📚 REFERÊNCIAS

- **Documentação Azure SSH:** https://learn.microsoft.com/azure/virtual-machines/linux/mac-create-ssh-keys
- **Guia icacls Windows:** https://learn.microsoft.com/windows-server/administration/windows-commands/icacls
- **Manual completo:** Ver `RELATORIO_PARTE_16_APENDICE_C_MANUAL_TECNICO.md`

---

**DoceGest - Deploy Azure**  
*Guia de Correção SSH - Novembro 2025*
