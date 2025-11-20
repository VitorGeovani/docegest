# RELATÓRIO TÉCNICO - PARTE 5
## 2. HIPÓTESES DE SOLUÇÕES

---

## 2.1. Quadro Comparativo de Alternativas

Durante a fase de **Ideação** do Design Thinking, foram analisadas **4 alternativas** de solução para os problemas identificados na confeitaria "Segredo do Sabor". Cada alternativa foi avaliada considerando viabilidade técnica, custo, tempo de implementação e adequação às necessidades da persona.

### 🔍 Alternativas Consideradas

---

#### **Alternativa 1: Planilhas Excel Avançadas**

**Descrição:**  
Criar um conjunto de planilhas Excel/Google Sheets interligadas para gestão de produtos, estoque, vendas e custos.

**Vantagens:**
- ✅ Custo zero ou muito baixo
- ✅ Familiaridade do usuário com Excel
- ✅ Não precisa de internet constante
- ✅ Implementação rápida (1-2 semanas)

**Desvantagens:**
- ❌ Não integra com WhatsApp
- ❌ Sem catálogo online para clientes
- ❌ Risco de perda de dados (backup manual)
- ❌ Difícil manutenção de fórmulas complexas
- ❌ Não escala bem (lentidão com muitos dados)
- ❌ Sem controle de acesso (qualquer um pode editar)

**Nível de Complexidade:** ⭐⭐ (Baixo-Médio)  
**Tempo de Implementação:** 2 semanas  
**Custo Total:** R$ 0 - R$ 200  

---

#### **Alternativa 2: Sistema Pronto SaaS (Software as a Service)**

**Descrição:**  
Contratar uma solução pronta no mercado (ex: iFood Mercado, Nex, Bling, Omie) com mensalidade mensal.

**Vantagens:**
- ✅ Implementação imediata
- ✅ Suporte técnico incluído
- ✅ Atualizações automáticas
- ✅ Interface profissional
- ✅ Geralmente tem app mobile

**Desvantagens:**
- ❌ Custo mensal recorrente (R$ 50-300/mês)
- ❌ Funcionalidades genéricas (não específicas para confeitaria)
- ❌ Dependência de internet 100% do tempo
- ❌ Dados armazenados em servidor externo
- ❌ Personalização limitada ou impossível
- ❌ Muitas soluções não são acessíveis (WCAG)

**Exemplos:**
- **iFood Mercado:** R$ 89/mês + 12% por venda
- **Nex:** R$ 79/mês (básico)
- **Bling:** R$ 59/mês + R$ 299 setup

**Nível de Complexidade:** ⭐ (Baixo - apenas configuração)  
**Tempo de Implementação:** 1-2 dias  
**Custo Total:** R$ 600 - R$ 3.600/ano (recorrente)  

---

#### **Alternativa 3: Aplicativo Mobile Nativo**

**Descrição:**  
Desenvolver um aplicativo nativo (iOS e Android) para gestão e vendas, com backend próprio.

**Vantagens:**
- ✅ Performance otimizada (app nativo)
- ✅ Funcionalidades offline
- ✅ Notificações push nativas
- ✅ Experiência mobile superior
- ✅ Pode ser publicado nas lojas (App Store/Play Store)

**Desvantagens:**
- ❌ Custo de desenvolvimento muito alto
- ❌ Tempo de desenvolvimento longo (4-6 meses)
- ❌ Precisa desenvolver 2 versões (iOS + Android)
- ❌ Taxas das lojas (Apple 30%, Google 15-30%)
- ❌ Atualizações precisam aprovação das lojas
- ❌ Clientes precisam instalar app (barreira)
- ❌ Manutenção complexa

**Nível de Complexidade:** ⭐⭐⭐⭐⭐ (Muito Alto)  
**Tempo de Implementação:** 6 meses  
**Custo Total:** R$ 30.000 - R$ 80.000  

---

#### **Alternativa 4: Sistema Web Full-Stack (Escolhida) ✅**

**Descrição:**  
Desenvolver uma aplicação web completa (frontend + backend + banco de dados) responsiva, acessível e integrável.

