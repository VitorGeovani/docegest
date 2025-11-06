## INSTRUÇÕES PARA DEBUG - MODAL NÃO APARECE

### Passo 1: Salve todos os arquivos e recarregue o navegador

1. Certifique-se de que o backend está rodando (`npm start` na pasta backend)
2. Certifique-se de que o frontend está rodando (`npm start` na pasta frontend)
3. **LIMPE O CACHE DO NAVEGADOR** (Ctrl + Shift + Delete)
4. **Recarregue a página** (Ctrl + F5 para hard refresh)

### Passo 2: Abra o Console do Navegador (F12)

Vá até a aba "Console"

### Passo 3: Remova o produto do carrinho

Clique no X vermelho para remover o Ferrero Rocher do carrinho

### Passo 4: Clique no produto no catálogo

Clique no CARD do produto (não no botão do carrinho)

### O que você DEVE ver no console:

```
🔍 Verificando personalizações para produto ID 21...
✅ Produto Ferrero Rocher (ID: 21) tem personalização: true
📋 10 opções disponíveis: [Array com 10 opções]
🟢 Estado temPersonalizacao mudou para: true
🛒 Clicou em adicionar: Ferrero Rocher
   - temPersonalizacao: true
   - produto.ativo: true
   - produto.quantidade: XX
🎨 Abrindo modal de personalização...
🔴 Estado mostrarPersonalizacao mudou para: true
🎨 RENDERIZANDO MODAL DE PERSONALIZAÇÃO
🎨🎨🎨 COMPONENTE PERSONALIZACAO MONTADO! {produto: {...}}
🔄 useEffect carregarOpcoes disparado
```

### Se NÃO aparecer:

**Cenário A: Não vê "tem personalização: true"**
- O produto não está associado às opções
- Execute novamente: `node associar-todos-produtos.js`

**Cenário B: Vê "tem personalização: true" mas não vê "Abrindo modal"**
- O botão de adicionar não está chamando a função correta
- Pode estar clicando no botão errado

**Cenário C: Vê "Abrindo modal" mas não vê "COMPONENTE MONTADO"**
- O componente PersonalizacaoProduto não está sendo renderizado
- Problema no condicional ou no import

**Cenário D: Vê tudo mas o modal não aparece visualmente**
- Problema de CSS (z-index, display, visibility)
- Possível conflito com outro CSS

### Teste Manual Rápido:

Cole isso no console do navegador enquanto está na página do catálogo:

```javascript
// Forçar mostrar o modal
document.querySelectorAll('.card-produto-catalogo').forEach((card, i) => {
    if (i === 0) { // Primeiro card
        const button = card.querySelector('.btn-adicionar');
        button.click();
    }
});
```

### Se ainda não funcionar:

Execute este comando no console:

```javascript
// Verificar se o componente existe
console.log('PersonalizacaoProduto existe?', window.PersonalizacaoProduto);

// Verificar quantos modais estão no DOM
console.log('Modais no DOM:', document.querySelectorAll('.personalizacao-produto').length);

// Verificar o z-index mais alto na página
const allElements = document.querySelectorAll('*');
let maxZ = 0;
allElements.forEach(el => {
    const z = parseInt(window.getComputedStyle(el).zIndex);
    if (!isNaN(z) && z > maxZ) maxZ = z;
});
console.log('Z-index máximo na página:', maxZ);
```

### Me envie:

1. Screenshot do console completo
2. Qual cenário (A, B, C ou D) está acontecendo
3. Resultado dos comandos de teste manual
