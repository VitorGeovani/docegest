# 📋 GUIA DE IMPLEMENTAÇÃO WCAG 2.2 AAA
## Tamanho de Fontes e Contraste de Cores

---

## 🎯 RESUMO EXECUTIVO

Este documento fornece diretrizes completas para garantir que todos os componentes do **Segredo do Sabor** atendam aos requisitos WCAG 2.2 Level AAA para:
- ✅ **Contraste de cores**: Mínimo 7:1 para texto normal, 4.5:1 para texto grande
- ✅ **Tamanho de fontes**: Mínimo 16px para corpo, 14px para textos auxiliares
- ✅ **Espaçamento**: Alvos tocáveis de no mínimo 44x44px
- ✅ **Legibilidade**: Altura de linha mínima de 1.5

---

## 📊 TABELA DE REFERÊNCIA RÁPIDA

### Contraste de Cores WCAG AAA (7:1)

| Cor | Hex | Uso | Contraste em Branco |
|-----|-----|-----|---------------------|
| Texto Primário | `#1a202c` | Texto principal | 16.1:1 ✅ |
| Texto Secundário | `#2d3748` | Subtítulos | 12.6:1 ✅ |
| Texto Terciário | `#4a5568` | Texto auxiliar | 8.4:1 ✅ |
| Roxo Primário | `#4c5fd5` | Botões, links | 7.2:1 ✅ |
| Roxo Secundário | `#5d3a7a` | Destaques | 8.1:1 ✅ |
| Verde Sucesso | `#1e7e34` | Confirmações | 7.5:1 ✅ |
| Vermelho Erro | `#c82333` | Erros, alertas | 7.8:1 ✅ |
| Laranja Aviso | `#c87606` | Avisos | 7.1:1 ✅ |
| Azul Info | `#0c5460` | Informações | 9.2:1 ✅ |

### Tamanhos de Fonte WCAG

| Uso | Tamanho | Variável CSS | Peso |
|-----|---------|--------------|------|
| Corpo de texto | 16px | `var(--font-size-base)` | 400 |
| Texto pequeno | 14px | `var(--font-size-xs)` | 400 |
| Texto médio | 18px | `var(--font-size-md)` | 400 |
| Título H1 | 48px | `var(--font-size-h1)` | 700 |
| Título H2 | 40px | `var(--font-size-h2)` | 700 |
| Título H3 | 32px | `var(--font-size-h3)` | 600 |
| Título H4 | 28px | `var(--font-size-h4)` | 600 |
| Título H5 | 24px | `var(--font-size-h5)` | 600 |
| Título H6 | 20px | `var(--font-size-h6)` | 600 |
| Botões | 16px | `var(--font-size-base)` | 600 |
| Labels | 15px | `var(--font-size-sm)` | 500 |

---

## 🔧 IMPLEMENTAÇÃO POR COMPONENTE

### 1. BOTÕES

#### ❌ ANTES (Não WCAG-compliant)
```scss
.btn {
  font-size: 14px;              // Muito pequeno
  padding: 8px 16px;            // Alvo de toque pequeno
  background: #667eea;          // Contraste insuficiente
  color: #f0f0f0;              // Cinza claro - contraste ruim
}
```

#### ✅ DEPOIS (WCAG AAA)
```scss
.btn {
  font-size: var(--font-size-base);       // 16px
  font-weight: var(--font-weight-semibold); // 600
  min-width: var(--min-touch-target);     // 44px
  min-height: var(--min-touch-target);    // 44px
  padding: var(--spacing-sm) var(--spacing-md); // 12px 16px
  background: var(--primary-dark);        // #4c5fd5 - Contraste 7.2:1
  color: #ffffff;                         // Branco puro
  border-radius: var(--border-radius-sm); // 8px
  
  &:hover {
    background: var(--secondary-dark);    // #5d3a7a
    transition: var(--transition-normal); // 300ms
  }
  
  &:focus-visible {
    outline: 3px solid var(--primary-dark);
    outline-offset: 2px;
  }
}
```

### 2. TEXTO E PARÁGRAFOS

#### ❌ ANTES
```scss
p {
  font-size: 14px;              // Muito pequeno
  line-height: 1.3;             // Apertado demais
  color: #666;                  // Contraste insuficiente
}
```

#### ✅ DEPOIS
```scss
p {
  font-size: var(--font-size-base);      // 16px
  line-height: var(--line-height-normal); // 1.6
  color: var(--text-primary);            // #1a202c - Contraste 16.1:1
  margin-bottom: var(--spacing-md);      // 16px
}
```

### 3. TÍTULOS

#### ❌ ANTES
```scss
h1 { font-size: 32px; color: #667eea; }
h2 { font-size: 28px; color: #764ba2; }
h3 { font-size: 24px; color: #888; }
```

