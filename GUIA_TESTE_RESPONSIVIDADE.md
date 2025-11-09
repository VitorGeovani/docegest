# 🧪 Guia de Teste - Responsividade do Menu de Personalização

## 📱 Como Testar as Melhorias

### Pré-requisitos
1. Abrir o projeto no navegador
2. Abrir as ferramentas de desenvolvedor (F12)
3. Ativar o modo responsivo (Ctrl+Shift+M ou Cmd+Shift+M)

---

## 🎯 Cenários de Teste

### ✅ Teste 1: Desktop (1920x1080)
**Passos:**
1. Navegar até o catálogo de produtos
2. Clicar em "Personalizar" em qualquer produto
3. **Verificar:**
   - ✓ Modal centralizado na tela
   - ✓ Largura máxima de 650px
   - ✓ Bordas arredondadas (20px)
   - ✓ Animação `slideUp` ao abrir
   - ✓ Scroll interno no conteúdo
   - ✓ Hover nos cards funciona
   - ✓ Botões lado a lado

### ✅ Teste 2: Tablet (768x1024)
**Passos:**
1. Mudar dimensões para iPad (768x1024)
2. Abrir menu de personalização
3. **Verificar:**
   - ✓ Modal em 90% da largura
   - ✓ Espaçamentos reduzidos
   - ✓ Touch targets maiores (48px)
   - ✓ Fontes legíveis
   - ✓ Botões ainda em linha

### ✅ Teste 3: iPhone 14 Pro Max (430x932)
**Passos:**
1. Selecionar "iPhone 14 Pro Max" ou definir 430x932
2. Abrir menu de personalização
3. **Verificar:**
   - ✓ Modal em **tela cheia** (sem bordas)
   - ✓ Header fixo no topo durante scroll
   - ✓ Animação vindo de baixo (`slideInFromBottom`)
   - ✓ Opções com altura mínima de 48px
   - ✓ Radio/checkbox com 22px
   - ✓ Scroll suave (touch optimized)
   - ✓ Footer fixo na base
   - ✓ Botões empilhados verticalmente
   - ✓ Botão "Confirmar" maior que "Cancelar"

### ✅ Teste 4: iPhone SE (375x667)
**Passos:**
1. Selecionar "iPhone SE" ou definir 375x667
2. Abrir menu de personalização
3. **Verificar:**
   - ✓ Tudo visível sem zoom
   - ✓ Título do header quebra linha se necessário
   - ✓ Valores de preço não transbordam
   - ✓ Resumo financeiro legível
   - ✓ Botões com altura de 52px

### ✅ Teste 5: Galaxy S21 (360x800)
**Passos:**
1. Definir dimensões 360x800
2. Abrir menu de personalização
3. **Verificar:**
   - ✓ Layout compacto mas funcional
   - ✓ Espaçamentos mínimos aplicados
   - ✓ Fonte mínima de 13px
   - ✓ Sem scroll horizontal

### ✅ Teste 6: Modo Paisagem (Landscape)
**Passos:**
1. Definir 768x480 (tablet landscape)
2. Abrir menu de personalização
3. **Verificar:**
   - ✓ Header mais compacto
   - ✓ Conteúdo aproveita altura
   - ✓ Botões em linha (horizontal)
   - ✓ Scroll otimizado

---

## 🎨 Checklist Visual

### Header
- [ ] Emoji de pincel visível
- [ ] Título não cortado
- [ ] Botão X bem posicionado
- [ ] Background gradient suave
- [ ] Shadow quando rola

### Opções
- [ ] Cards bem espaçados
- [ ] Border radius consistente
- [ ] Radio/checkbox alinhados
- [ ] Texto não transborda
- [ ] Preços alinhados à direita
- [ ] Estado ativo visível

### Select (iOS/Android)
- [ ] Seta customizada aparece
- [ ] Altura mínima respeitada
- [ ] Fonte legível (15px)
- [ ] Background branco

### Resumo
- [ ] Valores alinhados
- [ ] Total destacado
- [ ] Cores corretas (vermelho)
- [ ] Espaçamento adequado

### Footer
- [ ] Botões ocupam 100% da largura
- [ ] Shadow superior visível
- [ ] Espaço entre botões (10px)
- [ ] Altura mínima 52px

---

## 🐛 Possíveis Problemas e Soluções

### ❌ Modal não abre em tela cheia no mobile
**Solução:** Limpar cache do navegador (Ctrl+Shift+Delete)

### ❌ Scroll não funciona
**Solução:** Verificar se `overflow-y: auto` está aplicado em `.personalizacao-content`

### ❌ Botões pequenos demais
**Solução:** Verificar se `min-height: 48px` está sendo aplicado

### ❌ Header não fica fixo
**Solução:** Verificar `position: sticky` e `z-index: 10`

### ❌ Animação estranha
**Solução:** Em mobile deve ser `slideInFromBottom`, não `slideUp`

---

## 📊 Métricas de Sucesso

### Acessibilidade (WCAG AAA)
- ✅ Touch targets ≥ 48px
- ✅ Fonte mínima 13px
- ✅ Contraste 7:1 (vermelho vs branco)
- ✅ Line-height 1.4

### Performance
- ✅ Animação 60fps
- ✅ Scroll suave
- ✅ Sem layout shift
- ✅ Sem scroll horizontal

### Usabilidade
- ✅ Fácil fechar (X ou fora do modal)
- ✅ Valores claramente visíveis
- ✅ Feedback tátil (active state)
- ✅ Loading state claro

---

## 🔧 Ferramentas Úteis

### Chrome DevTools
```
F12 → Ctrl+Shift+M (Toggle device toolbar)
```

### Testar Dispositivos Reais
1. Conectar celular via USB
2. Chrome: `chrome://inspect`
3. Abrir site no celular
4. Inspecionar remotamente

### Lighthouse (Performance)
```
F12 → Lighthouse → Mobile → Generate report
```

### Responsinator (Online)
```
https://www.responsinator.com
```

---

## 📸 Screenshots Esperados

### Desktop
```
┌────────────────────────────────┐
│  🎨 Personalize seu Mousse  [×]│
├────────────────────────────────┤
│                                │
│  [Opção 1]                     │
│  [Opção 2]                     │
│  [Opção 3]                     │
│                                │
│  Resumo:                       │
│  Base: R$ 10,00                │
│  + Personalizações: R$ 2,50    │
│  TOTAL: R$ 12,50               │
│                                │
├────────────────────────────────┤
│ [Cancelar]  [Confirmar]        │
└────────────────────────────────┘
```

### Mobile
```
┌──────────────────┐
│🎨 Mousse    [×]  │ ← Sticky
├──────────────────┤
│                  │
│ [Opção 1]        │ ← 48px altura
│ [Opção 2]        │
│ [Opção 3]        │
│                  │
│ Resumo:          │
│ Base: R$ 10,00   │
│ Total: R$ 12,50  │
│                  │
│                  │
├──────────────────┤
│ [Cancelar]       │ ← Sticky
│ [Confirmar ✓]    │
└──────────────────┘
```

---

## ✅ Aprovação Final

Após testar todos os cenários, verificar:

- [ ] Funciona em iPhone (Safari)
- [ ] Funciona em Android (Chrome)
- [ ] Funciona em iPad
- [ ] Funciona em Desktop
- [ ] Sem erros no console
- [ ] Performance aceitável
- [ ] UX intuitiva
- [ ] Acessível (WCAG)

---

**Data de Criação**: 09/11/2025  
**Testado Por**: _____________  
**Status**: ⏳ Pendente / ✅ Aprovado  
**Observações**: _____________________________________________

