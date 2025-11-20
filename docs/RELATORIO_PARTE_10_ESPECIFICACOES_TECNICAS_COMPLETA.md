# RELATÓRIO TÉCNICO - PARTE 10
## 4.3.4. BACKEND - Controllers, Services e Middlewares

---

### 🎮 Controllers (Camada de Controle)

#### 1. **authController.js** - Autenticação

```javascript
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const clienteRepository = require('../repositories/clienteRepository');

// Registro de novo usuário
exports.registrar = async (req, res, next) => {
  try {
    const { nome, email, telefone, senha, cpf } = req.body;

    // Validar se email já existe
    const clienteExistente = await clienteRepository.buscarPorEmail(email);
    if (clienteExistente) {
      return res.status(400).json({ mensagem: 'Email já cadastrado' });
    }

    // Hash da senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // Inserir cliente
    const novoCliente = await clienteRepository.inserir({
      nome,
      email,
      telefone,
      senha: senhaHash,
      cpf,
      tipo: 'cliente'
    });

    res.status(201).json({
      mensagem: 'Cliente cadastrado com sucesso',
      cliente: {
        idcliente: novoCliente.idcliente,
        nome,
        email,
        tipo: 'cliente'
      }
    });
  } catch (error) {
    next(error);
  }
};

// Login
exports.login = async (req, res, next) => {
  try {
    const { email, senha } = req.body;

    // Buscar cliente
    const cliente = await clienteRepository.buscarPorEmail(email);
    if (!cliente) {
      return res.status(401).json({ mensagem: 'Credenciais inválidas' });
    }

    // Verificar senha
    const senhaValida = await bcrypt.compare(senha, cliente.senha);
    if (!senhaValida) {
      return res.status(401).json({ mensagem: 'Credenciais inválidas' });
    }

    // Verificar se está ativo
    if (cliente.ativo !== 1) {
      return res.status(403).json({ mensagem: 'Conta desativada' });
    }

    // Gerar JWT
    const token = jwt.sign(
      { 
        idcliente: cliente.idcliente, 
        email: cliente.email, 
        tipo: cliente.tipo 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Atualizar último acesso
    await clienteRepository.atualizarUltimoAcesso(cliente.idcliente);

    res.json({
      mensagem: 'Login realizado com sucesso',
      token,
      usuario: {
        idcliente: cliente.idcliente,
        nome: cliente.nome,
        email: cliente.email,
        tipo: cliente.tipo
      }
    });
  } catch (error) {
    next(error);
  }
};

// Verificar token
exports.verificarToken = async (req, res) => {
  // req.usuario já foi populado pelo middleware de autenticação
  res.json({
    valido: true,
    usuario: req.usuario
  });
};
```

#### 2. **produtoController.js** - Gestão de Produtos

