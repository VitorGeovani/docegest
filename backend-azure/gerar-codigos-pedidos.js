// Script para gerar códigos de pedidos
import mysql from 'mysql2/promise';

async function gerarCodigosPedidos() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'P@$$w0rd',
        database: 'segredodosabor'
    });

    console.log('🔧 Verificando e gerando códigos de pedidos...\n');

    // Verificar se coluna existe
    const [columns] = await connection.execute(`
        SHOW COLUMNS FROM reserva LIKE 'codigo_pedido'
    `);

    if (columns.length === 0) {
        console.log('❌ Coluna codigo_pedido não existe! Criando...');
        await connection.execute(`
            ALTER TABLE reserva 
            ADD COLUMN codigo_pedido VARCHAR(20) UNIQUE AFTER idreserva
        `);
        console.log('✅ Coluna codigo_pedido criada!\n');
    }

    // Buscar pedidos sem código
    const [pedidos] = await connection.execute(`
        SELECT idreserva FROM reserva WHERE codigo_pedido IS NULL
    `);

    if (pedidos.length === 0) {
        console.log('✅ Todos os pedidos já têm código!');
        
        // Mostrar alguns códigos
        const [comCodigo] = await connection.execute(`
            SELECT codigo_pedido, status, valor_total 
            FROM reserva 
            WHERE codigo_pedido IS NOT NULL
            ORDER BY idreserva DESC 
            LIMIT 5
        `);
        
        console.log('\n📦 Últimos 5 pedidos:\n');
        comCodigo.forEach((p, i) => {
            console.log(`${i + 1}. ${p.codigo_pedido} - ${p.status} - R$ ${parseFloat(p.valor_total).toFixed(2)}`);
        });
        
        console.log(`\n✅ Use "${comCodigo[0].codigo_pedido}" para testar no chat!\n`);
    } else {
        console.log(`🔄 Gerando códigos para ${pedidos.length} pedidos...\n`);

        for (const pedido of pedidos) {
            const codigo = `PED${String(pedido.idreserva).padStart(6, '0')}`;
            await connection.execute(
                'UPDATE reserva SET codigo_pedido = ? WHERE idreserva = ?',
                [codigo, pedido.idreserva]
            );
            console.log(`✅ Gerado: ${codigo}`);
        }

        console.log(`\n✅ ${pedidos.length} códigos gerados com sucesso!`);
        
        // Mostrar exemplos
        const [exemplos] = await connection.execute(`
            SELECT codigo_pedido, status, valor_total 
            FROM reserva 
            ORDER BY idreserva DESC 
            LIMIT 3
        `);
        
        console.log('\n📦 Exemplos de códigos gerados:\n');
        exemplos.forEach((p, i) => {
            console.log(`${i + 1}. ${p.codigo_pedido} - ${p.status} - R$ ${parseFloat(p.valor_total).toFixed(2)}`);
        });
        
        console.log(`\n✅ Use "${exemplos[0].codigo_pedido}" para testar no chat!\n`);
    }

    await connection.end();
}

gerarCodigosPedidos().catch(console.error);
