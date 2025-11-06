/**
 * Script para remover a coluna 'turno' da tabela reserva
 * A coluna turno não é mais necessária pois agora fazemos entregas para qualquer lugar
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const config = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'segredodosabor',
    port: process.env.DB_PORT || 3306
};

async function removerColunasTurno() {
    let connection;
    
    try {
        console.log('🔌 Conectando ao banco de dados...');
        connection = await mysql.createConnection(config);
        console.log('✅ Conectado com sucesso!\n');

        // Verificar se a coluna turno existe
        console.log('🔍 Verificando se a coluna turno existe...');
        const [columns] = await connection.query(`
            SELECT COLUMN_NAME
            FROM information_schema.COLUMNS
            WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'reserva'
            AND COLUMN_NAME = 'turno'
        `, [config.database]);

        if (columns.length === 0) {
            console.log('⏭️  Coluna turno não existe (já foi removida ou nunca existiu)');
            console.log('✅ Banco de dados já está atualizado!');
            return;
        }

        console.log('📋 Coluna turno encontrada. Removendo...');
        
        // Remover coluna turno
        await connection.query(`
            ALTER TABLE reserva 
            DROP COLUMN turno
        `);
        
        console.log('✅ Coluna turno removida com sucesso!');

        console.log('\n🎉 ============================================');
        console.log('🎉 BANCO ATUALIZADO COM SUCESSO!');
        console.log('🎉 ============================================\n');
        console.log('✅ Sistema agora está preparado para entregas em qualquer lugar!');
        console.log('✅ A coluna turno foi removida da tabela reserva');
        console.log('');

    } catch (error) {
        console.error('❌ Erro ao atualizar banco de dados:', error.message);
        console.error('Detalhes:', error);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
            console.log('🔌 Conexão fechada.');
        }
    }
}

// Executar
console.log('🚀 Iniciando remoção da coluna turno...\n');
removerColunasTurno();
