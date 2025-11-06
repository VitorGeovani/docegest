/**
 * Script para atualizar o banco de dados com as colunas necessárias para o sistema de pedidos
 * Executa automaticamente as alterações na tabela reserva
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

async function atualizarBanco() {
    let connection;
    
    try {
        console.log('🔌 Conectando ao banco de dados...');
        connection = await mysql.createConnection(config);
        console.log('✅ Conectado com sucesso!\n');

        // Verificar quais colunas já existem
        console.log('🔍 Verificando colunas existentes...');
        const [columns] = await connection.query(`
            SELECT COLUMN_NAME
            FROM information_schema.COLUMNS
            WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'reserva'
            AND COLUMN_NAME IN ('data_pedido', 'numero_pedido', 'data_atualizacao', 'historico_status')
        `, [config.database]);

        const colunasExistentes = columns.map(col => col.COLUMN_NAME);
        console.log('Colunas já existentes:', colunasExistentes.length > 0 ? colunasExistentes.join(', ') : 'Nenhuma');
        console.log('');

        // Adicionar data_pedido
        if (!colunasExistentes.includes('data_pedido')) {
            console.log('📅 Adicionando coluna data_pedido...');
            await connection.query(`
                ALTER TABLE reserva 
                ADD COLUMN data_pedido DATETIME DEFAULT CURRENT_TIMESTAMP
                AFTER idreserva
            `);
            console.log('✅ Coluna data_pedido adicionada!');
        } else {
            console.log('⏭️  Coluna data_pedido já existe');
        }

        // Adicionar numero_pedido
        if (!colunasExistentes.includes('numero_pedido')) {
            console.log('🔢 Adicionando coluna numero_pedido...');
            await connection.query(`
                ALTER TABLE reserva 
                ADD COLUMN numero_pedido VARCHAR(20) UNIQUE
                AFTER data_pedido
            `);
            console.log('✅ Coluna numero_pedido adicionada!');
        } else {
            console.log('⏭️  Coluna numero_pedido já existe');
        }

        // Adicionar data_atualizacao
        if (!colunasExistentes.includes('data_atualizacao')) {
            console.log('🕐 Adicionando coluna data_atualizacao...');
            await connection.query(`
                ALTER TABLE reserva 
                ADD COLUMN data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                AFTER numero_pedido
            `);
            console.log('✅ Coluna data_atualizacao adicionada!');
        } else {
            console.log('⏭️  Coluna data_atualizacao já existe');
        }

        // Adicionar historico_status
        if (!colunasExistentes.includes('historico_status')) {
            console.log('📋 Adicionando coluna historico_status...');
            await connection.query(`
                ALTER TABLE reserva 
                ADD COLUMN historico_status JSON
                AFTER data_atualizacao
            `);
            console.log('✅ Coluna historico_status adicionada!');
        } else {
            console.log('⏭️  Coluna historico_status já existe');
        }

        console.log('\n🔧 Criando índices para otimização...');

        // Criar índices (ignorar se já existirem)
        const indices = [
            { name: 'idx_reserva_status', sql: 'CREATE INDEX idx_reserva_status ON reserva(status)' },
            { name: 'idx_reserva_cliente', sql: 'CREATE INDEX idx_reserva_cliente ON reserva(idcliente_fk)' },
            { name: 'idx_reserva_data_pedido', sql: 'CREATE INDEX idx_reserva_data_pedido ON reserva(data_pedido DESC)' },
            { name: 'idx_reserva_numero_pedido', sql: 'CREATE INDEX idx_reserva_numero_pedido ON reserva(numero_pedido)' }
        ];

        for (const indice of indices) {
            try {
                await connection.query(indice.sql);
                console.log(`✅ Índice ${indice.name} criado!`);
            } catch (error) {
                if (error.code === 'ER_DUP_KEYNAME') {
                    console.log(`⏭️  Índice ${indice.name} já existe`);
                } else {
                    console.log(`⚠️  Erro ao criar ${indice.name}: ${error.message}`);
                }
            }
        }

        // Atualizar pedidos existentes sem número
        console.log('\n🔄 Atualizando pedidos existentes...');
        const [result] = await connection.query(`
            UPDATE reserva 
            SET numero_pedido = CONCAT('PED', LPAD(idreserva, 6, '0'))
            WHERE numero_pedido IS NULL
        `);
        console.log(`✅ ${result.affectedRows} pedidos atualizados com número!`);

        // Inicializar histórico de status para pedidos existentes
        console.log('📝 Inicializando histórico de status...');
        const [result2] = await connection.query(`
            UPDATE reserva 
            SET historico_status = JSON_ARRAY(
                JSON_OBJECT(
                    'status', status,
                    'data', COALESCE(data_pedido, data_entrega),
                    'observacao', CONCAT('Status inicial: ', status)
                )
            )
            WHERE historico_status IS NULL
        `);
        console.log(`✅ ${result2.affectedRows} históricos inicializados!`);

        console.log('\n🎉 ============================================');
        console.log('🎉 BANCO ATUALIZADO COM SUCESSO!');
        console.log('🎉 ============================================\n');
        console.log('✅ Sistema de rastreamento de pedidos está pronto!');
        console.log('✅ Todas as funcionalidades avançadas estão habilitadas!');
        console.log('✅ O sistema agora suporta:');
        console.log('   - Números de pedido automáticos (PED000001)');
        console.log('   - Histórico completo de mudanças de status');
        console.log('   - Timestamps de criação e atualização');
        console.log('   - Rastreamento completo pelo cliente');
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
console.log('🚀 Iniciando atualização do banco de dados...\n');
atualizarBanco();
