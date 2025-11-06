# 🔍 SCRIPTS DE VALIDAÇÃO WCAG 2.2 AAA

## Scripts para encontrar problemas de acessibilidade no código

### 1. Encontrar Tamanhos de Fonte Pequenos

```bash
# Windows (PowerShell)
Get-ChildItem -Path "frontend\src" -Include *.scss,*.css -Recurse | Select-String -Pattern "font-size:\s*([0-9]|1[0-3])px"

# Linux/Mac
grep -rn "font-size: [0-9]px\|font-size: 1[0-3]px" frontend/src/
```

**Problemas encontrados**: Fontes menores que 14px (mínimo WCAG)

---

### 2. Encontrar Altura de Linha Inadequada

```bash
# Windows (PowerShell)
Get-ChildItem -Path "frontend\src" -Include *.scss,*.css -Recurse | Select-String -Pattern "line-height:\s*[0-1]\.[0-4]"

# Linux/Mac
grep -rn "line-height: [0-1]\.[0-4]" frontend/src/
```

**Problemas encontrados**: line-height menor que 1.5 (mínimo WCAG)

---

### 3. Encontrar Cores com Potencial Baixo Contraste

```bash
# Windows (PowerShell)
Get-ChildItem -Path "frontend\src" -Include *.scss,*.css -Recurse | Select-String -Pattern "color:\s*#[6-9a-fA-F][6-9a-fA-F][6-9a-fA-F]"

# Linux/Mac
grep -rn "color: #[6-9a-f][6-9a-f][6-9a-f]" frontend/src/ -i
```

**Problemas encontrados**: Cores cinza claras que podem ter baixo contraste

---

### 4. Encontrar Botões Sem Tamanho Mínimo

```bash
# Windows (PowerShell)
Get-ChildItem -Path "frontend\src" -Include *.scss,*.js,*.jsx -Recurse | Select-String -Pattern "padding:\s*[0-5]px"

# Linux/Mac
grep -rn "padding: [0-5]px" frontend/src/
```

**Problemas encontrados**: Botões com padding muito pequeno (< 44px total)

---

### 5. Listar Todos os Arquivos SCSS para Revisão

```bash
# Windows (PowerShell)
Get-ChildItem -Path "frontend\src" -Filter *.scss -Recurse | Select-Object FullName | Sort-Object

# Linux/Mac
find frontend/src -name "*.scss" | sort
```

---

## 🎨 Teste de Contraste de Cores

### Verificar Contraste Programaticamente

Crie um arquivo `frontend/scripts/check-contrast.js`:

