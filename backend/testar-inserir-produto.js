import axios from 'axios';
import FormData from 'form-data';

async function testarInserirProduto() {
    try {
        console.log('🧪 Testando inserção de produto...\n');

        const formData = new FormData();
        formData.append('nome', 'Teste Produto');
        formData.append('preco', '15.50');
        formData.append('quantidade', '10');
        formData.append('idcategoria', '1');
        formData.append('descricao', 'Produto de teste');
        formData.append('disponivel', 'true');

        console.log('📦 Dados sendo enviados:');
        console.log('  nome: Teste Produto');
        console.log('  preco: 15.50');
        console.log('  quantidade: 10');
        console.log('  idcategoria: 1');
        console.log('  descricao: Produto de teste');
        console.log('  disponivel: true\n');

        const response = await axios.post('http://localhost:5000/produto/inserir', formData, {
            headers: formData.getHeaders()
        });

        console.log('✅ Sucesso!');
        console.log('ID do produto criado:', response.data.id);
        console.log('\nResposta completa:', JSON.stringify(response.data, null, 2));

    } catch (error) {
        console.log('❌ Erro ao inserir produto!\n');
        
        if (error.response) {
            console.log('Status:', error.response.status);
            console.log('Erro:', error.response.data);
            console.log('\nDetalhes:');
            console.log(JSON.stringify(error.response.data, null, 2));
        } else if (error.request) {
            console.log('Erro de rede - nenhuma resposta do servidor');
            console.log('Certifique-se de que o backend está rodando em http://localhost:5000');
        } else {
            console.log('Erro:', error.message);
        }
    }
}

testarInserirProduto();
