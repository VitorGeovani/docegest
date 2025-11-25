import connection from './src/repository/connection.js';

/**
 * Script para testar busca de pedidos do Assistente Virtual
 */

async function testarBuscaPedidos() {
    console.log('\n🧪 TESTE: Busca de Pedidos do Assistente\n');
    
    try {
        // 1. Listar todos os pedidos
        console.log('📋 1. Listando todos os pedidos:');
        const [todosOsPedidos] = await connection.execute(`
            SELECT codigo_pedido, status, valor_total, data_entrega 
            FROM reserva 
            ORDER BY idreserva DESC 
            LIMIT 20
        `);
        
        console.table(todosOsPedidos);
        
        if (todosOsPedidos.length === 0) {
            console.log('⚠️ Nenhum pedido encontrado no banco!');
            return;
        }
        
        // 2. Testar busca específica do código PED000038
        console.log('\n🔍 2. Testando busca do código PED000038:');
        const [pedido38] = await connection.execute(`
            SELECT r.*, c.nome as nome_cliente, c.telefone, c.email
            FROM reserva r
            JOIN cliente c ON r.idcliente_fk = c.idcliente
            WHERE r.codigo_pedido = ?
            LIMIT 1
        `, ['PED000038']);
        
        if (pedido38.length > 0) {
            console.log('✅ Pedido PED000038 encontrado:');
            console.table([{
                codigo: pedido38[0].codigo_pedido,
                cliente: pedido38[0].nome_cliente,
                status: pedido38[0].status,
                valor: pedido38[0].valor_total
            }]);
        } else {
            console.log('❌ Pedido PED000038 NÃO encontrado');
            
            // Tentar busca alternativa
            console.log('\n🔄 Tentando busca alternativa (case insensitive):');
            const [pedidoAlt] = await connection.execute(`
                SELECT r.*, c.nome as nome_cliente
                FROM reserva r
                JOIN cliente c ON r.idcliente_fk = c.idcliente
                WHERE UPPER(REPLACE(r.codigo_pedido, '#', '')) = UPPER(REPLACE(?, '#', ''))
                LIMIT 1
            `, ['PED000038']);
            
            if (pedidoAlt.length > 0) {
                console.log('✅ Encontrado com busca alternativa:');
                console.table([{
                    codigo: pedidoAlt[0].codigo_pedido,
                    cliente: pedidoAlt[0].nome_cliente,
                    status: pedidoAlt[0].status
                }]);
            } else {
                console.log('❌ Pedido não existe no banco');
            }
        }
        
        // 3. Testar com diferentes formatos
        console.log('\n🧪 3. Testando diferentes formatos:');
        const formatos = ['PED000038', '#PED000038', 'ped000038', '#ped000038'];
        
        for (const formato of formatos) {
            const [resultado] = await connection.execute(`
                SELECT codigo_pedido, status
                FROM reserva
                WHERE UPPER(REPLACE(codigo_pedido, '#', '')) = UPPER(REPLACE(?, '#', ''))
                LIMIT 1
            `, [formato]);
            
            console.log(`  ${formato}: ${resultado.length > 0 ? '✅ Encontrado' : '❌ Não encontrado'}`);
        }
        
        // 4. Verificar estrutura da tabela
        console.log('\n📊 4. Estrutura da tabela reserva:');
        const [estrutura] = await connection.execute(`
            DESCRIBE reserva
        `);
        
        const campoRelevante = estrutura.find(campo => campo.Field === 'codigo_pedido');
        if (campoRelevante) {
            console.log('Campo codigo_pedido:', campoRelevante);
        }
        
        // 5. Estatísticas
        console.log('\n📈 5. Estatísticas:');
        const [stats] = await connection.execute(`
            SELECT 
                COUNT(*) as total_pedidos,
                COUNT(DISTINCT codigo_pedido) as codigos_unicos,
                MIN(codigo_pedido) as primeiro_codigo,
                MAX(codigo_pedido) as ultimo_codigo
            FROM reserva
        `);
        
        console.table(stats);
        
        console.log('\n✅ Teste concluído!');
        
    } catch (error) {
        console.error('❌ Erro no teste:', error);
    } finally {
        await connection.end();
    }
}

// Executar teste
testarBuscaPedidos();
