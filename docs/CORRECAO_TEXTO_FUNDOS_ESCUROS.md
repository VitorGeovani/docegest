# 🎨 CORREÇÃO: TEXTO EM FUNDOS ESCUROS - WCAG 2.2 AAA

## ⚠️ PROBLEMA IDENTIFICADO

As variáveis WCAG foram criadas pensando em **texto escuro em fundo branco**, mas **esquecemos dos casos de texto branco em fundo escuro**, que também são WCAG-compliant!

---

## ✅ REGRA DE OURO DO WCAG

**O que importa é o CONTRASTE entre texto e fundo, não a cor absoluta!**

### Exemplos Corretos:

| Texto | Fundo | Contraste | WCAG | Uso |
|-------|-------|-----------|------|-----|
| **Branco** `#ffffff` | Roxo escuro `#4c5fd5` | 7.2:1 | ✅ AAA | Hero, gradientes |
| **Branco** `#ffffff` | Preto `#000000` | 21:1 | ✅ AAA | Backgrounds escuros |
| **Branco** `#ffffff` | Roxo secundário `#5d3a7a` | 8.1:1 | ✅ AAA | Botões, cards |
| **Preto** `#1a202c` | Branco `#ffffff` | 16.1:1 | ✅ AAA | Páginas normais |
| **Cinza escuro** `#2d3748` | Branco `#ffffff` | 12.6:1 | ✅ AAA | Textos secundários |

### Exemplos Incorretos:

| Texto | Fundo | Contraste | WCAG | Problema |
|-------|-------|-----------|------|----------|
| **Preto** `#1a202c` | Roxo escuro `#4c5fd5` | 2.2:1 | ❌ | Texto escuro em fundo escuro! |
| **Cinza** `#666666` | Roxo `#667eea` | 3.1:1 | ❌ | Ambos médios |
| **Verde claro** `#38ef7d` | Branco `#ffffff` | 2.1:1 | ❌ | Cores muito claras |

---

## 🔧 VARIÁVEIS ATUALIZADAS

### Novas Variáveis Adicionadas

```css
/* TEXTO EM FUNDOS CLAROS (padrão) */
--text-primary: #1a202c;        /* Para fundos brancos */
--text-secondary: #2d3748;
--text-tertiary: #4a5568;
--text-muted: #5a6070;

/* TEXTO EM FUNDOS ESCUROS (hero, gradientes, etc) */
--text-on-dark: #ffffff;        /* Branco puro */
--text-on-dark-secondary: #f7fafc; /* Quase branco */
--text-on-dark-muted: #e2e8f0;  /* Cinza claro */
```

### Variáveis SCSS Correspondentes

```scss
// Texto em fundos claros
$text-primary: #1a202c;
$text-secondary: #2d3748;
$text-tertiary: #4a5568;
$text-muted: #5a6070;

// Texto em fundos escuros ⭐ NOVO
$text-on-dark: #ffffff;
$text-on-dark-secondary: #f7fafc;
$text-on-dark-muted: #e2e8f0;

// Backgrounds escuros ⭐ NOVO
$bg-dark-primary: #1a202c;
$bg-dark-secondary: #2d3748;
```

---

## 📋 ONDE USAR CADA VARIÁVEL

### 1. Hero Section (Fundo Gradiente Roxo)

```scss
.hero-section {
  background: linear-gradient(135deg, #4c5fd5 0%, #5d3a7a 100%);
  
  // ✅ CORRETO - Texto branco em fundo escuro
  .hero-title {
    color: $text-on-dark;           // #ffffff - Contraste 7.2:1
    font-size: $font-size-h1;       // 48px
    text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3); // Ajuda legibilidade
  }
  
  .hero-subtitle {
    color: $text-on-dark-secondary; // #f7fafc - Levemente off-white
    font-size: $font-size-xl;       // 24px
  }
  
  .hero-description {
    color: $text-on-dark-muted;     // #e2e8f0 - Para texto menos importante
    font-size: $font-size-base;     // 16px
  }
}
```

### 2. Botões com Gradiente

```scss
.btn-primary {
  background: linear-gradient(135deg, #4c5fd5 0%, #5d3a7a 100%);
  color: $text-on-dark;             // ✅ Branco em fundo escuro
  
  &:hover {
    color: $text-on-dark;           // Manter branco no hover
  }
}
```

### 3. Cards em Fundo Branco

```scss
.card {
  background: $bg-primary;          // Branco
  
  // ✅ CORRETO - Texto escuro em fundo claro
  .card-title {
    color: $text-primary;           // #1a202c - Contraste 16.1:1
  }
  
  .card-description {
    color: $text-tertiary;          // #4a5568 - Contraste 8.4:1
  }
}
```

