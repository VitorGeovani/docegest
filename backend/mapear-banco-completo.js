/**
 * ============================================================================
 * SCRIPT DE MAPEAMENTO COMPLETO DO BANCO DE DADOS
 * Sistema: DoceGest v5.0
 * Propósito: Mapear todas as tabelas, views, procedures, triggers e dados
 * ============================================================================
 */

require('dotenv').config();
const mysql = require('mysql2/promise');

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'P@$$w0rd',
    database: process.env.DB_DATABASE || 'segredodosabor',
    multipleStatements: true
};

async function mapearBancoDados() {
    let connection;
    
    try {
        console.log('📊 INICIANDO MAPEAMENTO DO BANCO DE DADOS...\n');
        connection = await mysql.createConnection(dbConfig);
        
        // ============================================================
        // 1. LISTAR TODAS AS TABELAS
        // ============================================================
        console.log('📋 TABELAS:');
        console.log('='.repeat(80));
        
        const [tables] = await connection.query(`
            SELECT 
                TABLE_NAME,
                TABLE_ROWS,
                ROUND(DATA_LENGTH/1024, 2) AS 'Size_KB',
                TABLE_COMMENT
            FROM information_schema.TABLES
            WHERE TABLE_SCHEMA = ?
              AND TABLE_TYPE = 'BASE TABLE'
            ORDER BY TABLE_NAME
        `, [dbConfig.database]);
        
        console.log(`Total de tabelas: ${tables.length}\n`);
        tables.forEach((table, idx) => {
            console.log(`${idx + 1}. ${table.TABLE_NAME}`);
            console.log(`   Linhas: ${table.TABLE_ROWS || 0} | Tamanho: ${table.Size_KB || 0} KB`);
            console.log(`   Comentário: ${table.TABLE_COMMENT || 'N/A'}`);
            console.log();
        });
        
        // ============================================================
        // 2. LISTAR TODAS AS VIEWS
        // ============================================================
        console.log('\n📊 VIEWS:');
        console.log('='.repeat(80));
        
        const [views] = await connection.query(`
            SELECT 
                TABLE_NAME,
                VIEW_DEFINITION
            FROM information_schema.VIEWS
            WHERE TABLE_SCHEMA = ?
            ORDER BY TABLE_NAME
        `, [dbConfig.database]);
        
        console.log(`Total de views: ${views.length}\n`);
        views.forEach((view, idx) => {
            console.log(`${idx + 1}. ${view.TABLE_NAME}`);
        });
        
        // ============================================================
        // 3. LISTAR TODAS AS STORED PROCEDURES
        // ============================================================
        console.log('\n⚙️ STORED PROCEDURES:');
        console.log('='.repeat(80));
        
        const [procedures] = await connection.query(`
            SELECT 
                ROUTINE_NAME,
                ROUTINE_TYPE,
                DTD_IDENTIFIER,
                ROUTINE_COMMENT
            FROM information_schema.ROUTINES
            WHERE ROUTINE_SCHEMA = ?
              AND ROUTINE_TYPE = 'PROCEDURE'
            ORDER BY ROUTINE_NAME
        `, [dbConfig.database]);
        
        console.log(`Total de procedures: ${procedures.length}\n`);
        procedures.forEach((proc, idx) => {
            console.log(`${idx + 1}. ${proc.ROUTINE_NAME}`);
            console.log(`   Tipo: ${proc.ROUTINE_TYPE} | Returns: ${proc.DTD_IDENTIFIER || 'void'}`);
            if (proc.ROUTINE_COMMENT) {
                console.log(`   Comentário: ${proc.ROUTINE_COMMENT}`);
            }
            console.log();
        });
        
        // ============================================================
        // 4. LISTAR TODAS AS TRIGGERS
        // ============================================================
        console.log('\n🔄 TRIGGERS:');
        console.log('='.repeat(80));
        
        const [triggers] = await connection.query(`
            SELECT 
                TRIGGER_NAME,
                EVENT_MANIPULATION,
                EVENT_OBJECT_TABLE,
                ACTION_TIMING,
                ACTION_STATEMENT
            FROM information_schema.TRIGGERS
            WHERE TRIGGER_SCHEMA = ?
            ORDER BY TRIGGER_NAME
        `, [dbConfig.database]);
        
        console.log(`Total de triggers: ${triggers.length}\n`);
        triggers.forEach((trigger, idx) => {
            console.log(`${idx + 1}. ${trigger.TRIGGER_NAME}`);
            console.log(`   Tabela: ${trigger.EVENT_OBJECT_TABLE}`);
            console.log(`   Evento: ${trigger.ACTION_TIMING} ${trigger.EVENT_MANIPULATION}`);
            console.log();
        });
        
        // ============================================================
        // 5. VERIFICAR DADOS INSERIDOS (Categorias, Ingredientes, Configurações)
        // ============================================================
        console.log('\n📦 DADOS INICIAIS:');
        console.log('='.repeat(80));
        
        // Categorias
        const [categorias] = await connection.query('SELECT * FROM categoria ORDER BY idcategoria');
        console.log(`\n🏷️ CATEGORIAS (${categorias.length}):`);
        categorias.forEach(cat => {
            console.log(`   ${cat.idcategoria}. ${cat.nome} - ${cat.descricao || 'N/A'}`);
        });
        
        // Ingredientes
        const [ingredientes] = await connection.query('SELECT * FROM ingrediente ORDER BY idingrediente');
        console.log(`\n🥚 INGREDIENTES (${ingredientes.length}):`);
        ingredientes.slice(0, 10).forEach(ing => {
            console.log(`   ${ing.idingrediente}. ${ing.nome} (${ing.unidade_medida}) - R$ ${ing.preco_unitario}`);
        });
        if (ingredientes.length > 10) {
            console.log(`   ... e mais ${ingredientes.length - 10} ingredientes`);
        }
        
        // Configurações
        const [configs] = await connection.query('SELECT * FROM configuracao ORDER BY chave');
        console.log(`\n⚙️ CONFIGURAÇÕES (${configs.length}):`);
        configs.forEach(cfg => {
            console.log(`   ${cfg.chave}: ${cfg.valor} (${cfg.tipo})`);
        });
        
        // Custos Indiretos
        const [custos] = await connection.query('SELECT * FROM custo_indireto ORDER BY idcusto');
        console.log(`\n💰 CUSTOS INDIRETOS (${custos.length}):`);
        custos.forEach(custo => {
            console.log(`   ${custo.tipo}: R$ ${custo.valor_mensal}`);
        });
        
        // ============================================================
        // 6. RESUMO ESTATÍSTICO
        // ============================================================
        console.log('\n\n📈 RESUMO ESTATÍSTICO:');
        console.log('='.repeat(80));
        
        const [dbSize] = await connection.query(`
            SELECT 
                ROUND(SUM(DATA_LENGTH + INDEX_LENGTH)/1024/1024, 2) AS 'Size_MB'
            FROM information_schema.TABLES
            WHERE TABLE_SCHEMA = ?
        `, [dbConfig.database]);
        
        console.log(`\n📊 ESTATÍSTICAS GERAIS:`);
        console.log(`   Banco de dados: ${dbConfig.database}`);
        console.log(`   Tamanho total: ${dbSize[0].Size_MB || 0} MB`);
        console.log(`   Total de tabelas: ${tables.length}`);
        console.log(`   Total de views: ${views.length}`);
        console.log(`   Total de procedures: ${procedures.length}`);
        console.log(`   Total de triggers: ${triggers.length}`);
        console.log(`   Total de categorias: ${categorias.length}`);
        console.log(`   Total de ingredientes: ${ingredientes.length}`);
        console.log(`   Total de configurações: ${configs.length}`);
        console.log(`   Total de custos indiretos: ${custos.length}`);
        
        // ============================================================
        // 7. VERIFICAR TABELAS NOVAS (V5.0)
        // ============================================================
        console.log('\n\n🆕 TABELAS NOVAS DA VERSÃO 5.0:');
        console.log('='.repeat(80));
        
        const tabelasNovas = [
            'produto_opcoes_personalizacao',
            'opcao_valores',
            'produto_opcao_associacao',
            'pedido_personalizacoes',
            'personalizacao_ingrediente',
            'cliente_preferencias',
            'cliente_preferencias_historico',
            'assistente_interacoes',
            'assistente_intencoes_customizadas',
            'assistente_palavras_chave',
            'assistente_sessoes',
            'assistente_faq',
            'assistente_feedback',
            'tb_mensagens_whatsapp',
            'tb_whatsapp_webhooks',
            'tb_whatsapp_bot_config',
            'tb_whatsapp_comandos',
            'tb_whatsapp_estatisticas'
        ];
        
        const tabelasExistentes = tables.map(t => t.TABLE_NAME);
        
        console.log('\n✅ Tabelas V5.0 PRESENTES:');
        let presentCount = 0;
        tabelasNovas.forEach(tabela => {
            if (tabelasExistentes.includes(tabela)) {
                console.log(`   ✓ ${tabela}`);
                presentCount++;
            }
        });
        
        console.log('\n❌ Tabelas V5.0 AUSENTES:');
        let ausentes = 0;
        tabelasNovas.forEach(tabela => {
            if (!tabelasExistentes.includes(tabela)) {
                console.log(`   ✗ ${tabela}`);
                ausentes++;
            }
        });
        
        console.log(`\n📊 Progresso V5.0: ${presentCount}/${tabelasNovas.length} tabelas (${Math.round(presentCount/tabelasNovas.length*100)}%)`);
        
        // ============================================================
        // 8. RETORNAR DADOS PARA GERAÇÃO DE SQL
        // ============================================================
        return {
            tables,
            views,
            procedures,
            triggers,
            categorias,
            ingredientes,
            configs,
            custos,
            dbSize: dbSize[0].Size_MB,
            tabelasNovasPresentes: presentCount,
            tabelasNovasTotal: tabelasNovas.length
        };
        
    } catch (error) {
        console.error('❌ ERRO:', error.message);
        throw error;
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Executar mapeamento
if (require.main === module) {
    mapearBancoDados()
        .then(dados => {
            console.log('\n✅ MAPEAMENTO CONCLUÍDO COM SUCESSO!\n');
            process.exit(0);
        })
        .catch(error => {
            console.error('\n❌ ERRO NO MAPEAMENTO:', error.message);
            process.exit(1);
        });
}

module.exports = { mapearBancoDados };
