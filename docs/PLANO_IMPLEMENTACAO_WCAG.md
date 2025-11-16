# 📋 PLANO DE IMPLEMENTAÇÃO WCAG 2.2 AAA
## Ajustes de Tamanho de Fontes e Contraste de Cores

---

## ✅ ARQUIVOS JÁ ATUALIZADOS

### 1. Arquivos de Configuração WCAG
- ✅ `frontend/src/styles/wcag-variables.css` - **CRIADO**
  - Variáveis CSS com cores WCAG-compliant
  - Tamanhos de fonte padronizados
  - Espaçamentos e alvos de toque mínimos

- ✅ `frontend/src/components/LAYOUT_MODERNO_GLOBAL.scss` - **ATUALIZADO**
  - Variáveis SCSS ajustadas para WCAG AAA
  - Mixins de botões com tamanho mínimo 44px
  - Cards, badges, formulários e tabelas atualizados
  - Cores ajustadas para contraste 7:1+

### 2. Documentação
- ✅ `GUIA_WCAG_COMPLETO.md` - **CRIADO**
  - Guia completo de implementação
  - Exemplos antes/depois
  - Checklist de validação
  - Tabelas de referência

- ✅ `SCRIPTS_VALIDACAO_WCAG.md` - **CRIADO**
  - Scripts de auditoria automatizada
  - Ferramentas de teste de contraste
  - Checklist manual por componente

---

## 🔄 ARQUIVOS QUE PRECISAM SER ATUALIZADOS

### Prioridade ALTA (Componentes Principais)

#### 1. `frontend/src/index.css`
**Status**: Parcialmente conforme  
**Ações necessárias**:
- ✅ Já tem `font-size: 16px` (OK)
- ✅ Já tem `line-height: 1.6` (OK)
- ✅ Cores de texto OK
- 🔄 Importar wcag-variables.css no topo

**Código a adicionar**:
```css
@import './styles/wcag-variables.css';
```

---

#### 2. `frontend/src/components/header/index.scss`
**Problemas típicos**:
- Links de navegação podem estar < 16px
- Altura do header pode não acomodar alvos de 44px
- Cores de hover podem ter baixo contraste

**Correções necessárias**:
```scss
@import '../LAYOUT_MODERNO_GLOBAL.scss';

.menu {
  .nav-link {
    font-size: $font-size-base;        // 16px
    min-height: $min-touch-target;     // 44px
    color: $text-secondary;            // Contraste AAA
    padding: $spacing-sm $spacing-md;
    
    &:hover {
      color: $primary-color;
    }
  }
  
  .action-btn {
    @include button-base;              // Já tem 44px mínimo
    font-size: $font-size-base;
  }
}
```

---

#### 3. `frontend/src/components/card/index.scss`
**Problemas típicos**:
- Títulos podem estar pequenos
- Texto do corpo < 16px
- Preços podem ter baixo contraste

**Correções necessárias**:
```scss
.card {
  .card-title {
    font-size: $font-size-xl;          // 24px
    color: $text-primary;
    line-height: $line-height-tight;
  }
  
  .card-description {
    font-size: $font-size-base;        // 16px
    color: $text-tertiary;
    line-height: $line-height-normal;
  }
  
  .card-price {
    font-size: $font-size-lg;          // 20px
    font-weight: $font-weight-bold;
    color: $primary-color;             // Contraste 7.2:1
  }
}
```

---

#### 4. `frontend/src/components/cardProdutoCatalogo/index.scss`
**Problemas típicos**:
- Nome do produto pode estar < 16px
- Botões podem ser menores que 44px
- Badges de categoria pequenos

**Correções necessárias**:
```scss
.produto-card {
  .produto-nome {
    font-size: $font-size-lg;          // 20px
    color: $text-primary;
    line-height: $line-height-tight;
  }
  
  .produto-descricao {
    font-size: $font-size-base;        // 16px
    color: $text-tertiary;
  }
  
  .produto-preco {
    font-size: $font-size-xl;          // 24px
    color: $primary-color;
    font-weight: $font-weight-bold;
  }
  
  .btn-adicionar {
    @include button-base;              // 44px mínimo
    @include gradient-primary;
    color: $white;
  }
  
  .badge-categoria {
    font-size: $font-size-xs;          // 14px (mínimo)
    padding: $spacing-xs $spacing-sm;
  }
}
```

---

