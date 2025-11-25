import mysql from 'mysql2/promise';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function executarProcedures() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'P@$$w0rd',
        database: 'segredodosabor',
        multipleStatements: true
    });

    console.log('✅ Conectado ao banco de dados');

    const sqlFile = path.join(__dirname, 'criar-procedures-manual.sql');
    const sql = await fs.readFile(sqlFile, 'utf8');

    console.log('📄 Criando stored procedures...');

    try {
        // 1. Procedure para buscar opções de um produto
        console.log('   [1/4] Criando sp_buscar_opcoes_produto...');
        await connection.query('DROP PROCEDURE IF EXISTS sp_buscar_opcoes_produto');
        await connection.query(`
            CREATE PROCEDURE sp_buscar_opcoes_produto(
                IN p_idproduto INT
            )
            BEGIN
                SELECT 
                    poa.idopcao_fk AS idopcao,
                    pop.nome,
                    pop.tipo,
                    pop.obrigatorio,
                    pop.multipla_selecao,
                    (
                        SELECT JSON_ARRAYAGG(
                            JSON_OBJECT(
                                'idvalor', ov.idvalor,
                                'nome', ov.nome_valor,
                                'preco', ov.preco_adicional
                            )
                        )
                        FROM opcao_valores ov
                        WHERE ov.idopcao_fk = poa.idopcao_fk
                    ) AS valores
                FROM produto_opcao_associacao poa
                INNER JOIN produto_opcoes_personalizacao pop ON poa.idopcao_fk = pop.idopcao
                WHERE poa.idproduto_fk = p_idproduto
                ORDER BY pop.ordem;
            END
        `);

        // 2. Procedure para calcular acréscimo total
        console.log('   [2/4] Criando sp_calcular_acrescimo_personalizacao...');
        await connection.query('DROP PROCEDURE IF EXISTS sp_calcular_acrescimo_personalizacao');
        await connection.query(`
            CREATE PROCEDURE sp_calcular_acrescimo_personalizacao(
                IN p_personalizacoes JSON,
                OUT p_valor_acrescimo DECIMAL(10,2)
            )
            BEGIN
                DECLARE v_total DECIMAL(10,2) DEFAULT 0.00;
                DECLARE v_num_opcoes INT;
                DECLARE v_idx INT DEFAULT 0;
                DECLARE v_idvalor INT;
                DECLARE v_preco DECIMAL(10,2);
                
                SET v_num_opcoes = JSON_LENGTH(p_personalizacoes);
                
                WHILE v_idx < v_num_opcoes DO
                    SET v_idvalor = JSON_UNQUOTE(JSON_EXTRACT(p_personalizacoes, CONCAT('$[', v_idx, '].idvalor')));
                    
                    SELECT preco_adicional INTO v_preco
                    FROM opcao_valores
                    WHERE idvalor = v_idvalor;
                    
                    SET v_total = v_total + COALESCE(v_preco, 0.00);
                    SET v_idx = v_idx + 1;
                END WHILE;
                
                SET p_valor_acrescimo = v_total;
            END
        `);

        // 3. Procedure para salvar personalização do pedido
        console.log('   [3/4] Criando sp_salvar_personalizacao_pedido...');
        await connection.query('DROP PROCEDURE IF EXISTS sp_salvar_personalizacao_pedido');
        await connection.query(`
            CREATE PROCEDURE sp_salvar_personalizacao_pedido(
                IN p_idreserva INT,
                IN p_idproduto INT,
                IN p_personalizacoes JSON
            )
            BEGIN
                DECLARE v_acrescimo DECIMAL(10,2) DEFAULT 0.00;
                
                CALL sp_calcular_acrescimo_personalizacao(p_personalizacoes, v_acrescimo);
                
                INSERT INTO pedido_personalizacoes (
                    idreserva_fk,
                    idproduto_fk,
                    personalizacoes_json,
                    valor_acrescimo
                ) VALUES (
                    p_idreserva,
                    p_idproduto,
                    p_personalizacoes,
                    v_acrescimo
                );
            END
        `);

        // 4. Trigger para atualizar valor do pedido
        console.log('   [4/4] Criando trg_atualizar_valor_com_personalizacao...');
        await connection.query('DROP TRIGGER IF EXISTS trg_atualizar_valor_com_personalizacao');
        await connection.query(`
            CREATE TRIGGER trg_atualizar_valor_com_personalizacao
            AFTER INSERT ON pedido_personalizacoes
            FOR EACH ROW
            BEGIN
                UPDATE tb_reserva
                SET valor_total = valor_total + NEW.valor_acrescimo
                WHERE idreserva = NEW.idreserva_fk;
            END
        `);

        console.log('✅ Stored procedures criadas com sucesso!');

        // Validar
        const [procedures] = await connection.query(
            "SHOW PROCEDURE STATUS WHERE Db = 'segredodosabor' AND (Name LIKE 'sp_%personalizacao%' OR Name LIKE 'sp_buscar_opcoes%' OR Name LIKE 'sp_calcular_acrescimo%' OR Name LIKE 'sp_salvar_personalizacao%')"
        );

        const [triggers] = await connection.query(
            "SHOW TRIGGERS FROM segredodosabor WHERE `Trigger` LIKE 'trg_%personalizacao%'"
        );

        console.log('\n📊 Validação:');
        console.log(`   ✅ ${procedures.length} stored procedures criadas`);
        procedures.forEach(p => console.log(`      - ${p.Name}`));
        
        console.log(`   ✅ ${triggers.length} trigger(s) criado(s)`);
        triggers.forEach(t => console.log(`      - ${t.Trigger}`));

        // Testar procedure principal
        console.log('\n🧪 Testando sp_buscar_opcoes_produto(1)...');
        const [result] = await connection.query('CALL sp_buscar_opcoes_produto(1)');
        console.log(`   ✅ Procedure funcionando! Retornou ${result[0].length} opções`);

    } catch (error) {
        console.error('❌ Erro:', error.message);
        process.exit(1);
    } finally {
        await connection.end();
    }
}

executarProcedures();
