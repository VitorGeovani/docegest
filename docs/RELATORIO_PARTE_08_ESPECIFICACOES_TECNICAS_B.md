# RELATÓRIO TÉCNICO - PARTE 8
## 4.3. TECNOLOGIAS UTILIZADAS

---

## 4.3.1. Arquitetura da Solução

### 🏗️ Visão Geral

O **DoceGest** utiliza arquitetura **cliente-servidor** com comunicação via **API RESTful**. A solução foi dividida em três camadas principais:

```
┌─────────────────────────────────────────────────────────┐
│                   CAMADA DE APRESENTAÇÃO                │
│              (Frontend - React SPA)                     │
│  • Interface do Cliente (E-commerce)                    │
│  • Interface do Administrador (Dashboard)               │
│  • Responsivo e Acessível (WCAG 2.2 AAA)              │
└────────────────┬────────────────────────────────────────┘
                 │
                 │ HTTP/HTTPS (REST API)
                 │ JSON Web Tokens (JWT)
                 │
┌────────────────▼────────────────────────────────────────┐
│                   CAMADA DE APLICAÇÃO                    │
│              (Backend - Node.js + Express)               │
│  • Controllers (rotas e validações)                      │
│  • Services (lógica de negócio)                          │
│  • Repositories (acesso a dados)                         │
│  • Middlewares (auth, erro, CORS)                        │
└────────────────┬────────────────────────────────────────┘
                 │
                 │ MySQL Driver (mysql2)
                 │ SQL Queries + Procedures
                 │
┌────────────────▼────────────────────────────────────────┐
│                     CAMADA DE DADOS                      │
│                    (MySQL 8.0+)                          │
│  • 35 Tabelas normalizadas                               │
│  • 16 Views (consultas otimizadas)                       │
│  • 20 Stored Procedures (cálculos)                       │
│  • 6 Triggers (automações)                               │
└──────────────────────────────────────────────────────────┘

               INTEGRAÇÕES EXTERNAS
┌───────────────────────────────────────────────────────┐
│  • WhatsApp (Evolution API)                           │
│  • VLibras (Acessibilidade LIBRAS)                    │
│  • Chart.js (Gráficos)                                │
│  • Multer (Upload de Arquivos)                        │
└───────────────────────────────────────────────────────┘
```

### 📊 Padrões Arquiteturais Utilizados

#### 1. **MVC (Model-View-Controller)**

**Aplicação:**
- **Model:** Camada de dados (MySQL + Repositories)
- **View:** Camada de apresentação (React Components)
- **Controller:** Camada de lógica (Express Controllers)

**Benefícios:**
- Separação clara de responsabilidades
- Facilita manutenção e testes
- Reutilização de código

**Exemplo Prático:**
```
Pedido de Produto:
┌──────────┐       ┌─────────────┐       ┌──────────┐
│   View   │──────▶│ Controller  │──────▶│  Model   │
│ (React)  │◀──────│  (Express)  │◀──────│ (MySQL)  │
└──────────┘       └─────────────┘       └──────────┘
    │                      │                    │
    │ User clica "Comprar" │                    │
    │─────────────────────▶│                    │
    │                      │ Valida dados       │
    │                      │ Chama Service      │
    │                      │────────────────────▶│
    │                      │                    │ INSERT
    │                      │◀────────────────────│
    │◀─────────────────────│                    │
    │ Exibe confirmação    │                    │
```

#### 2. **Arquitetura em Camadas (Layered Architecture)**

```
┌─────────────────────────────────────────┐
│  PRESENTATION LAYER (Frontend)          │
│  - React Components                     │
│  - Pages, Context API                   │
└────────────┬────────────────────────────┘
             │
┌────────────▼────────────────────────────┐
│  API LAYER (Controllers)                │
│  - Rotas HTTP                           │
│  - Validações de entrada                │
│  - Middlewares                          │
└────────────┬────────────────────────────┘
             │
┌────────────▼────────────────────────────┐
│  BUSINESS LOGIC LAYER (Services)        │
│  - Regras de negócio                    │
│  - Cálculos complexos                   │
│  - Integrações externas                 │
└────────────┬────────────────────────────┘
             │
┌────────────▼────────────────────────────┐
│  DATA ACCESS LAYER (Repositories)       │
│  - Queries SQL                          │
│  - CRUD operations                      │
│  - Connection pooling                   │
└────────────┬────────────────────────────┘
             │
┌────────────▼────────────────────────────┐
│  DATABASE LAYER (MySQL)                 │
│  - Tabelas, Views, Procedures           │
│  - Índices, Constraints                 │
└─────────────────────────────────────────┘
```

