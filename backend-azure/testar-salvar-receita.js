import axios from 'axios';

async function testarSalvarReceita() {
    try {
        console.log('🧪 Testando salvar receita...\n');

        const idProduto = 35; // ID do produto de teste
        
        const ingredientes = [
            {
                idingrediente: 1,
                quantidade: 0.5,
                unidadeMedida: 'kg',
                custo: 20.00
            },
            {
                idingrediente: 2,
                quantidade: 0.3,
                unidadeMedida: 'kg',
                custo: 3.00
            }
        ];

        console.log('📝 Dados a serem enviados:');
        console.log('ID Produto:', idProduto);
        console.log('Ingredientes:', JSON.stringify(ingredientes, null, 2));
        console.log('\n');

        const response = await axios.post(
            `http://localhost:5000/receita/${idProduto}`,
            { ingredientes }
        );

        console.log('✅ Resposta do servidor:');
        console.log(response.data);
        console.log('\n✅ Teste PASSOU!');

    } catch (error) {
        console.error('❌ Erro ao testar:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Dados:', error.response.data);
        } else {
            console.error(error.message);
        }
        console.log('\n❌ Teste FALHOU!');
    }
}

// Executar teste
testarSalvarReceita();
