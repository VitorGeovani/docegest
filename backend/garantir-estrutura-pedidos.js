import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function garantirEstruturaPedidos() {
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

        // Verificar colunas existentes
        console.log('📊 Verificando estrutura da tabela reserva...\n');
        const [columns] = await connection.query(`
            SELECT COLUMN_NAME
            FROM information_schema.COLUMNS
            WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'reserva';
        `, [process.env.DB_NAME || 'segredodosabor']);

        const existingColumns = columns.map(col => col.COLUMN_NAME);
        
        // Colunas necessárias
        const requiredColumns = [
            { name: 'status', type: "ENUM('Pendente', 'Confirmado', 'Preparando', 'Pronto', 'Entregue', 'Cancelado')", default: "'Pendente'" },
            { name: 'numero_pedido', type: 'VARCHAR(20)', default: 'NULL' },
            { name: 'data_pedido', type: 'DATETIME', default: 'CURRENT_TIMESTAMP' },
            { name: 'data_atualizacao', type: 'DATETIME', default: 'NULL ON UPDATE CURRENT_TIMESTAMP' },
            { name: 'historico_status', type: 'JSON', default: 'NULL' },
            { name: 'endereco_entrega', type: 'TEXT', default: 'NULL' },
            { name: 'observacoes', type: 'TEXT', default: 'NULL' },
            { name: 'tipo_pedido', type: "ENUM('ENTREGA', 'RETIRADA')", default: "'ENTREGA'" }
        ];

        let needsUpdate = false;
        const columnsToAdd = [];

        // Verificar cada coluna necessária
        for (const col of requiredColumns) {
            if (!existingColumns.includes(col.name)) {
                columnsToAdd.push(col);
                needsUpdate = true;
            }
        }

        if (!needsUpdate) {
            console.log('✅ Todas as colunas necessárias já existem!\n');
            
            // Verificar se status é ENUM com todos os valores
            console.log('🔍 Verificando tipo da coluna status...\n');
            const [statusColumn] = await connection.query(`
                SELECT COLUMN_TYPE
                FROM information_schema.COLUMNS
                WHERE TABLE_SCHEMA = ? 
                AND TABLE_NAME = 'reserva' 
                AND COLUMN_NAME = 'status';
            `, [process.env.DB_NAME || 'segredodosabor']);

            if (statusColumn.length > 0) {
                const columnType = statusColumn[0].COLUMN_TYPE;
                console.log(`  Status atual: ${columnType}\n`);
                
                const expectedValues = ['Pendente', 'Confirmado', 'Preparando', 'Pronto', 'Entregue', 'Cancelado'];
                const hasAllValues = expectedValues.every(val => columnType.includes(val));
                
                if (!hasAllValues) {
                    console.log('⚠️ Coluna status não tem todos os valores necessários!\n');
                    console.log('🔧 Atualizando coluna status...\n');
                    
                    await connection.query(`
                        ALTER TABLE reserva 
                        MODIFY COLUMN status ENUM('Pendente', 'Confirmado', 'Preparando', 'Pronto', 'Entregue', 'Cancelado') 
                        DEFAULT 'Pendente';
                    `);
                    
                    console.log('✅ Coluna status atualizada!\n');
                } else {
                    console.log('✅ Coluna status está correta!\n');
                }
            }
            
            return;
        }

        console.log(`⚠️ Faltam ${columnsToAdd.length} coluna(s). Adicionando...\n`);

        // Adicionar colunas faltantes
        for (const col of columnsToAdd) {
            console.log(`  🔧 Adicionando coluna: ${col.name} (${col.type})...`);
            
            const defaultClause = col.default === 'NULL' 
                ? 'DEFAULT NULL' 
                : col.default === 'CURRENT_TIMESTAMP'
                ? 'DEFAULT CURRENT_TIMESTAMP'
                : col.default === 'NULL ON UPDATE CURRENT_TIMESTAMP'
                ? 'DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP'
                : `DEFAULT ${col.default}`;
            
            try {
                await connection.query(`
                    ALTER TABLE reserva 
                    ADD COLUMN ${col.name} ${col.type} ${defaultClause};
                `);
                console.log(`     ✅ Coluna ${col.name} adicionada!`);
            } catch (error) {
                if (error.code === 'ER_DUP_FIELDNAME') {
                    console.log(`     ℹ️ Coluna ${col.name} já existe, pulando...`);
                } else {
                    console.error(`     ❌ Erro ao adicionar ${col.name}: ${error.message}`);
                }
            }
        }

        // Criar índice para otimizar buscas por status
        console.log('\n🔧 Criando índice para coluna status...\n');
        try {
            await connection.query(`
                CREATE INDEX idx_status ON reserva(status);
            `);
            console.log('✅ Índice criado!\n');
        } catch (error) {
            if (error.code === 'ER_DUP_KEYNAME') {
                console.log('ℹ️ Índice já existe!\n');
            } else {
                console.error(`⚠️ Erro ao criar índice: ${error.message}\n`);
            }
        }

        // Criar índice para número do pedido
        console.log('🔧 Criando índice para numero_pedido...\n');
        try {
            await connection.query(`
                CREATE INDEX idx_numero_pedido ON reserva(numero_pedido);
            `);
            console.log('✅ Índice criado!\n');
        } catch (error) {
            if (error.code === 'ER_DUP_KEYNAME') {
                console.log('ℹ️ Índice já existe!\n');
            } else {
                console.error(`⚠️ Erro ao criar índice: ${error.message}\n`);
            }
        }

        // Atualizar pedidos existentes sem número
        console.log('🔧 Atualizando números de pedidos...\n');
        const [updateResult] = await connection.query(`
            UPDATE reserva
            SET numero_pedido = CONCAT('PED', LPAD(idreserva, 6, '0'))
            WHERE numero_pedido IS NULL;
        `);
        console.log(`✅ ${updateResult.affectedRows} pedido(s) atualizado(s)!\n`);

        console.log('✅ Estrutura da tabela atualizada com sucesso!\n');

        // Mostrar resumo
        console.log('📊 Resumo da estrutura:\n');
        const [finalColumns] = await connection.query(`
            SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE, COLUMN_DEFAULT
            FROM information_schema.COLUMNS
            WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'reserva'
            ORDER BY ORDINAL_POSITION;
        `, [process.env.DB_NAME || 'segredodosabor']);

        finalColumns.forEach(col => {
            const icon = requiredColumns.find(req => req.name === col.COLUMN_NAME) ? '✅' : '  ';
            console.log(`${icon} ${col.COLUMN_NAME} (${col.COLUMN_TYPE})`);
        });

        console.log('\n🎉 Configuração concluída!\n');

    } catch (error) {
        console.error('❌ Erro:', error.message);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Executar
garantirEstruturaPedidos();
