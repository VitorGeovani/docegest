import connection from './src/repository/connection.js';

async function investigarPED000038() {
    console.log('\n🔍 INVESTIGAÇÃO: Pedido #PED000038\n');
    console.log('='.repeat(60));
    
    try {
        // 1. Verificar todas as tabelas do banco
        console.log('\n📋 1. Tabelas no banco de dados:');
        const [tabelas] = await connection.execute('SHOW TABLES');
        console.table(tabelas);
        
        // 2. Buscar em TODAS as tabelas que possam ter pedidos
        const tabelasPedidos = ['reserva', 'pedido', 'pedidos', 'orders'];
        
        console.log('\n🔍 2. Buscando PED000038 em possíveis tabelas:');
        
        for (const tabela of tabelas) {
            const nomeTabela = Object.values(tabela)[0];
            
            try {
                // Verificar se a tabela tem coluna codigo_pedido
                const [colunas] = await connection.execute(`SHOW COLUMNS FROM ${nomeTabela} LIKE '%codigo%'`);
                
                if (colunas.length > 0) {
                    console.log(`\n  📊 Tabela: ${nomeTabela}`);
                    console.log(`     Colunas com 'codigo':`, colunas.map(c => c.Field).join(', '));
                    
                    // Tentar buscar PED000038
                    for (const coluna of colunas) {
                        try {
                            const [resultado] = await connection.execute(
                                `SELECT * FROM ${nomeTabela} WHERE ${coluna.Field} LIKE '%PED000038%'`
                            );
                            
                            if (resultado.length > 0) {
                                console.log(`\n  ✅ ENCONTRADO em ${nomeTabela}.${coluna.Field}!`);
                                console.table(resultado);
                            }
                        } catch (err) {
                            // Ignorar erros de query inválida
                        }
                    }
                }
            } catch (err) {
                // Ignorar erros de tabela não acessível
            }
        }
        
        // 3. Buscar por ID de reserva similar
        console.log('\n🔍 3. Buscando reservas recentes (últimas 5):');
        const [reservasRecentes] = await connection.execute(`
            SELECT idreserva, codigo_pedido, status, valor_total, data_entrega
            FROM reserva
            ORDER BY idreserva DESC
            LIMIT 5
        `);
        console.table(reservasRecentes);
        
        // 4. Verificar se há pedido com ID 38
        console.log('\n🔍 4. Verificando reserva com idreserva = 38:');
        const [reserva38] = await connection.execute(`
            SELECT * FROM reserva WHERE idreserva = 38
        `);
        
        if (reserva38.length > 0) {
            console.log('  ✅ Reserva ID 38 encontrada:');
            console.table(reserva38);
        } else {
            console.log('  ❌ Não existe reserva com idreserva = 38');
        }
        
        // 5. Buscar pedidos com formatação diferente
        console.log('\n🔍 5. Buscando códigos similares a PED000038:');
        const [similares] = await connection.execute(`
            SELECT codigo_pedido, idreserva, status FROM reserva 
            WHERE codigo_pedido LIKE '%38%' OR codigo_pedido LIKE '%0038%'
        `);
        
        if (similares.length > 0) {
            console.log('  ✅ Códigos similares encontrados:');
            console.table(similares);
        } else {
            console.log('  ❌ Nenhum código similar encontrado');
        }
        
        // 6. Verificar pedidos NULL ou sem código
        console.log('\n🔍 6. Pedidos sem código (NULL):');
        const [semCodigo] = await connection.execute(`
            SELECT idreserva, codigo_pedido, status, valor_total, data_entrega
            FROM reserva
            WHERE codigo_pedido IS NULL
            ORDER BY idreserva DESC
        `);
        console.table(semCodigo);
        
        console.log('\n' + '='.repeat(60));
        console.log('✅ Investigação concluída!\n');
        
    } catch (error) {
        console.error('❌ Erro na investigação:', error);
    } finally {
        await connection.end();
    }
}

investigarPED000038();