```javascript
const produtoRepository = require('../repositories/produtoRepository');
const custoService = require('../services/custoService');
const fs = require('fs').promises;
const path = require('path');

// Listar todos produtos
exports.listar = async (req, res, next) => {
  try {
    const { idcategoria, ativo } = req.query;
    
    let produtos;
    if (idcategoria) {
      produtos = await produtoRepository.listarPorCategoria(idcategoria);
    } else if (ativo !== undefined) {
      produtos = await produtoRepository.listarPorStatus(ativo);
    } else {
      produtos = await produtoRepository.listarTodos();
    }

    res.json(produtos);
  } catch (error) {
    next(error);
  }
};

// Buscar produto por ID
exports.buscarPorId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const produto = await produtoRepository.buscarPorId(id);

    if (!produto) {
      return res.status(404).json({ mensagem: 'Produto não encontrado' });
    }

    // Buscar receita do produto (ingredientes)
    const receita = await produtoRepository.buscarReceitaProduto(id);
    produto.receita = receita;

    res.json(produto);
  } catch (error) {
    next(error);
  }
};

// Inserir novo produto
exports.inserir = async (req, res, next) => {
  try {
    const {
      nome,
      descricao,
      preco,
      quantidade,
      idcategoria,
      tempo_preparo,
      margem_lucro
    } = req.body;

    // Pegar nome da imagem (se enviada via Multer)
    const img_Produto = req.file ? req.file.filename : null;

    // Gerar código único
    const codigo_produto = await produtoRepository.gerarCodigoUnico();

    const novoProduto = await produtoRepository.inserir({
      nome,
      descricao,
      preco,
      quantidade: quantidade || 0,
      idcategoria,
      img_Produto,
      codigo_produto,
      tempo_preparo: tempo_preparo || 30,
      margem_lucro: margem_lucro || 40,
      ativo: 1
    });

    res.status(201).json({
      mensagem: 'Produto cadastrado com sucesso',
      produto: novoProduto
    });
  } catch (error) {
    // Se houver erro, deletar imagem enviada
    if (req.file) {
      await fs.unlink(req.file.path).catch(err => console.error(err));
    }
    next(error);
  }
};

// Atualizar produto
exports.atualizar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const dadosAtualizacao = req.body;

    // Verificar se produto existe
    const produtoExistente = await produtoRepository.buscarPorId(id);
    if (!produtoExistente) {
      return res.status(404).json({ mensagem: 'Produto não encontrado' });
    }

    // Se enviou nova imagem, deletar a antiga
    if (req.file) {
      if (produtoExistente.img_Produto) {
        const caminhoImagemAntiga = path.join(__dirname, '../uploads', produtoExistente.img_Produto);
        await fs.unlink(caminhoImagemAntiga).catch(err => console.error(err));
      }
      dadosAtualizacao.img_Produto = req.file.filename;
    }

    await produtoRepository.atualizar(id, dadosAtualizacao);

    // Recalcular custo se a receita foi alterada
    if (dadosAtualizacao.receita_alterada) {
      await custoService.calcularCustoProduto(id);
    }

    res.json({ mensagem: 'Produto atualizado com sucesso' });
  } catch (error) {
    next(error);
  }
};

// Deletar produto
exports.deletar = async (req, res, next) => {
  try {
    const { id } = req.params;

    const produto = await produtoRepository.buscarPorId(id);
    if (!produto) {
      return res.status(404).json({ mensagem: 'Produto não encontrado' });
    }

    // Soft delete (desativar)
    await produtoRepository.atualizar(id, { ativo: 0 });

    res.json({ mensagem: 'Produto desativado com sucesso' });
  } catch (error) {
    next(error);
  }
};
```

#### 3. **reservaController.js** - Gestão de Pedidos

```javascript
const reservaRepository = require('../repositories/reservaRepository');
const estoqueService = require('../services/estoqueService');
const whatsappService = require('../services/whatsappService');

// Inserir nova reserva/pedido
exports.inserir = async (req, res, next) => {
  try {
    const {
      idcliente_fk,
      data_entrega,
      hora_entrega,
      valor_total,
      pagamento,
      qtdReserva // Array de produtos: [{idproduto, nome, quantidade, preco}]
    } = req.body;

    // Validar estoque antes de confirmar
    const estoqueDisponivel = await estoqueService.verificarDisponibilidade(qtdReserva);
    if (!estoqueDisponivel.disponivel) {
      return res.status(400).json({
        mensagem: 'Estoque insuficiente',
        produtos_indisponiveis: estoqueDisponivel.produtos_indisponiveis
      });
    }

    // Criar pedido
    const novaReserva = await reservaRepository.inserir({
      idcliente_fk,
      data_entrega,
      hora_entrega,
      valor_total,
      pagamento,
      qtdReserva: JSON.stringify(qtdReserva),
      status: 'Pendente'
    });

    // Baixar estoque
    await estoqueService.baixarEstoque(novaReserva.idreserva, qtdReserva);

    // Enviar confirmação via WhatsApp
    const cliente = await reservaRepository.buscarCliente(idcliente_fk);
    if (cliente.telefone) {
      await whatsappService.enviarConfirmacaoPedido(
        cliente.telefone,
        novaReserva.codigo_pedido,
        valor_total,
        data_entrega
      );
    }

    res.status(201).json({
      mensagem: 'Pedido realizado com sucesso',
      pedido: {
        idreserva: novaReserva.idreserva,
        codigo_pedido: novaReserva.codigo_pedido,
        status: 'Pendente'
      }
    });
  } catch (error) {
    next(error);
  }
};

// Atualizar status do pedido
exports.atualizarStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const statusValidos = ['Pendente', 'Confirmado', 'Em Producao', 'Pronto', 'Finalizado', 'Cancelado'];
    if (!statusValidos.includes(status)) {
      return res.status(400).json({ mensagem: 'Status inválido' });
    }

    await reservaRepository.atualizarStatus(id, status);

    // Notificar cliente via WhatsApp
    const pedido = await reservaRepository.buscarPorId(id);
    const cliente = await reservaRepository.buscarCliente(pedido.idcliente_fk);
    
    if (cliente.telefone) {
      await whatsappService.enviarAtualizacaoStatus(
        cliente.telefone,
        pedido.codigo_pedido,
        status
      );
    }

    res.json({ mensagem: 'Status atualizado com sucesso' });
  } catch (error) {
    next(error);
  }
};

// Listar pedidos do cliente
exports.listarPorCliente = async (req, res, next) => {
  try {
    const { idcliente } = req.params;
    const pedidos = await reservaRepository.listarPorCliente(idcliente);

    res.json(pedidos);
  } catch (error) {
    next(error);
  }
};
```