```javascript
/**
 * Script para verificar contraste de cores WCAG AAA (7:1)
 * Uso: node scripts/check-contrast.js
 */

// Cores do projeto
const colors = {
  // Cores primárias
  'primary-dark': '#4c5fd5',
  'primary-light': '#5a6fd8',
  'secondary-dark': '#5d3a7a',
  'secondary-light': '#6b4689',
  
  // Cores de estado
  'success-dark': '#1e7e34',
  'success-light': '#28a745',
  'danger-dark': '#c82333',
  'danger-light': '#dc3545',
  'warning-dark': '#c87606',
  'warning-light': '#fd7e14',
  'info-dark': '#0c5460',
  'info-light': '#17a2b8',
  
  // Texto
  'text-primary': '#1a202c',
  'text-secondary': '#2d3748',
  'text-tertiary': '#4a5568',
  'text-muted': '#5a6070',
  
  // Backgrounds
  'bg-white': '#ffffff',
  'bg-secondary': '#f7fafc',
  'bg-tertiary': '#edf2f7',
};

// Função para converter hex para RGB
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// Calcular luminância relativa
function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Calcular contraste
function getContrast(color1, color2) {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

// Testar todas as combinações importantes
console.log('🎨 TESTE DE CONTRASTE WCAG 2.2 AAA (Mínimo 7:1)\n');
console.log('=' .repeat(70));

// Texto em fundo branco
console.log('\n📄 TEXTO EM FUNDO BRANCO:');
['text-primary', 'text-secondary', 'text-tertiary', 'text-muted'].forEach(textColor => {
  const contrast = getContrast(colors[textColor], colors['bg-white']);
  const status = contrast >= 7 ? '✅ AAA' : contrast >= 4.5 ? '⚠️ AA' : '❌ FALHOU';
  console.log(`  ${textColor.padEnd(20)} ${colors[textColor]} → ${contrast.toFixed(2)}:1 ${status}`);
});

// Botões coloridos com texto branco
console.log('\n🔘 BOTÕES COM TEXTO BRANCO:');
['primary-dark', 'secondary-dark', 'success-dark', 'danger-dark', 'info-dark'].forEach(bgColor => {
  const contrast = getContrast(colors[bgColor], colors['bg-white']);
  const status = contrast >= 4.5 ? '✅ PASSOU' : '❌ FALHOU';
  console.log(`  ${bgColor.padEnd(20)} ${colors[bgColor]} → ${contrast.toFixed(2)}:1 ${status}`);
});

// Avisos (texto escuro em fundo claro)
console.log('\n⚠️ AVISOS (TEXTO ESCURO):');
const warningContrast = getContrast(colors['warning-dark'], colors['bg-white']);
const warningStatus = warningContrast >= 7 ? '✅ AAA' : '❌ FALHOU';
console.log(`  warning-dark         ${colors['warning-dark']} → ${warningContrast.toFixed(2)}:1 ${warningStatus}`);

// Badges
console.log('\n🏷️ BADGES (TEXTO EM FUNDO CLARO):');
const badgeTests = [
  { text: 'success-dark', bg: '#d4edda', name: 'Success' },
  { text: 'danger-dark', bg: '#f8d7da', name: 'Danger' },
  { text: 'warning-dark', bg: '#fff3cd', name: 'Warning' },
  { text: 'info-dark', bg: '#d1ecf1', name: 'Info' },
];

badgeTests.forEach(({ text, bg, name }) => {
  const contrast = getContrast(colors[text], bg);
  const status = contrast >= 7 ? '✅ AAA' : contrast >= 4.5 ? '⚠️ AA' : '❌ FALHOU';
  console.log(`  ${name.padEnd(10)} ${colors[text]} em ${bg} → ${contrast.toFixed(2)}:1 ${status}`);
});

console.log('\n' + '='.repeat(70));
console.log('\n✅ AAA = Contraste 7:1+ (Ideal para WCAG 2.2 AAA)');
console.log('⚠️ AA  = Contraste 4.5:1-6.9:1 (Mínimo WCAG AA)');
console.log('❌ FALHOU = Contraste < 4.5:1 (Não atende WCAG)\n');
```

**Uso**:
```bash
node frontend/scripts/check-contrast.js
```

---

## 📊 Relatório de Auditoria Automatizada

### Script de Auditoria Completa

Crie `frontend/scripts/wcag-audit.js`:

