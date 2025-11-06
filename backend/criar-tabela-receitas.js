import connection from './src/repository/connection.js';

async function criarTabelaReceitas() {
    try {
        console.log('🔧 Criando tabela produto_ingrediente...');

        // Criar tabela produto_ingrediente (receita)
        const criarTabela = `
            CREATE TABLE IF NOT EXISTS produto_ingrediente (
                idproduto_ingrediente INT PRIMARY KEY AUTO_INCREMENT,
                idproduto INT NOT NULL,
                idingrediente INT NOT NULL,
                quantidade DECIMAL(10,3) NOT NULL COMMENT 'Quantidade do ingrediente necessária',
                unidade_medida VARCHAR(20) NOT NULL COMMENT 'kg, g, L, ml, unidade',
                custo DECIMAL(10,2) DEFAULT 0 COMMENT 'Custo do ingrediente nesta receita',
                data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                
                FOREIGN KEY (idproduto) REFERENCES produto(idproduto) ON DELETE CASCADE,
                FOREIGN KEY (idingrediente) REFERENCES ingrediente(idingrediente),
                
                UNIQUE KEY unique_produto_ingrediente (idproduto, idingrediente)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `;

        await connection.query(criarTabela);
        console.log('✅ Tabela produto_ingrediente criada com sucesso!');

        // Verificar se a tabela foi criada
        const [tabelas] = await connection.query(`
            SHOW TABLES LIKE 'produto_ingrediente'
        `);

        if (tabelas.length > 0) {
            console.log('✅ Verificação: Tabela produto_ingrediente existe no banco de dados');
            
            // Mostrar estrutura da tabela
            const [colunas] = await connection.query(`
                DESCRIBE produto_ingrediente
            `);
            
            console.log('\n📋 Estrutura da tabela produto_ingrediente:');
            console.table(colunas);
        }

        console.log('\n🎉 Migração concluída com sucesso!');
        console.log('\n💡 Agora você pode:');
        console.log('   - Adicionar ingredientes às receitas de produtos');
        console.log('   - Dar baixa automática no estoque de ingredientes');
        console.log('   - Calcular custos de produção automaticamente');

    } catch (error) {
        console.error('❌ Erro ao criar tabela:', error.message);
        throw error;
    } finally {
        await connection.end();
    }
}

// Executar
criarTabelaReceitas();