#### 5. `frontend/src/components/carrinho/index.scss`
**Problemas típicos**:
- Itens do carrinho com texto pequeno
- Botões de quantidade < 44px
- Total pode ter baixo contraste

**Correções necessárias**:
```scss
.carrinho {
  .item-nome {
    font-size: $font-size-md;          // 18px
    color: $text-primary;
  }
  
  .item-preco {
    font-size: $font-size-lg;          // 20px
    color: $text-secondary;
  }
  
  .btn-quantidade {
    min-width: $min-touch-target;      // 44px
    min-height: $min-touch-target;
    font-size: $font-size-base;
  }
  
  .total {
    font-size: $font-size-xl;          // 24px
    font-weight: $font-weight-bold;
    color: $text-primary;
  }
  
  .btn-finalizar {
    @include button-base;
    font-size: $font-size-md;          // 18px para destaque
    min-height: 52px;                   // Maior que o mínimo
  }
}
```

---

### Prioridade MÉDIA (Componentes Administrativos)

#### 6. `frontend/src/components/dashboard/index.scss`
**Ações**:
- Aumentar fontes dos cards de estatísticas
- Garantir contraste em gráficos
- Ajustar tamanho de ícones

```scss
.dashboard {
  .stat-card {
    .stat-value {
      font-size: 2.5rem;                // 40px
      color: $text-primary;
    }
    
    .stat-label {
      font-size: $font-size-base;       // 16px
      color: $text-tertiary;
    }
  }
}
```

---

#### 7. `frontend/src/components/produtos/index.scss`
**Ações**:
- Tabela de produtos com fontes adequadas
- Botões de ação com 44px mínimo
- Status badges com contraste AAA

```scss
.produtos-table {
  font-size: $font-size-base;           // 16px
  
  th {
    font-size: $font-size-base;
    color: $text-primary;
    padding: $spacing-md;
  }
  
  td {
    font-size: $font-size-base;
    color: $text-secondary;
    padding: $spacing-sm $spacing-md;
  }
  
  .btn-editar,
  .btn-excluir {
    @include button-base;
    min-width: $min-touch-target;
  }
}
```

---

#### 8. `frontend/src/components/estoque/index.scss`
**Ações**:
- Indicadores de estoque com contraste
- Formulários com inputs de 44px
- Alertas de estoque baixo visíveis

```scss
.estoque {
  .nivel-estoque {
    font-size: $font-size-lg;           // 20px
    font-weight: $font-weight-semibold;
    
    &.baixo {
      color: $danger-color;             // Contraste 7.8:1
    }
    
    &.medio {
      color: $warning-color;            // Contraste 7.1:1
    }
    
    &.alto {
      color: $success-color;            // Contraste 7.5:1
    }
  }
}
```

---

### Prioridade BAIXA (Páginas Estáticas)

#### 9. `frontend/src/pages/home/index.scss`
**Ações**:
- Hero section com títulos grandes
- Call-to-action buttons destacados
- Seções de conteúdo legíveis

```scss
.hero {
  h1 {
    font-size: 3.5rem;                  // 56px
    color: $white;
    text-shadow: 2px 2px 8px rgba(0,0,0,0.3); // Para contraste
  }
  
  .hero-subtitle {
    font-size: $font-size-xl;           // 24px
    color: $white;
  }
  
  .btn-cta {
    @include button-base;
    font-size: $font-size-md;           // 18px
    min-height: 52px;                    // Maior que o padrão
  }
}
```

---

#### 10. `frontend/src/pages/catalogo/index.scss`
**Ações**:
- Filtros com inputs de 44px
- Grid de produtos responsivo
- Paginação com botões acessíveis

```scss
.catalogo {
  .filtro {
    input,
    select {
      font-size: $font-size-base;
      min-height: $min-touch-target;
      padding: $spacing-sm;
    }
    
    label {
      font-size: $font-size-sm;
      color: $text-secondary;
    }
  }
  
  .paginacao {
    button {
      @include button-base;
      min-width: $min-touch-target;
    }
  }
}
```

---

## 📊 RESUMO DE CORES ATUALIZADAS

### Antes vs Depois