**Componentes:**
- **Frontend:** React (SPA responsiva)
- **Backend:** Node.js + Express (API REST)
- **Banco de Dados:** MySQL
- **Integrações:** WhatsApp (Evolution API), VLibras
- **Deploy:** Self-hosted ou cloud (Azure/AWS)

**Vantagens:**
- ✅ Acesso via navegador (sem instalação)
- ✅ Funciona em qualquer dispositivo (desktop, mobile, tablet)
- ✅ Personalização total para confeitaria
- ✅ Sem custo de mensalidade (após desenvolvimento)
- ✅ Controle total dos dados
- ✅ Escalável conforme necessidade
- ✅ Pode integrar com WhatsApp, redes sociais, etc
- ✅ Acessibilidade WCAG implementável
- ✅ Atualizações e manutenções simplificadas

**Desvantagens:**
- ❌ Custo inicial de desenvolvimento médio-alto
- ❌ Tempo de desenvolvimento moderado (3-4 meses)
- ❌ Necessita hospedagem (R$ 30-100/mês)
- ❌ Precisa de internet para funcionar

**Nível de Complexidade:** ⭐⭐⭐⭐ (Alto)  
**Tempo de Implementação:** 4 meses  
**Custo Total (Desenvolvimento):** R$ 0 (projeto acadêmico)  
**Custo Total (Hospedagem):** R$ 360 - R$ 1.200/ano  

---

### 📊 Tabela Comparativa Completa

| Critério | Planilhas Excel | SaaS Pronto | App Mobile | **Web Full-Stack** ✅ |
|----------|----------------|-------------|------------|----------------------|
| **Custo Inicial** | R$ 0 | R$ 0 - R$ 299 | R$ 30.000+ | R$ 0 (acadêmico) |
| **Custo Recorrente** | R$ 0 | R$ 600-3.600/ano | R$ 0 | R$ 360-1.200/ano |
| **Tempo Implementação** | 2 semanas | 1-2 dias | 6 meses | 4 meses |
| **Complexidade** | ⭐⭐ | ⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Personalização** | Baixa | Baixa | Alta | **Alta** ✅ |
| **Catálogo Online** | ❌ | ✅ | ✅ | **✅** |
| **Integração WhatsApp** | ❌ | Limitada | ✅ | **✅** |
| **Controle de Custos** | Básico | Limitado | ✅ | **✅** |
| **Acessibilidade WCAG** | ❌ | ❌ | Difícil | **✅** |
| **Funciona Offline** | ✅ | ❌ | ✅ | ❌ |
| **Acesso Multi-dispositivo** | ✅ | ✅ | ❌ | **✅** |
| **Backup Automático** | ❌ | ✅ | ✅ | **✅** |
| **Escalabilidade** | Baixa | Média | Alta | **Alta** ✅ |
| **Controle de Dados** | ✅ | ❌ | ✅ | **✅** |
| **Manutenção** | Fácil | Zero | Difícil | **Média** |

---

## 2.2. Análise de Complexidade e Viabilidade

### 🎯 Análise por Dimensão

#### 1. Viabilidade Técnica

**Alternativa 1 (Planilhas):** ⭐⭐⭐⭐⭐ (Muito Viável)  
- Tecnologia simples e conhecida
- Não requer conhecimento de programação
- **Limitação:** Não resolve problemas de automação e integração

**Alternativa 2 (SaaS):** ⭐⭐⭐⭐⭐ (Muito Viável)  
- Plug & play, apenas configuração
- **Limitação:** Dependência de fornecedor, custo recorrente alto

**Alternativa 3 (App Mobile):** ⭐⭐ (Pouco Viável)  
- Requer equipe especializada em iOS e Android
- Custo proibitivo para pequeno negócio
- **Limitação:** Barreira de instalação para clientes

**Alternativa 4 (Web Full-Stack):** ⭐⭐⭐⭐ (Viável) ✅  
- Stack tecnológica consolidada (React + Node.js)
- Conhecimento disponível na equipe
- **Vantagem:** Equilíbrio entre funcionalidades e viabilidade

