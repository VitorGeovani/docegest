import connection from './src/repository/connection.js';

/**
 * 🧪 TESTE: Validar geração automática de código de pedido
 * 
 * Este script testa se o trigger está funcionando corretamente:
 * 1. Insere um pedido de teste SEM código
 * 2. Verifica se o código foi gerado automaticamente
 * 3. Remove o pedido de teste
 */

async function testarTriggerCodigoPedido() {
    console.log('\n🧪 TESTE: Geração Automática de Código de Pedido\n');
    console.log('='.repeat(60));
    
    let pedidoTesteId = null;
    
    try {
        // ========================================
        // TESTE 1: Inserir pedido sem código
        // ========================================
        console.log('\n📋 TESTE 1: Inserir pedido SEM informar codigo_pedido...\n');
        
        const [resultado] = await connection.execute(`
            INSERT INTO reserva (
                data_entrega,
                hora_entrega,
                ponto_entrega,
                valor_total,
                status,
                pagamento,
                produtos,
                qtdReserva,
                idcliente_fk,
                tipo_pedido
            ) VALUES (
                CURDATE(),
                '12:00:00',
                'Teste Automático',
                10.00,
                'Pendente',
                'PIX',
                '[]',
                '[]',
                1,
                'TESTE'
            )
        `);
        
        pedidoTesteId = resultado.insertId;
        console.log(`  ✅ Pedido inserido com ID: ${pedidoTesteId}`);
        
        // ========================================
        // TESTE 2: Verificar se código foi gerado
        // ========================================
        console.log('\n📋 TESTE 2: Verificar se codigo_pedido foi gerado...\n');
        
        const [pedido] = await connection.execute(`
            SELECT idreserva, codigo_pedido, status, valor_total
            FROM reserva
            WHERE idreserva = ?
        `, [pedidoTesteId]);
        
        if (pedido.length === 0) {
            throw new Error('Pedido não encontrado após inserção!');
        }
        
        const pedidoInserido = pedido[0];
        
        console.log('  📊 Dados do pedido inserido:');
        console.table({
            'ID': pedidoInserido.idreserva,
            'Código': pedidoInserido.codigo_pedido || '❌ NULL',
            'Status': pedidoInserido.status,
            'Valor': `R$ ${pedidoInserido.valor_total}`
        });
        
        // Validar código
        const codigoEsperado = `PED${String(pedidoTesteId).padStart(6, '0')}`;
        
        if (!pedidoInserido.codigo_pedido) {
            console.log('\n  ❌ FALHA: codigo_pedido está NULL!');
            console.log('     O trigger NÃO está funcionando!');
            return false;
        }
        
        if (pedidoInserido.codigo_pedido !== codigoEsperado) {
            console.log(`\n  ❌ FALHA: Código incorreto!`);
            console.log(`     Esperado: ${codigoEsperado}`);
            console.log(`     Recebido: ${pedidoInserido.codigo_pedido}`);
            return false;
        }
        
        console.log(`\n  ✅ SUCESSO: Código gerado corretamente!`);
        console.log(`     ID ${pedidoTesteId} → ${pedidoInserido.codigo_pedido}`);
        
        // ========================================
        // TESTE 3: Testar busca pelo código
        // ========================================
        console.log('\n📋 TESTE 3: Testar busca pelo código gerado...\n');
        
        const [buscaPorCodigo] = await connection.execute(`
            SELECT idreserva, codigo_pedido
            FROM reserva
            WHERE codigo_pedido = ?
        `, [pedidoInserido.codigo_pedido]);
        
        if (buscaPorCodigo.length === 0) {
            console.log('  ❌ FALHA: Não conseguiu encontrar pedido pelo código!');
            return false;
        }
        
        console.log(`  ✅ SUCESSO: Pedido encontrado pelo código!`);
        console.log(`     Busca por "${pedidoInserido.codigo_pedido}" retornou ID ${buscaPorCodigo[0].idreserva}`);
        
        // ========================================
        // TESTE 4: Verificar índice
        // ========================================
        console.log('\n📋 TESTE 4: Verificar performance do índice...\n');
        
        const [explain] = await connection.execute(`
            EXPLAIN SELECT * FROM reserva WHERE codigo_pedido = ?
        `, [pedidoInserido.codigo_pedido]);
        
        const usandoIndice = explain[0].key === 'idx_codigo_pedido';
        
        console.log(`  ${usandoIndice ? '✅' : '⚠️'} Índice: ${usandoIndice ? 'Sendo usado' : 'NÃO usado'}`);
        console.log(`     Key: ${explain[0].key || 'NULL'}`);
        console.log(`     Type: ${explain[0].type}`);
        console.log(`     Rows: ${explain[0].rows}`);
        
        // ========================================
        // RESULTADO FINAL
        // ========================================
        console.log('\n' + '='.repeat(60));
        console.log('\n🎉 TODOS OS TESTES PASSARAM!\n');
        
        console.log('✅ Resultados:');
        console.log(`   ✅ Trigger está ATIVO e funcionando`);
        console.log(`   ✅ Código gerado: ${pedidoInserido.codigo_pedido}`);
        console.log(`   ✅ Busca por código: Funcionando`);
        console.log(`   ${usandoIndice ? '✅' : '⚠️'} Índice: ${usandoIndice ? 'Otimizado' : 'Precisa criar índice'}`);
        
        console.log('\n💡 Sistema 100% funcional!');
        console.log('   → Novos pedidos receberão código automaticamente');
        console.log('   → Não é necessário informar codigo_pedido na inserção');
        console.log('   → Formato garantido: PED000XXX\n');
        
        return true;
        
    } catch (error) {
        console.error('\n❌ ERRO NO TESTE:', error.message);
        return false;
    } finally {
        // ========================================
        // LIMPEZA: Remover pedido de teste
        // ========================================
        if (pedidoTesteId) {
            console.log('🧹 Limpeza: Removendo pedido de teste...');
            
            try {
                await connection.execute(`
                    DELETE FROM reserva WHERE idreserva = ?
                `, [pedidoTesteId]);
                console.log(`   ✅ Pedido ID ${pedidoTesteId} removido\n`);
            } catch (err) {
                console.error(`   ⚠️ Não foi possível remover pedido: ${err.message}\n`);
            }
        }
        
        await connection.end();
    }
}

// Executar teste
testarTriggerCodigoPedido()
    .then((sucesso) => {
        if (sucesso) {
            console.log('✅ Teste finalizado com sucesso!\n');
            process.exit(0);
        } else {
            console.log('❌ Teste falhou!\n');
            process.exit(1);
        }
    })
    .catch((error) => {
        console.error('❌ Erro fatal:', error);
        process.exit(1);
    });