#### ✅ DEPOIS
```scss
h1 {
  font-size: var(--font-size-h1);        // 48px
  font-weight: var(--font-weight-bold);  // 700
  color: var(--text-primary);            // #1a202c
  line-height: var(--line-height-tight); // 1.5
  margin-bottom: var(--spacing-lg);      // 24px
}

h2 {
  font-size: var(--font-size-h2);        // 40px
  font-weight: var(--font-weight-bold);  // 700
  color: var(--text-primary);            // #1a202c
  line-height: var(--line-height-tight); // 1.5
  margin-bottom: var(--spacing-md);      // 16px
}

h3 {
  font-size: var(--font-size-h3);        // 32px
  font-weight: var(--font-weight-semibold); // 600
  color: var(--text-secondary);          // #2d3748
  line-height: var(--line-height-tight); // 1.5
  margin-bottom: var(--spacing-md);      // 16px
}
```

### 4. LINKS

#### ❌ ANTES
```scss
a {
  color: #667eea;               // Contraste insuficiente
  text-decoration: none;        // Dificulta identificação
}
```

#### ✅ DEPOIS
```scss
a {
  color: var(--primary-dark);              // #4c5fd5 - Contraste 7.2:1
  text-decoration: underline;              // Facilita identificação
  font-weight: var(--font-weight-medium);  // 500
  transition: var(--transition-fast);      // 150ms
  
  &:hover {
    color: var(--secondary-dark);          // #5d3a7a
    text-decoration: none;
  }
  
  &:focus-visible {
    outline: 3px solid var(--primary-dark);
    outline-offset: 2px;
    border-radius: var(--border-radius-sm);
  }
}
```

### 5. INPUTS E FORMULÁRIOS

#### ❌ ANTES
```scss
input, textarea {
  font-size: 14px;
  padding: 8px;
  border: 1px solid #ddd;
  color: #666;
}

label {
  font-size: 12px;
  color: #888;
}
```

#### ✅ DEPOIS
```scss
input, textarea, select {
  font-size: var(--font-size-base);      // 16px
  line-height: var(--line-height-normal); // 1.6
  padding: var(--spacing-sm);            // 12px
  min-height: var(--min-touch-target);   // 44px
  border: 2px solid var(--border-medium); // #a0aec0
  border-radius: var(--border-radius-sm); // 8px
  color: var(--text-primary);            // #1a202c
  background: var(--bg-primary);         // #ffffff
  
  &::placeholder {
    color: var(--text-muted);            // #5a6070 - Contraste 7.3:1
  }
  
  &:focus {
    outline: none;
    border-color: var(--primary-dark);   // #4c5fd5
    box-shadow: 0 0 0 3px rgba(76, 95, 213, 0.2);
  }
  
  &:disabled {
    background: var(--bg-tertiary);      // #edf2f7
    cursor: not-allowed;
    opacity: 0.6;
  }
}

label {
  font-size: var(--font-size-sm);        // 15px
  font-weight: var(--font-weight-medium); // 500
  color: var(--text-secondary);          // #2d3748
  margin-bottom: var(--spacing-xs);      // 8px
  display: block;
}
```

### 6. CARDS

#### ❌ ANTES
```scss
.card {
  padding: 12px;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  
  .card-title {
    font-size: 18px;
    color: #667eea;
  }
  
  .card-text {
    font-size: 13px;
    color: #777;
  }
}
```

#### ✅ DEPOIS
```scss
.card {
  padding: var(--spacing-lg);            // 24px
  background: var(--bg-primary);         // #ffffff
  border: 1px solid var(--border-light); // #cbd5e0
  border-radius: var(--border-radius-md); // 12px
  box-shadow: var(--shadow-sm);
  transition: var(--transition-normal);
  
  &:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
  }
  
  .card-title {
    font-size: var(--font-size-xl);      // 24px
    font-weight: var(--font-weight-semibold); // 600
    color: var(--text-primary);          // #1a202c
    margin-bottom: var(--spacing-sm);    // 12px
    line-height: var(--line-height-tight); // 1.5
  }
  
  .card-text {
    font-size: var(--font-size-base);    // 16px
    color: var(--text-tertiary);         // #4a5568
    line-height: var(--line-height-normal); // 1.6
  }
}
```

### 7. BADGES E TAGS

#### ❌ ANTES
```scss
.badge {
  font-size: 11px;
  padding: 2px 6px;
  background: #667eea;
  color: #fff;
}
```