### 🛡️ Middlewares

#### 1. **auth.js** - Validação JWT

```javascript
const jwt = require('jsonwebtoken');

// Middleware de autenticação
exports.verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ mensagem: 'Token não fornecido' });
  }

  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer') {
    return res.status(401).json({ mensagem: 'Token mal formatado' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ mensagem: 'Token inválido ou expirado' });
    }

    // Adiciona dados do usuário na requisição
    req.usuario = decoded;
    next();
  });
};

// Middleware de autorização (verificar tipo de usuário)
exports.verificarAdmin = (req, res, next) => {
  if (req.usuario.tipo !== 'admin') {
    return res.status(403).json({ mensagem: 'Acesso negado: apenas administradores' });
  }
  next();
};
```

#### 2. **errorHandler.js** - Tratamento Global de Erros

```javascript
const logger = require('../utils/logger');

module.exports = (err, req, res, next) => {
  // Log do erro
  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    timestamp: new Date().toISOString()
  });

  // Erro de validação do MySQL
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(400).json({
      mensagem: 'Registro duplicado',
      erro: 'Esse valor já existe no sistema'
    });
  }

  // Erro de foreign key
  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(400).json({
      mensagem: 'Referência inválida',
      erro: 'O registro referenciado não existe'
    });
  }

  // Erro de conexão com banco
  if (err.code === 'ECONNREFUSED') {
    return res.status(503).json({
      mensagem: 'Serviço indisponível',
      erro: 'Não foi possível conectar ao banco de dados'
    });
  }

  // Erro padrão
  const statusCode = err.statusCode || 500;
  const mensagem = err.message || 'Erro interno do servidor';

  res.status(statusCode).json({
    mensagem,
    erro: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};
```

#### 3. **upload.js** - Upload de Imagens (Multer)

```javascript
const multer = require('multer');
const path = require('path');

// Configuração do armazenamento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `produto-${uniqueSuffix}${ext}`);
  }
});

// Filtro de tipos de arquivo
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Apenas imagens são permitidas (JPEG, PNG, WEBP)'));
  }
};

// Configuração do upload
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter
});

module.exports = upload;
```

### 🔧 Services (Lógica de Negócio)

#### 1. **custoService.js** - Cálculo de Custos

```javascript
const connection = require('../config/database');

// Calcular custo de produção de um produto baseado na receita
exports.calcularCustoProduto = async (idproduto) => {
  try {
    const [rows] = await connection.execute(
      'CALL sp_calcular_custo_produto(?)',
      [idproduto]
    );

    return rows[0][0].custo_calculado;
  } catch (error) {
    throw new Error(`Erro ao calcular custo: ${error.message}`);
  }
};

// Calcular margem de lucro
exports.calcularMargemLucro = (preco, custo) => {
  if (preco <= 0) return 0;
  return ((preco - custo) / preco) * 100;
};

// Sugerir preço de venda baseado na margem desejada
exports.sugerirPrecoVenda = (custo, margemDesejada) => {
  if (margemDesejada >= 100) {
    throw new Error('Margem de lucro deve ser menor que 100%');
  }
  return custo / (1 - margemDesejada / 100);
};
```

