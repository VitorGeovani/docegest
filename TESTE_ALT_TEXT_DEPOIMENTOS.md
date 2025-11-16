# 🧪 GUIA DE TESTE: Alt Text dos Depoimentos

## ✅ Teste Rápido - 5 minutos

### 1. **Inspecionar no Navegador**

```bash
# 1. Abra o site
http://localhost:3000

# 2. Role até a seção "O que nossos clientes dizem"

# 3. Clique direito em cada imagem → "Inspecionar"

# 4. Verifique o atributo alt:
```

**Resultados Esperados:**

✅ **Imagem 1:**
```html
<img 
  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face" 
  alt="Maria Silva - Cliente satisfeita sorrindo" 
  class="foto-cliente"
/>
```

✅ **Imagem 2:**
```html
<img 
  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" 
  alt="João Santos - Cliente feliz com expressão positiva" 
  class="foto-cliente"
/>
```

✅ **Imagem 3:**
```html
<img 
  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face" 
  alt="Ana Paula - Cliente satisfeita e contente" 
  class="foto-cliente"
/>
```

---

## 🎧 Teste com Leitor de Tela (Opcional)

### Windows - NVDA

1. **Baixar NVDA:**
   - https://www.nvaccess.org/download/
   - É gratuito e open source

2. **Instalar e Iniciar:**
   ```
   - Execute o instalador
   - Pressione Ctrl+Alt+N para iniciar NVDA
   ```

3. **Testar o Site:**
   ```
   - Abra http://localhost:3000
   - Pressione Tab para navegar
   - Quando chegar nas imagens dos depoimentos, NVDA lerá:
     
     🔊 "Imagem, Maria Silva - Cliente satisfeita sorrindo"
     🔊 "Imagem, João Santos - Cliente feliz com expressão positiva"
     🔊 "Imagem, Ana Paula - Cliente satisfeita e contente"
   ```

4. **Parar NVDA:**
   ```
   - Pressione Ctrl+Alt+N novamente
   ```

---

## 🤟 Teste com VLibras

1. **Acesse o Site:**
   ```
   http://localhost:3000
   ```

2. **Ative o VLibras:**
   ```
   - Clique no ícone azul no canto inferior direito
   - Ele mostra um avatar de intérprete
   ```

3. **Teste as Imagens:**
   ```
   - Passe o mouse sobre cada imagem de cliente
   - O VLibras deve interpretar os textos alternativos em Libras
   ```

---

## 🔍 Teste com DevTools (Acessibilidade)

### Chrome DevTools

1. **Abrir DevTools:**
   ```
   F12 ou Ctrl+Shift+I
   ```

2. **Ir para Accessibility:**
   ```
   - Clique na aba "Elements"
   - No painel direito, procure "Accessibility"
   - Se não aparecer, clique nos 3 pontinhos → More tools → Accessibility
   ```

3. **Inspecionar Imagens:**
   ```
   - Clique em uma das imagens dos clientes
   - No painel Accessibility, verifique:
     
     ✅ Name: "Maria Silva - Cliente satisfeita sorrindo"
     ✅ Role: img
     ✅ Description: [conteúdo do alt]
   ```

---

## 🚦 Teste com Lighthouse

### Executar Lighthouse

1. **Abrir DevTools:**
   ```
   F12
   ```

2. **Ir para Lighthouse:**
   ```
   - Clique na aba "Lighthouse"
   - Selecione apenas "Accessibility"
   - Clique em "Analyze page load"
   ```

3. **Verificar Resultados:**
   ```
   ✅ Image elements have [alt] attributes - PASSED
   ✅ [aria-*] attributes are valid and not misspelled - PASSED
   ✅ Score de Acessibilidade: 90+/100
   ```

---

## 📋 Checklist de Validação

### Visual
- [ ] Abri http://localhost:3000
- [ ] Rolei até "O que nossos clientes dizem"
- [ ] Cliquei direito em cada imagem → Inspecionar
- [ ] Verifiquei que os 3 alt texts estão corretos

### Semântico
- [ ] Alt text contém nome do cliente
- [ ] Alt text descreve expressão/emoção
- [ ] Alt text é breve (< 80 caracteres)
- [ ] Não há redundância ("foto de", "imagem de")

### Ferramentas (Opcional)
- [ ] Testei com NVDA ou VoiceOver
- [ ] Testei com VLibras
- [ ] Validei com Chrome Accessibility Panel
- [ ] Rodei Lighthouse Accessibility Audit

---

## ✅ Resultado Esperado

### Antes:
```
🔴 Alt text genérico: "Foto de Maria Silva"
🔴 Contexto limitado
🔴 WCAG 1.1.1: Parcialmente conforme
```

### Depois:
```
🟢 Alt text descritivo: "Maria Silva - Cliente satisfeita sorrindo"
🟢 Contexto completo com emoção
🟢 WCAG 1.1.1: Totalmente conforme (Nível A)
```

---

## 🎯 Se Algo Não Funcionar

### Problema 1: Não vejo as mudanças
```bash
# Solução: Limpar cache e recompilar
cd d:\Downloads\Segredo-do-Sabor\frontend
npm run build
# Depois, recarregue a página com Ctrl+F5
```

### Problema 2: NVDA não lê as imagens
```
# Verifique:
1. NVDA está iniciado (Ctrl+Alt+N)
2. Use Tab ou Setas para navegar
3. NVDA deve anunciar automaticamente
```

### Problema 3: VLibras não aparece
```
# Verifique:
1. Você está em localhost:3000 (não em localhost:3001)
2. Há um ícone azul no canto inferior direito
3. JavaScript está ativado no navegador
```

---

## 📞 Suporte

Se tiver dúvidas sobre acessibilidade:

📧 **Email:** contato@segredodosabor.com.br  
📱 **WhatsApp:** (11) 96769-6744  
🌐 **Site:** https://segredodosabor.com.br

---

**Data:** 16/11/2025  
**Tempo estimado:** 5-15 minutos  
**Dificuldade:** Fácil ⭐  
**Status:** ✅ Pronto para testar