```javascript
const fs = require('fs');
const path = require('path');

const issues = {
  smallFonts: [],
  lowLineHeight: [],
  potentialContrastIssues: [],
  smallPadding: [],
};

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  lines.forEach((line, index) => {
    const lineNum = index + 1;
    
    // Verificar font-size < 14px
    const fontSizeMatch = line.match(/font-size:\s*(\d+)px/);
    if (fontSizeMatch && parseInt(fontSizeMatch[1]) < 14) {
      issues.smallFonts.push({
        file: filePath,
        line: lineNum,
        value: fontSizeMatch[1] + 'px',
        content: line.trim()
      });
    }
    
    // Verificar line-height < 1.5
    const lineHeightMatch = line.match(/line-height:\s*([\d.]+)/);
    if (lineHeightMatch && parseFloat(lineHeightMatch[1]) < 1.5 && parseFloat(lineHeightMatch[1]) > 0) {
      issues.lowLineHeight.push({
        file: filePath,
        line: lineNum,
        value: lineHeightMatch[1],
        content: line.trim()
      });
    }
    
    // Verificar cores potencialmente problemáticas
    const colorMatch = line.match(/color:\s*#([6-9a-fA-F]{3}|[6-9a-fA-F]{6})/);
    if (colorMatch) {
      issues.potentialContrastIssues.push({
        file: filePath,
        line: lineNum,
        value: '#' + colorMatch[1],
        content: line.trim()
      });
    }
    
    // Verificar padding muito pequeno
    const paddingMatch = line.match(/padding:\s*([0-5])px/);
    if (paddingMatch) {
      issues.smallPadding.push({
        file: filePath,
        line: lineNum,
        value: paddingMatch[1] + 'px',
        content: line.trim()
      });
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
    } else if (file.endsWith('.scss') || file.endsWith('.css')) {
      scanFile(filePath);
    }
  });
}

// Executar auditoria
console.log('🔍 Iniciando Auditoria WCAG 2.2 AAA...\n');
scanDirectory(path.join(__dirname, '..', 'src'));

// Gerar relatório
console.log('📊 RELATÓRIO DE AUDITORIA WCAG\n');
console.log('='.repeat(80));

console.log(`\n❌ FONTES MENORES QUE 14PX (${issues.smallFonts.length} encontradas):`);
issues.smallFonts.slice(0, 10).forEach(issue => {
  console.log(`  ${issue.file}:${issue.line}`);
  console.log(`    Valor: ${issue.value}`);
  console.log(`    ${issue.content}`);
  console.log('');
});
if (issues.smallFonts.length > 10) {
  console.log(`  ... e mais ${issues.smallFonts.length - 10} problemas\n`);
}

console.log(`\n❌ LINE-HEIGHT MENOR QUE 1.5 (${issues.lowLineHeight.length} encontrados):`);
issues.lowLineHeight.slice(0, 10).forEach(issue => {
  console.log(`  ${issue.file}:${issue.line}`);
  console.log(`    Valor: ${issue.value}`);
  console.log(`    ${issue.content}`);
  console.log('');
});
if (issues.lowLineHeight.length > 10) {
  console.log(`  ... e mais ${issues.lowLineHeight.length - 10} problemas\n`);
}

console.log(`\n⚠️ CORES COM POTENCIAL BAIXO CONTRASTE (${issues.potentialContrastIssues.length} encontradas):`);
issues.potentialContrastIssues.slice(0, 10).forEach(issue => {
  console.log(`  ${issue.file}:${issue.line}`);
  console.log(`    Cor: ${issue.value}`);
  console.log(`    ${issue.content}`);
  console.log('');
});
if (issues.potentialContrastIssues.length > 10) {
  console.log(`  ... e mais ${issues.potentialContrastIssues.length - 10} problemas\n`);
}

console.log(`\n⚠️ PADDING MUITO PEQUENO (${issues.smallPadding.length} encontrados):`);
issues.smallPadding.slice(0, 10).forEach(issue => {
  console.log(`  ${issue.file}:${issue.line}`);
  console.log(`    Valor: ${issue.value}`);
  console.log(`    ${issue.content}`);
  console.log('');
});
if (issues.smallPadding.length > 10) {
  console.log(`  ... e mais ${issues.smallPadding.length - 10} problemas\n`);
}

console.log('\n' + '='.repeat(80));
console.log('\n📈 RESUMO:');
console.log(`  Total de problemas encontrados: ${
  issues.smallFonts.length + 
  issues.lowLineHeight.length + 
  issues.potentialContrastIssues.length + 
  issues.smallPadding.length
}`);
console.log(`  - Fontes pequenas: ${issues.smallFonts.length}`);
console.log(`  - Line-height baixo: ${issues.lowLineHeight.length}`);
console.log(`  - Potenciais problemas de contraste: ${issues.potentialContrastIssues.length}`);
console.log(`  - Padding pequeno: ${issues.smallPadding.length}`);
console.log('');

// Salvar relatório em arquivo
const report = {
  timestamp: new Date().toISOString(),
  summary: {
    total: issues.smallFonts.length + issues.lowLineHeight.length + 
           issues.potentialContrastIssues.length + issues.smallPadding.length,
    smallFonts: issues.smallFonts.length,
    lowLineHeight: issues.lowLineHeight.length,
    potentialContrastIssues: issues.potentialContrastIssues.length,
    smallPadding: issues.smallPadding.length,
  },
  issues
};

fs.writeFileSync(
  path.join(__dirname, '..', 'wcag-audit-report.json'),
  JSON.stringify(report, null, 2)
);

console.log('💾 Relatório completo salvo em: frontend/wcag-audit-report.json\n');
```

