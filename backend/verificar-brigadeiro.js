import mysql from 'mysql2/promise';

async function verificarBrigadeiro() {
    const conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'P@$$w0rd',
        database: 'segredodosabor'
    });

    try {
        console.log('\n========================================');
        console.log('🔍 VERIFICANDO BRIGADEIRO');
        console.log('========================================\n');

        // Verificar Brigadeiro
        const [brigadeiros] = await conn.query(`
            SELECT 
                v.idvalor,
                o.idopcao,
                o.nome_opcao,
                v.nome_valor,
                v.preco_adicional,
                v.disponivel,
                v.ordem_exibicao,
                COUNT(pi.id) as qtd_ingredientes,
                GROUP_CONCAT(i.nome) as ingredientes
            FROM opcao_valores v
            INNER JOIN produto_opcoes_personalizacao o ON v.idopcao_fk = o.idopcao
            LEFT JOIN personalizacao_ingrediente pi ON v.idvalor = pi.idvalor_fk
            LEFT JOIN ingrediente i ON pi.idingrediente_fk = i.idingrediente
            WHERE v.nome_valor = 'Brigadeiro'
            GROUP BY v.idvalor
        `);

        console.log('📊 Status do Brigadeiro:');
        console.table(brigadeiros);

        if (brigadeiros.length === 0) {
            console.log('❌ Brigadeiro não encontrado!');
        } else if (brigadeiros.length > 1) {
            console.log('\n⚠️  ATENÇÃO: Ainda há múltiplos Brigadeiros!');
        } else {
            const brig = brigadeiros[0];
            console.log('\n✅ Apenas 1 Brigadeiro encontrado:');
            console.log(`   ID: ${brig.idvalor}`);
            console.log(`   Preço adicional: R$ ${parseFloat(brig.preco_adicional).toFixed(2)}`);
            console.log(`   Disponível: ${brig.disponivel ? 'Sim' : 'Não'}`);
            console.log(`   Ingredientes vinculados: ${brig.qtd_ingredientes}`);
            
            if (brig.qtd_ingredientes > 0) {
                console.log(`   Lista: ${brig.ingredientes}\n`);
            } else {
                console.log('   ⚠️  Sem ingredientes vinculados\n');
            }
        }

        // Verificar todos os recheios
        console.log('📋 Todos os recheios disponíveis:');
        const [recheios] = await conn.query(`
            SELECT 
                v.idvalor,
                v.nome_valor,
                v.preco_adicional,
                v.disponivel,
                v.ordem_exibicao
            FROM opcao_valores v
            INNER JOIN produto_opcoes_personalizacao o ON v.idopcao_fk = o.idopcao
            WHERE o.nome_opcao = 'Recheio'
              AND v.disponivel = 1
            ORDER BY v.ordem_exibicao, v.nome_valor
        `);
        console.table(recheios);

        console.log('========================================\n');

    } catch (error) {
        console.error('❌ Erro:', error.message);
    } finally {
        await conn.end();
    }
}

verificarBrigadeiro();
