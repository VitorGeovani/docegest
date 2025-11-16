import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function investigarPedido40() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
    });

    try {
        console.log('🔍 INVESTIGANDO PROBLEMA: PED000040\n');

        // 1. Buscar últimos pedidos
        console.log('📋 ÚLTIMOS PEDIDOS NO BANCO:');
        const [pedidos] = await connection.query(`
            SELECT idreserva, codigo_pedido, data_entrega, valor_total, status, idcliente_fk
            FROM reserva 
            ORDER BY idreserva DESC 
            LIMIT 5
        `);
        console.table(pedidos);

        // 2. Buscar especificamente por PED000040
        console.log('\n🔎 BUSCANDO PED000040:');
        const [ped40] = await connection.query(`
            SELECT * FROM reserva WHERE codigo_pedido = 'PED000040'
        `);
        console.log('Resultado:', ped40.length > 0 ? ped40[0] : 'NÃO ENCONTRADO');

        // 3. Buscar especificamente por PED000039
        console.log('\n🔎 BUSCANDO PED000039:');
        const [ped39] = await connection.query(`
            SELECT * FROM reserva WHERE codigo_pedido = 'PED000039'
        `);
        console.log('Resultado:', ped39.length > 0 ? ped39[0] : 'NÃO ENCONTRADO');

        // 4. Buscar por ID 40
        console.log('\n🔎 BUSCANDO POR ID 40:');
        const [id40] = await connection.query(`
            SELECT idreserva, codigo_pedido, valor_total, status 
            FROM reserva WHERE idreserva = 40
        `);
        console.log('Resultado:', id40.length > 0 ? id40[0] : 'NÃO ENCONTRADO');

        // 5. Verificar se há duplicatas
        console.log('\n📊 VERIFICANDO DUPLICATAS:');
        const [duplicatas] = await connection.query(`
            SELECT codigo_pedido, COUNT(*) as quantidade
            FROM reserva
            GROUP BY codigo_pedido
            HAVING COUNT(*) > 1
        `);
        if (duplicatas.length > 0) {
            console.log('⚠️ DUPLICATAS ENCONTRADAS:');
            console.table(duplicatas);
        } else {
            console.log('✅ Sem duplicatas');
        }

        // 6. Verificar últimos códigos gerados
        console.log('\n📈 PROGRESSÃO DE CÓDIGOS:');
        const [progressao] = await connection.query(`
            SELECT idreserva, codigo_pedido, data_entrega
            FROM reserva 
            WHERE idreserva >= 35
            ORDER BY idreserva ASC
        `);
        console.table(progressao);

    } catch (error) {
        console.error('❌ Erro:', error.message);
    } finally {
        await connection.end();
    }
}

investigarPedido40();
