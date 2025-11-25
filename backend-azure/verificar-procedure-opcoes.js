import mysql from 'mysql2/promise';

async function verificarProcedure() {
    const conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'P@$$w0rd',
        database: 'segredodosabor'
    });

    try {
        console.log('\n========================================');
        console.log('🔍 VERIFICANDO STORED PROCEDURE');
        console.log('========================================\n');

        // Mostrar definição da procedure
        const [procedures] = await conn.query(`
            SHOW CREATE PROCEDURE sp_buscar_opcoes_produto
        `);

        if (procedures.length > 0) {
            console.log('📄 Definição da procedure sp_buscar_opcoes_produto:\n');
            console.log(procedures[0]['Create Procedure']);
            console.log('\n========================================\n');
        }

        // Testar a procedure com um produto
        console.log('🧪 Testando procedure com produto ID 2 (Ovomaltine):\n');
        const [result] = await conn.query(`CALL sp_buscar_opcoes_produto(2)`);
        
        const opcoes = result[0];
        console.log(`✅ ${opcoes.length} opções retornadas:\n`);
        
        opcoes.forEach((opcao, index) => {
            console.log(`${index + 1}. ${opcao.nome} (${opcao.tipo})`);
            console.log(`   ID: ${opcao.idopcao}`);
            console.log(`   Obrigatório: ${opcao.obrigatorio ? 'Sim' : 'Não'}`);
            
            // Parse valores
            let valores = opcao.valores;
            if (Buffer.isBuffer(valores)) {
                valores = JSON.parse(valores.toString('utf8'));
            } else if (typeof valores === 'string') {
                valores = JSON.parse(valores);
            }
            
            console.log(`   Valores (${valores ? valores.length : 0}):`);
            if (valores && valores.length > 0) {
                valores.forEach(v => {
                    console.log(`      - ${v.nome}: R$ ${parseFloat(v.preco).toFixed(2)}`);
                });
            }
            console.log('');
        });

    } catch (error) {
        console.error('❌ Erro:', error.message);
        if (error.sqlMessage) {
            console.error('   SQL Error:', error.sqlMessage);
        }
    } finally {
        await conn.end();
    }
}

verificarProcedure();
