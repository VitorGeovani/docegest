import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuração do banco
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'P@$$w0rd',
    database: 'segredodosabor',
    multipleStatements: true
};

async function executarMigracaoPersonalizacaoIngredientes() {
    let connection;
    
    try {
        console.log('🔄 Conectando ao banco de dados...');
        connection = await mysql.createConnection(dbConfig);
        console.log('✅ Conectado com sucesso!\n');

        // Ler arquivo SQL
        const sqlPath = path.join(__dirname, '..', 'vincular-personalizacao-ingredientes.sql');
        
        if (!fs.existsSync(sqlPath)) {
            throw new Error(`Arquivo SQL não encontrado: ${sqlPath}`);
        }

        console.log('📄 Lendo arquivo SQL...');
        const sqlContent = fs.readFileSync(sqlPath, 'utf8');
        console.log(`✅ Arquivo carregado: ${(sqlContent.length / 1024).toFixed(2)} KB\n`);

        // Executar SQL
        console.log('🔄 Executando migração...\n');
        console.log('=' .repeat(70));
        
        const [results] = await connection.query(sqlContent);
        
        console.log('=' .repeat(70));
        console.log('\n✅ MIGRAÇÃO CONCLUÍDA COM SUCESSO!\n');
        
        // Verificar tabelas criadas
        console.log('📋 Verificando estrutura criada...\n');
        
        // 1. Verificar tabela
        const [tableCheck] = await connection.query(`
            SELECT COUNT(*) as total 
            FROM information_schema.tables 
            WHERE table_schema = 'db_segredo_do_sabor' 
            AND table_name = 'personalizacao_ingrediente'
        `);
        console.log(`   ✅ Tabela personalizacao_ingrediente: ${tableCheck[0].total > 0 ? 'OK' : 'ERRO'}`);
        
        // 2. Verificar views
        const [viewCheck1] = await connection.query(`
            SELECT COUNT(*) as total 
            FROM information_schema.views 
            WHERE table_schema = 'db_segredo_do_sabor' 
            AND table_name = 'vw_personalizacao_com_ingredientes'
        `);
        console.log(`   ✅ View vw_personalizacao_com_ingredientes: ${viewCheck1[0].total > 0 ? 'OK' : 'ERRO'}`);
        
        const [viewCheck2] = await connection.query(`
            SELECT COUNT(*) as total 
            FROM information_schema.views 
            WHERE table_schema = 'db_segredo_do_sabor' 
            AND table_name = 'vw_disponibilidade_personalizacao'
        `);
        console.log(`   ✅ View vw_disponibilidade_personalizacao: ${viewCheck2[0].total > 0 ? 'OK' : 'ERRO'}`);
        
        // 3. Verificar dados inseridos
        const [dataCheck] = await connection.query(`
            SELECT COUNT(*) as total FROM personalizacao_ingrediente
        `);
        console.log(`   ✅ Vínculos inseridos: ${dataCheck[0].total} registros\n`);
        
        // Mostrar alguns exemplos
        const [examples] = await connection.query(`
            SELECT 
                o.nome_opcao,
                v.nome_valor,
                i.nome AS ingrediente,
                pi.quantidade_usada,
                i.unidade_medida
            FROM personalizacao_ingrediente pi
            INNER JOIN opcao_valores v ON pi.idvalor_fk = v.idvalor
            INNER JOIN produto_opcoes_personalizacao o ON v.idopcao_fk = o.idopcao
            INNER JOIN ingrediente i ON pi.idingrediente_fk = i.idingrediente
            LIMIT 10
        `);
        
        if (examples.length > 0) {
            console.log('📊 Exemplos de vínculos criados:');
            console.log('=' .repeat(70));
            examples.forEach(ex => {
                console.log(`   ${ex.nome_opcao} → ${ex.nome_valor}`);
                console.log(`   └─ ${ex.ingrediente}: ${ex.quantidade_usada} ${ex.unidade_medida}`);
            });
            console.log('=' .repeat(70) + '\n');
        }
        
        console.log('✨ Próximos passos:');
        console.log('   1. Iniciar o backend: npm start');
        console.log('   2. Testar endpoints: node testar-personalizacao-estoque.js');
        console.log('   3. Verificar frontend no navegador\n');

    } catch (error) {
        console.error('\n❌ ERRO NA MIGRAÇÃO:');
        console.error(error.message);
        
        if (error.sql) {
            console.error('\nSQL que causou erro:');
            console.error(error.sql.substring(0, 200) + '...');
        }
        
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
            console.log('🔌 Conexão fechada.\n');
        }
    }
}

// Executar
console.log('\n' + '='.repeat(70));
console.log('🎨 MIGRAÇÃO: PERSONALIZAÇÃO COM INGREDIENTES');
console.log('='.repeat(70) + '\n');

executarMigracaoPersonalizacaoIngredientes();
