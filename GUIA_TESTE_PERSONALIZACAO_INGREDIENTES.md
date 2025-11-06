# 🧪 Guia de Teste: Visualização de Itens de Personalização

## 📋 Pré-requisitos

Antes de iniciar os testes, certifique-se de que:

- ✅ Backend está rodando em `http://localhost:5000`
- ✅ Frontend está rodando em `http://localhost:3000`
- ✅ Banco de dados está acessível e populado
- ✅ Migração `vincular-personalizacao-ingredientes.sql` foi executada

## 🚀 Passos para Testar

### 1. Iniciar os Servidores

#### Backend
```cmd
cd d:\Downloads\Segredo-do-Sabor\backend
npm start
```

#### Frontend
```cmd
cd d:\Downloads\Segredo-do-Sabor\frontend
npm start
```

### 2. Acessar a Interface

1. Abra o navegador em `http://localhost:3000`
2. Faça login como administrador
3. No menu lateral, clique em **Gerenciamentos**
4. Clique em **📦 Ingredientes**

### 3. Verificar Aba de Ingredientes (Padrão)

**O que esperar:**
- Lista de todos os ingredientes cadastrados
- Busca funcionando
- Filtros (Todos / Estoque Baixo)
- Botões de Editar e Excluir
- Botão "➕ Novo Ingrediente" visível

**Teste:**
- [ ] Buscar por um ingrediente específico
- [ ] Filtrar por "Estoque Baixo"
- [ ] Verificar se os cards aparecem corretamente

### 4. Alternar para Aba de Personalização

**Ação:**
- Clique no botão **🎨 Itens de Personalização**

**O que esperar:**
- Aba muda de cor (azul)
- Botão "➕ Novo Ingrediente" desaparece
- Aparece mensagem "Carregando itens de personalização..."
- Após carregar, aparecem cards de personalização

### 5. Verificar Cards de Personalização

**Estrutura de cada card:**

```
┌─────────────────────────────────────────┐
│ [TIPO]              [BADGE DE ALERTA?]  │
│ Nome do Item                            │
│ Acréscimo: R$ XX,XX                     │
│                                         │
│ Ingredientes Utilizados:                │
│ • Nome do Ingrediente                   │
│   Usa: XXg | Estoque: XXXg              │
│ • Nome do Ingrediente                   │
│   Usa: XXml | Estoque: XXml             │
└─────────────────────────────────────────┘
```

**Testes:**

#### Teste 5.1: Card Normal (Estoque OK)
- [ ] Card tem fundo branco
- [ ] Borda cinza
- [ ] Tipo de personalização aparece (RECHEIO, COBERTURA, etc.)
- [ ] Nome do item está correto
- [ ] Preço está formatado (R$ X,XX)
- [ ] Lista de ingredientes está completa
- [ ] Quantidades estão formatadas corretamente

#### Teste 5.2: Card com Estoque Baixo
- [ ] Card tem fundo amarelo claro
- [ ] Borda amarela
- [ ] Badge "⚠️ X item(ns) baixo" aparece no topo
- [ ] Ingredientes com estoque baixo têm badge ⚠️
- [ ] Badge tem animação pulsante
- [ ] Cor do estoque muda para vermelho nos itens baixos

### 6. Verificar Interações

#### Hover nos Cards
- [ ] Card eleva ao passar o mouse
- [ ] Sombra aumenta
- [ ] Transição suave

#### Hover nos Ingredientes
- [ ] Item desliza para direita
- [ ] Fundo muda de cor
- [ ] Transição suave

#### Troca de Abas
- [ ] Troca é instantânea (dados já carregados)
- [ ] Aba ativa tem estilo diferente
- [ ] Conteúdo muda corretamente

### 7. Verificar Dados Específicos

#### Exemplo: Brigadeiro

**Dados esperados:**
- Tipo: RECHEIO
- Nome: Brigadeiro
- Acréscimo: R$ 8,00
- Ingredientes:
  - Leite Condensado: 50g
  - Chocolate: 100g
  - Chocolate Branco: 50g

**Validação:**
- [ ] Todos os dados estão corretos
- [ ] Estoque de cada ingrediente aparece
- [ ] Se algum estoque estiver baixo, badge aparece

### 8. Testar Cenários Especiais

#### Cenário 1: Sem Ingredientes Vinculados
**Se houver um valor de personalização sem ingredientes:**
- [ ] Card aparece normalmente
- [ ] Mensagem "Nenhum ingrediente vinculado" é exibida
- [ ] Não há erro no console

#### Cenário 2: Muitos Itens de Personalização
**Se houver 10+ itens:**
- [ ] Grid se adapta responsivamente
- [ ] Scroll funciona corretamente
- [ ] Performance é aceitável
- [ ] Não há travamentos

#### Cenário 3: Nenhum Item de Personalização
**Se o banco estiver vazio:**
- [ ] Mensagem "Nenhum item de personalização encontrado" aparece
- [ ] Não há erro no console
- [ ] Interface não quebra

### 9. Verificar Responsividade

#### Desktop (>1200px)
- [ ] Múltiplas colunas no grid
- [ ] Cards bem espaçados
- [ ] Texto legível

#### Tablet (768px - 1200px)
- [ ] 2 colunas no grid
- [ ] Cards ajustam tamanho
- [ ] Navegação funciona

#### Mobile (<768px)
- [ ] 1 coluna no grid
- [ ] Cards ocupam largura total
- [ ] Botões de aba são clicáveis
- [ ] Texto não quebra mal