#### 2. **estoqueService.js** - Gestão de Estoque

```javascript
const connection = require('../config/database');

// Verificar disponibilidade de estoque para um pedido
exports.verificarDisponibilidade = async (qtdReserva) => {
  try {
    const produtosIndisponiveis = [];

    for (const item of qtdReserva) {
      const [rows] = await connection.execute(
        'SELECT quantidade FROM produto WHERE idproduto = ?',
        [item.idproduto]
      );

      if (rows.length === 0 || rows[0].quantidade < item.quantidade) {
        produtosIndisponiveis.push({
          idproduto: item.idproduto,
          nome: item.nome,
          quantidadeDisponivel: rows[0]?.quantidade || 0,
          quantidadeSolicitada: item.quantidade
        });
      }
    }

    return {
      disponivel: produtosIndisponiveis.length === 0,
      produtos_indisponiveis: produtosIndisponiveis
    };
  } catch (error) {
    throw new Error(`Erro ao verificar estoque: ${error.message}`);
  }
};

// Baixar estoque após venda confirmada
exports.baixarEstoque = async (idreserva, qtdReserva) => {
  const conn = await connection.getConnection();
  try {
    await conn.beginTransaction();

    // Chamar procedure que baixa estoque de ingredientes e produtos
    await conn.execute('CALL sp_baixar_estoque_venda(?)', [idreserva]);

    await conn.commit();
  } catch (error) {
    await conn.rollback();
    throw new Error(`Erro ao baixar estoque: ${error.message}`);
  } finally {
    conn.release();
  }
};

// Listar ingredientes com estoque baixo
exports.listarEstoqueBaixo = async () => {
  try {
    const [rows] = await connection.execute(
      'SELECT * FROM vw_ingredientes_estoque_baixo'
    );
    return rows;
  } catch (error) {
    throw new Error(`Erro ao listar estoque baixo: ${error.message}`);
  }
};
```

---

## 4.3.5. INTEGRAÇÕES EXTERNAS

### 📱 WhatsApp Bot (Evolution API)

#### **whatsappService.js**

```javascript
const axios = require('axios');

const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL;
const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY;
const INSTANCE_NAME = process.env.WHATSAPP_INSTANCE_NAME;

// Cliente Axios configurado
const whatsappClient = axios.create({
  baseURL: `${EVOLUTION_API_URL}/message`,
  headers: {
    'apikey': EVOLUTION_API_KEY
  }
});

// Enviar confirmação de pedido
exports.enviarConfirmacaoPedido = async (telefone, codigoPedido, valorTotal, dataEntrega) => {
  try {
    const mensagem = `
🎂 *Pedido Confirmado - Segredo do Sabor*

📋 Código: *${codigoPedido}*
💰 Valor: R$ ${valorTotal.toFixed(2)}
📅 Entrega: ${dataEntrega}

✅ Seu pedido foi confirmado com sucesso!
Em breve entraremos em contato.

Obrigado pela preferência! 🍰
    `;

    await whatsappClient.post('/sendText', {
      instance: INSTANCE_NAME,
      number: telefone,
      text: mensagem
    });

    console.log(`✅ WhatsApp enviado para ${telefone}`);
  } catch (error) {
    console.error('Erro ao enviar WhatsApp:', error.message);
  }
};

// Enviar atualização de status
exports.enviarAtualizacaoStatus = async (telefone, codigoPedido, novoStatus) => {
  try {
    const mensagens = {
      'Confirmado': '✅ Seu pedido foi *confirmado* e já está em nossa fila de produção!',
      'Em Producao': '👨‍🍳 Seu pedido está sendo *preparado* com todo carinho!',
      'Pronto': '🎉 Seu pedido está *pronto* para retirada/entrega!',
      'Finalizado': '✨ Pedido *finalizado*! Esperamos que tenha amado! 🥰',
      'Cancelado': '❌ Seu pedido foi *cancelado*. Entre em contato conosco para mais informações.'
    };

    const mensagem = `
