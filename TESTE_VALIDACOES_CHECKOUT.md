# 🧪 GUIA DE TESTE: Validações do Checkout

## ⚡ Teste Rápido - 5 minutos

### 📋 Pré-requisitos
- Frontend compilado ✅
- Navegador aberto: `http://localhost:3000`
- Carrinho com pelo menos 1 produto

---

## 🎯 Cenário 1: Dados Válidos (Caminho Feliz)

### Passos:
1. Adicione um produto ao carrinho
2. Clique em "Finalizar Pedido"
3. Preencha os dados **corretamente**:

```
Nome: João Silva
E-mail: joao.silva@gmail.com
Telefone: (11) 99999-8888
CPF: (deixe vazio - é opcional)
CEP: 01310-100
```

4. Aguarde o preenchimento automático do endereço
5. Complete o número: `1000`
6. Clique em "Próximo: Pagamento"

### ✅ Resultados Esperados:
```
✅ Todos os campos com borda VERDE
✅ Mensagens "✓ [Campo] válido" em verde
✅ Toast: "✅ Dados validados com sucesso!"
✅ Avança para página de pagamento
```

---

## ❌ Cenário 2: Nome Inválido

### Teste 2A: Nome Incompleto
```
Nome: João

Resultado esperado:
❌ Borda vermelha
❌ "Digite nome e sobrenome completos"
❌ Não deixa avançar
```

### Teste 2B: Nome com Números
```
Nome: João123 Silva

Resultado esperado:
❌ Borda vermelha
❌ "Nome deve conter apenas letras"
❌ Não deixa avançar
```

### Teste 2C: Nome de Teste
```
Nome: Teste Silva

Resultado esperado:
❌ Borda vermelha
❌ "Por favor, digite seu nome real"
❌ Não deixa avançar
```

---

## ❌ Cenário 3: E-mail Inválido

### Teste 3A: Formato Errado
```
E-mail: joao

Resultado esperado:
❌ Borda vermelha
❌ "E-mail inválido"
❌ Não deixa avançar
```

### Teste 3B: E-mail Falso
```
E-mail: teste@teste.com

Resultado esperado:
❌ Borda vermelha
❌ "Por favor, use um e-mail válido"
❌ Não deixa avançar
```

---

## ❌ Cenário 4: Telefone Inválido

### Teste 4A: Número Repetido
```
Telefone: (11) 11111-1111

Resultado esperado:
❌ Borda vermelha
❌ "Telefone inválido (números repetidos)"
❌ Não deixa avançar
```

### Teste 4B: DDD Inválido
```
Telefone: (01) 99999-9999

Resultado esperado:
❌ Borda vermelha
❌ "DDD inválido"
❌ Não deixa avançar
```

### Teste 4C: Celular sem 9
```
Telefone: (11) 89999-9999

Resultado esperado:
❌ Borda vermelha
❌ "Número de celular deve começar com 9"
❌ Não deixa avançar
```

---

## ❌ Cenário 5: CPF Inválido

### Teste 5A: CPF Inventado
```
CPF: 123.456.789-00

Resultado esperado:
❌ Borda vermelha
❌ "CPF inválido"
❌ Não deixa avançar
```

### Teste 5B: CPF Repetido
```
CPF: 111.111.111-11

Resultado esperado:
❌ Borda vermelha
❌ "CPF inválido"
❌ Não deixa avançar
```

**Nota:** CPF é opcional, então pode deixar vazio ✅

---

## ❌ Cenário 6: CEP Inválido

### Teste 6A: CEP Repetido
```
CEP: 00000-000

Resultado esperado:
❌ Borda vermelha
❌ "CEP inválido"
❌ Não deixa avançar
```

### Teste 6B: CEP Incompleto
```
CEP: 12345

Resultado esperado:
❌ Borda vermelha
❌ "CEP deve ter 8 dígitos"
❌ Não deixa avançar
```

---

## ❌ Cenário 7: Endereço Inválido

### Teste 7A: Endereço Curto
```
Endereço: Rua

Resultado esperado:
❌ Borda vermelha
❌ "Endereço deve ter pelo menos 5 caracteres"
❌ Não deixa avançar
```

