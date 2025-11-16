# 🔧 CORREÇÃO URGENTE: Texto Branco em Fundos Escuros

## ⚠️ PROBLEMA

Após implementar as variáveis WCAG, os títulos globais (H1-H6) foram forçados para cor preta, **sobrescrevendo** o texto branco em fundos escuros (hero sections, gradientes, etc).

---

## ✅ SOLUÇÃO APLICADA

### 1. Removida Regra Global de Cor em Títulos

**Arquivo**: `frontend/src/index.css`

```css
/* ❌ ANTES - Forçava preto em TODOS os títulos */
h1, h2, h3, h4, h5, h6 {
  color: var(--text-primary); /* ← REMOVIDO */
  line-height: var(--line-height-tight);
}

/* ✅ DEPOIS - Permite que componentes definam suas cores */
h1, h2, h3, h4, h5, h6 {
  line-height: var(--line-height-tight);
  /* Sem cor definida aqui! */
}
```

### 2. Criado Arquivo de Utilitários

**Arquivo**: `frontend/src/styles/text-on-dark.scss`

Contém:
- Mixin `@include text-on-dark-background`
- Classes `.hero-gradient`, `.dark-background`
- Mixins de gradientes WCAG-compliant

### 3. Atualizado Hero Section

**Arquivo**: `frontend/src/pages/home/index.scss`

```scss
.hero-content {
  color: #ffffff !important; // Branco em fundo roxo
  
  // Todos os filhos também brancos
  * {
    color: #ffffff !important;
  }
  
  .hero-title {
    color: #ffffff !important;
  }
}
```

---

## 📋 COMO CORRIGIR OUTROS ARQUIVOS

### Método 1: Usar Classe CSS (Recomendado)

**No arquivo JSX**:
```jsx
<div className="hero-section gradient-background">
  <h1>Segredo do Sabor</h1> {/* Será branco automaticamente */}
</div>
```

### Método 2: Usar Mixin SCSS

**No arquivo SCSS**:
```scss
@import '../styles/text-on-dark.scss';

.minha-secao-escura {
  background: linear-gradient(135deg, #4c5fd5 0%, #5d3a7a 100%);
  @include text-on-dark-background; // ← Adiciona texto branco
}
```

### Método 3: Força com !important

**Para casos específicos**:
```scss
.hero-title {
  color: #ffffff !important; // Força branco
}
```

---

## 🎯 ARQUIVOS QUE PRECISAM CORREÇÃO

### Prioridade ALTA (Visíveis na Home)

1. ✅ **frontend/src/pages/home/index.scss** - CORRIGIDO
   - Hero section (linha 16-130)
   - Outras seções com gradiente (linhas 190, 278, 330)

2. ⏳ **frontend/src/pages/catalogo/index.scss**
   - Header com gradiente (linha 14)
   - Botões (linha 78)

3. ⏳ **frontend/src/pages/login/index.scss**
   - Background completo (linha 8)
   - Card de login (linha 92)
   - Botão (linha 200)

### Prioridade MÉDIA

4. ⏳ **frontend/src/pages/checkout/index.scss**
   - Header (linha 47)
   - Botão finalizar (linha 391)

5. ⏳ **frontend/src/pages/meusPedidos/index.scss**
   - Múltiplos botões com gradiente (linhas 44, 95, 130, etc)

6. ⏳ **frontend/src/pages/gerenciamentos/index.scss**
   - Header (linha 11)
   - Loading (linha 185)

### Prioridade BAIXA

7. ⏳ **frontend/src/pages/politicaPrivacidade/index.scss**
8. ⏳ **frontend/src/pages/termosUso/index.scss**
9. ⏳ **frontend/src/pages/pedidoConfirmado/index.scss**

---

## 🔍 SCRIPT PARA ENCONTRAR PROBLEMAS

### PowerShell (Windows)

```powershell
# Encontrar todos os gradientes roxos
Get-ChildItem -Path "frontend\src" -Include *.scss -Recurse | Select-String -Pattern "linear-gradient.*667eea|linear-gradient.*764ba2|linear-gradient.*4c5fd5|linear-gradient.*5d3a7a"

# Encontrar possíveis textos forçados para preto em fundos escuros
Get-ChildItem -Path "frontend\src" -Include *.scss -Recurse | Select-String -Pattern "background.*gradient" -Context 5,5 | Select-String -Pattern "color.*text-primary|color.*#1a202c|color.*#2d3748"
```

---

## ⚡ CORREÇÃO RÁPIDA EM MASSA

### Padrão de Substituição

Para cada seção com fundo gradiente roxo:

```scss
// ❌ ANTES
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  
  h1 {
    font-size: 52px;
    /* cor vem do global = preto ❌ */
  }
}

// ✅ DEPOIS
.hero-section {
  background: linear-gradient(135deg, #4c5fd5 0%, #5d3a7a 100%); // WCAG AAA
  @include text-on-dark-background; // ← ADICIONAR
  
  h1 {
    font-size: 52px;
    /* cor vem do mixin = branco ✅ */
  }
}
```

### Ou com !important inline

```scss
.hero-section {
  background: linear-gradient(135deg, #4c5fd5 0%, #5d3a7a 100%);
  color: #ffffff !important;
  
  * {
    color: #ffffff !important; // Força em todos os filhos
  }
}
```

---

## 📊 CHECKLIST DE VALIDAÇÃO

Após corrigir cada arquivo:

- [ ] Texto principal está branco/visível?
- [ ] Subtítulos estão brancos?
- [ ] Links estão brancos e sublinhados?
- [ ] Botões têm contraste adequado?
- [ ] Testar com Lighthouse (contraste 7:1+)?
- [ ] Testar visualmente no navegador?

---

## 🛠️ TESTE VISUAL RÁPIDO

```bash
# Iniciar servidor
cd frontend
npm start

# Verificar páginas:
# 1. http://localhost:3000 - Hero deve ter título BRANCO
# 2. http://localhost:3000/catalogo - Header deve ter texto BRANCO
# 3. http://localhost:3000/login - Fundo gradiente com texto BRANCO
```

---

## 💡 PREVENÇÃO FUTURA

### Regra de Ouro

**NUNCA definir `color` globalmente em seletores universais (h1-h6, p, etc)!**

```css
/* ❌ ERRADO - Força cor em todos os contextos */
h1 {
  color: #1a202c; /* Quebra fundos escuros */
}

/* ✅ CORRETO - Deixa componentes decidirem */
h1 {
  font-size: 48px;
  line-height: 1.5;
  /* SEM cor aqui */
}

/* ✅ CORRETO - Define cor no contexto específico */
.page-content h1 {
  color: #1a202c; /* Só em page-content */
}

.hero-section h1 {
  color: #ffffff; /* Só em hero */
}
```

---

## 📚 REFERÊNCIAS

- **Arquivo de utilitários**: `frontend/src/styles/text-on-dark.scss`
- **Guia completo**: `CORRECAO_TEXTO_FUNDOS_ESCUROS.md`
- **Variáveis WCAG**: `frontend/src/styles/wcag-variables.css`

---

## ✅ STATUS ATUAL

- ✅ Regra global de cor removida
- ✅ Utilitários criados
- ✅ Home/index.scss corrigido
- ⏳ Demais páginas aguardando correção
- ⏳ Teste visual pendente

---

**Criado em**: 18 de Outubro de 2025  
**Prioridade**: 🔴 CRÍTICA  
**Tempo estimado**: 30-60 minutos para corrigir todos os arquivos
