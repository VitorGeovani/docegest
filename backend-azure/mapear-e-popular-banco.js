import mysql from 'mysql2/promise';
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
 * 🗺️ SCRIPT: MAPEAR E POPULAR BANCO DE DADOS COMPLETO
 * 
 * Este script:
 * 1. Mapeia todas as tabelas existentes no banco
 * 2. Mostra a estrutura de cada tabela
 * 3. Popula automaticamente com dados de teste
 * 4. Gera relatório completo do banco
 */

async function mapearEPopularBanco() {
    let connection;
    
    try {
        console.log('🚀 MAPEAMENTO E POPULAÇÃO DO BANCO DE DADOS\n');
        console.log('='.repeat(70));
        console.log(`📊 Banco: ${dbConfig.database}`);
        console.log(`🖥️  Host: ${dbConfig.host}:${dbConfig.port}`);
        console.log(`👤 User: ${dbConfig.user}`);
        console.log('='.repeat(70) + '\n');

        // Conectar ao banco
        console.log('📦 Conectando ao banco...');
        connection = await mysql.createConnection(dbConfig);
        console.log('✅ Conectado com sucesso!\n');

        // ============================================================
        // 1. MAPEAR TODAS AS TABELAS
        // ============================================================
        console.log('🗺️  MAPEANDO TABELAS...\n');
        
        const [tables] = await connection.query(`
            SELECT 
                TABLE_NAME as nome,
                TABLE_ROWS as linhas_aproximadas,
                ROUND(DATA_LENGTH / 1024, 2) as tamanho_kb,
                TABLE_COMMENT as comentario,
                CREATE_TIME as criado_em
            FROM information_schema.TABLES
            WHERE TABLE_SCHEMA = ?
            AND TABLE_TYPE = 'BASE TABLE'
            ORDER BY TABLE_NAME
        `, [dbConfig.database]);

        console.log(`📋 Total de tabelas: ${tables.length}\n`);
        
        const tabelasInfo = {};
        
        for (const table of tables) {
            console.log(`\n📌 Tabela: ${table.nome}`);
            console.log(`   Linhas: ${table.linhas_aproximadas || 0}`);
            console.log(`   Tamanho: ${table.tamanho_kb || 0} KB`);
            if (table.comentario) {
                console.log(`   Descrição: ${table.comentario}`);
            }
            
            // Obter estrutura da tabela
            const [columns] = await connection.query(`
                SELECT 
                    COLUMN_NAME as nome,
                    COLUMN_TYPE as tipo,
                    IS_NULLABLE as nulo,
                    COLUMN_KEY as chave,
                    COLUMN_DEFAULT as padrao,
                    EXTRA as extra,
                    COLUMN_COMMENT as comentario
                FROM information_schema.COLUMNS
                WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
                ORDER BY ORDINAL_POSITION
            `, [dbConfig.database, table.nome]);
            
            tabelasInfo[table.nome] = {
                tabela: table,
                colunas: columns,
                linhas_atuais: table.linhas_aproximadas || 0
            };
            
            console.log(`   Colunas: ${columns.length}`);
        }

        // ============================================================
        // 2. VERIFICAR DADOS EXISTENTES
        // ============================================================
        console.log('\n\n📊 VERIFICANDO DADOS EXISTENTES...\n');
        
        for (const [nomeTabela, info] of Object.entries(tabelasInfo)) {
            const [count] = await connection.query(`SELECT COUNT(*) as total FROM ??`, [nomeTabela]);
            const total = count[0].total;
            tabelasInfo[nomeTabela].linhas_reais = total;
            
            console.log(`${total > 0 ? '✅' : '⚪'} ${nomeTabela.padEnd(40)} ${total} registros`);
        }

        // ============================================================
        // 3. POPULAR TABELAS VAZIAS OU COM POUCOS DADOS
        // ============================================================
        console.log('\n\n🌱 POPULANDO BANCO COM DADOS DE TESTE...\n');
        
        await popularDadosTeste(connection, tabelasInfo);

        // ============================================================
        // 4. GERAR RELATÓRIO FINAL
        // ============================================================
        console.log('\n\n📈 RELATÓRIO FINAL DO BANCO DE DADOS\n');
        console.log('='.repeat(70));
        
        const [finalStats] = await connection.query(`
            SELECT 
                COUNT(*) as total_tabelas,
                SUM(TABLE_ROWS) as total_registros,
                ROUND(SUM(DATA_LENGTH) / 1024 / 1024, 2) as tamanho_mb
            FROM information_schema.TABLES
            WHERE TABLE_SCHEMA = ?
            AND TABLE_TYPE = 'BASE TABLE'
        `, [dbConfig.database]);
        
        const stats = finalStats[0];
        console.log(`📊 Total de Tabelas: ${stats.total_tabelas}`);
        console.log(`📝 Total de Registros: ${stats.total_registros || 0}`);
        console.log(`💾 Tamanho Total: ${stats.tamanho_mb || 0} MB`);
        console.log('='.repeat(70));

        // Verificar Views
        const [views] = await connection.query(`
            SELECT TABLE_NAME 
            FROM information_schema.VIEWS
            WHERE TABLE_SCHEMA = ?
            ORDER BY TABLE_NAME
        `, [dbConfig.database]);
        
        if (views.length > 0) {
            console.log(`\n📊 Views: ${views.length}`);
            views.forEach(v => console.log(`   - ${v.TABLE_NAME}`));
        }

        // Verificar Procedures
        const [procedures] = await connection.query(`
            SELECT ROUTINE_NAME 
            FROM information_schema.ROUTINES
            WHERE ROUTINE_SCHEMA = ? AND ROUTINE_TYPE = 'PROCEDURE'
            ORDER BY ROUTINE_NAME
        `, [dbConfig.database]);
        
        if (procedures.length > 0) {
            console.log(`\n⚙️  Procedures: ${procedures.length}`);
            procedures.forEach(p => console.log(`   - ${p.ROUTINE_NAME}`));
        }

        // Verificar Triggers
        const [triggers] = await connection.query(`
            SELECT TRIGGER_NAME, EVENT_OBJECT_TABLE 
            FROM information_schema.TRIGGERS
            WHERE TRIGGER_SCHEMA = ?
            ORDER BY TRIGGER_NAME
        `, [dbConfig.database]);
        
        if (triggers.length > 0) {
            console.log(`\n🔫 Triggers: ${triggers.length}`);
            triggers.forEach(t => console.log(`   - ${t.TRIGGER_NAME} (${t.EVENT_OBJECT_TABLE})`));
        }

        console.log('\n✅ MAPEAMENTO E POPULAÇÃO CONCLUÍDOS COM SUCESSO!');

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

/**
 * Popular banco com dados de teste
 */
async function popularDadosTeste(connection, tabelasInfo) {
    
    // ============================================================
    // CATEGORIAS
    // ============================================================
    if (tabelasInfo['categoria']?.linhas_reais < 5) {
        console.log('📦 Populando categorias...');
        await connection.query(`
            INSERT IGNORE INTO categoria (idcategoria, nome, descricao, ativo) VALUES 
            (1, 'Sorvetes', 'Sorvetes artesanais diversos sabores', 1),
            (2, 'Cones Recheados', 'Cones recheados com brigadeiro e coberturas especiais', 1),
            (3, 'Picolés', 'Picolés de frutas e cremes', 1),
            (4, 'Bolos Gelados', 'Bolos para sobremesa gelados', 1),
            (5, 'Mousses', 'Mousses cremosos diversos sabores', 1),
            (6, 'Sobremesas', 'Sobremesas especiais', 1),
            (7, 'Doces Gourmet', 'Doces finos e sofisticados', 1),
            (8, 'Brigadeiros', 'Brigadeiros tradicionais e gourmet', 1),
            (9, 'Veganos', 'Produtos sem ingredientes de origem animal', 1)
        `);
        console.log('✅ Categorias populadas!');
    }

    // ============================================================
    // INGREDIENTES
    // ============================================================
    if (tabelasInfo['ingrediente']?.linhas_reais < 10) {
        console.log('📦 Populando ingredientes...');
        await connection.query(`
            INSERT IGNORE INTO ingrediente (idingrediente, nome, unidade_medida, preco_unitario, quantidade_estoque, estoque_minimo, fornecedor, ativo) VALUES 
            (1, 'Leite Condensado', 'kg', 8.50, 50.000, 10.000, 'Atacadão', 1),
            (2, 'Creme de Leite', 'lata', 4.50, 100.000, 20.000, 'Atacadão', 1),
            (3, 'Manteiga', 'kg', 25.00, 10.000, 3.000, 'Atacadão', 1),
            (4, 'Leite em Pó Ninho', 'kg', 25.00, 15.000, 5.000, 'Distribuidora', 1),
            (5, 'Chocolate ao Leite', 'kg', 35.00, 20.000, 5.000, 'Distribuidora Chocolates', 1),
            (6, 'Chocolate Meio Amargo', 'kg', 38.00, 15.000, 5.000, 'Distribuidora Chocolates', 1),
            (7, 'Chocolate Branco', 'kg', 40.00, 10.000, 3.000, 'Distribuidora Chocolates', 1),
            (8, 'Nutella', 'kg', 45.00, 8.000, 2.000, 'Importadora', 1),
            (9, 'Ovomaltine', 'kg', 30.00, 10.000, 3.000, 'Distribuidora', 1),
            (10, 'Oreo', 'kg', 20.00, 10.000, 3.000, 'Distribuidora', 1),
            (11, 'Kit Kat', 'kg', 35.00, 8.000, 2.000, 'Distribuidora', 1),
            (12, 'Kinder Bueno', 'kg', 50.00, 5.000, 1.000, 'Importadora', 1),
            (13, 'Ferrero Rocher', 'kg', 80.00, 3.000, 1.000, 'Importadora', 1),
            (14, 'Morango', 'kg', 12.00, 10.000, 3.000, 'Hortifruti', 1),
            (15, 'Limão Siciliano', 'kg', 8.00, 8.000, 2.000, 'Hortifruti', 1),
            (16, 'Maracujá', 'kg', 10.00, 5.000, 2.000, 'Hortifruti', 1),
            (17, 'Coco Ralado', 'kg', 15.00, 10.000, 3.000, 'Distribuidora', 1),
            (18, 'Ovos', 'unidade', 0.50, 200.000, 50.000, 'Granja Local', 1),
            (19, 'Açúcar', 'kg', 3.50, 50.000, 10.000, 'Atacadão', 1),
            (20, 'Farinha de Trigo', 'kg', 4.00, 30.000, 10.000, 'Atacadão', 1),
            (21, 'Casquinha/Cone', 'unidade', 0.50, 500.000, 100.000, 'Fábrica de Cones', 1),
            (22, 'Embalagem Individual', 'unidade', 0.30, 1000.000, 200.000, 'Gráfica Rápida', 1),
            (23, 'Caixinha Brigadeiro', 'unidade', 0.40, 500.000, 100.000, 'Gráfica Rápida', 1),
            (24, 'Saco Plástico', 'unidade', 0.15, 1000.000, 200.000, 'Distribuidora', 1)
        `);
        console.log('✅ Ingredientes populados!');
    }

    // ============================================================
    // CLIENTE DE TESTE
    // ============================================================
    if (tabelasInfo['cliente']?.linhas_reais < 3) {
        console.log('📦 Criando cliente de teste...');
        
        // Importar bcrypt para hash de senha
        const bcrypt = await import('bcrypt');
        const senhaHash = await bcrypt.hash('teste123', 10);
        const senhaAdmin = await bcrypt.hash('admin123', 10);
        
        await connection.query(`
            INSERT IGNORE INTO cliente (idcliente, nome, email, senha, telefone, cpf, tipo, ativo) VALUES 
            (1, 'Administrador Sistema', 'admin@segredodosabor.com', ?, '(11) 99999-9999', '000.000.000-00', 'admin', 1),
            (2, 'Cliente Teste', 'cliente@teste.com', ?, '(11) 98888-8888', '111.111.111-11', 'cliente', 1),
            (3, 'João da Silva', 'joao@email.com', ?, '(11) 97777-7777', '222.222.222-22', 'cliente', 1)
        `, [senhaAdmin, senhaHash, senhaHash]);
        console.log('✅ Clientes de teste criados!');
    }

    // ============================================================
    // OPÇÕES DE PERSONALIZAÇÃO
    // ============================================================
    if (tabelasInfo['personalizacao_opcoes']?.linhas_reais < 3) {
        console.log('📦 Criando opções de personalização...');
        await connection.query(`
            INSERT IGNORE INTO personalizacao_opcoes (idopcao, nome_opcao, tipo_opcao, obrigatorio, ordem, ativo) VALUES 
            (1, 'Sabor', 'select', 1, 1, 1),
            (2, 'Tamanho', 'select', 1, 2, 1),
            (3, 'Cobertura', 'select', 0, 3, 1),
            (4, 'Complementos', 'checkbox', 0, 4, 1)
        `);
        console.log('✅ Opções de personalização criadas!');
    }

    // ============================================================
    // VALORES DE PERSONALIZAÇÃO
    // ============================================================
    if (tabelasInfo['personalizacao_valores']?.linhas_reais < 5) {
        console.log('📦 Criando valores de personalização...');
        await connection.query(`
            INSERT IGNORE INTO personalizacao_valores (idvalor, idopcao, nome_valor, acrescimo_preco, ordem, ativo) VALUES 
            -- Sabores
            (1, 1, 'Chocolate', 0.00, 1, 1),
            (2, 1, 'Morango', 0.00, 2, 1),
            (3, 1, 'Baunilha', 0.00, 3, 1),
            (4, 1, 'Limão', 0.00, 4, 1),
            (5, 1, 'Maracujá', 0.00, 5, 1),
            -- Tamanhos
            (6, 2, 'Pequeno (300ml)', 0.00, 1, 1),
            (7, 2, 'Médio (500ml)', 3.00, 2, 1),
            (8, 2, 'Grande (1L)', 6.00, 3, 1),
            -- Coberturas
            (9, 3, 'Calda de Chocolate', 2.50, 1, 1),
            (10, 3, 'Calda de Morango', 2.50, 2, 1),
            (11, 3, 'Nutella', 5.00, 3, 1),
            (12, 3, 'Ovomaltine', 4.00, 4, 1),
            -- Complementos
            (13, 4, 'Granulado', 1.50, 1, 1),
            (14, 4, 'Confete', 1.50, 2, 1),
            (15, 4, 'M&M', 3.00, 3, 1),
            (16, 4, 'Castanha', 3.50, 4, 1)
        `);
        console.log('✅ Valores de personalização criados!');
    }

    // ============================================================
    // CONFIGURAÇÕES DO SISTEMA
    // ============================================================
    if (tabelasInfo['configuracao']?.linhas_reais < 5) {
        console.log('📦 Configurando sistema...');
        await connection.query(`
            INSERT IGNORE INTO configuracao (chave, valor, descricao, tipo) VALUES 
            ('margem_lucro_padrao', '40', 'Margem de lucro padrão em porcentagem', 'number'),
            ('taxa_desperdicio', '5', 'Taxa de desperdício em porcentagem', 'number'),
            ('valor_entrega', '8.00', 'Valor da taxa de entrega', 'number'),
            ('tempo_preparo_padrao', '30', 'Tempo de preparo padrão em minutos', 'number'),
            ('aceita_pix', 'true', 'Aceita pagamento via PIX', 'boolean'),
            ('aceita_cartao', 'true', 'Aceita pagamento com cartão', 'boolean'),
            ('aceita_dinheiro', 'true', 'Aceita pagamento em dinheiro', 'boolean'),
            ('sistema_nome', 'Segredo do Sabor', 'Nome do estabelecimento', 'string'),
            ('sistema_versao', '5.0', 'Versão do sistema', 'string')
        `);
        console.log('✅ Configurações criadas!');
    }

    // ============================================================
    // PALAVRAS-CHAVE ASSISTENTE VIRTUAL
    // ============================================================
    if (tabelasInfo['assistente_palavras_chave']?.linhas_reais < 10) {
        console.log('📦 Criando palavras-chave do assistente...');
        await connection.query(`
            INSERT IGNORE INTO assistente_palavras_chave (palavra, categoria, relevancia, ativo) VALUES 
            -- Saudações
            ('oi', 'saudacao', 10, 1),
            ('ola', 'saudacao', 10, 1),
            ('bom dia', 'saudacao', 10, 1),
            ('boa tarde', 'saudacao', 10, 1),
            ('boa noite', 'saudacao', 10, 1),
            -- Pedidos
            ('pedido', 'pedidos', 10, 1),
            ('status', 'pedidos', 10, 1),
            ('codigo', 'pedidos', 8, 1),
            ('entrega', 'pedidos', 7, 1),
            ('cancelar', 'pedidos', 9, 1),
            -- Produtos
            ('produto', 'produtos', 10, 1),
            ('cardapio', 'produtos', 10, 1),
            ('preco', 'produtos', 8, 1),
            ('valor', 'produtos', 8, 1),
            ('quanto custa', 'produtos', 9, 1),
            -- Pagamento
            ('pagamento', 'pagamento', 10, 1),
            ('pix', 'pagamento', 9, 1),
            ('cartao', 'pagamento', 9, 1),
            ('dinheiro', 'pagamento', 9, 1),
            ('forma de pagamento', 'pagamento', 10, 1),
            -- Horário
            ('horario', 'horario', 10, 1),
            ('funcionamento', 'horario', 10, 1),
            ('aberto', 'horario', 8, 1),
            ('fecha', 'horario', 8, 1),
            -- Contato
            ('telefone', 'contato', 10, 1),
            ('endereco', 'contato', 10, 1),
            ('whatsapp', 'contato', 10, 1),
            ('email', 'contato', 10, 1),
            ('localizacao', 'contato', 9, 1)
        `);
        console.log('✅ Palavras-chave do assistente criadas!');
    }

    // ============================================================
    // FAQ INICIAL
    // ============================================================
    if (tabelasInfo['assistente_faq']?.linhas_reais < 5) {
        console.log('📦 Criando FAQ inicial...');
        await connection.query(`
            INSERT IGNORE INTO assistente_faq (pergunta, resposta, categoria, tags, ativo, ordem_exibicao) VALUES 
            (
                'Como faço um pedido?',
                'É muito fácil! Navegue pelo nosso catálogo, escolha seus produtos favoritos, adicione ao carrinho e finalize o pedido. Você receberá uma confirmação por WhatsApp.',
                'pedidos',
                '["pedido", "como fazer", "comprar"]',
                1,
                1
            ),
            (
                'Quais formas de pagamento vocês aceitam?',
                'Aceitamos PIX, cartão de crédito/débito e dinheiro. No PIX o desconto é de 5%!',
                'pagamento',
                '["pagamento", "pix", "cartao", "dinheiro"]',
                1,
                2
            ),
            (
                'Qual o prazo de entrega?',
                'O prazo de entrega varia de 30 a 60 minutos, dependendo da sua localização. Você pode acompanhar o status do seu pedido em tempo real.',
                'pedidos',
                '["entrega", "prazo", "tempo"]',
                1,
                3
            ),
            (
                'Posso personalizar meus produtos?',
                'Sim! Oferecemos várias opções de personalização: sabores, tamanhos, coberturas e complementos. Basta selecionar na página do produto.',
                'produtos',
                '["personalizar", "customizar", "opcoes"]',
                1,
                4
            ),
            (
                'Como faço para consultar o status do meu pedido?',
                'Você pode consultar o status do seu pedido informando o código que recebeu. Digite seu código (exemplo: PED000001) que eu verifico para você!',
                'pedidos',
                '["status", "codigo", "acompanhar"]',
                1,
                5
            )
        `);
        console.log('✅ FAQ inicial criado!');
    }

    console.log('\n✅ População de dados concluída!');
}

// Executar script
mapearEPopularBanco();
