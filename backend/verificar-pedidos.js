import pool from './src/repository/connection.js';

async function verificar() {
    try {
        const [rows] = await pool.query(`
            SELECT codigo_pedido, data_entrega, hora_entrega, status 
            FROM reserva 
            WHERE codigo_pedido LIKE '%PED00004%'
            ORDER BY idreserva DESC 
            LIMIT 5
        `);
        
        console.log('📋 Pedidos encontrados:');
        rows.forEach(r => {
            console.log(`   ${r.codigo_pedido} - ${r.data_entrega} - ${r.status}`);
        });
        
        await pool.end();
    } catch (error) {
        console.error('Erro:', error);
        process.exit(1);
    }
}

verificar();