🎂 *Segredo do Sabor*

📋 Pedido: ${codigoPedido}
${mensagens[novoStatus]}
    `;

    await whatsappClient.post('/sendText', {
      instance: INSTANCE_NAME,
      number: telefone,
      text: mensagem
    });
  } catch (error) {
    console.error('Erro ao enviar atualização:', error.message);
  }
};

// Bot de atendimento automático
exports.processarMensagemCliente = async (telefone, mensagemRecebida) => {
  try {
    let resposta = '';

    // Lógica simples de NLP (palavras-chave)
    const msg = mensagemRecebida.toLowerCase();

    if (msg.includes('cardápio') || msg.includes('produtos')) {
      resposta = `
📚 *Nosso Cardápio*

Acesse nosso catálogo completo em:
🌐 https://segredodosabor.com.br/catalogo

Temos bolos, tortas, docinhos e muito mais! 🍰
      `;
    } else if (msg.includes('horário') || msg.includes('funcionamento')) {
      resposta = `
🕐 *Horário de Funcionamento*

Segunda a Sexta: 08h às 18h
Sábado: 08h às 14h
Domingo: Fechado
      `;
    } else if (msg.includes('entrega') || msg.includes('frete')) {
      resposta = `
🚚 *Entregas*

Fazemos entregas na região central.
Taxa calculada no checkout.

Você também pode retirar na loja! 🏪
      `;
    } else if (msg.includes('pedido') && /\d{6}/.test(msg)) {
      // Extrai código do pedido (6 dígitos)
      const codigo = msg.match(/\d{6}/)[0];
      resposta = `
📋 Consultando pedido *${codigo}*...

Para mais detalhes, acesse:
🌐 https://segredodosabor.com.br/meus-pedidos
      `;
    } else {
      resposta = `
👋 Olá! Sou o assistente virtual do *Segredo do Sabor*!

Como posso ajudar?
📚 Cardápio
🕐 Horários
🚚 Entregas
📋 Consultar pedido

Ou fale com um atendente: (11) 99999-9999
      `;
    }

    await whatsappClient.post('/sendText', {
      instance: INSTANCE_NAME,
      number: telefone,
      text: resposta
    });
  } catch (error) {
    console.error('Erro ao processar mensagem:', error.message);
  }
};
```

### 🤖 Assistente Virtual (FAQ Inteligente)

#### **assistenteService.js**

```javascript
const connection = require('../config/database');

// Buscar resposta por NLP (busca de palavras-chave)
exports.buscarResposta = async (perguntaUsuario) => {
  try {
    // Busca FULLTEXT (MySQL)
    const [rows] = await connection.execute(`
      SELECT 
        idfaq,
        pergunta,
        resposta,
        categoria,
        visualizacoes
      FROM assistente_faq
      WHERE MATCH(pergunta, resposta) AGAINST(? IN NATURAL LANGUAGE MODE)
      AND ativo = 1
      ORDER BY visualizacoes DESC
      LIMIT 3
    `, [perguntaUsuario]);

    if (rows.length > 0) {
      // Incrementar visualizações
      await connection.execute(
        'UPDATE assistente_faq SET visualizacoes = visualizacoes + 1 WHERE idfaq = ?',
        [rows[0].idfaq]
      );

      return {
        encontrado: true,
        respostas: rows
      };
    }

    return {
      encontrado: false,
      mensagem: 'Desculpe, não encontrei uma resposta para sua pergunta. Tente reformular ou entre em contato conosco!'
    };
  } catch (error) {
    throw new Error(`Erro ao buscar resposta: ${error.message}`);
  }
};

// Listar perguntas frequentes por categoria
exports.listarPorCategoria = async (categoria) => {
  try {
    const [rows] = await connection.execute(`
      SELECT idfaq, pergunta, resposta, categoria
      FROM assistente_faq
      WHERE categoria = ? AND ativo = 1
      ORDER BY ordem_exibicao ASC, visualizacoes DESC
    `, [categoria]);

    return rows;
  } catch (error) {
    throw new Error(`Erro ao listar FAQ: ${error.message}`);
  }
};

// Feedback do usuário (útil/não útil)
exports.registrarFeedback = async (idfaq, util) => {
  try {
    const campo = util ? 'util' : 'nao_util';
    await connection.execute(
      `UPDATE assistente_faq SET ${campo} = ${campo} + 1 WHERE idfaq = ?`,
      [idfaq]
    );
  } catch (error) {
    throw new Error(`Erro ao registrar feedback: ${error.message}`);
  }
};
```

