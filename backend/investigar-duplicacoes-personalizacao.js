import mysql from 'mysql2/promise';

async function investigarDuplicacoes() {
    const conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'P@$$w0rd',
        database: 'segredodosabor'
    });

    try {
        console.log('\n========================================');
        console.log('🔍 INVESTIGANDO DUPLICAÇÕES');
        console.log('========================================\n');

        // 1. Verificar opções duplicadas
        console.log('1️⃣ Opções duplicadas (mesmo nome):');
        const [opcoesDuplicadas] = await conn.query(`
            SELECT nome_opcao, COUNT(*) as qtd
            FROM produto_opcoes_personalizacao
            WHERE ativo = 1
            GROUP BY nome_opcao
            HAVING COUNT(*) > 1
            ORDER BY qtd DESC
        `);
        
        if (opcoesDuplicadas.length > 0) {
            console.table(opcoesDuplicadas);
        } else {
            console.log('   ✅ Nenhuma opção duplicada\n');
        }

        // 2. Verificar valores duplicados por opção
        console.log('2️⃣ Valores duplicados dentro de cada opção:');
        const [valoresDuplicados] = await conn.query(`
            SELECT 
                o.nome_opcao,
                v.nome_valor,
                COUNT(*) as qtd,
                GROUP_CONCAT(v.idvalor) as ids,
                GROUP_CONCAT(v.preco_adicional) as precos
            FROM opcao_valores v
            INNER JOIN produto_opcoes_personalizacao o ON v.idopcao_fk = o.idopcao
            WHERE v.disponivel = 1 AND o.ativo = 1
            GROUP BY o.nome_opcao, v.nome_valor
            HAVING COUNT(*) > 1
            ORDER BY o.nome_opcao, qtd DESC
        `);

        if (valoresDuplicados.length > 0) {
            console.log('\n   ❌ Valores duplicados encontrados:\n');
            valoresDuplicados.forEach(dup => {
                console.log(`   📋 ${dup.nome_opcao} → ${dup.nome_valor}`);
                console.log(`      Quantidade: ${dup.qtd} duplicatas`);
                console.log(`      IDs: ${dup.ids}`);
                console.log(`      Preços: R$ ${dup.precos}`);
                console.log('');
            });
        } else {
            console.log('   ✅ Nenhum valor duplicado\n');
        }

        // 3. Verificar vínculos duplicados produto-opção
        console.log('3️⃣ Vínculos produto-opção duplicados:');
        const [vinculosDuplicados] = await conn.query(`
            SELECT 
                p.nome as produto,
                o.nome_opcao,
                COUNT(*) as qtd,
                GROUP_CONCAT(poa.id) as ids_vinculo
            FROM produto_opcao_associacao poa
            INNER JOIN produto p ON poa.idproduto_fk = p.idproduto
            INNER JOIN produto_opcoes_personalizacao o ON poa.idopcao_fk = o.idopcao
            WHERE p.ativo = 1 AND o.ativo = 1
            GROUP BY p.idproduto, o.idopcao
            HAVING COUNT(*) > 1
        `);

        if (vinculosDuplicados.length > 0) {
            console.log('\n   ❌ Vínculos duplicados encontrados:\n');
            console.table(vinculosDuplicados);
        } else {
            console.log('   ✅ Nenhum vínculo duplicado\n');
        }

        // 4. Mostrar detalhes do Brigadeiro especificamente
        console.log('4️⃣ Detalhes específicos de "Brigadeiro":');
        const [brigadeiros] = await conn.query(`
            SELECT 
                v.idvalor,
                v.idopcao_fk,
                o.nome_opcao,
                v.nome_valor,
                v.preco_adicional,
                v.disponivel,
                v.ordem_exibicao,
                COUNT(pi.id) as qtd_ingredientes
            FROM opcao_valores v
            INNER JOIN produto_opcoes_personalizacao o ON v.idopcao_fk = o.idopcao
            LEFT JOIN personalizacao_ingrediente pi ON v.idvalor = pi.idvalor_fk
            WHERE v.nome_valor LIKE '%Brigadeiro%'
            GROUP BY v.idvalor
            ORDER BY v.idopcao_fk, v.ordem_exibicao
        `);

        if (brigadeiros.length > 0) {
            console.log('\n   📊 Todos os "Brigadeiros" no banco:\n');
            console.table(brigadeiros);
        }

        // 5. Verificar se há opções antigas da tabela personalizacao_produto
        console.log('5️⃣ Verificando tabela antiga personalizacao_produto:');
        const [tabelaAntiga] = await conn.query(`
            SELECT COUNT(*) as total
            FROM personalizacao_produto
        `);
        
        if (tabelaAntiga[0].total > 0) {
            console.log(`   ⚠️  Encontrados ${tabelaAntiga[0].total} registros na tabela antiga personalizacao_produto`);
            console.log('   Esta tabela pode estar causando conflito!\n');
        } else {
            console.log('   ✅ Tabela antiga vazia\n');
        }

        console.log('========================================');
        console.log('✅ INVESTIGAÇÃO CONCLUÍDA');
        console.log('========================================\n');

    } catch (error) {
        console.error('\n❌ Erro:', error.message);
    } finally {
        await conn.end();
    }
}

investigarDuplicacoes();
