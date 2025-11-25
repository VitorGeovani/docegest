import connection from './src/repository/connection.js';

async function verReserva() {
    const [campos] = await connection.query('DESCRIBE reserva');
    console.log('📋 Campos da tabela reserva:\n');
    campos.forEach(c => console.log(`  - ${c.Field} (${c.Type})`));
    await connection.end();
}

verReserva();
