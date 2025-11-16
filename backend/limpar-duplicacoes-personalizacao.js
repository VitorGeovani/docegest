import mysql from 'mysql2/promise';

async function limparDuplicacoes() {
    const conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'P@$$w0rd',
        database: 'segredodosabor',
        multipleStatements: true
    });

    try {
        console.log('\n========================================');
        console.log('🧹 LIMPANDO DUPLICAÇÕES');
        console.log('========================================\n');

        await conn.beginTransaction();

        // 1. REMOVER VALORES INDISPONÍVEIS
        console.log('1️⃣ Removendo valores marcados como indisponíveis (disponivel=0)...');
        const [resultIndisponiveis] = await conn.query(`
            DELETE FROM opcao_valores
            WHERE disponivel = 0
        `);
        console.log(`   ✅ ${resultIndisponiveis.affectedRows} valores indisponíveis removidos\n`);

        // 2. IDENTIFICAR E MANTER APENAS UMA CÓPIA DE CADA OPÇÃO
        console.log('2️⃣ Removendo opções duplicadas (mantendo a mais antiga)...');
        
        // Buscar opções duplicadas
        const [opcoesDup] = await conn.query(`
            SELECT nome_opcao, MIN(idopcao) as id_manter, COUNT(*) as total
            FROM produto_opcoes_personalizacao
            WHERE ativo = 1
            GROUP BY nome_opcao
            HAVING COUNT(*) > 1
        `);

        let totalOpcoesRemovidas = 0;
        for (const opcao of opcoesDup) {
            console.log(`   📋 ${opcao.nome_opcao}: mantendo ID ${opcao.id_manter}, removendo ${opcao.total - 1} duplicata(s)`);
            
            // Remover vínculos das opções duplicadas
            await conn.query(`
                DELETE FROM produto_opcao_associacao
                WHERE idopcao_fk IN (
                    SELECT idopcao FROM produto_opcoes_personalizacao
                    WHERE nome_opcao = ? AND idopcao != ?
                )
            `, [opcao.nome_opcao, opcao.id_manter]);

            // Remover valores das opções duplicadas
            await conn.query(`
                DELETE v FROM opcao_valores v
                INNER JOIN produto_opcoes_personalizacao o ON v.idopcao_fk = o.idopcao
                WHERE o.nome_opcao = ? AND o.idopcao != ?
            `, [opcao.nome_opcao, opcao.id_manter]);

            // Remover as opções duplicadas
            const [resultOpcoes] = await conn.query(`
                DELETE FROM produto_opcoes_personalizacao
                WHERE nome_opcao = ? AND idopcao != ?
            `, [opcao.nome_opcao, opcao.id_manter]);
            
            totalOpcoesRemovidas += resultOpcoes.affectedRows;
        }
        console.log(`   ✅ ${totalOpcoesRemovidas} opções duplicadas removidas\n`);

        // 3. REMOVER VALORES DUPLICADOS DENTRO DE CADA OPÇÃO
        console.log('3️⃣ Removendo valores duplicados (mantendo o mais antigo de cada)...');
        
        const [valoresDup] = await conn.query(`
            SELECT 
                v.idopcao_fk,
                o.nome_opcao,
                v.nome_valor,
                MIN(v.idvalor) as id_manter,
                COUNT(*) as total,
                GROUP_CONCAT(v.idvalor ORDER BY v.idvalor) as todos_ids
            FROM opcao_valores v
            INNER JOIN produto_opcoes_personalizacao o ON v.idopcao_fk = o.idopcao
            WHERE v.disponivel = 1 AND o.ativo = 1
            GROUP BY v.idopcao_fk, v.nome_valor
            HAVING COUNT(*) > 1
        `);

        let totalValoresRemovidos = 0;
        for (const valor of valoresDup) {
            console.log(`   📝 ${valor.nome_opcao} → ${valor.nome_valor}`);
            console.log(`      Mantendo ID ${valor.id_manter}, removendo ${valor.total - 1} duplicata(s)`);
            console.log(`      IDs duplicados: ${valor.todos_ids}`);

            // Remover vínculos ingredientes dos valores duplicados
            await conn.query(`
                DELETE FROM personalizacao_ingrediente
                WHERE idvalor_fk IN (
                    SELECT idvalor FROM opcao_valores
                    WHERE idopcao_fk = ? AND nome_valor = ? AND idvalor != ?
                )
            `, [valor.idopcao_fk, valor.nome_valor, valor.id_manter]);

            // Remover valores duplicados
            const [resultValores] = await conn.query(`
                DELETE FROM opcao_valores
                WHERE idopcao_fk = ? AND nome_valor = ? AND idvalor != ?
            `, [valor.idopcao_fk, valor.nome_valor, valor.id_manter]);
            
            totalValoresRemovidos += resultValores.affectedRows;
        }
        console.log(`   ✅ ${totalValoresRemovidos} valores duplicados removidos\n`);

        // 4. VERIFICAR RESULTADO
        console.log('4️⃣ Verificando resultado da limpeza...\n');
        
        const [opcoesFinais] = await conn.query(`
            SELECT 
                o.idopcao,
                o.nome_opcao,
                o.tipo_selecao,
                COUNT(DISTINCT v.idvalor) as qtd_valores
            FROM produto_opcoes_personalizacao o
            LEFT JOIN opcao_valores v ON o.idopcao = v.idopcao_fk AND v.disponivel = 1
            WHERE o.ativo = 1
            GROUP BY o.idopcao
            ORDER BY o.nome_opcao
        `);

        console.log('   📊 Opções restantes (sem duplicatas):');
        console.table(opcoesFinais);

        // Verificar se ainda há duplicações
        const [dupCheck] = await conn.query(`
            SELECT nome_opcao, COUNT(*) as qtd
            FROM produto_opcoes_personalizacao
            WHERE ativo = 1
            GROUP BY nome_opcao
            HAVING COUNT(*) > 1
        `);

        if (dupCheck.length > 0) {
            console.log('\n   ⚠️  ATENÇÃO: Ainda há opções duplicadas!');
            console.table(dupCheck);
        } else {
            console.log('\n   ✅ Nenhuma duplicação de opções encontrada!');
        }

        const [valDupCheck] = await conn.query(`
            SELECT 
                o.nome_opcao,
                v.nome_valor,
                COUNT(*) as qtd
            FROM opcao_valores v
            INNER JOIN produto_opcoes_personalizacao o ON v.idopcao_fk = o.idopcao
            WHERE v.disponivel = 1 AND o.ativo = 1
            GROUP BY o.idopcao, v.nome_valor
            HAVING COUNT(*) > 1
        `);

        if (valDupCheck.length > 0) {
            console.log('\n   ⚠️  ATENÇÃO: Ainda há valores duplicados!');
            console.table(valDupCheck);
        } else {
            console.log('   ✅ Nenhuma duplicação de valores encontrada!\n');
        }

        await conn.commit();

        console.log('========================================');
        console.log('✅ LIMPEZA CONCLUÍDA COM SUCESSO!');
        console.log('========================================\n');

        console.log('📝 Resumo:');
        console.log(`   - ${resultIndisponiveis.affectedRows} valores indisponíveis removidos`);
        console.log(`   - ${totalOpcoesRemovidas} opções duplicadas removidas`);
        console.log(`   - ${totalValoresRemovidos} valores duplicados removidos`);
        console.log(`   - ${opcoesFinais.length} opções únicas restantes\n`);

        console.log('🎉 Agora cada item aparecerá apenas UMA vez!');
        console.log('🔄 Recarregue o frontend para ver as mudanças.\n');

    } catch (error) {
        await conn.rollback();
        console.error('\n❌ Erro durante limpeza:', error.message);
        console.error('   Todas as alterações foram revertidas (rollback).\n');
    } finally {
        await conn.end();
    }
}

limparDuplicacoes();