### 🎨 VLibras (Acessibilidade - LIBRAS)

**Integração no Frontend (index.html)**

```html
<!-- VLibras Widget -->
<div vw class="enabled">
  <div vw-access-button class="active"></div>
  <div vw-plugin-wrapper>
    <div class="vw-plugin-top-wrapper"></div>
  </div>
</div>

<script src="https://vlibras.gov.br/app/vlibras-plugin.js"></script>
<script>
  new window.VLibras.Widget('https://vlibras.gov.br/app');
</script>
```

---

### 📦 Dependências Backend

**package.json**

```json
{
  "name": "segredo-do-sabor-backend",
  "version": "5.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^5.1.0",
    "mysql2": "^3.14.0",
    "bcrypt": "^6.0.0",
    "jsonwebtoken": "^9.0.2",
    "cors": "^2.8.5",
    "dotenv": "^16.4.7",
    "multer": "^1.4.5",
    "axios": "^1.12.2",
    "jspdf": "^2.5.2",
    "jspdf-autotable": "^3.8.4",
    "xlsx": "^0.18.5"
  },
  "devDependencies": {
    "nodemon": "^3.1.9",
    "jest": "^29.7.0",
    "supertest": "^6.3.3"
  }
}
```

### 🔒 Variáveis de Ambiente (.env)

```env
# Servidor
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000

# Banco de Dados
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=segredodosabor
DB_PORT=3306

# JWT
JWT_SECRET=sua_chave_secreta_super_segura_aqui
JWT_EXPIRES_IN=7d

# WhatsApp - Evolution API
EVOLUTION_API_URL=https://api.evolution.com.br
EVOLUTION_API_KEY=sua_chave_api
WHATSAPP_INSTANCE_NAME=segredo_do_sabor

# Upload
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./uploads
```

---

## 📊 Resumo das Tecnologias

| Categoria | Tecnologias |
|-----------|-------------|
| **Frontend Core** | React 19.1.0, React Router DOM 7.5.0 |
| **Estilização** | SCSS 1.86.3, CSS Modules |
| **Estado** | Context API (AuthContext, CarrinhoContext) |
| **HTTP Client** | Axios 1.8.4 |
| **Gráficos** | Chart.js 4.4.1, React Chart.js 2 5.2.0 |
| **Feedback** | React Toastify 10.0.4 |
| **Ícones** | React Icons 5.0.1 |
| **Backend Core** | Node.js 20.x, Express 5.1.0 |
| **Banco de Dados** | MySQL 8.0+, mysql2 3.14.0 |
| **Autenticação** | JWT 9.0.2, Bcrypt 6.0.0 |
| **Upload Files** | Multer 1.4.5 |
| **Relatórios** | jsPDF 2.5.2, jsPDF AutoTable 3.8.4, XLSX 0.18.5 |
| **Integrações** | Axios 1.12.2 (Evolution API WhatsApp) |
| **Acessibilidade** | VLibras (Widget oficial do governo) |
| **Dev Tools** | Nodemon 3.1.9, Jest 29.7.0, Supertest 6.3.3 |

---

**Conclusão:** Esta seção apresentou a implementação completa do Frontend React, Backend Node.js, todos os controllers, middlewares, services e integrações externas (WhatsApp Bot, Assistente Virtual IA, VLibras).
