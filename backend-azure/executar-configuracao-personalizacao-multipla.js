import mysql from 'mysql2/promise';
import fs from 'fs';

async function configurarPersonalizacaoMultipla() {
    const conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'P@$$w0rd',
        database: 'segredodosabor',
        multipleStatements: true
    });

    try {
        console.log('\n==========================================');
        console.log('📦 CONFIGURANDO PERSONALIZAÇÃO MÚLTIPLA');
        console.log('==========================================\n');

        // Ler e executar SQL
        const sql = fs.readFileSync('../configurar-personalizacao-multipla.sql', 'utf8');
        
        console.log('📄 Executando script SQL...\n');
        const [results] = await conn.query(sql);

        // Exibir resultados
        if (Array.isArray(results)) {
            results.forEach((result, index) => {
                if (result && Array.isArray(result) && result.length > 0) {
                    console.log(`\n📊 Resultado ${index + 1}:`);
                    console.table(result);
                }
            });
        }

        console.log('\n==========================================');
        console.log('✅ CONFIGURAÇÃO CONCLUÍDA COM SUCESSO!');
        console.log('==========================================\n');

        console.log('🎉 Personalização múltipla configurada!\n');
        console.log('📝 O que foi criado:');
        console.log('   ✅ Opção "Extras" (tipo: checkbox)');
        console.log('   ✅ 4 valores com preços diferentes');
        console.log('   ✅ Vinculado a um produto (Mousse de Limão)');
        console.log('   ✅ Ingredientes vinculados para baixa de estoque\n');

        console.log('🧪 Para testar:');
        console.log('   1. Abra o frontend: http://localhost:3000/catalogo');
        console.log('   2. Encontre o produto Mousse de Limão');
        console.log('   3. Clique em "Adicionar ao Carrinho"');
        console.log('   4. No carrinho, clique em "Personalizar"');
        console.log('   5. Marque VÁRIOS checkboxes em "Extras"');
        console.log('   6. Veja o valor total somar corretamente');
        console.log('   7. Finalize o pedido');
        console.log('   8. Verifique baixa automática no estoque\n');

        console.log('💡 Como funciona:');
        console.log('   - tipo_selecao = "checkbox" → múltipla seleção');
        console.log('   - tipo_selecao = "radio" → seleção única');
        console.log('   - tipo_selecao = "select" → dropdown\n');

    } catch (error) {
        console.error('\n❌ Erro:', error.message);
        throw error;
    } finally {
        await conn.end();
    }
}

configurarPersonalizacaoMultipla().catch(console.error);