#### 3. **RESTful API Design**

**Princípios Seguidos:**
- ✅ **Stateless:** Cada requisição independente
- ✅ **HTTP Methods:** GET (leitura), POST (criação), PUT (atualização), DELETE (exclusão)
- ✅ **URIs Descritivas:** `/api/produto`, `/api/reserva`, `/api/ingrediente`
- ✅ **Status Codes Corretos:** 200 (sucesso), 201 (criado), 400 (erro cliente), 500 (erro servidor)
- ✅ **JSON:** Formato padrão para request/response

**Exemplos de Endpoints:**
```
GET    /api/produto          → Lista todos produtos
GET    /api/produto/:id      → Busca produto específico
POST   /api/produto/inserir  → Cria novo produto
PUT    /api/produto/:id      → Atualiza produto
DELETE /api/produto/:id      → Remove produto

GET    /api/reserva          → Lista pedidos
POST   /api/reserva/inserir  → Cria novo pedido
PUT    /api/reserva/:id      → Atualiza status pedido

GET    /api/ingrediente      → Lista ingredientes
POST   /api/ingrediente      → Adiciona ingrediente
```

---

### 🛠️ Stack Tecnológica Completa

| Camada | Tecnologia | Versão | Justificativa |
|--------|-----------|---------|---------------|
| **Frontend** | React | 19.1.0 | Framework líder, componentização, virtual DOM |
| **Roteamento** | React Router DOM | 7.5.0 | Navegação SPA |
| **Estilização** | SCSS | 1.86.3 | CSS com superpoderes (variáveis, mixins) |
| **HTTP Client** | Axios | 1.8.4 | Requests HTTP simplificados |
| **Gráficos** | Chart.js + React Chart.js 2 | 4.4.1 / 5.2.0 | Gráficos interativos para BI |
| **Ícones** | React Icons | 5.0.1 | Biblioteca completa de ícones |
| **Notificações** | React Toastify | 10.0.4 | Feedback visual elegante |
| **Estado Global** | Context API | Built-in React | Gerenciamento de estado (Auth, Favoritos) |
| **Backend** | Node.js | 20.x | Runtime JavaScript server-side |
| **Framework Web** | Express | 5.1.0 | Framework minimalista e robusto |
| **Banco de Dados** | MySQL | 8.0+ | RDBMS confiável e performático |
| **Driver DB** | mysql2 | 3.14.0 | Driver MySQL para Node.js (promises) |
| **Autenticação** | JWT + Bcrypt | 9.0.2 / 6.0.0 | Tokens seguros + hash de senhas |
| **Upload Files** | Multer | 1.4.5 | Upload de imagens de produtos |
| **Relatórios PDF** | jsPDF + AutoTable | 2.5.2 / 3.8.4 | Geração de PDFs |
| **Relatórios Excel** | XLSX | 0.18.5 | Exportação para Excel |
| **Integração API** | Axios | 1.12.2 | HTTP client (Evolution API) |
| **Testes** | Jest + Supertest | 29.7.0 / 6.3.3 | Testes unitários e integração |
| **Dev Server** | Nodemon | 3.1.9 | Auto-reload em desenvolvimento |
| **CORS** | cors | 2.8.5 | Cross-Origin Resource Sharing |
| **Env Variables** | dotenv | 16.4.7 | Configurações ambiente |
| **Build Tool** | React Scripts | 5.0.1 | Webpack configurado |

---

## 4.3.2. Banco de Dados (MySQL 8.0+)

### 📊 Modelo Entidade-Relacionamento (MER)

#### Entidades Principais

