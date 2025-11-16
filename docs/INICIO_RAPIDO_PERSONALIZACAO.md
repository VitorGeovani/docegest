# ⚡ INÍCIO RÁPIDO: Personalização com Estoque

## 🚀 3 Passos Para Começar

### 1️⃣ Executar Migração (2 minutos)
```bash
# Windows - Duplo clique no arquivo:
executar-migracao-personalizacao-estoque.bat

# Ou manual:
mysql -u root -p db_segredo_do_sabor < vincular-personalizacao-ingredientes.sql
```

### 2️⃣ Iniciar Backend (30 segundos)
```bash
cd backend
npm start
```

### 3️⃣ Testar (1 minuto)
```bash
cd backend
node testar-personalizacao-estoque.js
```

---

## ✅ O Que Foi Feito

✔️ Tabela que vincula personalizações aos ingredientes  
✔️ Baixa automática no estoque ao personalizar produtos  
✔️ API REST com 5 novos endpoints  
✔️ Verificação de disponibilidade por estoque  
✔️ Registro de movimentações  

---

## 🧪 Teste Rápido

### Verificar se funcionou:
```sql
-- 1. Ver vínculos criados
SELECT * FROM vw_personalizacao_com_ingredientes LIMIT 10;

-- 2. Ver disponibilidade
SELECT * FROM vw_disponibilidade_personalizacao;
```

### Testar endpoint:
```bash
curl http://localhost:5000/personalizacao/valores/1/ingredientes
```

---

## 📖 Documentação

| Arquivo | Para Que Serve |
|---------|----------------|
| `GUIA_PERSONALIZACAO_ESTOQUE.md` | Guia completo e detalhado |
| `RESUMO_IMPLEMENTACAO.md` | Resumo técnico |
| `SUMARIO_SESSAO_PERSONALIZACAO_ESTOQUE.md` | Visão geral |

---

## ⚠️ Atenção

O arquivo `frontend/src/components/personalizacao/index.js` ficou com código duplicado e **necessita correção manual**.

Backend está 100% funcional! ✅