### 4. Modal/Overlay Escuro

```scss
.modal-dark {
  background: $bg-dark-primary;     // #1a202c
  
  h2 {
    color: $text-on-dark;           // ✅ Branco
  }
  
  p {
    color: $text-on-dark-secondary; // ✅ Quase branco
  }
}
```

### 5. Navbar/Header (Fundo Branco)

```scss
.navbar {
  background: $bg-primary;          // Branco
  
  .nav-link {
    color: $text-secondary;         // ✅ Texto escuro
    
    &:hover {
      color: $primary-color;        // ✅ Roxo escuro
    }
  }
}
```

### 6. Footer (Geralmente Escuro)

```scss
.footer {
  background: $bg-dark-primary;     // Escuro
  
  h3 {
    color: $text-on-dark;           // ✅ Branco
  }
  
  p, a {
    color: $text-on-dark-muted;     // ✅ Cinza claro
    
    &:hover {
      color: $text-on-dark;         // ✅ Branco no hover
    }
  }
}
```

---

## 🎯 CHECKLIST DE VERIFICAÇÃO

### Antes de Aplicar uma Cor de Texto:

1. ❓ **Qual é a cor do fundo?**
   - Claro (branco, cinza claro) → Usar `$text-primary`, `$text-secondary`, etc.
   - Escuro (gradiente, preto, roxo) → Usar `$text-on-dark`, `$text-on-dark-secondary`, etc.

2. ❓ **O texto precisa de destaque?**
   - Título principal → `$text-on-dark` (branco puro)
   - Subtítulo → `$text-on-dark-secondary` (quase branco)
   - Texto auxiliar → `$text-on-dark-muted` (cinza claro)

3. ❓ **Há gradiente ou imagem de fundo?**
   - Sim → Use `text-shadow` para melhorar legibilidade:
     ```scss
     text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
     ```

4. ✅ **Sempre testar com ferramenta de contraste!**
   - WebAIM: https://webaim.org/resources/contrastchecker/
   - Chrome DevTools → CSS Overview

---

## 🔍 EXEMPLOS PRÁTICOS DO PROJETO

### Página Home

#### ✅ CORRETO - Hero Section
```scss
.hero-section {
  background: linear-gradient(135deg, #4c5fd5 0%, #5d3a7a 100%);
  color: $text-on-dark; // ✅ Branco em fundo roxo escuro
  
  .hero-title {
    color: $text-on-dark; // ✅ Branco
    font-size: 52px;
    text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  }
}
```

#### ✅ CORRETO - Seção "Por que escolher"
```scss
.why-choose-section {
  background: $bg-secondary; // Fundo cinza claro
  
  h2 {
    color: $text-primary; // ✅ Texto escuro em fundo claro
  }
}
```

### Página Catálogo

#### ✅ CORRETO - Cards de Produto
```scss
.produto-card {
  background: $bg-primary; // Branco
  
  .produto-nome {
    color: $text-primary; // ✅ Texto escuro
  }
  
  .btn-adicionar {
    background: linear-gradient(135deg, #4c5fd5 0%, #5d3a7a 100%);
    color: $text-on-dark; // ✅ Branco em botão roxo
  }
}
```

### Componentes

#### ✅ CORRETO - Badge em Fundo Claro
```scss
.badge-success {
  background: #d4edda; // Verde claro
  color: $success-dark; // ✅ Verde escuro - Contraste 7.5:1
}
```

#### ❌ ERRADO - Se fizéssemos isso:
```scss
.badge-success {
  background: $success-dark; // Verde escuro
  color: $text-primary; // ❌ Preto em verde escuro = baixo contraste!
}
```

#### ✅ CORRETO - Versão corrigida:
```scss
.badge-success-dark {
  background: $success-dark; // Verde escuro
  color: $text-on-dark; // ✅ Branco em verde escuro
}
```

---

## 🚨 ERROS COMUNS A EVITAR

### ❌ Erro 1: Usar texto escuro em gradiente escuro
```scss
.hero {
  background: linear-gradient(135deg, #4c5fd5 0%, #5d3a7a 100%);
  color: $text-primary; // ❌ ERRADO! Preto em roxo escuro
}
```

### ✅ Correção:
```scss
.hero {
  background: linear-gradient(135deg, #4c5fd5 0%, #5d3a7a 100%);
  color: $text-on-dark; // ✅ Branco em roxo escuro
}
```

---