### 10. Verificar Console do Navegador

**Abrir DevTools (F12) > Console**

**Não deve haver:**
- ❌ Erros em vermelho
- ❌ Warnings sobre chaves duplicadas
- ❌ Erros de API (404, 500, etc.)

**Pode haver:**
- ⚠️ Warnings de complexidade (isso é OK)
- ℹ️ Logs de desenvolvimento

### 11. Verificar Chamadas de API

**Abrir DevTools (F12) > Network**

**Ao acessar aba de personalização, deve haver:**
1. `GET /personalizacao/opcoes` - Status 200
2. `GET /personalizacao/opcoes/[id]/valores` - Status 200 (múltiplas chamadas)
3. `GET /personalizacao/valores/[id]/ingredientes` - Status 200 (múltiplas chamadas)

**Verificar:**
- [ ] Todas as requisições retornam 200
- [ ] Dados JSON estão corretos
- [ ] Tempo de resposta é aceitável (<1s por requisição)

### 12. Comparar com Dados do Banco

**Executar no MySQL:**
```sql
-- Ver todos os vínculos
SELECT 
    v.descricao AS valor,
    o.nome AS opcao,
    i.nome AS ingrediente,
    pi.quantidade_usada,
    i.unidade_medida,
    i.quantidade_estoque,
    i.estoque_minimo
FROM personalizacao_ingrediente pi
JOIN opcao_valores v ON pi.idopcao_valor = v.idopcao_valor
JOIN opcao_personalizacao o ON v.idopcao_personalizacao = o.idopcao_personalizacao
JOIN ingrediente i ON pi.idingrediente = i.idingrediente
ORDER BY o.nome, v.descricao;
```

**Validar:**
- [ ] Cada linha do banco tem um card correspondente
- [ ] Quantidades estão corretas
- [ ] Nomes estão corretos
- [ ] Alertas de estoque baixo são consistentes

## 🐛 Problemas Comuns e Soluções

### Problema 1: "Carregando..." infinito

**Causa:** Backend não está rodando ou API retorna erro

**Solução:**
1. Verificar se backend está rodando
2. Abrir console e verificar erros de rede
3. Verificar se as rotas estão corretas

### Problema 2: Cards vazios ou sem dados

**Causa:** Migração não foi executada ou não há dados

**Solução:**
1. Executar `vincular-personalizacao-ingredientes.sql`
2. Verificar se há dados: `SELECT * FROM personalizacao_ingrediente`
3. Executar script de população se necessário

### Problema 3: Estilo quebrado

**Causa:** SCSS não compilou ou há erro de sintaxe

**Solução:**
1. Reiniciar o frontend (`Ctrl+C` e `npm start`)
2. Verificar se há erros de compilação
3. Verificar `index.scss` para erros de sintaxe

### Problema 4: Badge de alerta não aparece

**Causa:** Lógica de estoque baixo não está funcionando

**Solução:**
1. Verificar se `quantidade_estoque <= estoque_minimo`
2. Verificar se os dados vêm corretos da API
3. Adicionar console.log para debug:
```javascript
console.log('Estoque:', estoque, 'Mínimo:', minimo, 'Baixo?', estoque <= minimo);
```

### Problema 5: Animação não funciona

**Causa:** CSS não carregou ou navegador não suporta

**Solução:**
1. Verificar se SCSS está compilando
2. Verificar compatibilidade do navegador
3. Usar navegador moderno (Chrome, Firefox, Edge)

## ✅ Checklist Final

### Funcionalidades
- [ ] Abas de navegação funcionam
- [ ] Cards de personalização aparecem
- [ ] Ingredientes são listados corretamente
- [ ] Alertas de estoque baixo funcionam
- [ ] Animações são suaves
- [ ] Performance é boa

### Dados
- [ ] Todos os itens do banco aparecem
- [ ] Quantidades estão corretas
- [ ] Preços estão formatados
- [ ] Status de estoque é preciso

### UI/UX
- [ ] Interface é intuitiva
- [ ] Cores são apropriadas
- [ ] Texto é legível
- [ ] Botões são clicáveis
- [ ] Responsividade funciona

### Técnico
- [ ] Sem erros no console
- [ ] APIs retornam 200
- [ ] Dados JSON válidos
- [ ] Código compilou sem erros

## 📊 Resultados Esperados

### Cenário Ideal

- ✅ 10+ cards de personalização aparecem
- ✅ Cada card mostra 2-4 ingredientes
- ✅ 2-3 cards têm alertas de estoque baixo
- ✅ Todas as informações estão corretas
- ✅ Interface é responsiva
- ✅ Performance é fluida

### Se Tudo Funcionou

🎉 **Parabéns!** A implementação está completa e funcionando corretamente.

### Se Algo Não Funcionou

📝 **Próximos Passos:**
1. Anote o problema específico
2. Verifique a seção "Problemas Comuns"
3. Consulte o console para erros
4. Verifique os dados do banco
5. Entre em contato com suporte se necessário

## 📞 Suporte

**Em caso de problemas:**
1. Verifique os logs do backend
2. Verifique o console do navegador
3. Consulte `IMPLEMENTACAO_PERSONALIZACAO_INGREDIENTES.md`
4. Revise este guia de testes

---

**Data do Teste**: _____________
**Testador**: _____________
**Resultado**: ⭕ APROVADO / ⭕ REPROVADO
**Observações**: ___________________________