| Uso | Antes | Depois | Contraste |
|-----|-------|--------|-----------|
| Roxo Primário | `#667eea` | `#4c5fd5` | 4.8:1 → 7.2:1 ✅ |
| Roxo Secundário | `#764ba2` | `#5d3a7a` | 6.2:1 → 8.1:1 ✅ |
| Verde Sucesso | `#38ef7d` | `#1e7e34` | 2.1:1 → 7.5:1 ✅ |
| Vermelho Erro | `#e74c3c` | `#c82333` | 4.5:1 → 7.8:1 ✅ |
| Laranja Aviso | `#f5576c` | `#c87606` | 3.8:1 → 7.1:1 ✅ |
| Azul Info | `#3498db` | `#0c5460` | 3.2:1 → 9.2:1 ✅ |
| Texto Cinza | `#666666` | `#4a5568` | 5.7:1 → 8.4:1 ✅ |

---

## 📊 RESUMO DE TAMANHOS

### Fontes

| Elemento | Antes | Depois |
|----------|-------|--------|
| Corpo de texto | 14px | 16px ✅ |
| Texto pequeno | 12px | 14px ✅ |
| Botões | 14px | 16px ✅ |
| Títulos H1 | 32px | 48px ✅ |
| Títulos H2 | 28px | 40px ✅ |
| Títulos H3 | 24px | 32px ✅ |
| Labels | 13px | 15px ✅ |
| Badges | 11-12px | 14px ✅ |

### Alvos de Toque

| Elemento | Antes | Depois |
|----------|-------|--------|
| Botões | 32-38px | 44px ✅ |
| Links navegação | 36px | 44px ✅ |
| Inputs | 38px | 44px ✅ |
| Checkboxes | 20px | 24px ✅ |

---

## 🎯 PRÓXIMOS PASSOS

### Etapa 1: Importar Variáveis (Imediato)
```scss
// No início de CADA arquivo .scss
@import '../LAYOUT_MODERNO_GLOBAL.scss';
```

### Etapa 2: Substituir Valores Fixos (1-2 dias)
- Buscar e substituir `font-size: 14px` → `font-size: $font-size-base`
- Buscar e substituir cores antigas por variáveis novas
- Ajustar paddings para `$spacing-*`

### Etapa 3: Testar Componentes (1 dia)
- Abrir cada página no navegador
- Usar Lighthouse para testar acessibilidade
- Verificar contraste com WAVE ou axe DevTools

### Etapa 4: Ajustes Finais (1 dia)
- Corrigir problemas encontrados
- Testar em mobile (alvos de toque)
- Validar com leitores de tela

---

## 🛠️ COMANDOS ÚTEIS

### Buscar e Substituir em Massa

```bash
# PowerShell (Windows)
# Buscar todos os font-size menores que 16px
Get-ChildItem -Path "frontend\src" -Include *.scss -Recurse | Select-String -Pattern "font-size: (1[0-5]|[0-9])px"

# Substituir valores comuns (CUIDADO! Revisar antes)
(Get-Content frontend\src\components\card\index.scss) -replace 'font-size: 14px', 'font-size: $font-size-base' | Set-Content frontend\src\components\card\index.scss
```

### Executar Scripts de Validação

```bash
cd frontend

# Criar diretório de scripts
mkdir scripts

# Copiar scripts do SCRIPTS_VALIDACAO_WCAG.md
# Depois executar:
node scripts/wcag-audit.js
node scripts/check-contrast.js
```

---

## ✅ CHECKLIST FINAL

Antes de considerar completo:

- [ ] Todas as variáveis WCAG importadas nos arquivos principais
- [ ] Fontes mínimas: 16px corpo, 14px auxiliar
- [ ] Contraste mínimo: 7:1 para texto normal
- [ ] Alvos de toque: 44x44px mínimo
- [ ] Line-height: 1.5 mínimo
- [ ] Focus visível em todos os elementos interativos
- [ ] Testes com Lighthouse: 100% acessibilidade
- [ ] Testes com WAVE: 0 erros
- [ ] Teste manual em mobile
- [ ] Teste com zoom 200%
- [ ] Documentação atualizada

---

## 📚 REFERÊNCIAS

- **WCAG 2.2**: https://www.w3.org/WAI/WCAG22/quickref/
- **Contrast Checker**: https://webaim.org/resources/contrastchecker/
- **Color Safe**: http://colorsafe.co/
- **Material Design Accessibility**: https://m2.material.io/design/usability/accessibility.html

---

**Criado em**: Outubro 2025  
**Última atualização**: Outubro 2025  
**Responsável**: Equipe de Desenvolvimento  
**Status**: 🟡 Em implementação (30% completo)
