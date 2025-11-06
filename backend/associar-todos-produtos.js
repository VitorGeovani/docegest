import mysql from 'mysql2/promise';

async function associarTodosProdutos() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'P@$$w0rd',
        database: 'segredodosabor'
    });

    console.log('🔗 ASSOCIANDO TODOS OS PRODUTOS ÀS OPÇÕES\n');

    // 1. Buscar todos os produtos ativos
    const [produtos] = await connection.query(`
        SELECT idproduto, nome 
        FROM produto 
        WHERE ativo = 1 
        ORDER BY nome
    `);

    console.log(`📦 ${produtos.length} produtos ativos encontrados\n`);

    // 2. Buscar opções disponíveis
    const [opcoes] = await connection.query(`
        SELECT idopcao, nome_opcao, tipo_selecao
        FROM produto_opcoes_personalizacao
        WHERE ativo = 1
        ORDER BY ordem_exibicao
    `);

    console.log(`🎨 ${opcoes.length} opções disponíveis:\n`);
    opcoes.forEach(o => {
        console.log(`   ${o.idopcao}. ${o.nome_opcao} (${o.tipo_selecao})`);
    });

    // 3. Associar cada produto a TODAS as opções
    console.log('\n🔄 Criando associações...\n');

    let totalCriadas = 0;
    let totalExistentes = 0;

    for (const produto of produtos) {
        console.log(`\n📍 ${produto.nome} (ID: ${produto.idproduto})`);
        
        for (const opcao of opcoes) {
            try {
                await connection.query(`
                    INSERT INTO produto_opcao_associacao (idproduto_fk, idopcao_fk)
                    VALUES (?, ?)
                `, [produto.idproduto, opcao.idopcao]);
                
                console.log(`   ✅ Associado: ${opcao.nome_opcao}`);
                totalCriadas++;
            } catch (error) {
                if (error.code === 'ER_DUP_ENTRY') {
                    console.log(`   ⚠️  Já existe: ${opcao.nome_opcao}`);
                    totalExistentes++;
                } else {
                    console.error(`   ❌ Erro: ${error.message}`);
                }
            }
        }
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ PROCESSO CONCLUÍDO!');
    console.log('='.repeat(60));
    console.log(`📊 Estatísticas:`);
    console.log(`   - Produtos processados: ${produtos.length}`);
    console.log(`   - Opções disponíveis: ${opcoes.length}`);
    console.log(`   - Associações criadas: ${totalCriadas}`);
    console.log(`   - Associações existentes: ${totalExistentes}`);
    console.log(`   - Total de associações: ${totalCriadas + totalExistentes}`);

    // 4. Verificar alguns produtos específicos
    console.log('\n🔍 Verificando produtos específicos:\n');

    const produtosTestar = ['Ferrero Rocher', 'Ovomaltine', 'Kinder Bueno'];
    
    for (const nomeProduto of produtosTestar) {
        const [result] = await connection.query(`
            SELECT p.idproduto, p.nome, COUNT(poa.idopcao_fk) as total_opcoes
            FROM produto p
            LEFT JOIN produto_opcao_associacao poa ON p.idproduto = poa.idproduto_fk
            WHERE p.nome = ?
            GROUP BY p.idproduto
        `, [nomeProduto]);

        if (result.length > 0) {
            const prod = result[0];
            console.log(`   ${prod.nome} (ID: ${prod.idproduto}): ${prod.total_opcoes} opções`);
            
            // Testar procedure
            const [opcoesProduto] = await connection.query('CALL sp_buscar_opcoes_produto(?)', [prod.idproduto]);
            console.log(`      ✅ Procedure retorna: ${opcoesProduto[0].length} opções\n`);
        }
    }

    console.log('\n💡 Próximo passo:');
    console.log('   1. Reinicie o frontend (Ctrl+C e npm start)');
    console.log('   2. Abra o console (F12)');
    console.log('   3. Clique em qualquer produto');
    console.log('   4. Veja o log: "Produto X tem personalização: true"');
    console.log('   5. O modal deve aparecer! 🎉\n');

    await connection.end();
}

associarTodosProdutos().catch(err => {
    console.error('❌ ERRO:', err.message);
    process.exit(1);
});
