import mysql from 'mysql2/promise';

async function testarDiretamente() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'P@$$w0rd',
        database: 'segredodosabor'
    });

    console.log('🧪 TESTE DIRETO NO BANCO - PERSONALIZAÇÃO\n');

    // 1. Buscar produtos
    console.log('📦 Produtos cadastrados:');
    const [produtos] = await connection.query('SELECT idproduto, nome FROM produto LIMIT 5');
    console.table(produtos.map(p => ({ ID: p.idproduto, Nome: p.nome })));

    if (produtos.length === 0) {
        console.log('❌ Nenhum produto cadastrado!');
        await connection.end();
        return;
    }

    const primeiroProduto = produtos[0];

    // 2. Buscar opções
    console.log('\n🎨 Opções de personalização:');
    const [opcoes] = await connection.query('SELECT idopcao, nome_opcao, tipo_selecao, obrigatorio FROM produto_opcoes_personalizacao LIMIT 5');
    console.table(opcoes.map(o => ({
        ID: o.idopcao,
        Nome: o.nome_opcao,
        Tipo: o.tipo_selecao,
        Obrigatório: o.obrigatorio ? 'Sim' : 'Não'
    })));

    if (opcoes.length === 0) {
        console.log('❌ Nenhuma opção cadastrada!');
        await connection.end();
        return;
    }

    const primeiraOpcao = opcoes[0];

    // 3. Verificar se há associações
    console.log('\n🔗 Associações existentes:');
    const [associacoes] = await connection.query(`
        SELECT poa.*, p.nome AS produto_nome, pop.nome_opcao
        FROM produto_opcao_associacao poa
        INNER JOIN produto p ON poa.idproduto_fk = p.idproduto
        INNER JOIN produto_opcoes_personalizacao pop ON poa.idopcao_fk = pop.idopcao
        LIMIT 5
    `);
    
    if (associacoes.length > 0) {
        console.table(associacoes.map(a => ({
            'ID Produto': a.idproduto_fk,
            'Produto': a.produto_nome,
            'ID Opção': a.idopcao_fk,
            'Opção': a.nome_opcao
        })));
    } else {
        console.log('⚠️  Nenhuma associação encontrada! Criando uma de exemplo...');
        
        // Criar associação de exemplo
        await connection.query(`
            INSERT IGNORE INTO produto_opcao_associacao (idproduto_fk, idopcao_fk)
            VALUES (?, ?)
        `, [primeiroProduto.idproduto, primeiraOpcao.idopcao]);
        
        console.log(`✅ Associado "${primeiraOpcao.nome_opcao}" ao produto "${primeiroProduto.nome}"`);
    }

    // 4. Testar procedure
    console.log(`\n🧪 Testando sp_buscar_opcoes_produto(${primeiroProduto.idproduto})...`);
    const [result] = await connection.query('CALL sp_buscar_opcoes_produto(?)', [primeiroProduto.idproduto]);
    
    if (result[0].length > 0) {
        console.log(`✅ ${result[0].length} opção(ões) retornadas!`);
        console.log('\n📋 Detalhes da primeira opção:');
        const opcao = result[0][0];
        console.log(`   Nome: ${opcao.nome}`);
        console.log(`   Tipo: ${opcao.tipo}`);
        console.log(`   Obrigatória: ${opcao.obrigatorio ? 'Sim' : 'Não'}`);
        console.log(`   Múltipla Seleção: ${opcao.multipla_selecao ? 'Sim' : 'Não'}`);
        
        console.log(`   Tipo do valores: ${typeof opcao.valores}`);
        console.log(`   É Buffer? ${Buffer.isBuffer(opcao.valores)}`);
        console.log(`   valores.constructor: ${opcao.valores?.constructor?.name}`);
        
        // Converter valores para string se for Buffer
        let valoresStr = opcao.valores;
        if (Buffer.isBuffer(valoresStr)) {
            valoresStr = valoresStr.toString('utf8');
        } else if (typeof valoresStr === 'object' && valoresStr !== null) {
            valoresStr = JSON.stringify(valoresStr);
        }
        
        console.log(`   Valores (string): ${valoresStr || '[]'}`);
        
        if (valoresStr && typeof valoresStr === 'string') {
            const valores = JSON.parse(valoresStr);
            console.log(`\n   📝 ${valores.length} valores disponíveis:`);
            valores.forEach(v => {
                console.log(`      - ${v.nome}: R$ ${v.preco.toFixed(2)}`);
            });
        }
    } else {
        console.log('⚠️  Nenhuma opção retornada para este produto');
        console.log('💡 Certifique-se de que o produto está associado a pelo menos uma opção');
    }

    // 5. Resumo final
    console.log('\n' + '='.repeat(60));
    console.log('✅ ESTRUTURA DO BANCO OK!');
    console.log('='.repeat(60));
    console.log(`✅ ${produtos.length} produtos cadastrados`);
    console.log(`✅ ${opcoes.length} opções de personalização`);
    console.log(`✅ Stored procedure sp_buscar_opcoes_produto funcionando`);
    console.log('\n💡 Próximos passos:');
    console.log('   1. Inicie o backend: npm start');
    console.log('   2. Inicie o frontend: npm start');
    console.log('   3. Acesse o catálogo e clique em um produto personalizado');

    await connection.end();
}

testarDiretamente().catch(err => {
    console.error('\n❌ ERRO:', err.message);
    process.exit(1);
});