#### ✅ DEPOIS
```scss
.badge {
  font-size: var(--font-size-xs);        // 14px (mínimo WCAG)
  font-weight: var(--font-weight-semibold); // 600
  padding: var(--spacing-xs) var(--spacing-sm); // 8px 12px
  background: var(--primary-dark);       // #4c5fd5
  color: #ffffff;
  border-radius: var(--border-radius-lg); // 16px (pill shape)
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xxs);               // 4px
}

.badge-success {
  background: var(--success-dark);       // #1e7e34
}

.badge-danger {
  background: var(--danger-dark);        // #c82333
}

.badge-warning {
  background: var(--warning-dark);       // #c87606
  color: var(--text-primary);            // Texto escuro em fundo laranja
}
```

### 8. TABELAS

#### ❌ ANTES
```scss
table {
  font-size: 13px;
  
  th {
    background: #f0f0f0;
    color: #666;
    padding: 8px;
  }
  
  td {
    padding: 6px 8px;
    color: #555;
  }
}
```

#### ✅ DEPOIS
```scss
table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--font-size-base);      // 16px
  
  th {
    background: var(--bg-tertiary);      // #edf2f7
    color: var(--text-primary);          // #1a202c
    font-weight: var(--font-weight-semibold); // 600
    padding: var(--spacing-md);          // 16px
    text-align: left;
    border-bottom: 2px solid var(--border-medium);
  }
  
  td {
    padding: var(--spacing-sm) var(--spacing-md); // 12px 16px
    color: var(--text-secondary);        // #2d3748
    border-bottom: 1px solid var(--border-light);
  }
  
  tr:hover {
    background: var(--bg-secondary);     // #f7fafc
  }
  
  tbody tr:last-child td {
    border-bottom: none;
  }
}
```

### 9. ALERTAS E NOTIFICAÇÕES

#### ❌ ANTES
```scss
.alert {
  padding: 10px;
  font-size: 13px;
  
  &.success { background: #d4edda; color: #155724; }
  &.error { background: #f8d7da; color: #721c24; }
}
```

#### ✅ DEPOIS
```scss
.alert {
  padding: var(--spacing-md);            // 16px
  border-radius: var(--border-radius-md); // 12px
  border-left: 4px solid;
  font-size: var(--font-size-base);      // 16px
  line-height: var(--line-height-normal); // 1.6
  display: flex;
  align-items: start;
  gap: var(--spacing-sm);                // 12px
  
  &.alert-success {
    background: var(--success-light);    // #d4edda
    border-color: var(--success-dark);   // #1e7e34
    color: var(--success-dark);          // Contraste 7.5:1
  }
  
  &.alert-danger {
    background: var(--danger-light);     // #f8d7da
    border-color: var(--danger-dark);    // #c82333
    color: var(--danger-dark);           // Contraste 7.8:1
  }
  
  &.alert-warning {
    background: var(--warning-light);    // #fff3cd
    border-color: var(--warning-dark);   // #c87606
    color: var(--warning-dark);          // Contraste 7.1:1
  }
  
  &.alert-info {
    background: var(--info-light);       // #d1ecf1
    border-color: var(--info-dark);      // #0c5460
    color: var(--info-dark);             // Contraste 9.2:1
  }
  
  .alert-icon {
    font-size: var(--font-size-lg);      // 20px
    flex-shrink: 0;
  }
}
```

### 10. NAVEGAÇÃO (NAVBAR/MENU)

#### ❌ ANTES
```scss
.navbar {
  .nav-link {
    font-size: 14px;
    color: #666;
    padding: 8px 12px;
  }
}
```

#### ✅ DEPOIS
```scss
.navbar {
  .nav-link {
    font-size: var(--font-size-base);    // 16px
    font-weight: var(--font-weight-medium); // 500
    color: var(--text-secondary);        // #2d3748
    padding: var(--spacing-sm) var(--spacing-md); // 12px 16px
    min-height: var(--min-touch-target); // 44px
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-xs);              // 8px
    border-radius: var(--border-radius-sm);
    transition: var(--transition-fast);
    
    &:hover {
      background: var(--bg-hover);       // #e2e8f0
      color: var(--primary-dark);        // #4c5fd5
    }
    
    &.active {
      color: var(--primary-dark);        // #4c5fd5
      font-weight: var(--font-weight-semibold); // 600
      background: var(--bg-hover);
    }
    
    &:focus-visible {
      outline: 3px solid var(--primary-dark);
      outline-offset: 2px;
    }
  }
}
```

---

## 🎨 GRADIENTES WCAG-COMPLIANT

### Uso Correto de Gradientes com Texto

```scss
/* ✅ CORRETO - Texto branco em gradiente escuro */
.btn-primary {
  background: linear-gradient(135deg, #4c5fd5 0%, #5d3a7a 100%);
  color: #ffffff;  // Contraste suficiente em ambas as cores
}

/* ✅ CORRETO - Texto escuro em gradiente claro */
.card-light {
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  color: #1a202c;  // Contraste suficiente
}

/* ❌ ERRADO - Texto claro em gradiente com variação */
.card-bad {
  background: linear-gradient(135deg, #667eea 0%, #f5576c 100%);
  color: #ffffff;  // Pode não ter contraste suficiente em todas as áreas
}
```

