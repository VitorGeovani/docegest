import connection from './src/repository/connection.js';

async function verificarProdutos() {
    try {
        console.log('🔍 Verificando produtos no banco de dados...\n');

        // 1. Total de produtos
        const [totalProdutos] = await connection.query(
            'SELECT COUNT(*) as total FROM produto'
        );
        console.log(`📦 Total de produtos: ${totalProdutos[0].total}`);

        // 2. Produtos ativos
        const [produtosAtivos] = await connection.query(
            'SELECT COUNT(*) as total FROM produto WHERE ativo = 1'
        );
        console.log(`✅ Produtos ativos: ${produtosAtivos[0].total}`);

        // 3. Produtos inativos
        const [produtosInativos] = await connection.query(
            'SELECT COUNT(*) as total FROM produto WHERE ativo = 0 OR ativo IS NULL'
        );
        console.log(`❌ Produtos inativos: ${produtosInativos[0].total}`);

        // 4. Produtos com quantidade > 0
        const [produtosEstoque] = await connection.query(
            'SELECT COUNT(*) as total FROM produto WHERE quantidade > 0'
        );
        console.log(`📊 Produtos com estoque: ${produtosEstoque[0].total}`);

        // 5. Produtos ativos E com estoque
        const [produtosDisponiveis] = await connection.query(
            'SELECT COUNT(*) as total FROM produto WHERE ativo = 1 AND quantidade > 0'
        );
        console.log(`🎯 Produtos disponíveis (ativo=1 E estoque>0): ${produtosDisponiveis[0].total}\n`);

        // 6. Listar alguns produtos
        const [produtos] = await connection.query(`
            SELECT 
                idproduto,
                nome,
                preco,
                quantidade,
                ativo,
                idcategoria,
                img_Produto
            FROM produto
            LIMIT 10
        `);

        console.log('📋 Primeiros 10 produtos:');
        console.table(produtos.map(p => ({
            ID: p.idproduto,
            Nome: p.nome,
            Preço: `R$ ${p.preco.toFixed(2)}`,
            Qtd: p.quantidade,
            Ativo: p.ativo,
            Categoria: p.idcategoria,
            Imagem: p.img_Produto ? '✅' : '❌'
        })));

        // 7. Verificar categorias
        const [categorias] = await connection.query(
            'SELECT idcategoria, nome FROM categoria WHERE ativo = 1'
        );
        console.log('\n📂 Categorias ativas:');
        console.table(categorias);

        await connection.end();
        console.log('\n✅ Verificação concluída!');
    } catch (error) {
        console.error('❌ Erro:', error.message);
        await connection.end();
    }
}

verificarProdutos();
