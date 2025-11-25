import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

async function adicionarCamposReserva() {
    try {
        console.log('🔄 Conectando ao banco de dados...');
        
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_DATABASE || 'segredodosabor',
            multipleStatements: true
        });

        console.log('✅ Conectado ao banco de dados!');
        console.log('🔄 Adicionando campos à tabela reserva...\n');

        // Verificar e adicionar endereco_entrega
        const [camposEndereco] = await connection.query(
            `SELECT COUNT(*) as existe 
             FROM information_schema.COLUMNS 
             WHERE TABLE_SCHEMA = ? 
             AND TABLE_NAME = 'reserva' 
             AND COLUMN_NAME = 'endereco_entrega'`,
            [process.env.DB_DATABASE || 'segredodosabor']
        );

        if (camposEndereco[0].existe === 0) {
            await connection.query('ALTER TABLE reserva ADD COLUMN endereco_entrega TEXT');
            console.log('✅ Campo "endereco_entrega" adicionado com sucesso!');
        } else {
            console.log('ℹ️  Campo "endereco_entrega" já existe.');
        }

        // Verificar e adicionar observacoes
        const [camposObservacoes] = await connection.query(
            `SELECT COUNT(*) as existe 
             FROM information_schema.COLUMNS 
             WHERE TABLE_SCHEMA = ? 
             AND TABLE_NAME = 'reserva' 
             AND COLUMN_NAME = 'observacoes'`,
            [process.env.DB_DATABASE || 'segredodosabor']
        );

        if (camposObservacoes[0].existe === 0) {
            await connection.query('ALTER TABLE reserva ADD COLUMN observacoes TEXT');
            console.log('✅ Campo "observacoes" adicionado com sucesso!');
        } else {
            console.log('ℹ️  Campo "observacoes" já existe.');
        }

        // Verificar e adicionar tipo_pedido
        const [camposTipo] = await connection.query(
            `SELECT COUNT(*) as existe 
             FROM information_schema.COLUMNS 
             WHERE TABLE_SCHEMA = ? 
             AND TABLE_NAME = 'reserva' 
             AND COLUMN_NAME = 'tipo_pedido'`,
            [process.env.DB_DATABASE || 'segredodosabor']
        );

        if (camposTipo[0].existe === 0) {
            await connection.query('ALTER TABLE reserva ADD COLUMN tipo_pedido VARCHAR(20) DEFAULT "ENTREGA"');
            console.log('✅ Campo "tipo_pedido" adicionado com sucesso!');
        } else {
            console.log('ℹ️  Campo "tipo_pedido" já existe.');
        }

        console.log('\n🎉 Estrutura da tabela reserva atualizada com sucesso!');
        
        await connection.end();
        process.exit(0);

    } catch (error) {
        console.error('❌ Erro ao atualizar tabela:', error.message);
        console.error(error);
        process.exit(1);
    }
}

adicionarCamposReserva();