### Teste 7B: Endereço de Teste
```
Endereço: Rua Teste 123

Resultado esperado:
❌ Borda vermelha
❌ "Por favor, digite um endereço válido"
❌ Não deixa avançar
```

---

## ✅ Cenário 8: Formatação Automática

### Teste 8A: Telefone
```
Digitar: 11999998888

Resultado esperado:
✅ Formato: (11) 99999-8888
✅ Formatação automática
```

### Teste 8B: CPF
```
Digitar: 12345678900

Resultado esperado:
✅ Formato: 123.456.789-00
✅ Formatação automática
```

### Teste 8C: CEP
```
Digitar: 01310100

Resultado esperado:
✅ Formato: 01310-100
✅ Busca automática de endereço
✅ Preenche: Rua, Bairro, Cidade, UF
```

---

## 🔍 Cenário 9: Busca Automática de CEP

### Passos:
1. Digite um CEP válido: `01310-100`
2. Aguarde 1 segundo
3. Observe os campos sendo preenchidos

### ✅ Resultados Esperados:
```
✅ Mensagem: "🔍 Buscando CEP..."
✅ Endereço preenchido: "Avenida Paulista"
✅ Bairro preenchido: "Bela Vista"
✅ Cidade preenchida: "São Paulo"
✅ UF preenchido: "SP"
✅ Toast: "Endereço preenchido automaticamente!"
```

---

## 📊 Feedback Visual

### Campo Válido:
```
┌──────────────────────────────────────┐
│ Nome Completo *                      │
│ ┌────────────────────────────────┐   │
│ │ João Silva                     │   │ ← Borda VERDE
│ └────────────────────────────────┘   │   Fundo verde claro
│ ✓ Nome válido                        │ ← Texto VERDE
└──────────────────────────────────────┘
```

### Campo Inválido:
```
┌──────────────────────────────────────┐
│ E-mail *                             │
│ ┌────────────────────────────────┐   │
│ │ joao                           │   │ ← Borda VERMELHA
│ └────────────────────────────────┘   │   Fundo vermelho claro
│ E-mail inválido                      │ ← Texto VERMELHO
└──────────────────────────────────────┘
```

---

## 🚫 Cenário 10: Bloqueio de Avanço

### Passos:
1. Preencha alguns campos corretamente
2. Deixe outros com erro
3. Clique em "Próximo: Pagamento"

### ✅ Resultado Esperado:
```
❌ NÃO avança para próxima etapa
⚠️ Toast com mensagem específica do erro
📍 Foco no primeiro campo com erro
```

---

## ✅ Checklist de Teste

Execute todos os cenários e marque:

**Dados Pessoais:**
- [ ] Nome válido → Borda verde ✅
- [ ] Nome incompleto → Erro ❌
- [ ] Nome com números → Erro ❌
- [ ] Nome de teste → Erro ❌
- [ ] E-mail válido → Borda verde ✅
- [ ] E-mail inválido → Erro ❌
- [ ] E-mail falso → Erro ❌
- [ ] Telefone válido → Borda verde + Formatação ✅
- [ ] Telefone inválido → Erro ❌
- [ ] CPF válido → Borda verde ✅
- [ ] CPF inválido → Erro ❌

**Endereço:**
- [ ] CEP válido → Busca automática ✅
- [ ] CEP inválido → Erro ❌
- [ ] Endereço válido → Borda verde ✅
- [ ] Endereço inválido → Erro ❌
- [ ] Número válido → Borda verde ✅
- [ ] Número "S/N" → Aceito ✅
- [ ] Cidade válida → Borda verde ✅
- [ ] UF válida → Borda verde ✅
- [ ] UF inválida → Erro ❌

**Fluxo:**
- [ ] Não avança com dados inválidos ❌
- [ ] Avança com todos dados válidos ✅
- [ ] Mensagens de erro são claras ✅
- [ ] Formatação automática funciona ✅

---

## 🎯 Matriz de Testes

