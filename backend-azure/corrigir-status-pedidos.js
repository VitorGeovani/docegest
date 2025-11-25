import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function corrigirStatusPedidos() {
    let connection;
    
    try {
        console.log('🔧 Conectando ao banco de dados...\n');
        
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'segredodosabor',
            port: process.env.DB_PORT || 3306
        });

        console.log('✅ Conectado ao banco de dados!\n');

        // Verificar pedidos com status inválido
        console.log('🔍 Buscando pedidos com status inválido...\n');
        const [invalidStatus] = await connection.query(`
            SELECT idreserva, status, data_entrega, valor_total
            FROM reserva
            WHERE status NOT IN ('Pendente', 'Confirmado', 'Preparando', 'Pronto', 'Entregue', 'Cancelado')
            ORDER BY idreserva;
        `);

        if (invalidStatus.length === 0) {
            console.log('✅ Nenhum status inválido encontrado! Todos os pedidos estão corretos.\n');
            return;
        }

        console.log(`⚠️ Encontrados ${invalidStatus.length} pedido(s) com status inválido:\n`);
        invalidStatus.forEach(pedido => {
            console.log(`  - ID: ${pedido.idreserva}, Status atual: "${pedido.status}", Valor: R$ ${pedido.valor_total}`);
        });

        console.log('\n🔧 Corrigindo status inválidos para "Pendente"...\n');

        // Corrigir status inválidos
        const [result] = await connection.query(`
            UPDATE reserva
            SET status = 'Pendente'
            WHERE status NOT IN ('Pendente', 'Confirmado', 'Preparando', 'Pronto', 'Entregue', 'Cancelado');
        `);

        console.log(`✅ ${result.affectedRows} pedido(s) corrigido(s) com sucesso!\n`);

        // Verificar contagem final
        console.log('📊 Contagem atualizada de pedidos por status:\n');
        const [statusCount] = await connection.query(`
            SELECT status, COUNT(*) as quantidade
            FROM reserva
            GROUP BY status
            ORDER BY 
                CASE status
                    WHEN 'Pendente' THEN 1
                    WHEN 'Confirmado' THEN 2
                    WHEN 'Preparando' THEN 3
                    WHEN 'Pronto' THEN 4
                    WHEN 'Entregue' THEN 5
                    WHEN 'Cancelado' THEN 6
                    ELSE 7
                END;
        `);

        statusCount.forEach(row => {
            const icon = {
                'Pendente': '⏳',
                'Confirmado': '✅',
                'Preparando': '👨‍🍳',
                'Pronto': '🎁',
                'Entregue': '🚚',
                'Cancelado': '❌'
            }[row.status] || '❓';
            
            console.log(`  ${icon} ${row.status}: ${row.quantidade} pedido(s)`);
        });

        console.log('\n✅ Correção concluída com sucesso!\n');

    } catch (error) {
        console.error('❌ Erro:', error.message);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Executar
corrigirStatusPedidos();
