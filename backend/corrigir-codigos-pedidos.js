import connection from './src/repository/connection.js';

async function corrigirCodigosPedidos() {
    console.log('\n🔧 CORREÇÃO: Gerando códigos de pedidos faltantes\n');
    console.log('='.repeat(60));
    
    try {
        // 1. Buscar pedidos sem código
        console.log('\n📋 1. Buscando pedidos sem código:');
        const [pedidosSemCodigo] = await connection.execute(`
            SELECT idreserva, codigo_pedido, status, valor_total, data_entrega
            FROM reserva
            WHERE codigo_pedido IS NULL
            ORDER BY idreserva ASC
        `);
        
        console.table(pedidosSemCodigo);
        
        if (pedidosSemCodigo.length === 0) {
            console.log('  ✅ Todos os pedidos já têm código!');
            return;
        }
        
        console.log(`\n  ⚠️ Encontrados ${pedidosSemCodigo.length} pedido(s) sem código`);
        
        // 2. Gerar e atualizar códigos
        console.log('\n🔄 2. Gerando códigos:');
        
        for (const pedido of pedidosSemCodigo) {
            // Gerar código no formato PED000XXX
            const codigo = `PED${String(pedido.idreserva).padStart(6, '0')}`;
            
            console.log(`  📝 ID ${pedido.idreserva} → ${codigo}`);
            
            // Atualizar no banco
            await connection.execute(
                'UPDATE reserva SET codigo_pedido = ? WHERE idreserva = ?',
                [codigo, pedido.idreserva]
            );
        }
        
        console.log(`\n  ✅ ${pedidosSemCodigo.length} código(s) gerado(s) com sucesso!`);
        
        // 3. Verificar resultado
        console.log('\n📊 3. Verificando pedidos atualizados:');
        const [pedidosAtualizados] = await connection.execute(`
            SELECT idreserva, codigo_pedido, status, valor_total
            FROM reserva
            WHERE idreserva IN (${pedidosSemCodigo.map(p => p.idreserva).join(',')})
        `);
        
        console.table(pedidosAtualizados);
        
        // 4. Teste específico do PED000038
        console.log('\n🧪 4. Testando busca do PED000038:');
        const [testePED38] = await connection.execute(`
            SELECT codigo_pedido, idreserva, status, valor_total
            FROM reserva
            WHERE codigo_pedido = 'PED000038'
        `);
        
        if (testePED38.length > 0) {
            console.log('  ✅ PED000038 agora pode ser encontrado!');
            console.table(testePED38);
        } else {
            console.log('  ❌ PED000038 ainda não encontrado');
        }
        
        console.log('\n' + '='.repeat(60));
        console.log('✅ Correção concluída!\n');
        
    } catch (error) {
        console.error('❌ Erro na correção:', error);
    } finally {
        await connection.end();
    }
}

corrigirCodigosPedidos();
