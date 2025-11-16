# 🎨 Guia de Teste - Estilização Profissional: Ingredientes e Personalização

## ✅ Checklist de Verificação

### 1️⃣ Pré-requisitos
- [ ] Backend rodando na porta 5000
- [ ] Frontend rodando na porta 3000
- [ ] Banco de dados com dados de personalização (44 valores, 52 links)

### 2️⃣ Acesso à Interface
1. Abra o navegador em: `http://localhost:3000/gerenciamentos`
2. Faça login com credenciais de administrador
3. Clique na aba **"Ingredientes"**

### 3️⃣ Verificação dos Botões de Navegação

#### 🔘 Botão "Ingredientes"
**Deve ter:**
- ✅ Fundo com gradiente roxo (#667eea → #764ba2)
- ✅ Texto branco em negrito
- ✅ Ícone de caixa (📦) ao lado do texto
- ✅ Efeito hover: elevação + brilho aumentado
- ✅ Animação suave na transição
- ✅ Sombra roxa sutil

#### 🔘 Botão "Itens de Personalização"
**Deve ter:**
- ✅ Fundo cinza claro (#f3f4f6) quando inativo
- ✅ Gradiente roxo quando ativo (igual ao botão Ingredientes)
- ✅ Ícone de paleta (🎨) ao lado do texto
- ✅ Efeito hover: background mais escuro
- ✅ Transição suave entre estados

### 4️⃣ Verificação dos Cards de Personalização

Clique em **"Itens de Personalização"** e verifique:

#### 📋 Cabeçalho do Card
**Cada item deve ter:**
- ✅ Badge roxo com o tipo (RECHEIO, COBERTURA, DECORAÇÃO, EXTRAS)
- ✅ Nome do item em negrito e tamanho grande
- ✅ Ícone de edição (✏️) no canto superior direito

#### 💵 Seção de Preço
**Deve mostrar:**
- ✅ Label "Preço Adicional" em cinza
- ✅ Valor em verde (#10b981) e fonte grande
- ✅ Texto alinhado à esquerda

#### 📦 Seção de Estoque
**Deve ter:**
- ✅ Barra de progresso visual:
  - 🟢 Verde (#10b981) quando quantidade > 50
  - 🟡 Amarelo (#f59e0b) quando quantidade entre 20-50
  - 🔴 Vermelho (#ef4444) quando quantidade < 20
- ✅ Texto mostrando: "X unidades disponíveis"
- ✅ Badge de alerta vermelho se quantidade < 10

#### 🔗 Seção de Ingrediente Vinculado
**Se o item tem ingrediente:**
- ✅ Título "Ingrediente Vinculado"
- ✅ Nome do ingrediente em roxo
- ✅ Unidade de medida ao lado
- ✅ Quantidade que será consumida

**Se não tem ingrediente:**
- ✅ Texto em cinza: "Nenhum ingrediente vinculado"

#### 🎯 Efeitos de Interação
**Ao passar o mouse sobre o card:**
- ✅ Elevação aumenta (sombra mais pronunciada)
- ✅ Transição suave (300ms)
- ✅ Borda permanece cinza clara

### 5️⃣ Verificação de Responsividade

#### 💻 Desktop (> 1024px)
- [ ] Cards em grid de 3 colunas
- [ ] Botões lado a lado horizontalmente
- [ ] Espaçamento adequado entre cards

#### 📱 Tablet (768px - 1024px)
- [ ] Cards em grid de 2 colunas
- [ ] Botões ainda horizontais
- [ ] Margens ajustadas

#### 📱 Mobile (< 768px)
- [ ] Cards em coluna única
- [ ] Botões empilhados verticalmente
- [ ] Fonte ajustada para leitura fácil

## 🐛 Problemas Comuns e Soluções

### ❌ Problema: Estilos não aparecem
**Solução:**
1. Limpe o cache do navegador: **Ctrl + Shift + R** (Windows) ou **Cmd + Shift + R** (Mac)
2. Verifique se o arquivo `index.scss` está sendo importado no componente
3. Verifique no DevTools se o CSS foi carregado:
   - Abra DevTools (F12)
   - Vá em Network → CSS
   - Procure por `ingredientes/index.scss` ou similar
   - Verifique se o status é 200

### ❌ Problema: Botões aparecem sem gradiente
**Solução:**
1. Inspecione o elemento (clique direito → Inspecionar)
2. Verifique se a classe `.aba-btn` está presente
3. Verifique se a classe `.ativo` está no botão correto
4. Procure por estilos sobrescritos no DevTools

### ❌ Problema: Cards aparecem sem formatação
**Solução:**
1. Verifique se os dados estão carregando no console:
   ```javascript
   console.log('Valores de personalização:', valoresPersonalizacao);
   ```
2. Inspecione um card e veja se as classes estão aplicadas:
   - `.personalizacao-card`
   - `.card-header-personalizacao`
   - `.card-body-personalizacao`
3. Verifique se há erros no console do navegador

## 🔍 Comandos de Diagnóstico

### Backend
```bash
# Verificar se o servidor está rodando
curl http://localhost:5000/personalizacao/valores-completos
```

**Resposta esperada:** JSON com 44 valores de personalização

### Frontend
```bash
# Limpar cache e rebuildar
cd D:\Downloads\Segredo-do-Sabor\frontend
rm -r build
rm -r node_modules/.cache
npm start
```

### Banco de Dados
```sql
-- Verificar valores de personalização
SELECT COUNT(*) FROM opcao_valores;
-- Deve retornar: 44

-- Verificar links com ingredientes
SELECT COUNT(*) FROM personalizacao_ingrediente;
-- Deve retornar: 52
```

## 📸 Aparência Esperada

### Botões de Navegação
```
┌────────────────────┬────────────────────────────────┐
│   📦 Ingredientes  │   🎨 Itens de Personalização  │
│   (gradiente roxo) │        (cinza claro)          │
└────────────────────┴────────────────────────────────┘
```

### Card de Personalização (Exemplo)
```
┌─────────────────────────────────────────────────┐
│ 🏷️ RECHEIO          Chocolate Belga       ✏️   │
├─────────────────────────────────────────────────┤
│                                                 │
│ Preço Adicional                                 │
│ R$ 5,00                                         │
│                                                 │
│ Estoque                                         │
│ ████████████████████░░░░░░░░ 75%               │
│ 75 unidades disponíveis                         │
│                                                 │
│ Ingrediente Vinculado                           │
│ 🔗 Chocolate ao Leite (kg)                      │
│ Consumo: 0.200 kg                               │
│                                                 │
└─────────────────────────────────────────────────┘
```

## ✨ Animações Implementadas

1. **fadeIn**: Cards aparecem suavemente ao carregar
2. **spin**: Ícone de loading girando
3. **pulse-alert**: Badge de alerta pulsando
4. **pulse-mini**: Animação sutil no ícone de edição

## 🎯 Resultados Esperados

Após seguir este guia, você deve ter:

✅ Interface moderna e profissional
✅ Navegação intuitiva entre abas
✅ Feedback visual claro sobre estoque
✅ Informações organizadas em cards
✅ Responsividade em todos os dispositivos
✅ Animações suaves e naturais
✅ Paleta de cores consistente (roxo, verde, vermelho)

## 📞 Suporte

Se algum item do checklist não estiver funcionando:
1. Verifique os logs do console do navegador (F12)
2. Verifique os logs do backend no terminal
3. Confirme que todos os serviços estão rodando
4. Limpe o cache e tente novamente

---

**Data de Criação:** ${new Date().toLocaleDateString('pt-BR')}
**Componente:** frontend/src/components/ingredientes/
**Arquivo de Estilos:** index.scss (1465 linhas)
