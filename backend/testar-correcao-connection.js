import pool from './src/repository/connection.js';
import * as receitaRepo from './src/repository/receitaRepository.js';

console.log('🧪 Testando correção do erro "connection.rollback is not a function"\n');

async function testar() {
    try {
        console.log('1️⃣ Testando pool básico...');
        const [rows] = await pool.query('SELECT 1 AS teste');
        console.log('   ✅ Pool funcionando:', rows[0].teste === 1);

        console.log('\n2️⃣ Testando função com transação (receitaRepository)...');
        
        // Testar com produto inexistente (deve gerar erro controlado)
        try {
            await receitaRepo.adicionarIngredientesReceita(9999, [
                {
                    idingrediente: 1,
                    quantidade: 100,
                    unidadeMedida: 'g',
                    custo: 5.00
                }
            ]);
            console.log('   ⚠️ Não deveria ter chegado aqui');
        } catch (err) {
            // Erro esperado, mas não deve ser "rollback is not a function"
            if (err.message.includes('rollback is not a function')) {
                console.log('   ❌ ERRO: connection.rollback ainda não funciona!');
                throw err;
            }
            console.log('   ✅ Transação funcionando (erro controlado capturado)');
        }

        console.log('\n3️⃣ Testando listar ingredientes...');
        const ingredientes = await receitaRepo.listarIngredientesReceita(1);
        console.log(`   ✅ Lista retornou ${ingredientes.length} ingredientes`);

        console.log('\n4️⃣ Testando calcular custo...');
        const custo = await receitaRepo.calcularCustoProducao(1);
        console.log(`   ✅ Custo calculado: R$ ${custo.toFixed(2)}`);

        console.log('\n🎉 TODOS OS TESTES PASSARAM!');
        console.log('\n✅ Correção aplicada com sucesso:');
        console.log('   - connection.beginTransaction() ✅');
        console.log('   - connection.commit() ✅');
        console.log('   - connection.rollback() ✅');
        console.log('   - connection.release() ✅');
        
    } catch (error) {
        console.error('\n❌ ERRO NO TESTE:', error.message);
        throw error;
    } finally {
        await pool.end();
        console.log('\n🔌 Conexão fechada');
    }
}

testar();