**Uso**:
```bash
cd frontend
node scripts/wcag-audit.js
```

---

## 🎯 Checklist de Validação Manual

### Componente por Componente

- [ ] **Botões**
  - [ ] Tamanho mínimo 44x44px
  - [ ] Fonte >= 16px
  - [ ] Contraste 7:1 ou maior
  - [ ] Focus visível (3px outline)
  - [ ] Hover state visível

- [ ] **Formulários**
  - [ ] Labels visíveis (não apenas placeholder)
  - [ ] Inputs com altura >= 44px
  - [ ] Fonte >= 16px
  - [ ] Bordas visíveis (2px mínimo)
  - [ ] Focus visível
  - [ ] Mensagens de erro com contraste AAA

- [ ] **Texto**
  - [ ] Corpo >= 16px
  - [ ] Auxiliar >= 14px
  - [ ] Line-height >= 1.5
  - [ ] Contraste >= 7:1

- [ ] **Links**
  - [ ] Sublinhados ou claramente distinguíveis
  - [ ] Contraste >= 7:1
  - [ ] Focus visível
  - [ ] Hover state diferente

- [ ] **Títulos**
  - [ ] H1 >= 48px
  - [ ] H2 >= 40px
  - [ ] H3 >= 32px
  - [ ] Contraste >= 7:1
  - [ ] Hierarquia visual clara

- [ ] **Cards**
  - [ ] Título >= 24px
  - [ ] Texto >= 16px
  - [ ] Bordas visíveis
  - [ ] Hover state se interativo

- [ ] **Tabelas**
  - [ ] Headers >= 16px
  - [ ] Células >= 16px
  - [ ] Bordas visíveis
  - [ ] Hover em linhas se interativa

- [ ] **Badges/Tags**
  - [ ] Fonte >= 14px
  - [ ] Contraste >= 7:1
  - [ ] Padding adequado (8px 12px mínimo)

- [ ] **Alertas**
  - [ ] Fonte >= 16px
  - [ ] Contraste >= 7:1
  - [ ] Ícone visível
  - [ ] Bordas visíveis

- [ ] **Navegação**
  - [ ] Links >= 16px
  - [ ] Altura >= 44px
  - [ ] Contraste >= 7:1
  - [ ] Active state visível

---

## 🛠️ Ferramentas Recomendadas

### Extensões de Navegador
1. **WAVE** - https://wave.webaim.org/extension/
2. **axe DevTools** - https://www.deque.com/axe/devtools/
3. **Lighthouse** - Integrado no Chrome DevTools
4. **Color Contrast Analyzer** - https://www.tpgi.com/color-contrast-checker/

### Ferramentas Online
1. **WebAIM Contrast Checker** - https://webaim.org/resources/contrastchecker/
2. **Who Can Use** - https://www.whocanuse.com/
3. **Accessible Colors** - https://accessible-colors.com/

### Ferramentas de Terminal
```bash
# Instalar Pa11y para testes automatizados
npm install -g pa11y

# Testar uma página
pa11y http://localhost:3000

# Gerar relatório HTML
pa11y http://localhost:3000 --reporter html > relatorio.html
```

---

## 📝 Como Usar Este Guia

1. **Execute os scripts de auditoria** para encontrar problemas
2. **Priorize as correções** começando pelos mais críticos
3. **Use as ferramentas** de teste para validar
4. **Documente exceções** se houver casos especiais
5. **Teste com usuários reais** se possível

---

**Última atualização**: Outubro 2025  
**Versão**: 1.0  
**Compatibilidade**: WCAG 2.2 Level AAA