#### 2. Viabilidade Financeira

**Para João Vitor (pequeno negócio com R$ 8k-12k/mês):**

| Alternativa | Investimento Inicial | Custo Mensal | Viável? |
|-------------|---------------------|--------------|---------|
| Planilhas | R$ 0 | R$ 0 | ✅ Sim |
| SaaS | R$ 0-299 | R$ 50-300 | ⚠️ Talvez |
| App Mobile | R$ 30.000+ | R$ 0 | ❌ Não |
| **Web Full-Stack** | **R$ 0** (acadêmico) | **R$ 30-100** | **✅ Sim** |

**Análise:**
- SaaS seria viável, mas custo recorrente alto impacta margem
- App Mobile está fora da realidade financeira
- **Web Full-Stack** oferece melhor relação custo-benefício a longo prazo

#### 3. Viabilidade de Tempo

**Cenário:** Projeto acadêmico com prazo de 4-5 meses

| Alternativa | Tempo | Adequado ao Prazo? |
|-------------|-------|-------------------|
| Planilhas | 2 semanas | ✅ Sim (mas limitado) |
| SaaS | 1-2 dias | ✅ Sim (mas não é desenvolvimento) |
| App Mobile | 6+ meses | ❌ Não |
| **Web Full-Stack** | **4 meses** | **✅ Sim** ✅ |

#### 4. Complexidade de Implementação

**Nível de Dificuldade × Tempo × Resultado**

```
Planilhas:     ██░░░░░░░░ (20% complexidade) → Resultado básico
SaaS:          █░░░░░░░░░ (10% complexidade) → Sem desenvolvimento real
App Mobile:    ██████████ (100% complexidade) → Inviável
Web Full-Stack: ███████░░░ (70% complexidade) → Resultado completo ✅
```

### 💡 Justificativa da Escolha: Web Full-Stack

Após análise criteriosa de todas as alternativas, optou-se pela **Alternativa 4 (Sistema Web Full-Stack)** pelos seguintes motivos:

---

## 2.3. Justificativa da Solução Escolhida

### ✅ Por que Sistema Web Full-Stack?

#### 1. **Atende TODAS as Necessidades Identificadas**

| Necessidade | Planilhas | SaaS | App Mobile | **Web** ✅ |
|-------------|-----------|------|------------|-----------|
| Catálogo Online | ❌ | ✅ | ✅ | **✅** |
| Gestão de Produtos | ⚠️ | ✅ | ✅ | **✅** |
| Controle de Estoque | ⚠️ | ✅ | ✅ | **✅** |
| Cálculo de Custos | ⚠️ | ⚠️ | ✅ | **✅** |
| Integração WhatsApp | ❌ | ⚠️ | ✅ | **✅** |
| Bot Inteligente | ❌ | ❌ | ✅ | **✅** |
| Acessibilidade WCAG | ❌ | ❌ | ⚠️ | **✅** |
| Personalização | Baixa | Baixa | Alta | **Alta** |
| Custo-Benefício | ⚠️ | ⚠️ | ❌ | **✅** |

#### 2. **Viabilidade Técnica e Acadêmica**

**Aspectos Técnicos:**
- Stack tecnológica moderna e bem documentada
- Arquitetura MVC facilita manutenção
- API REST permite futuras integrações
- Banco de dados relacional (MySQL) adequado ao problema

**Aspectos Acadêmicos:**
- Demonstra conhecimento em múltiplas disciplinas:
  - Banco de Dados (modelagem, SQL)
  - Engenharia de Software (requisitos, arquitetura)
  - Desenvolvimento Web (React, Node.js)
  - Interface Humano-Computador (UX/UI, acessibilidade)
  - Gestão de Projetos (Design Thinking, Scrum)

#### 3. **Personalização Específica para Confeitaria**

Funcionalidades específicas implementadas:

✅ **Gestão de Receitas (BOM - Bill of Materials)**
- Cada produto tem sua receita (ingredientes + quantidades)
- Cálculo automático de custo baseado na receita
- Baixa automática de estoque ao vender