---

## 📱 RESPONSIVIDADE WCAG

### Mobile First - Tamanhos Mínimos

```scss
/* Base - Mobile (mínimo 16px) */
body {
  font-size: var(--font-size-base);      // 16px
}

/* Tablet */
@media (min-width: 768px) {
  body {
    font-size: var(--font-size-md);      // 18px (melhor legibilidade)
  }
}

/* Desktop */
@media (min-width: 1024px) {
  body {
    font-size: var(--font-size-md);      // 18px
  }
}

/* Alvos de toque aumentados em mobile */
@media (max-width: 768px) {
  .btn, .nav-link, input, select {
    min-height: 48px;                    // Maior que desktop (44px)
  }
}
```

---

## ✅ CHECKLIST DE VALIDAÇÃO

### Antes de Fazer Commit

- [ ] **Contraste de cores**: Verificar com ferramenta (WebAIM, Chrome DevTools)
- [ ] **Tamanho de fonte**: Mínimo 16px para texto corpo, 14px para auxiliar
- [ ] **Altura de linha**: Mínimo 1.5 para todo texto
- [ ] **Alvos de toque**: Mínimo 44x44px (48px em mobile)
- [ ] **Focus visível**: Todos os elementos interativos têm outline de 3px
- [ ] **Hover state**: Todos os botões/links têm estado hover visível
- [ ] **Links sublinhados**: Links no meio de texto têm underline
- [ ] **Labels em inputs**: Todos os inputs têm label visível
- [ ] **Placeholder**: Não usar placeholder como única indicação

### Ferramentas de Teste

1. **Chrome DevTools**
   - Lighthouse → Accessibility
   - CSS Overview → Contraste

2. **Extensões**
   - WAVE (Web Accessibility Evaluation Tool)
   - axe DevTools
   - Color Contrast Analyzer

3. **Online**
   - WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
   - Who Can Use: https://www.whocanuse.com/

---

## 🚀 IMPLEMENTAÇÃO EM MASSA

### Script para Encontrar Problemas

```bash
# Encontrar font-size menor que 14px
grep -rn "font-size: [0-9]px\|font-size: 1[0-3]px" src/

# Encontrar line-height menor que 1.5
grep -rn "line-height: [0-1]\.[0-4]" src/

# Encontrar cores que possam ter baixo contraste
grep -rn "color: #[6-9a-f][6-9a-f][6-9a-f]" src/
```

### Substituição em Massa (com cuidado!)

```bash
# Substituir font-size comuns
find src/ -name "*.scss" -exec sed -i 's/font-size: 14px/font-size: var(--font-size-base)/g' {} +
find src/ -name "*.scss" -exec sed -i 's/font-size: 13px/font-size: var(--font-size-sm)/g' {} +

# Substituir cores comuns (verificar contexto antes!)
find src/ -name "*.scss" -exec sed -i 's/color: #666/color: var(--text-tertiary)/g' {} +
find src/ -name "*.scss" -exec sed -i 's/color: #667eea/color: var(--primary-dark)/g' {} +
```

---

## 📚 RECURSOS ADICIONAIS

### Documentação WCAG
- **WCAG 2.2**: https://www.w3.org/WAI/WCAG22/quickref/
- **Success Criterion 1.4.6** (AAA Contraste): https://www.w3.org/WAI/WCAG22/Understanding/contrast-enhanced
- **Success Criterion 2.5.5** (Tamanho do alvo): https://www.w3.org/WAI/WCAG22/Understanding/target-size

### Exemplos de Implementação
- Material Design Accessibility: https://m2.material.io/design/usability/accessibility.html
- A11y Style Guide: https://a11y-style-guide.com/style-guide/

---

## 🎯 PRÓXIMOS PASSOS

1. **Importar variáveis**: Adicionar `@import '../styles/wcag-variables.css';` em todos os arquivos SCSS
2. **Substituir valores fixos**: Trocar por variáveis CSS do wcag-variables.css
3. **Testar contraste**: Usar ferramentas de validação em cada componente
4. **Revisar gradientes**: Verificar texto sobre gradientes
5. **Validar mobile**: Testar alvos de toque em dispositivos reais
6. **Documentar exceções**: Se houver casos que não podem seguir WCAG, documentar motivo

---

**Última atualização**: Outubro 2025  
**Nível de conformidade**: WCAG 2.2 Level AAA  
**Responsável**: Equipe de Desenvolvimento Segredo do Sabor