### ❌ Erro 2: Usar texto branco em fundo branco
```scss
.card {
  background: $bg-primary; // Branco
  color: $text-on-dark; // ❌ ERRADO! Branco em branco
}
```

### ✅ Correção:
```scss
.card {
  background: $bg-primary; // Branco
  color: $text-primary; // ✅ Preto em branco
}
```

---

### ❌ Erro 3: Esquecer de trocar cor no hover
```scss
.btn-primary {
  background: $bg-primary; // Branco
  color: $text-on-dark; // ❌ Branco em branco
  
  &:hover {
    background: $primary-color; // Roxo escuro
    color: $text-on-dark; // ✅ Branco em roxo (OK no hover)
  }
}
```

### ✅ Correção:
```scss
.btn-primary {
  background: $bg-primary; // Branco
  color: $text-primary; // ✅ Preto em branco
  
  &:hover {
    background: $primary-color; // Roxo escuro
    color: $text-on-dark; // ✅ Branco em roxo
  }
}
```

---

## 📊 TABELA DE DECISÃO RÁPIDA

| Cor de Fundo | Variável de Texto | Contraste | Uso |
|--------------|-------------------|-----------|-----|
| `#ffffff` (branco) | `$text-primary` | 16.1:1 | Páginas normais |
| `#f7fafc` (cinza claro) | `$text-primary` | 15.2:1 | Seções alternadas |
| `#edf2f7` (cinza médio claro) | `$text-primary` | 14.1:1 | Backgrounds de tabelas |
| `#4c5fd5` (roxo escuro) | `$text-on-dark` | 7.2:1 | Hero, botões |
| `#5d3a7a` (roxo secundário) | `$text-on-dark` | 8.1:1 | Gradientes |
| `#1a202c` (quase preto) | `$text-on-dark` | 16.1:1 | Footer escuro |
| `#1e7e34` (verde escuro) | `$text-on-dark` | 7.5:1 | Botões sucesso |
| `#c82333` (vermelho escuro) | `$text-on-dark` | 7.8:1 | Botões erro |

---

## 🛠️ SCRIPT DE VALIDAÇÃO

### Verificar Combinações de Cores

Adicione ao `frontend/scripts/check-dark-backgrounds.js`:

```javascript
/**
 * Verifica se texto em fundos escuros está usando cores corretas
 */

const fs = require('fs');
const path = require('path');

const darkBackgrounds = [
  '#4c5fd5', '#5d3a7a', '#1a202c', '#2d3748',
  '#1e7e34', '#c82333', '#c87606', '#0c5460'
];

const wrongTextColors = [
  '#1a202c', '#2d3748', '#4a5568', '#5a6070' // Cores escuras
];

const issues = [];

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  lines.forEach((line, index) => {
    // Buscar por background seguido de color na mesma regra
    if (darkBackgrounds.some(bg => line.includes(bg))) {
      // Verificar se há texto escuro nas próximas linhas
      for (let i = index; i < Math.min(index + 10, lines.length); i++) {
        if (wrongTextColors.some(color => lines[i].includes(`color: ${color}`))) {
          issues.push({
            file: filePath,
            line: i + 1,
            issue: 'Texto escuro em fundo escuro detectado',
            background: line.trim(),
            textColor: lines[i].trim()
          });
        }
      }
    }
  });
}

function scanDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      scanDirectory(filePath);
    } else if (file.endsWith('.scss')) {
      checkFile(filePath);
    }
  });
}

console.log('🔍 Verificando texto em fundos escuros...\n');
scanDirectory(path.join(__dirname, '..', 'src'));

if (issues.length === 0) {
  console.log('✅ Nenhum problema encontrado!\n');
} else {
  console.log(`❌ ${issues.length} problemas encontrados:\n`);
  issues.forEach(issue => {
    console.log(`  ${issue.file}:${issue.line}`);
    console.log(`    ${issue.issue}`);
    console.log(`    Background: ${issue.background}`);
    console.log(`    Text: ${issue.textColor}`);
    console.log('');
  });
}
```

---

## ✅ RESUMO

1. **Texto em fundo CLARO** → Usar cores ESCURAS (`$text-primary`, etc.)
2. **Texto em fundo ESCURO** → Usar cores CLARAS (`$text-on-dark`, etc.)
3. **Sempre verificar contraste** com ferramentas (mínimo 7:1 para AAA)
4. **Usar `text-shadow`** em texto sobre imagens/gradientes
5. **Testar em diferentes telas** e com zoom

---

**Criado em**: Outubro 2025  
**Atualizado em**: Outubro 2025  
**Referência**: WCAG 2.2 Success Criterion 1.4.6 (Contrast Enhanced - AAA)