✅ **Personalização de Produtos**
- Cliente pode escolher sabores, coberturas, tamanhos
- Cálculo automático de acréscimos
- Registro de preferências

✅ **Controle de Custos Detalhado**
- Custo por ingrediente rastreado
- Margem de lucro configurável por produto
- Simulador de cenários

✅ **Assistente Virtual Contextual**
- Responde perguntas sobre produtos
- Busca pedidos por código
- Vocabulário específico de confeitaria

#### 4. **Escalabilidade e Crescimento**

**Futuro do Negócio:**
- Sistema pode crescer conforme o negócio cresce
- Novas funcionalidades podem ser adicionadas
- Possibilidade de multi-loja (franquias)
- Integração com outros sistemas (contabilidade, delivery)

#### 5. **Custo-Benefício Superior**

**Análise de 3 Anos:**

| Solução | Ano 1 | Ano 2 | Ano 3 | **Total 3 Anos** |
|---------|-------|-------|-------|-----------------|
| Planilhas | R$ 0 | R$ 0 | R$ 0 | R$ 0 (limitado) |
| SaaS | R$ 1.200 | R$ 1.320 | R$ 1.452 | R$ 3.972 |
| App Mobile | R$ 35.000 | R$ 500 | R$ 500 | R$ 36.000 |
| **Web Full-Stack** | **R$ 600** | **R$ 600** | **R$ 600** | **R$ 1.800** ✅ |

**Retorno sobre Investimento (ROI):**
- Redução de desperdício: 20% → 5% = **Economia de R$ 450/mês**
- Aumento de vendas (automação): **15% = +R$ 1.200/mês**
- ROI esperado: **Payback em 2 meses**

#### 6. **Diferenciais Competitivos Implementados**

🌟 **Acessibilidade WCAG 2.2 AAA**
- VLibras integrado (tradução LIBRAS)
- Navegação por teclado
- Leitores de tela compatíveis
- **Diferencial:** Pouquíssimos sistemas de gestão são acessíveis

🌟 **Inteligência Artificial**
- Bot WhatsApp com NLP
- Assistente Virtual contextual
- Aprendizado supervisionado
- **Diferencial:** Automação de 60% das perguntas comuns

🌟 **Zero Mensalidade**
- Custo fixo baixo (apenas hospedagem)
- Sem dependência de fornecedor
- Dados sob controle do proprietário
- **Diferencial:** Ideal para pequenos negócios

#### 7. **Adequação ao Projeto Acadêmico**

**Critérios do Projeto Integrador:**

✅ Aplica Design Thinking (Imersão, Ideação, Prototipação)  
✅ Demonstra conhecimento técnico avançado  
✅ Resolve problema real de comunidade identificada  
✅ Contempla requisitos funcionais e não funcionais  
✅ Apresenta documentação técnica completa  
✅ Inclui aspectos legais (LGPD, termos de uso)  
✅ Relaciona com ODS da ONU (ODS 8, 9, 10)  

---

### 🎯 Conclusão da Escolha

A **Alternativa 4 (Sistema Web Full-Stack)** foi escolhida por oferecer:

1. ✅ **Melhor relação custo-benefício** (R$ 1.800 em 3 anos vs R$ 3.972 SaaS)
2. ✅ **Funcionalidades completas** (100% das necessidades atendidas)
3. ✅ **Personalização total** para o nicho de confeitaria
4. ✅ **Viabilidade técnica** (stack conhecida pela equipe)
5. ✅ **Viabilidade de tempo** (4 meses, adequado ao prazo acadêmico)
6. ✅ **Diferenc iação de mercado** (acessibilidade, IA, sem mensalidade)
7. ✅ **Escalabilidade** (pode crescer com o negócio)
8. ✅ **Adequação acadêmica** (demonstra conhecimento multidisciplinar)

---

**Próxima Seção:**  
Na Seção 3, será apresentada em detalhes a **solução implementada (DoceGest)**, incluindo visão geral, funcionalidades, jornada do usuário pós-sistema, análise SWOT e relação com os ODS.
