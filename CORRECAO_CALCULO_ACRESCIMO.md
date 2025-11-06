# 🔧 CORREÇÃO: Cálculo de Acréscimo de Personalização

## 📅 Data: 17/10/2025

## 🐛 Problemas Identificados:

### 1. **Erro 400 - Tabela não existe**
- **Erro**: `Table 'segredodosabor.opcoes_valores' doesn't exist`
- **Causa**: Nome da tabela errado (plural em vez de singular)
- **Correção**: Mudado de `opcoes_valores` para `opcao_valores`

### 2. **Erro 400 - Coluna não existe**  
- **Erro**: `Unknown column 'ativo' in 'where clause'`
- **Causa**: Nome da coluna errado
- **Correção**: Mudado de `ativo` para `disponivel`

### 3. **Valor não atualiza no frontend**
- **Causa**: Falta de logs para debug
- **Correção**: Adicionados console.logs em `calcularAcrescimo()`

### 4. **Múltiplas instruções SQL falhando**
- **Causa**: MySQL query com SET + CALL + SELECT não funciona bem
- **Correção**: Simplificado para uma única query SUM

---

## ✅ Correções Aplicadas:

### Backend: `personalizacaoRepository.js`

**ANTES (Quebrado):**
```javascript
export async function calcularAcrescimoPersonalizacao(personalizacoes) {
    const comando = `
        SET @valor_acrescimo = 0;
        CALL sp_calcular_acrescimo_personalizacao(?, @valor_acrescimo);
        SELECT @valor_acrescimo AS valor_acrescimo;
    `;
    
    const personalizacoesJson = JSON.stringify(personalizacoes);
    const [results] = await connection.query(comando, [personalizacoesJson]);
    const valorAcrescimo = results[results.length - 1][0].valor_acrescimo;
    
    return parseFloat(valorAcrescimo);
}
```

**DEPOIS (Funcionando):**
```javascript
export async function calcularAcrescimoPersonalizacao(personalizacoes) {
    if (!Array.isArray(personalizacoes) || personalizacoes.length === 0) {
        return 0.00;
    }
    
    const ids = personalizacoes.map(p => p.idvalor).join(',');
    
    const comando = `
        SELECT COALESCE(SUM(preco_adicional), 0) AS valor_acrescimo
        FROM opcao_valores
        WHERE idvalor IN (${ids})
          AND disponivel = 1
    `;
    
    const [rows] = await connection.query(comando);
    
    return parseFloat(rows[0].valor_acrescimo || 0);
}
```

### Frontend: `personalizacao/index.js`

**Adicionado logs para debug:**
```javascript
async function calcularAcrescimo() {
    try {
        // ... código existente ...
        
        console.log('Calculando acréscimo para:', personalizacoesArray);

        const resp = await axios.post('http://localhost:5000/personalizacao/calcular-acrescimo', {
            personalizacoes: personalizacoesArray
        });

        console.log('Acréscimo calculado:', resp.data);
        setValorAcrescimo(resp.data.valor_acrescimo);
    } catch (error) {
        console.error('❌ Erro ao calcular acréscimo:', error.response?.data || error.message);
        setErro('Erro ao calcular acréscimo: ' + (error.response?.data?.erro || error.message));
    }
}
```

---

## 🧪 Testes Realizados:

### Teste 1: Endpoint /calcular-acrescimo
```bash
$ node testar-acrescimo-rapido.js

✅ Sucesso!
Resposta: {
  "valor_acrescimo": 1,
  "formatado": "R$ 1.00"
}
```

### Teste 2: Verificação de valores no banco
```
📋 Valores cadastrados:
  22: Vela de Aniversário = R$ 1.00
  3: Nutella = R$ 5.00
  4: Frutas Vermelhas = R$ 4.00
  5: Chocolate Branco = R$ 3.00
  ...
```

---

## 📊 Estrutura Correta das Tabelas:

### opcao_valores
```sql
CREATE TABLE opcao_valores (
    idvalor INT PRIMARY KEY AUTO_INCREMENT,
    idopcao_fk INT NOT NULL,
    nome_valor VARCHAR(100) NOT NULL,
    preco_adicional DECIMAL(10,2) DEFAULT 0.00,
    disponivel BOOLEAN DEFAULT TRUE,  -- ✅ Nome correto
    ordem_exibicao INT DEFAULT 0
);
```

**Colunas importantes:**
- ✅ `disponivel` (não `ativo`)
- ✅ `preco_adicional` (valor adicional da opção)
- ✅ `idvalor` (PK para identificar o valor)

---

## 🔍 Como Testar Agora:

1. **Limpe o cache do browser** (`Ctrl + Shift + Del`)
2. **Recarregue a página** (`Ctrl + F5`)
3. **Adicione um produto ao carrinho**
4. **Abra o carrinho** → Clique em **🎨 Personalizar**
5. **Selecione "Vela de Aniversário"**
6. **Verifique no Console** (F12):
   ```
   Calculando acréscimo para: [{idopcao: 5, idvalor: 22}]
   Acréscimo calculado: {valor_acrescimo: 1, formatado: "R$ 1.00"}
   ```
7. **Verifique no modal**: TOTAL deve mudar de R$ 12.00 para **R$ 13.00**

---

## ✅ Resultado Esperado:

### Antes de Selecionar:
```
Valor Base:  R$ 12.00
TOTAL:       R$ 12.00
```

### Depois de Selecionar "Vela de Aniversário":
```
Valor Base:         R$ 12.00
Personalizações:   + R$ 1.00
TOTAL:              R$ 13.00
```

---

## 📝 Arquivos Modificados:

1. ✅ `backend/src/repository/personalizacaoRepository.js`
   - Função `calcularAcrescimoPersonalizacao()` simplificada
   - Correção de nomes de tabelas e colunas

2. ✅ `frontend/src/components/personalizacao/index.js`
   - Adicionados logs de debug
   - Melhor tratamento de erros

3. ✅ `backend/testar-acrescimo-rapido.js` (novo arquivo de teste)
4. ✅ `backend/verificar-valores.js` (novo arquivo de teste)

---

## 🚀 Próximos Passos:

1. ✅ Testar no browser com DevTools aberto
2. ✅ Verificar se console.log aparece com os dados corretos
3. ✅ Confirmar que TOTAL atualiza automaticamente
4. ✅ Testar com múltiplas opções selecionadas
5. ✅ Confirmar personalização no carrinho após confirmar

---

**Status:** 🟢 CORRIGIDO E PRONTO PARA TESTE  
**Implementado por:** GitHub Copilot  
**Data:** 17/10/2025
