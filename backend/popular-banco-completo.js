import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

// Configuração do banco
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'segredodosabor',
    multipleStatements: true
};

/**
 * 🌱 SCRIPT: POPULAR BANCO DE DADOS COMPLETO - V5.0
 * 
 * Popula o banco de dados com TODOS os dados necessários para
 * funcionamento completo do sistema em qualquer máquina.
 * 
 * Baseado no Dump-Segredo-V5.sql
 */

async function popularBancoCompleto() {
    let connection;
    
    try {
        console.log('🌱 POPULAÇÃO COMPLETA DO BANCO DE DADOS - V5.0\n');
        console.log('='.repeat(70));
        console.log(`📊 Banco: ${dbConfig.database}`);
        console.log(`🖥️  Host: ${dbConfig.host}:${dbConfig.port}`);
        console.log(`👤 User: ${dbConfig.user}`);
        console.log('='.repeat(70) + '\n');

        // Conectar ao banco
        console.log('📦 Conectando ao banco...');
        connection = await mysql.createConnection(dbConfig);
        console.log('✅ Conectado com sucesso!\n');

        let totalInseridos = 0;

        // ============================================================
        // 1. ADMINISTRADOR
        // ============================================================
        console.log('👨‍💼 1/14 - Populando ADMINISTRADOR...');
        const senhaAdmin = await bcrypt.hash('admin123', 10);
        
        await connection.query(`
            INSERT IGNORE INTO administrador 
            (id_admin, nome, email, cpf, senha, data_criacao, ultima_atualizacao, ativo) 
            VALUES 
            (1, 'Administrador', 'admin@segredodosabor.com', '000.000.000-00', ?, NOW(), NOW(), 1)
        `, [senhaAdmin]);
        
        const [countAdmin] = await connection.query('SELECT COUNT(*) as total FROM administrador');
        console.log(`   ✅ ${countAdmin[0].total} administrador(es)\n`);
        totalInseridos += countAdmin[0].total;

        // ============================================================
        // 2. CATEGORIAS
        // ============================================================
        console.log('📦 2/14 - Populando CATEGORIAS...');
        await connection.query(`
            INSERT IGNORE INTO categoria (idcategoria, nome, descricao, ativo) VALUES 
            (1, 'Sorvetes', 'Sorvetes artesanais diversos sabores', 1),
            (2, 'Cones Recheados', 'Cones recheados com brigadeiro e coberturas especiais', 1),
            (3, 'Picolés', 'Picolés de frutas e cremes', 1),
            (4, 'Bolos Gelados', 'Bolos para sobremesa gelados', 1),
            (5, 'Mousses', 'Mousses cremosos diversos sabores', 1),
            (6, 'Sobremesas', 'Sobremesas especiais', 1),
            (7, 'Doces Gourmet', 'Doces finos e sofisticados', 1)
        `);
        
        const [countCat] = await connection.query('SELECT COUNT(*) as total FROM categoria');
        console.log(`   ✅ ${countCat[0].total} categoria(s)\n`);
        totalInseridos += countCat[0].total;

        // ============================================================
        // 3. INGREDIENTES
        // ============================================================
        console.log('🥚 3/14 - Populando INGREDIENTES...');
        await connection.query(`
            INSERT IGNORE INTO ingrediente 
            (idingrediente, nome, unidade_medida, preco_unitario, quantidade_estoque, estoque_minimo, fornecedor, ativo) 
            VALUES 
            -- Bases e Laticínios
            (1, 'Leite Condensado', 'kg', 8.50, 50.000, 10.000, 'Atacadão', 1),
            (2, 'Creme de Leite', 'lata', 4.50, 100.000, 20.000, 'Atacadão', 1),
            (3, 'Manteiga', 'kg', 25.00, 10.000, 3.000, 'Atacadão', 1),
            (4, 'Leite em Pó Ninho', 'kg', 25.00, 15.000, 5.000, 'Distribuidora', 1),
            (5, 'Leite Integral', 'litro', 4.50, 50.000, 10.000, 'Laticínio Local', 1),
            -- Chocolates
            (6, 'Chocolate ao Leite', 'kg', 35.00, 20.000, 5.000, 'Distribuidora Chocolates', 1),
            (7, 'Chocolate Meio Amargo', 'kg', 38.00, 15.000, 5.000, 'Distribuidora Chocolates', 1),
            (8, 'Chocolate Branco', 'kg', 40.00, 10.000, 3.000, 'Distribuidora Chocolates', 1),
            (9, 'Cacau em Pó', 'kg', 30.00, 10.000, 3.000, 'Distribuidora', 1),
            -- Coberturas Premium
            (10, 'Nutella', 'kg', 45.00, 8.000, 2.000, 'Importadora', 1),
            (11, 'Ovomaltine', 'kg', 30.00, 10.000, 3.000, 'Distribuidora', 1),
            (12, 'Oreo', 'kg', 20.00, 10.000, 3.000, 'Distribuidora', 1),
            (13, 'Kit Kat', 'kg', 35.00, 8.000, 2.000, 'Distribuidora', 1),
            (14, 'Kinder Bueno', 'kg', 50.00, 5.000, 1.000, 'Importadora', 1),
            (15, 'Ferrero Rocher', 'kg', 80.00, 3.000, 1.000, 'Importadora', 1),
            -- Frutas
            (16, 'Morango', 'kg', 12.00, 10.000, 3.000, 'Hortifruti', 1),
            (17, 'Limão Siciliano', 'kg', 8.00, 8.000, 2.000, 'Hortifruti', 1),
            (18, 'Maracujá', 'kg', 10.00, 5.000, 2.000, 'Hortifruti', 1),
            (19, 'Banana', 'kg', 5.00, 15.000, 5.000, 'Hortifruti', 1),
            (20, 'Abacaxi', 'kg', 6.00, 10.000, 3.000, 'Hortifruti', 1),
            -- Outros Ingredientes
            (21, 'Coco Ralado', 'kg', 15.00, 10.000, 3.000, 'Distribuidora', 1),
            (22, 'Ovos', 'unidade', 0.50, 200.000, 50.000, 'Granja Local', 1),
            (23, 'Açúcar', 'kg', 3.50, 50.000, 10.000, 'Atacadão', 1),
            (24, 'Farinha de Trigo', 'kg', 4.00, 30.000, 10.000, 'Atacadão', 1),
            (25, 'Fermento em Pó', 'kg', 12.00, 5.000, 1.000, 'Atacadão', 1),
            (26, 'Essência de Baunilha', 'ml', 0.50, 1000.000, 200.000, 'Distribuidora', 1),
            (27, 'Corante Alimentício', 'ml', 0.30, 500.000, 100.000, 'Distribuidora', 1),
            (28, 'Gelatina sem Sabor', 'g', 0.05, 5000.000, 1000.000, 'Atacadão', 1),
            (29, 'Amido de Milho', 'kg', 8.00, 10.000, 3.000, 'Atacadão', 1),
            (30, 'Leite de Coco', 'litro', 12.00, 10.000, 3.000, 'Distribuidora', 1),
            -- Embalagens
            (31, 'Casquinha/Cone', 'unidade', 0.50, 500.000, 100.000, 'Fábrica de Cones', 1),
            (32, 'Embalagem Individual', 'unidade', 0.30, 1000.000, 200.000, 'Gráfica Rápida', 1),
            (33, 'Caixinha Brigadeiro', 'unidade', 0.40, 500.000, 100.000, 'Gráfica Rápida', 1),
            (34, 'Saco Plástico', 'unidade', 0.15, 1000.000, 200.000, 'Distribuidora', 1),
            (35, 'Caixa de Bolo (1kg)', 'unidade', 1.50, 200.000, 50.000, 'Gráfica Rápida', 1),
            (36, 'Copo Descartável 300ml', 'unidade', 0.20, 1000.000, 200.000, 'Distribuidora', 1),
            -- Decorações
            (37, 'Granulado Colorido', 'kg', 18.00, 5.000, 1.000, 'Distribuidora', 1),
            (38, 'Confete', 'kg', 20.00, 3.000, 1.000, 'Distribuidora', 1),
            (39, 'Chocolate Raspado', 'kg', 35.00, 5.000, 1.000, 'Distribuidora Chocolates', 1),
            (40, 'Castanha Triturada', 'kg', 40.00, 3.000, 1.000, 'Distribuidora', 1)
        `);
        
        const [countIng] = await connection.query('SELECT COUNT(*) as total FROM ingrediente');
        console.log(`   ✅ ${countIng[0].total} ingrediente(s)\n`);
        totalInseridos += countIng[0].total;

        // ============================================================
        // 4. PRODUTOS
        // ============================================================
        console.log('🍰 4/14 - Populando PRODUTOS...');
        await connection.query(`
            INSERT IGNORE INTO produto 
            (idproduto, nome, descricao, preco, quantidade, idcategoria, imagem, codigo_produto, ativo, custo_producao, margem_lucro) 
            VALUES 
            (1, 'Cone Ovomaltine', 'Cone recheado com brigadeiro de Ovomaltine', 15.00, 50, 2, 'cone-ovomaltine.jpg', 'PROD001', 1, 8.50, 43.33),
            (2, 'Cone Nutella', 'Cone recheado com Nutella original', 18.00, 40, 2, 'cone-nutella.jpg', 'PROD002', 1, 10.00, 44.44),
            (3, 'Sorvete Chocolate', 'Sorvete artesanal de chocolate belga', 12.00, 100, 1, 'sorvete-chocolate.jpg', 'PROD003', 1, 6.00, 50.00),
            (4, 'Sorvete Morango', 'Sorvete artesanal de morango natural', 12.00, 100, 1, 'sorvete-morango.jpg', 'PROD004', 1, 6.50, 45.83),
            (5, 'Picolé Limão', 'Picolé refrescante de limão siciliano', 5.00, 200, 3, 'picole-limao.jpg', 'PROD005', 1, 2.00, 60.00),
            (6, 'Mousse de Maracujá', 'Mousse cremoso de maracujá', 10.00, 50, 5, 'mousse-maracuja.jpg', 'PROD006', 1, 5.00, 50.00),
            (7, 'Bolo Gelado Chocolate', 'Bolo gelado com recheio de chocolate', 45.00, 20, 4, 'bolo-chocolate.jpg', 'PROD007', 1, 22.00, 51.11),
            (8, 'Brigadeiro Gourmet', 'Brigadeiro gourmet diversos sabores (caixa com 12)', 25.00, 80, 7, 'brigadeiro-gourmet.jpg', 'PROD008', 1, 12.00, 52.00),
            (9, 'Sobremesa Surpresa', 'Sobremesa especial do dia (consultar sabor)', 15.00, 30, 6, 'sobremesa-surpresa.jpg', 'PROD009', 1, 8.00, 46.67),
            (10, 'Cone Oreo', 'Cone recheado com creme de Oreo', 16.00, 45, 2, 'cone-oreo.jpg', 'PROD010', 1, 9.00, 43.75)
        `);
        
        const [countProd] = await connection.query('SELECT COUNT(*) as total FROM produto');
        console.log(`   ✅ ${countProd[0].total} produto(s)\n`);
        totalInseridos += countProd[0].total;

        // ============================================================
        // 5. RECEITAS (BOM - Bill of Materials)
        // ============================================================
        console.log('📝 5/14 - Populando RECEITAS...');
        await connection.query(`
            INSERT IGNORE INTO receita (idproduto, idingrediente, quantidade) VALUES 
            -- Cone Ovomaltine (Produto 1)
            (1, 1, 0.050),  -- Leite Condensado
            (1, 2, 0.030),  -- Creme de Leite
            (1, 11, 0.040), -- Ovomaltine
            (1, 31, 1.000), -- Casquinha
            (1, 32, 1.000), -- Embalagem
            
            -- Cone Nutella (Produto 2)
            (2, 1, 0.050),  -- Leite Condensado
            (2, 2, 0.030),  -- Creme de Leite
            (2, 10, 0.050), -- Nutella
            (2, 31, 1.000), -- Casquinha
            (2, 32, 1.000), -- Embalagem
            
            -- Sorvete Chocolate (Produto 3)
            (3, 5, 0.200),  -- Leite Integral
            (3, 2, 0.050),  -- Creme de Leite
            (3, 6, 0.080),  -- Chocolate ao Leite
            (3, 23, 0.050), -- Açúcar
            (3, 36, 1.000), -- Copo
            
            -- Sorvete Morango (Produto 4)
            (4, 5, 0.200),  -- Leite Integral
            (4, 2, 0.050),  -- Creme de Leite
            (4, 16, 0.100), -- Morango
            (4, 23, 0.050), -- Açúcar
            (4, 36, 1.000), -- Copo
            
            -- Picolé Limão (Produto 5)
            (5, 17, 0.050), -- Limão
            (5, 23, 0.030), -- Açúcar
            (5, 32, 1.000), -- Embalagem
            
            -- Mousse de Maracujá (Produto 6)
            (6, 1, 0.100),  -- Leite Condensado
            (6, 2, 0.100),  -- Creme de Leite
            (6, 18, 0.080), -- Maracujá
            (6, 28, 0.010), -- Gelatina
            (6, 36, 1.000), -- Copo
            
            -- Bolo Gelado Chocolate (Produto 7)
            (7, 24, 0.300), -- Farinha de Trigo
            (7, 22, 3.000), -- Ovos
            (7, 23, 0.200), -- Açúcar
            (7, 9, 0.050),  -- Cacau em Pó
            (7, 5, 0.200),  -- Leite
            (7, 3, 0.100),  -- Manteiga
            (7, 25, 0.010), -- Fermento
            (7, 2, 0.200),  -- Creme de Leite
            (7, 35, 1.000), -- Caixa
            
            -- Brigadeiro Gourmet (Produto 8)
            (8, 1, 0.300),  -- Leite Condensado
            (8, 3, 0.020),  -- Manteiga
            (8, 9, 0.030),  -- Cacau em Pó
            (8, 37, 0.050), -- Granulado
            (8, 33, 1.000), -- Caixinha
            
            -- Sobremesa Surpresa (Produto 9)
            (9, 1, 0.100),  -- Leite Condensado
            (9, 2, 0.100),  -- Creme de Leite
            (9, 23, 0.050), -- Açúcar
            (9, 36, 1.000), -- Copo
            
            -- Cone Oreo (Produto 10)
            (10, 1, 0.050), -- Leite Condensado
            (10, 2, 0.030), -- Creme de Leite
            (10, 12, 0.050),-- Oreo
            (10, 31, 1.000),-- Casquinha
            (10, 32, 1.000) -- Embalagem
        `);
        
        const [countRec] = await connection.query('SELECT COUNT(*) as total FROM receita');
        console.log(`   ✅ ${countRec[0].total} receita(s)\n`);
        totalInseridos += countRec[0].total;

        // ============================================================
        // 6. CLIENTES
        // ============================================================
        console.log('👥 6/14 - Populando CLIENTES...');
        const senhaCliente = await bcrypt.hash('senha123', 10);
        
        await connection.query(`
            INSERT IGNORE INTO cliente 
            (idcliente, nome, email, senha, telefone, cpf, tipo, ativo) 
            VALUES 
            (1, 'João Silva', 'joao.silva@email.com', ?, '(11) 98765-4321', '123.456.789-00', 'cliente', 1),
            (2, 'Maria Santos', 'maria.santos@email.com', ?, '(11) 98765-4322', '123.456.789-01', 'cliente', 1),
            (3, 'Pedro Oliveira', 'pedro.oliveira@email.com', ?, '(11) 98765-4323', '123.456.789-02', 'cliente', 1),
            (4, 'Ana Costa', 'ana.costa@email.com', ?, '(11) 98765-4324', '123.456.789-03', 'cliente', 1),
            (5, 'Carlos Mendes', 'carlos.mendes@email.com', ?, '(11) 98765-4325', '123.456.789-04', 'cliente', 1)
        `, [senhaCliente, senhaCliente, senhaCliente, senhaCliente, senhaCliente]);
        
        const [countCli] = await connection.query('SELECT COUNT(*) as total FROM cliente');
        console.log(`   ✅ ${countCli[0].total} cliente(s)\n`);
        totalInseridos += countCli[0].total;

        // ============================================================
        // 7. OPÇÕES DE PERSONALIZAÇÃO
        // ============================================================
        console.log('🎨 7/14 - Populando OPÇÕES DE PERSONALIZAÇÃO...');
        await connection.query(`
            INSERT IGNORE INTO produto_opcoes_personalizacao 
            (idopcao, nome_opcao, descricao, tipo_selecao, obrigatorio, ativo, ordem_exibicao) 
            VALUES 
            (1, 'Sabor', 'Escolha o sabor do recheio', 'radio', 1, 1, 1),
            (2, 'Tamanho', 'Selecione o tamanho', 'radio', 1, 1, 2),
            (3, 'Cobertura', 'Adicione uma cobertura extra', 'select', 0, 1, 3),
            (4, 'Complementos', 'Adicione complementos', 'checkbox', 0, 1, 4),
            (5, 'Decoração', 'Escolha a decoração', 'checkbox', 0, 1, 5)
        `);
        
        const [countOpc] = await connection.query('SELECT COUNT(*) as total FROM produto_opcoes_personalizacao');
        console.log(`   ✅ ${countOpc[0].total} opção(ões)\n`);
        totalInseridos += countOpc[0].total;

        // ============================================================
        // 8. VALORES DAS OPÇÕES
        // ============================================================
        console.log('💎 8/14 - Populando VALORES DAS OPÇÕES...');
        await connection.query(`
            INSERT IGNORE INTO opcao_valores 
            (idvalor, idopcao_fk, nome_valor, preco_adicional, disponivel, ordem_exibicao) 
            VALUES 
            -- Sabores (Opção 1)
            (1, 1, 'Chocolate', 0.00, 1, 1),
            (2, 1, 'Morango', 0.00, 1, 2),
            (3, 1, 'Baunilha', 0.00, 1, 3),
            (4, 1, 'Limão', 0.00, 1, 4),
            (5, 1, 'Maracujá', 0.00, 1, 5),
            (6, 1, 'Coco', 0.00, 1, 6),
            
            -- Tamanhos (Opção 2)
            (7, 2, 'Pequeno (300ml)', 0.00, 1, 1),
            (8, 2, 'Médio (500ml)', 3.00, 1, 2),
            (9, 2, 'Grande (1L)', 6.00, 1, 3),
            
            -- Coberturas (Opção 3)
            (10, 3, 'Sem Cobertura', 0.00, 1, 1),
            (11, 3, 'Calda de Chocolate', 2.50, 1, 2),
            (12, 3, 'Calda de Morango', 2.50, 1, 3),
            (13, 3, 'Nutella', 5.00, 1, 4),
            (14, 3, 'Ovomaltine', 4.00, 1, 5),
            (15, 3, 'Doce de Leite', 3.00, 1, 6),
            
            -- Complementos (Opção 4)
            (16, 4, 'Granulado', 1.50, 1, 1),
            (17, 4, 'Confete', 1.50, 1, 2),
            (18, 4, 'M&M', 3.00, 1, 3),
            (19, 4, 'Castanha', 3.50, 1, 4),
            (20, 4, 'Coco Ralado', 2.00, 1, 5),
            
            -- Decorações (Opção 5)
            (21, 5, 'Simples', 0.00, 1, 1),
            (22, 5, 'Com Frutas', 5.00, 1, 2),
            (23, 5, 'Flores Comestíveis', 8.00, 1, 3),
            (24, 5, 'Chocolate Raspado', 4.00, 1, 4)
        `);
        
        const [countVal] = await connection.query('SELECT COUNT(*) as total FROM opcao_valores');
        console.log(`   ✅ ${countVal[0].total} valor(es)\n`);
        totalInseridos += countVal[0].total;

        // ============================================================
        // 9. ASSOCIAÇÃO PRODUTO-OPÇÃO
        // ============================================================
        console.log('🔗 9/14 - Populando ASSOCIAÇÃO PRODUTO-OPÇÃO...');
        await connection.query(`
            INSERT IGNORE INTO produto_opcao_associacao 
            (idproduto_fk, idopcao_fk, obrigatorio) 
            VALUES 
            -- Cone Ovomaltine (1)
            (1, 2, 1), -- Tamanho (obrigatório)
            (1, 3, 0), -- Cobertura (opcional)
            (1, 4, 0), -- Complementos (opcional)
            
            -- Cone Nutella (2)
            (2, 2, 1), -- Tamanho
            (2, 3, 0), -- Cobertura
            (2, 4, 0), -- Complementos
            
            -- Sorvetes (3, 4)
            (3, 1, 1), -- Sabor
            (3, 2, 1), -- Tamanho
            (3, 3, 0), -- Cobertura
            (3, 4, 0), -- Complementos
            (4, 1, 1),
            (4, 2, 1),
            (4, 3, 0),
            (4, 4, 0),
            
            -- Picolé (5)
            (5, 1, 1), -- Sabor
            
            -- Mousse (6)
            (6, 1, 1), -- Sabor
            (6, 2, 1), -- Tamanho
            (6, 4, 0), -- Complementos
            
            -- Bolo (7)
            (7, 1, 1), -- Sabor
            (7, 2, 1), -- Tamanho
            (7, 5, 0), -- Decoração
            
            -- Brigadeiro (8)
            (8, 1, 1), -- Sabor
            (8, 4, 0), -- Complementos
            
            -- Sobremesa (9)
            (9, 1, 1), -- Sabor
            (9, 2, 1), -- Tamanho
            
            -- Cone Oreo (10)
            (10, 2, 1), -- Tamanho
            (10, 3, 0), -- Cobertura
            (10, 4, 0)  -- Complementos
        `);
        
        const [countAssoc] = await connection.query('SELECT COUNT(*) as total FROM produto_opcao_associacao');
        console.log(`   ✅ ${countAssoc[0].total} associação(ões)\n`);
        totalInseridos += countAssoc[0].total;

        // ============================================================
        // 10. CONFIGURAÇÕES DO SISTEMA
        // ============================================================
        console.log('⚙️  10/14 - Populando CONFIGURAÇÕES...');
        await connection.query(`
            INSERT IGNORE INTO configuracao (chave, valor, descricao, tipo) VALUES 
            ('margem_lucro_padrao', '40', 'Margem de lucro padrão em porcentagem', 'number'),
            ('taxa_desperdicio', '5', 'Taxa de desperdício em porcentagem', 'number'),
            ('valor_entrega', '8.00', 'Valor da taxa de entrega', 'number'),
            ('tempo_preparo_padrao', '30', 'Tempo de preparo padrão em minutos', 'number'),
            ('aceita_pix', 'true', 'Aceita pagamento via PIX', 'boolean'),
            ('aceita_cartao', 'true', 'Aceita pagamento com cartão', 'boolean'),
            ('aceita_dinheiro', 'true', 'Aceita pagamento em dinheiro', 'boolean'),
            ('chave_pix', '11967696744', 'Chave PIX para recebimento', 'string'),
            ('telefone_whatsapp', '5511967696744', 'Número do WhatsApp para pedidos', 'string'),
            ('email_notificacao', 'contato@segredodosabor.com', 'Email para notificações', 'string'),
            ('sistema_nome', 'Segredo do Sabor', 'Nome do estabelecimento', 'string'),
            ('sistema_versao', '5.0', 'Versão do sistema', 'string'),
            ('horario_abertura', '09:00', 'Horário de abertura', 'string'),
            ('horario_fechamento', '18:00', 'Horário de fechamento', 'string'),
            ('dias_funcionamento', 'Segunda a Sábado', 'Dias de funcionamento', 'string')
        `);
        
        const [countConf] = await connection.query('SELECT COUNT(*) as total FROM configuracao');
        console.log(`   ✅ ${countConf[0].total} configuração(ões)\n`);
        totalInseridos += countConf[0].total;

        // ============================================================
        // 11. ASSISTENTE VIRTUAL - FAQ
        // ============================================================
        console.log('🤖 11/14 - Populando ASSISTENTE VIRTUAL - FAQ...');
        await connection.query(`
            INSERT IGNORE INTO assistente_faq 
            (idfaq, pergunta, resposta, categoria, tags, ativo, ordem_exibicao) 
            VALUES 
            (1, 'Como faço para fazer um pedido?', 
                'É muito fácil! Acesse nosso catálogo (https://segredodosabor.com/catalogo), escolha seus produtos, adicione ao carrinho, personalize se desejar e finalize o pedido. Você também pode pedir pelo WhatsApp: (11) 96769-6744', 
                'pedidos', '["pedido", "como fazer", "comprar"]', 1, 1),
            (2, 'Quais são as formas de pagamento?', 
                'Aceitamos PIX (com 5% de desconto), cartão de crédito/débito, dinheiro e vale-presente. Parcelamos em até 3x sem juros!', 
                'pagamento', '["pagamento", "pix", "cartão"]', 1, 2),
            (3, 'Qual o prazo de entrega?', 
                'Produtos prontos: retirada imediata. Sob encomenda: 24-48h. Bolos decorados: 48-72h. Para eventos, entre em contato para combinar!', 
                'entrega', '["prazo", "entrega", "quanto tempo"]', 1, 3),
            (4, 'Vocês fazem entrega?', 
                'Sim! Oferecemos entrega em um raio de 10km. A taxa varia conforme a distância. A retirada na loja é sempre gratuita!', 
                'entrega', '["entrega", "delivery", "frete"]', 1, 4),
            (5, 'Qual o horário de funcionamento?', 
                'Segunda a Sexta: 9h às 18h. Sábado: 9h às 14h. Domingo e feriados: fechado. Pedidos online 24/7!', 
                'horario', '["horário", "funciona", "abre"]', 1, 5),
            (6, 'Posso personalizar meu pedido?', 
                'Sim! Você pode remover ingredientes (alergias), adicionar extras, escolher tamanhos e criar combinações únicas. O preço ajusta automaticamente!', 
                'produtos', '["personalizar", "customizar", "mudar"]', 1, 6),
            (7, 'Como consulto o status do meu pedido?', 
                'Acesse "Meus Pedidos" no site ou envie "status" no WhatsApp. Você receberá todas as informações em tempo real!', 
                'pedidos', '["status", "acompanhar", "onde está"]', 1, 7),
            (8, 'O site é acessível?', 
                'Sim! Somos 100% acessíveis (WCAG 2.2 AAA): VLibras integrado, navegação por teclado, leitores de tela compatíveis, alto contraste e muito mais!', 
                'acessibilidade', '["acessibilidade", "libras", "deficiente"]', 1, 8)
        `);
        
        const [countFAQ] = await connection.query('SELECT COUNT(*) as total FROM assistente_faq');
        console.log(`   ✅ ${countFAQ[0].total} FAQ(s)\n`);
        totalInseridos += countFAQ[0].total;

        // ============================================================
        // 12. ASSISTENTE VIRTUAL - PALAVRAS-CHAVE
        // ============================================================
        console.log('🔑 12/14 - Populando PALAVRAS-CHAVE DO ASSISTENTE...');
        await connection.query(`
            INSERT IGNORE INTO assistente_palavras_chave (palavra, categoria, relevancia, ativo) VALUES
            -- Pedidos
            ('pedido', 'pedidos', 10, 1),
            ('comprar', 'pedidos', 9, 1),
            ('encomendar', 'pedidos', 9, 1),
            ('reservar', 'pedidos', 8, 1),
            ('status', 'pedidos', 10, 1),
            ('rastrear', 'pedidos', 9, 1),
            ('cancelar', 'pedidos', 10, 1),
            
            -- Produtos
            ('cardápio', 'produtos', 10, 1),
            ('cardapio', 'produtos', 10, 1),
            ('menu', 'produtos', 10, 1),
            ('produto', 'produtos', 10, 1),
            ('doce', 'produtos', 8, 1),
            ('bolo', 'produtos', 9, 1),
            ('sorvete', 'produtos', 9, 1),
            ('brigadeiro', 'produtos', 9, 1),
            ('preço', 'produtos', 10, 1),
            ('preco', 'produtos', 10, 1),
            ('valor', 'produtos', 9, 1),
            
            -- Entrega
            ('entrega', 'entrega', 10, 1),
            ('delivery', 'entrega', 10, 1),
            ('retirar', 'entrega', 9, 1),
            ('buscar', 'entrega', 8, 1),
            ('prazo', 'entrega', 9, 1),
            
            -- Pagamento
            ('pagar', 'pagamento', 10, 1),
            ('pagamento', 'pagamento', 10, 1),
            ('pix', 'pagamento', 10, 1),
            ('cartão', 'pagamento', 10, 1),
            ('cartao', 'pagamento', 10, 1),
            ('dinheiro', 'pagamento', 9, 1),
            ('parcelar', 'pagamento', 9, 1),
            
            -- Contato
            ('contato', 'contato', 10, 1),
            ('telefone', 'contato', 9, 1),
            ('whatsapp', 'contato', 10, 1),
            ('email', 'contato', 9, 1),
            ('atendente', 'contato', 10, 1),
            ('ajuda', 'contato', 10, 1),
            
            -- Horário
            ('horário', 'horario', 10, 1),
            ('horario', 'horario', 10, 1),
            ('abre', 'horario', 9, 1),
            ('fecha', 'horario', 9, 1),
            ('funciona', 'horario', 9, 1),
            ('aberto', 'horario', 8, 1),
            
            -- Acessibilidade
            ('acessibilidade', 'acessibilidade', 10, 1),
            ('libras', 'acessibilidade', 10, 1),
            ('vlibras', 'acessibilidade', 10, 1),
            ('deficiente', 'acessibilidade', 9, 1),
            ('inclusão', 'acessibilidade', 9, 1),
            ('inclusao', 'acessibilidade', 9, 1)
        `);
        
        const [countPalavras] = await connection.query('SELECT COUNT(*) as total FROM assistente_palavras_chave');
        console.log(`   ✅ ${countPalavras[0].total} palavra(s)-chave\n`);
        totalInseridos += countPalavras[0].total;

        // ============================================================
        // 13. WHATSAPP BOT - CONFIGURAÇÃO
        // ============================================================
        console.log('📱 13/14 - Populando CONFIGURAÇÃO WHATSAPP BOT...');
        await connection.query(`
            INSERT IGNORE INTO tb_whatsapp_bot_config 
            (id_config, status_bot, mensagem_boas_vindas, mensagem_ausente, horario_funcionamento_inicio, horario_funcionamento_fim, resposta_automatica_ativa) 
            VALUES 
            (1, 'ativo', 
             '👋 Olá! Bem-vindo ao *Segredo do Sabor*! 🍰\n\nComo posso te ajudar hoje?\n\n1️⃣ Fazer um pedido\n2️⃣ Consultar pedido\n3️⃣ Ver cardápio\n4️⃣ Falar com atendente',
             '😴 No momento estamos fora do horário de atendimento.\n\nNosso horário é de *Segunda a Sexta, das 9h às 18h*.\n\nDeixe sua mensagem que responderemos em breve!',
             '09:00:00', '18:00:00', 1)
        `);
        
        const [countBotConfig] = await connection.query('SELECT COUNT(*) as total FROM tb_whatsapp_bot_config');
        console.log(`   ✅ ${countBotConfig[0].total} configuração(ões) WhatsApp\n`);
        totalInseridos += countBotConfig[0].total;

        // ============================================================
        // 14. WHATSAPP BOT - COMANDOS
        // ============================================================
        console.log('💬 14/14 - Populando COMANDOS WHATSAPP BOT...');
        await connection.query(`
            INSERT IGNORE INTO tb_whatsapp_comandos 
            (palavra_chave, tipo_resposta, resposta_texto, ativo, ordem_exibicao) 
            VALUES
            ('pedido', 'texto', '📦 Para fazer um pedido, acesse nosso catálogo online:\n\nhttps://segredodosabor.com.br/catalogo\n\nOu se preferir, me diga o que deseja e eu te ajudo! 😊', 1, 1),
            ('consultar', 'acao', NULL, 1, 2),
            ('cardapio', 'texto', '📋 Confira nosso cardápio completo:\n\nhttps://segredodosabor.com.br/catalogo\n\n🧁 Bolos personalizados\n🍰 Doces finos\n🎂 Tortas artesanais\n🍪 Cookies gourmet', 1, 3),
            ('horario', 'texto', '⏰ *Horário de Funcionamento:*\n\nSegunda a Sexta: 9h às 18h\nSábado: 9h às 14h\nDomingo: Fechado', 1, 4),
            ('endereco', 'texto', '📍 *Nosso endereço:*\n\nRua dos Doces, 123\nCentro - São Paulo/SP\nCEP: 01234-567\n\nEstamos te esperando! 💜', 1, 5),
            ('ajuda', 'menu', '🤖 *Comandos disponíveis:*\n\n• *pedido* - Fazer um novo pedido\n• *consultar* - Ver status do seu pedido\n• *cardapio* - Ver nossos produtos\n• *horario* - Horário de funcionamento\n• *endereco* - Como chegar\n• *contato* - Falar com atendente', 1, 6),
            ('oi', 'texto', '👋 Olá! Como posso te ajudar? Digite *ajuda* para ver os comandos disponíveis.', 1, 7),
            ('ola', 'texto', '👋 Olá! Como posso te ajudar? Digite *ajuda* para ver os comandos disponíveis.', 1, 8),
            ('bom dia', 'texto', '🌅 Bom dia! Como posso te ajudar hoje?', 1, 9),
            ('boa tarde', 'texto', '☀️ Boa tarde! Como posso te ajudar?', 1, 10),
            ('boa noite', 'texto', '🌙 Boa noite! Como posso te ajudar?', 1, 11)
        `);
        
        const [countComandos] = await connection.query('SELECT COUNT(*) as total FROM tb_whatsapp_comandos');
        console.log(`   ✅ ${countComandos[0].total} comando(s)\n`);
        totalInseridos += countComandos[0].total;

        // ============================================================
        // RESUMO FINAL
        // ============================================================
        console.log('\n' + '='.repeat(70));
        console.log('✅ POPULAÇÃO CONCLUÍDA COM SUCESSO!');
        console.log('='.repeat(70));
        console.log(`\n📊 Total de registros inseridos: ${totalInseridos}`);
        
        // Verificar totais por tabela
        const [totais] = await connection.query(`
            SELECT 
                'administrador' as tabela, COUNT(*) as total FROM administrador
            UNION ALL SELECT 'categoria', COUNT(*) FROM categoria
            UNION ALL SELECT 'ingrediente', COUNT(*) FROM ingrediente
            UNION ALL SELECT 'produto', COUNT(*) FROM produto
            UNION ALL SELECT 'receita', COUNT(*) FROM receita
            UNION ALL SELECT 'cliente', COUNT(*) FROM cliente
            UNION ALL SELECT 'produto_opcoes_personalizacao', COUNT(*) FROM produto_opcoes_personalizacao
            UNION ALL SELECT 'opcao_valores', COUNT(*) FROM opcao_valores
            UNION ALL SELECT 'produto_opcao_associacao', COUNT(*) FROM produto_opcao_associacao
            UNION ALL SELECT 'configuracao', COUNT(*) FROM configuracao
            UNION ALL SELECT 'assistente_faq', COUNT(*) FROM assistente_faq
            UNION ALL SELECT 'assistente_palavras_chave', COUNT(*) FROM assistente_palavras_chave
            UNION ALL SELECT 'tb_whatsapp_bot_config', COUNT(*) FROM tb_whatsapp_bot_config
            UNION ALL SELECT 'tb_whatsapp_comandos', COUNT(*) FROM tb_whatsapp_comandos
        `);
        
        console.log('\n📋 Resumo por Tabela:');
        totais.forEach(row => {
            console.log(`   ${row.tabela.padEnd(35)} ${row.total} registro(s)`);
        });
        
        console.log('\n🎉 Sistema pronto para uso!');
        console.log('\n💡 Credenciais padrão:');
        console.log('   Admin: admin@segredodosabor.com / admin123');
        console.log('   Cliente: joao.silva@email.com / senha123');
        console.log('\n📞 Suporte: contato@segredodosabor.com.br');
        console.log('='.repeat(70) + '\n');

    } catch (error) {
        console.error('\n❌ ERRO:', error.message);
        console.error(error);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Executar script
popularBancoCompleto();
