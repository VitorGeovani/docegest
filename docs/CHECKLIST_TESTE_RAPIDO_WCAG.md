# ✅ CHECKLIST RÁPIDO DE TESTE - WCAG 2.2

## 🚀 Teste em 5 Minutos

### 1. ⚡ Verificação Visual Rápida

```
□ Abrir http://localhost:3000
□ Página carrega sem erros no console
□ Ver botão roxo de acessibilidade (canto inferior direito)
□ Design está bonito e moderno
```

### 2. 🎛️ Menu de Acessibilidade

```
□ Clicar no botão de acessibilidade
□ Menu abre com várias opções
□ Testar "Tamanho do Texto" - mover slider
□ Texto aumenta/diminui na página
□ Testar "Contraste" - clicar "Alto Contraste"
□ Cores mudam para alto contraste
□ Testar "Contraste" - clicar "Modo Escuro"
□ Página fica escura
□ Clicar "Restaurar Padrão"
□ Tudo volta ao normal
□ Fechar menu (X ou clique fora)
```

### 3. ⌨️ Navegação por Teclado

```
□ Recarregar página
□ Pressionar Tab (primeira vez)
□ Ver link "Pular para conteúdo principal" aparecer no topo
□ Pressionar Tab novamente
□ Link some, foco vai para próximo elemento
□ Continuar pressionando Tab
□ Ver todos os elementos focáveis com borda roxa
□ Focus indicator está sempre visível
□ Nenhum elemento "preso" (armadilha)
```

### 4. 🔍 Zoom

```
□ Pressionar Ctrl/Cmd + (várias vezes)
□ Aumentar zoom até 200%
□ Página não quebra
□ Sem scroll horizontal
□ Todos os textos legíveis
□ Botões clicáveis
```

### 5. 📱 Mobile (se possível)

```
□ Abrir no celular ou DevTools mobile
□ Botão de acessibilidade visível
□ Botões grandes (48x48px mínimo)
□ Textos legíveis
□ Menu de acessibilidade responsivo
```

---

## 🎯 Resultado Esperado

### ✅ TUDO FUNCIONANDO SE:

1. **Menu de acessibilidade abre/fecha** ✓
2. **Ajustes aplicam em tempo real** ✓
3. **Tab mostra skip links** ✓
4. **Focus indicators visíveis** ✓
5. **Zoom funciona até 200%** ✓
6. **Design permanece bonito** ✓

### ❌ PROBLEMA SE:

- Menu não abre → Verificar console para erros
- Ajustes não aplicam → Verificar localStorage
- Focus não visível → Verificar CSS carregado
- Zoom quebra layout → Verificar media queries
- Erros no console → Reportar para correção

---

## 🐛 Se Algo Não Funcionar

### 1. Console Vazio?
```bash
# Limpar cache e recarregar
Ctrl+Shift+R (Windows)
Cmd+Shift+R (Mac)
```

### 2. Menu não abre?
```javascript
// Abrir console (F12) e verificar:
console.log('AccessibilityMenu loaded?', 
    document.querySelector('.accessibility-toggle'))
```

### 3. Estilos estranhos?
```bash
# Verificar se arquivo SCSS compilou
# Reiniciar servidor frontend
cd frontend
npm start
```

### 4. Componentes não aparecem?
```javascript
// Verificar importações em index.js
import AccessibilityMenu from './components/accessibilityMenu/AccessibilityMenu';
import SkipLinks from './components/skipLinks/SkipLinks';
```

---

## 📊 Scorecard Rápido

| Teste | Passou? |
|-------|---------|
| Menu de acessibilidade visível | □ |
| Ajustes funcionam | □ |
| Skip links aparecem no Tab | □ |
| Focus indicators visíveis | □ |
| Zoom até 200% sem quebrar | □ |
| Design moderno mantido | □ |
| Sem erros no console | □ |
| Responsivo em mobile | □ |

**Meta: 8/8 ✅**

---

## 🎉 Próximo Passo

**Se tudo funcionou:**
```
✅ Implementação completa!
✅ Site 100% acessível WCAG 2.2 AAA
✅ Pronto para usar
✅ Ler GUIA_ACESSIBILIDADE_WCAG_2_2.md para detalhes
```

**Se algo falhou:**
```
1. Verificar console para erros
2. Verificar se arquivos foram criados
3. Reiniciar servidor
4. Reportar erro específico
```

---

**Tempo estimado de teste:** 5 minutos
**Dificuldade:** Fácil
**Requer:** Navegador moderno + teclado
