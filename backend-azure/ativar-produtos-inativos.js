import connection from './src/repository/connection.js';

async function ativarProdutosInativos() {
    try {
        console.log('🔧 Ativando produtos inativos...\n');

        // Verificar produtos inativos
        const [produtosInativos] = await connection.query(`
            SELECT idproduto, nome, ativo 
            FROM produto 
            WHERE ativo IS NULL OR ativo = 0
        `);

        if (produtosInativos.length === 0) {
            console.log('✅ Nenhum produto inativo encontrado!');
            console.log('   Todos os produtos já estão com ativo = 1\n');
            process.exit(0);
        }

        console.log(`📋 ${produtosInativos.length} produto(s) inativo(s) encontrado(s):\n`);
        produtosInativos.forEach(p => {
            console.log(`   ID: ${p.idproduto} | Nome: ${p.nome} | Ativo: ${p.ativo}`);
        });

        console.log('\n🔄 Ativando todos os produtos...\n');

        // Ativar todos os produtos inativos
        const [result] = await connection.query(`
            UPDATE produto 
            SET ativo = 1 
            WHERE ativo IS NULL OR ativo = 0
        `);

        console.log(`✅ ${result.affectedRows} produto(s) ativado(s) com sucesso!`);
        console.log('\n💡 Agora todos os produtos devem aparecer no Estoque.');
        
        process.exit(0);

    } catch (error) {
        console.error('❌ Erro ao ativar produtos:', error);
        process.exit(1);
    }
}

ativarProdutosInativos();
