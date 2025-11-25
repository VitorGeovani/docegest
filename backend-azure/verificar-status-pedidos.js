import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function verificarStatusPedidos() {
    let connection;
    
    try {
        console.log('🔍 Conectando ao banco de dados...\n');
        
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'segredodosabor',
            port: process.env.DB_PORT || 3306
        });

        console.log('✅ Conectado ao banco de dados!\n');

        // Verificar estrutura da tabela reserva
        console.log('📊 Verificando estrutura da tabela reserva...\n');
        const [columns] = await connection.query(`
            SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT, COLUMN_TYPE
            FROM information_schema.COLUMNS
            WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'reserva'
            ORDER BY ORDINAL_POSITION;
        `, [process.env.DB_NAME || 'segredodosabor']);

        console.log('Colunas da tabela reserva:');
        columns.forEach(col => {
            console.log(`  - ${col.COLUMN_NAME} (${col.COLUMN_TYPE}) ${col.IS_NULLABLE === 'NO' ? 'NOT NULL' : 'NULL'} ${col.COLUMN_DEFAULT ? `DEFAULT ${col.COLUMN_DEFAULT}` : ''}`);
        });

        // Verificar se a coluna status existe
        const statusColumn = columns.find(col => col.COLUMN_NAME === 'status');
        
        if (!statusColumn) {
            console.log('\n❌ ERRO: Coluna "status" não encontrada na tabela reserva!');
            console.log('\nExecute o script de migração primeiro.\n');
            return;
        }

        console.log('\n✅ Coluna "status" encontrada!\n');

        // Contar pedidos por status
        console.log('📈 Contagem de pedidos por status:\n');
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

        // Verificar pedidos com status inválido
        console.log('\n🔍 Verificando status inválidos...\n');
        const [invalidStatus] = await connection.query(`
            SELECT idreserva, status, data_entrega, valor_total
            FROM reserva
            WHERE status NOT IN ('Pendente', 'Confirmado', 'Preparando', 'Pronto', 'Entregue', 'Cancelado')
            ORDER BY idreserva DESC
            LIMIT 10;
        `);

        if (invalidStatus.length > 0) {
            console.log('⚠️ Pedidos com status inválido encontrados:');
            invalidStatus.forEach(pedido => {
                console.log(`  - ID: ${pedido.idreserva}, Status: "${pedido.status}", Valor: R$ ${pedido.valor_total}`);
            });
            
            console.log('\n❓ Deseja corrigir os status inválidos para "Pendente"? (Execute com argumento --fix)');
        } else {
            console.log('✅ Nenhum status inválido encontrado!');
        }

        // Listar últimos 10 pedidos
        console.log('\n📋 Últimos 10 pedidos:\n');
        const [recentOrders] = await connection.query(`
            SELECT 
                r.idreserva,
                COALESCE(r.numero_pedido, CONCAT('PED', LPAD(r.idreserva, 6, '0'))) AS numero,
                r.status,
                r.valor_total,
                DATE_FORMAT(r.data_entrega, '%d/%m/%Y') AS data,
                c.nome AS cliente
            FROM reserva r
            LEFT JOIN cliente c ON r.idcliente_fk = c.idcliente
            ORDER BY r.idreserva DESC
            LIMIT 10;
        `);

        recentOrders.forEach(pedido => {
            const icon = {
                'Pendente': '⏳',
                'Confirmado': '✅',
                'Preparando': '👨‍🍳',
                'Pronto': '🎁',
                'Entregue': '🚚',
                'Cancelado': '❌'
            }[pedido.status] || '❓';
            
            console.log(`  ${icon} ${pedido.numero} - ${pedido.cliente || 'Cliente não especificado'} - R$ ${pedido.valor_total} - ${pedido.status}`);
        });

        console.log('\n✅ Verificação concluída!\n');

    } catch (error) {
        console.error('❌ Erro:', error.message);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Executar
verificarStatusPedidos();
