import connection from './src/repository/connection.js';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function executarMigracaoWhatsApp() {
    try {
        console.log('🚀 Iniciando migração de tabelas WhatsApp...\n');

        // Ler arquivo SQL
        const sqlPath = join(__dirname, 'criar-tabela-mensagens-whatsapp.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        // Dividir em statements individuais
        const statements = sql
            .split('DELIMITER $$')[0]
            .split(';')
            .filter(stmt => stmt.trim().length > 0 && !stmt.trim().startsWith('--'));

        console.log(`📝 Executando ${statements.length} comandos SQL...\n`);

        // Executar cada statement
        for (let i = 0; i < statements.length; i++) {
            const stmt = statements[i].trim();
            if (stmt) {
                try {
                    await connection.query(stmt);
                    console.log(`✅ [${i + 1}/${statements.length}] Comando executado com sucesso`);
                } catch (error) {
                    if (error.code === 'ER_TABLE_EXISTS_ALREADY' || 
                        error.message.includes('already exists') ||
                        error.code === 'ER_DUP_FIELDNAME') {
                        console.log(`⚠️  [${i + 1}/${statements.length}] Já existe, ignorando...`);
                    } else {
                        console.error(`❌ Erro no comando ${i + 1}:`, error.message);
                    }
                }
            }
        }

        // Executar procedures separadamente
        console.log('\n📦 Criando stored procedures...\n');

        const procedures = [
            {
                name: 'sp_registrar_mensagem_enviada',
                sql: `CREATE PROCEDURE IF NOT EXISTS sp_registrar_mensagem_enviada(
                    IN p_id_reserva INT,
                    IN p_telefone VARCHAR(20),
                    IN p_conteudo TEXT,
                    IN p_tipo_notificacao VARCHAR(50),
                    IN p_whatsapp_message_id VARCHAR(100)
                )
                BEGIN
                    INSERT INTO tb_mensagens_whatsapp (
                        id_reserva,
                        telefone,
                        tipo_mensagem,
                        conteudo,
                        status_envio,
                        tipo_notificacao,
                        whatsapp_message_id
                    ) VALUES (
                        p_id_reserva,
                        p_telefone,
                        'enviada',
                        p_conteudo,
                        'enviado',
                        p_tipo_notificacao,
                        p_whatsapp_message_id
                    );
                    
                    SELECT LAST_INSERT_ID() as id_mensagem;
                END`
            },
            {
                name: 'sp_registrar_mensagem_recebida',
                sql: `CREATE PROCEDURE IF NOT EXISTS sp_registrar_mensagem_recebida(
                    IN p_telefone VARCHAR(20),
                    IN p_conteudo TEXT,
                    IN p_whatsapp_message_id VARCHAR(100)
                )
                BEGIN
                    DECLARE v_id_mensagem INT;
                    
                    INSERT INTO tb_mensagens_whatsapp (
                        telefone,
                        tipo_mensagem,
                        conteudo,
                        status_envio,
                        whatsapp_message_id
                    ) VALUES (
                        p_telefone,
                        'recebida',
                        p_conteudo,
                        'entregue',
                        p_whatsapp_message_id
                    );
                    
                    SET v_id_mensagem = LAST_INSERT_ID();
                    
                    SELECT 
                        id_mensagem,
                        telefone,
                        conteudo,
                        data_hora_envio
                    FROM tb_mensagens_whatsapp
                    WHERE id_mensagem = v_id_mensagem;
                END`
            },
            {
                name: 'sp_buscar_historico_mensagens',
                sql: `CREATE PROCEDURE IF NOT EXISTS sp_buscar_historico_mensagens(
                    IN p_telefone VARCHAR(20),
                    IN p_limite INT
                )
                BEGIN
                    SELECT 
                        m.id_mensagem,
                        m.id_reserva,
                        m.telefone,
                        m.tipo_mensagem,
                        m.conteudo,
                        m.status_envio,
                        m.tipo_notificacao,
                        m.data_hora_envio,
                        m.data_hora_leitura,
                        r.numero_pedido
                    FROM tb_mensagens_whatsapp m
                    LEFT JOIN reserva r ON m.id_reserva = r.idreserva
                    WHERE m.telefone COLLATE utf8mb4_unicode_ci = p_telefone COLLATE utf8mb4_unicode_ci
                    ORDER BY m.data_hora_envio DESC
                    LIMIT p_limite;
                END`
            },
            {
                name: 'sp_atualizar_status_mensagem',
                sql: `CREATE PROCEDURE IF NOT EXISTS sp_atualizar_status_mensagem(
                    IN p_whatsapp_message_id VARCHAR(100),
                    IN p_novo_status ENUM('pendente', 'enviado', 'entregue', 'lido', 'falha')
                )
                BEGIN
                    UPDATE tb_mensagens_whatsapp
                    SET 
                        status_envio = p_novo_status,
                        data_hora_entrega = CASE WHEN p_novo_status = 'entregue' THEN NOW() ELSE data_hora_entrega END,
                        data_hora_leitura = CASE WHEN p_novo_status = 'lido' THEN NOW() ELSE data_hora_leitura END
                    WHERE whatsapp_message_id = p_whatsapp_message_id;
                    
                    SELECT ROW_COUNT() as linhas_afetadas;
                END`
            },
            {
                name: 'sp_atualizar_estatisticas_whatsapp',
                sql: `CREATE PROCEDURE IF NOT EXISTS sp_atualizar_estatisticas_whatsapp()
                BEGIN
                    INSERT INTO tb_whatsapp_estatisticas (
                        data_referencia,
                        total_mensagens_enviadas,
                        total_mensagens_recebidas,
                        total_mensagens_lidas,
                        total_pedidos_whatsapp,
                        tempo_medio_resposta_segundos
                    )
                    SELECT 
                        CURDATE(),
                        SUM(CASE WHEN tipo_mensagem = 'enviada' THEN 1 ELSE 0 END),
                        SUM(CASE WHEN tipo_mensagem = 'recebida' THEN 1 ELSE 0 END),
                        SUM(CASE WHEN status_envio = 'lido' THEN 1 ELSE 0 END),
                        (SELECT COUNT(*) FROM tb_reserva WHERE DATE(data_reserva) = CURDATE() AND canal_venda = 'whatsapp'),
                        0
                    FROM tb_mensagens_whatsapp
                    WHERE DATE(data_hora_envio) = CURDATE()
                    ON DUPLICATE KEY UPDATE
                        total_mensagens_enviadas = VALUES(total_mensagens_enviadas),
                        total_mensagens_recebidas = VALUES(total_mensagens_recebidas),
                        total_mensagens_lidas = VALUES(total_mensagens_lidas),
                        total_pedidos_whatsapp = VALUES(total_pedidos_whatsapp);
                END`
            }
        ];

        for (const proc of procedures) {
            try {
                // Dropar se existir
                await connection.query(`DROP PROCEDURE IF EXISTS ${proc.name}`);
                // Criar nova
                await connection.query(proc.sql);
                console.log(`✅ Procedure ${proc.name} criada com sucesso`);
            } catch (error) {
                console.error(`❌ Erro ao criar procedure ${proc.name}:`, error.message);
            }
        }

        // Verificar tabelas criadas
        console.log('\n📊 Verificando tabelas criadas...\n');

        const [tabelas] = await connection.query(`
            SHOW TABLES LIKE 'tb_%whatsapp%'
        `);

        console.log(`✅ ${tabelas.length} tabelas WhatsApp encontradas:`);
        tabelas.forEach(t => {
            console.log(`   - ${Object.values(t)[0]}`);
        });

        // Verificar procedures
        const [procs] = await connection.query(`
            SHOW PROCEDURE STATUS WHERE Db = DATABASE() AND Name LIKE 'sp_%whatsapp%'
        `);

        console.log(`\n✅ ${procs.length} procedures criadas\n`);

        console.log('🎉 Migração concluída com sucesso!\n');
        console.log('📝 Próximos passos:');
        console.log('   1. Reinicie o backend: npm start');
        console.log('   2. Teste os endpoints:');
        console.log('      GET  /whatsapp/status');
        console.log('      GET  /whatsapp/historico/:telefone');
        console.log('      GET  /whatsapp/estatisticas');
        console.log('      POST /whatsapp/webhook\n');

    } catch (error) {
        console.error('❌ Erro na migração:', error);
    } finally {
        await connection.end();
        process.exit(0);
    }
}

executarMigracaoWhatsApp();