**1. CLIENTE**
```sql
CREATE TABLE cliente (
    idcliente INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    telefone VARCHAR(20) NOT NULL,
    senha VARCHAR(255), -- Hash bcrypt
    cpf VARCHAR(14),
    tipo ENUM('cliente', 'admin') DEFAULT 'cliente',
    ativo TINYINT DEFAULT 1,
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
    ultimo_acesso DATETIME,
    INDEX idx_cliente_email (email),
    INDEX idx_cliente_tipo (tipo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**2. CATEGORIA**
```sql
CREATE TABLE categoria (
    idcategoria INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE,
    descricao VARCHAR(200),
    ativo TINYINT DEFAULT 1,
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_categoria_ativo (ativo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**3. PRODUTO**
```sql
CREATE TABLE produto (
    idproduto INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10,2) NOT NULL,
    quantidade INT DEFAULT 0, -- Estoque
    idcategoria INT,
    img_Produto VARCHAR(255),
    codigo_produto VARCHAR(20) UNIQUE,
    custo_producao DECIMAL(10,2) DEFAULT 0,
    margem_lucro DECIMAL(5,2) DEFAULT 40, -- Porcentagem
    tempo_preparo INT DEFAULT 30, -- Minutos
    ativo TINYINT DEFAULT 1,
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (idcategoria) REFERENCES categoria(idcategoria),
    INDEX idx_produto_categoria (idcategoria),
    INDEX idx_produto_ativo (ativo),
    INDEX idx_produto_codigo (codigo_produto)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**4. INGREDIENTE**
```sql
CREATE TABLE ingrediente (
    idingrediente INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    unidade_medida ENUM('kg', 'g', 'litro', 'ml', 'unidade') NOT NULL,
    preco_unitario DECIMAL(10,2) NOT NULL,
    quantidade_estoque DECIMAL(10,3) DEFAULT 0,
    estoque_minimo DECIMAL(10,3) DEFAULT 0,
    fornecedor VARCHAR(100),
    ativo TINYINT DEFAULT 1,
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_ingrediente_ativo (ativo),
    INDEX idx_ingrediente_estoque_baixo (quantidade_estoque, estoque_minimo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**5. RECEITA (Bill of Materials - BOM)**
```sql
CREATE TABLE receita (
    idreceita INT AUTO_INCREMENT PRIMARY KEY,
    idproduto INT NOT NULL,
    idingrediente INT NOT NULL,
    quantidade DECIMAL(10,3) NOT NULL, -- Quantidade do ingrediente
    FOREIGN KEY (idproduto) REFERENCES produto(idproduto) ON DELETE CASCADE,
    FOREIGN KEY (idingrediente) REFERENCES ingrediente(idingrediente),
    INDEX idx_receita_produto (idproduto),
    INDEX idx_receita_ingrediente (idingrediente),
    UNIQUE KEY unique_produto_ingrediente (idproduto, idingrediente)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
COMMENT='Receita de produtos - Bill of Materials';
```

**6. RESERVA (Pedidos)**
```sql
CREATE TABLE reserva (
    idreserva INT AUTO_INCREMENT PRIMARY KEY,
    idcliente_fk INT NOT NULL,
    data_entrega DATE NOT NULL,
    hora_entrega TIME NOT NULL,
    valor_total DECIMAL(10,2) NOT NULL,
    pagamento VARCHAR(50) NOT NULL, -- PIX, Dinheiro, Cartão
    qtdReserva JSON NOT NULL, -- Array de produtos
    status ENUM('Pendente', 'Confirmado', 'Em Producao', 'Pronto', 'Finalizado', 'Cancelado') DEFAULT 'Pendente',
    codigo_pedido VARCHAR(20) UNIQUE, -- PED000001
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (idcliente_fk) REFERENCES cliente(idcliente),
    INDEX idx_reserva_cliente (idcliente_fk),
    INDEX idx_reserva_status (status),
    INDEX idx_reserva_data_entrega (data_entrega),
    INDEX idx_reserva_codigo (codigo_pedido)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
COMMENT='Pedidos/reservas dos clientes';
```

**7. PRODUTO_OPCOES_PERSONALIZACAO**
```sql
CREATE TABLE produto_opcoes_personalizacao (
    idopcao INT AUTO_INCREMENT PRIMARY KEY,
    nome_opcao VARCHAR(100) NOT NULL, -- "Sabor", "Tamanho", "Cobertura"
    descricao TEXT,
    tipo_selecao ENUM('radio', 'checkbox', 'select') DEFAULT 'radio',
    obrigatorio TINYINT DEFAULT 0,
    ativo TINYINT DEFAULT 1,
    ordem_exibicao INT DEFAULT 0,
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_opcao_ativo (ativo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
COMMENT='Opções de personalização de produtos';
```

**8. OPCAO_VALORES**
```sql
CREATE TABLE opcao_valores (
    idvalor INT AUTO_INCREMENT PRIMARY KEY,
    idopcao_fk INT NOT NULL,
    nome_valor VARCHAR(100) NOT NULL, -- "Chocolate", "Nutella", "Grande"
    preco_adicional DECIMAL(10,2) DEFAULT 0,
    disponivel TINYINT DEFAULT 1,
    ordem_exibicao INT DEFAULT 0,
    FOREIGN KEY (idopcao_fk) REFERENCES produto_opcoes_personalizacao(idopcao) ON DELETE CASCADE,
    INDEX idx_valor_opcao (idopcao_fk),
    INDEX idx_valor_disponivel (disponivel)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
COMMENT='Valores das opções de personalização';
```

**9. ASSISTENTE_FAQ**
```sql
CREATE TABLE assistente_faq (
    idfaq INT AUTO_INCREMENT PRIMARY KEY,
    pergunta VARCHAR(500) NOT NULL,
    resposta TEXT NOT NULL,
    categoria ENUM('pedidos', 'produtos', 'entrega', 'pagamento', 'horario', 'contato', 'acessibilidade', 'geral') DEFAULT 'geral',
    tags JSON, -- ["palavra-chave1", "palavra-chave2"]
    visualizacoes INT DEFAULT 0,
    util INT DEFAULT 0, -- Quantos marcaram como útil
    nao_util INT DEFAULT 0,
    ativo TINYINT DEFAULT 1,
    ordem_exibicao INT DEFAULT 0,
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_faq_categoria (categoria),
    INDEX idx_faq_ativo (ativo),
    FULLTEXT KEY idx_busca (pergunta, resposta)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Base de conhecimento do assistente virtual';
```

**10. TB_MENSAGENS_WHATSAPP**
```sql
CREATE TABLE tb_mensagens_whatsapp (
    id_mensagem INT AUTO_INCREMENT PRIMARY KEY,
    numero_telefone VARCHAR(20) NOT NULL,
    conteudo_mensagem TEXT NOT NULL,
    tipo_mensagem ENUM('enviada', 'recebida') NOT NULL,
    status ENUM('pendente', 'enviado', 'entregue', 'lido', 'falhou') DEFAULT 'pendente',
    id_mensagem_whatsapp VARCHAR(255), -- ID retornado pela Evolution API
    data_hora_envio DATETIME NOT NULL,
    data_hora_leitura DATETIME,
    anexos JSON, -- URLs de imagens/arquivos
    INDEX idx_mensagem_telefone (numero_telefone),
    INDEX idx_mensagem_tipo (tipo_mensagem),
    INDEX idx_mensagem_data (data_hora_envio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
COMMENT='Histórico de mensagens WhatsApp';
```

### 📐 Diagrama ER (Principais Relacionamentos)

```
┌──────────────┐
│   CLIENTE    │
└───────┬──────┘
        │ 1
        │
        │ N
┌───────▼──────┐      ┌──────────────┐
│   RESERVA    │──N───│ PRODUTO      │
└──────────────┘      └───┬──────┬───┘
                          │ 1    │ N
                          │      │
                      ┌───▼──┐   │
                      │CATEG.│   │
                      └──────┘   │
                                 │ N
                         ┌───────▼──────┐
                         │   RECEITA    │
                         └───────┬──────┘
                                 │ N
                                 │
                             ┌───▼──────────┐
                             │ INGREDIENTE  │
                             └──────────────┘

┌─────────────────────┐
│ PRODUTO_OPCOES_     │
│ PERSONALIZACAO      │
└──────┬──────────────┘
       │ 1
       │
       │ N
┌──────▼──────────┐      ┌──────────────────────┐
│ OPCAO_VALORES   │      │ PRODUTO_OPCAO_       │
└─────────────────┘      │ ASSOCIACAO           │
                         └───┬──────────────────┘
                             │
                             │ Liga produtos a opções
                             │
                         ┌───▼─────┐
                         │ PRODUTO │
                         └─────────┘
```

### 🔍 Views (Consultas Otimizadas)

**1. vw_ingredientes_estoque_baixo**
```sql
CREATE VIEW vw_ingredientes_estoque_baixo AS
SELECT 
    idingrediente,
    nome,
    quantidade_estoque,
    estoque_minimo,
    unidade_medida,
    fornecedor,
    ROUND((quantidade_estoque / estoque_minimo) * 100, 2) AS percentual_estoque
FROM ingrediente
WHERE quantidade_estoque < estoque_minimo
AND ativo = 1
ORDER BY percentual_estoque ASC;
```

**2. vw_vendas_hoje**
```sql
CREATE VIEW vw_vendas_hoje AS
SELECT 
    COUNT(*) as total_pedidos,
    SUM(valor_total) as valor_total,
    AVG(valor_total) as ticket_medio,
    SUM(CASE WHEN pagamento = 'PIX' THEN valor_total ELSE 0 END) as total_pix,
    SUM(CASE WHEN pagamento = 'Dinheiro' THEN valor_total ELSE 0 END) as total_dinheiro,
    SUM(CASE WHEN pagamento = 'Cartão' THEN valor_total ELSE 0 END) as total_cartao
FROM reserva
WHERE DATE(data_criacao) = CURDATE()
AND status != 'Cancelado';
```

**3. vw_produtos_mais_vendidos**
```sql
CREATE VIEW vw_produtos_mais_vendidos AS
SELECT 
    p.idproduto,
    p.nome,
    p.preco,
    p.custo_producao,
    COUNT(r.idreserva) as total_vendas,
    SUM(JSON_LENGTH(r.qtdReserva)) as quantidade_total,
    SUM(r.valor_total) as receita_total,
    ROUND((p.preco - p.custo_producao) / p.preco * 100, 2) as margem_lucro_percentual
FROM produto p
JOIN reserva r ON JSON_CONTAINS(r.qtdReserva, CAST(p.idproduto AS JSON), '$[*].idproduto')
WHERE r.status != 'Cancelado'
GROUP BY p.idproduto
ORDER BY quantidade_total DESC;
```

### ⚙️ Stored Procedures (Principais)

**1. sp_calcular_custo_produto**
```sql
DELIMITER $$
CREATE PROCEDURE sp_calcular_custo_produto(IN p_idproduto INT)
BEGIN
    DECLARE v_custo_total DECIMAL(10,2);
    
    -- Calcula custo baseado na receita
    SELECT SUM(r.quantidade * i.preco_unitario)
    INTO v_custo_total
    FROM receita r
    JOIN ingrediente i ON r.idingrediente = i.idingrediente
    WHERE r.idproduto = p_idproduto;
    
    -- Atualiza custo no produto
    UPDATE produto
    SET custo_producao = COALESCE(v_custo_total, 0)
    WHERE idproduto = p_idproduto;
    
    SELECT v_custo_total AS custo_calculado;
END$$
DELIMITER ;
```

**2. sp_baixar_estoque_venda**
```sql
DELIMITER $$
CREATE PROCEDURE sp_baixar_estoque_venda(IN p_idreserva INT)
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE v_idproduto INT;
    DECLARE v_quantidade INT;
    DECLARE cur CURSOR FOR 
        SELECT idproduto, quantidade 
        FROM JSON_TABLE(
            (SELECT qtdReserva FROM reserva WHERE idreserva = p_idreserva),
            '$[*]' COLUMNS(
                idproduto INT PATH '$.idproduto',
                quantidade INT PATH '$.quantidade'
            )
        ) AS jt;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    OPEN cur;
    read_loop: LOOP
        FETCH cur INTO v_idproduto, v_quantidade;
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        -- Baixa ingredientes da receita
        UPDATE ingrediente i
        JOIN receita r ON i.idingrediente = r.idingrediente
        SET i.quantidade_estoque = i.quantidade_estoque - (r.quantidade * v_quantidade)
        WHERE r.idproduto = v_idproduto;
        
        -- Baixa estoque do produto
        UPDATE produto
        SET quantidade = quantidade - v_quantidade
        WHERE idproduto = v_idproduto;
    END LOOP;
    
    CLOSE cur;
END$$
DELIMITER ;
```

### 🔔 Triggers (Automações)

**1. trg_gerar_codigo_pedido**
```sql
DELIMITER $$
CREATE TRIGGER trg_gerar_codigo_pedido
BEFORE INSERT ON reserva
FOR EACH ROW
BEGIN
    DECLARE v_proximo_numero INT;
    
    SELECT COALESCE(MAX(CAST(SUBSTRING(codigo_pedido, 4) AS UNSIGNED)), 0) + 1
    INTO v_proximo_numero
    FROM reserva;
    
    SET NEW.codigo_pedido = CONCAT('PED', LPAD(v_proximo_numero, 6, '0'));
END$$
DELIMITER ;
```

**2. trg_atualizar_custo_receita**
```sql
DELIMITER $$
CREATE TRIGGER trg_atualizar_custo_receita
AFTER INSERT ON receita
FOR EACH ROW
BEGIN
    CALL sp_calcular_custo_produto(NEW.idproduto);
END$$
DELIMITER ;
```

### 📊 Estatísticas do Banco

| Métrica | Quantidade |
|---------|------------|
| **Tabelas** | 35 |
| **Views** | 16 |
| **Stored Procedures** | 20 |
| **Triggers** | 6 |
| **Índices** | 68 |
| **Foreign Keys** | 42 |
| **Unique Constraints** | 15 |

---

**Conclusão Parcial:** Esta seção apresentou a arquitetura completa e o banco de dados. As próximas subseções abordarão Frontend (React) e Backend (Node.js) em detalhes.
