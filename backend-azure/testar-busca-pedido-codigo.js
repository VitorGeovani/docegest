// Script para testar busca de pedido por código
import mysql from 'mysql2/promise';

async function testarBuscaPedido() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'P@$$w0rd',
        database: 'segredodosabor'
    });

    console.log('🔍 Buscando pedidos no banco...\n');

    const [pedidos] = await connection.execute(
        'SELECT codigo_pedido, status, valor_total FROM reserva ORDER BY idreserva DESC LIMIT 5'
    );

    if (pedidos.length === 0) {
        console.log('❌ Nenhum pedido encontrado no banco!');
        await connection.end();
        return;
    }

    console.log('📦 Últimos 5 pedidos encontrados:\n');
    pedidos.forEach((p, i) => {
        console.log(`${i + 1}. ${p.codigo_pedido} - ${p.status} - R$ ${parseFloat(p.valor_total).toFixed(2)}`);
    });

    console.log('\n✅ Use um desses códigos para testar no chat!');
    console.log(`Exemplo: Digite "${pedidos[0].codigo_pedido}" no chat\n`);

    await connection.end();
}

testarBuscaPedido().catch(console.error);
