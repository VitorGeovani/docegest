import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function verificarReservas() {
    try {
        console.log('🔄 Conectando ao banco de dados...');
        
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_DATABASE || 'segredodosabor'
        });

        console.log('✅ Conectado ao banco de dados!\n');

        // Verificar total de reservas
        const [totalReservas] = await connection.query('SELECT COUNT(*) as total FROM reserva');
        console.log(`📊 Total de reservas no banco: ${totalReservas[0].total}\n`);

        // Listar todas as reservas
        const [reservas] = await connection.query(`
            SELECT 
                r.idreserva,
                r.data_entrega,
                r.hora_entrega,
                r.ponto_entrega,
                r.valor_total,
                r.status,
                r.pagamento,
                r.turno,
                c.nome as nome_cliente,
                c.telefone as telefone_cliente
            FROM reserva r
            LEFT JOIN cliente c ON r.idcliente_fk = c.idcliente
            ORDER BY r.idreserva DESC
            LIMIT 10
        `);

        if (reservas.length === 0) {
            console.log('⚠️  Nenhuma reserva encontrada no banco de dados.');
            console.log('\n💡 Crie um pedido pelo frontend para testar!');
        } else {
            console.log('📋 Últimas 10 reservas:\n');
            reservas.forEach(r => {
                console.log(`─────────────────────────────────────────`);
                console.log(`ID: ${r.idreserva}`);
                console.log(`Status: ${r.status}`);
                console.log(`Cliente: ${r.nome_cliente || 'N/A'}`);
                console.log(`Telefone: ${r.telefone_cliente || 'N/A'}`);
                console.log(`Data: ${r.data_entrega} ${r.hora_entrega}`);
                console.log(`Local: ${r.ponto_entrega}`);
                console.log(`Turno: ${r.turno}`);
                console.log(`Pagamento: ${r.pagamento}`);
                console.log(`Total: R$ ${Number(r.valor_total).toFixed(2)}`);
            });
            console.log(`─────────────────────────────────────────\n`);
        }

        // Verificar reservas pendentes especificamente
        const [pendentes] = await connection.query(`
            SELECT COUNT(*) as total 
            FROM reserva 
            WHERE status = 'Pendente'
        `);
        console.log(`✅ Reservas pendentes (que aparecem no painel): ${pendentes[0].total}`);

        // Verificar estrutura da tabela
        const [colunas] = await connection.query(`
            SHOW COLUMNS FROM reserva
        `);
        console.log('\n📋 Estrutura da tabela reserva:');
        colunas.forEach(col => {
            console.log(`  - ${col.Field} (${col.Type})`);
        });

        await connection.end();
        process.exit(0);

    } catch (error) {
        console.error('❌ Erro:', error.message);
        process.exit(1);
    }
}

verificarReservas();