| Campo | Entrada | Resultado Esperado | Status |
|-------|---------|-------------------|--------|
| Nome | "João" | ❌ Erro: Nome incompleto | ⬜ |
| Nome | "João Silva" | ✅ Válido | ⬜ |
| E-mail | "teste@teste.com" | ❌ Erro: E-mail falso | ⬜ |
| E-mail | "joao@gmail.com" | ✅ Válido | ⬜ |
| Telefone | "(11) 11111-1111" | ❌ Erro: Números repetidos | ⬜ |
| Telefone | "(11) 99999-8888" | ✅ Válido + Formatado | ⬜ |
| CPF | "123.456.789-00" | ❌ Erro: CPF inválido | ⬜ |
| CPF | "" | ✅ Válido (opcional) | ⬜ |
| CEP | "00000-000" | ❌ Erro: CEP inválido | ⬜ |
| CEP | "01310-100" | ✅ Válido + Busca auto | ⬜ |

---

## 🐛 Problemas Conhecidos

### Se algo não funcionar:

**Problema 1: Validação não aparece**
```
Solução:
1. Recarregue a página (Ctrl+F5)
2. Limpe o cache do navegador
3. Verifique se o build foi executado
```

**Problema 2: CEP não busca automaticamente**
```
Solução:
1. Verifique conexão com internet
2. Tente outro CEP válido
3. Confira API ViaCEP: https://viacep.com.br/
```

**Problema 3: Formatação não funciona**
```
Solução:
1. Limpe o campo completamente
2. Digite novamente
3. Aguarde 500ms para validação
```

---

## 💡 Dicas de Teste

### CEPs Válidos para Teste:
```
01310-100 → Av. Paulista, São Paulo/SP
20040-020 → Av. Rio Branco, Rio de Janeiro/RJ
30130-010 → Av. Afonso Pena, Belo Horizonte/MG
40020-000 → Praça da Sé, Salvador/BA
```

### E-mails Válidos para Teste:
```
teste@gmail.com
teste@hotmail.com
teste@outlook.com
usuario@dominio.com.br
```

### Telefones Válidos para Teste:
```
(11) 99999-8888 → São Paulo
(21) 98888-7777 → Rio de Janeiro
(11) 3333-4444 → Fixo São Paulo
```

---

## 📸 Capturas de Tela Esperadas

### Tela Inicial (Sem Validação):
```
┌─────────────────────────────────────────┐
│ 👤 Dados Pessoais                       │
│                                         │
│ Nome Completo *                         │
│ ┌─────────────────────────────────────┐ │
│ │                                     │ │ ← Borda cinza
│ └─────────────────────────────────────┘ │
│                                         │
│ E-mail *            Telefone *          │
│ ┌─────────────┐    ┌──────────────────┐│
│ │             │    │                  ││
│ └─────────────┘    └──────────────────┘│
└─────────────────────────────────────────┘
```

### Tela com Validações:
```
┌─────────────────────────────────────────┐
│ 👤 Dados Pessoais                       │
│                                         │
│ Nome Completo *                         │
│ ┌─────────────────────────────────────┐ │
│ │ João Silva                          │ │ ← Borda VERDE
│ └─────────────────────────────────────┘ │
│ ✓ Nome válido                           │ ← Mensagem VERDE
│                                         │
│ E-mail *            Telefone *          │
│ ┌─────────────┐    ┌──────────────────┐│
│ │ joao        │    │ (11) 99999-8888  ││ ← Verde
│ └─────────────┘    └──────────────────┘│
│ E-mail inválido    ✓ Telefone válido   │
│     ↑ Vermelho         ↑ Verde         │
└─────────────────────────────────────────┘
```

---

## ✅ Resultado Final

### Se Todos os Testes Passarem:

✅ **Sistema de validação funcionando perfeitamente!**

**Benefícios confirmados:**
- ✅ Bloqueia dados falsos
- ✅ Feedback visual claro
- ✅ Formatação automática
- ✅ Busca de CEP funcionando
- ✅ Mensagens de erro úteis
- ✅ Experiência profissional

**Status:** 🎉 **PRONTO PARA PRODUÇÃO!**

---

**Tempo estimado:** 5-10 minutos  
**Dificuldade:** Fácil ⭐  
**Status:** ✅ Pronto para testar
