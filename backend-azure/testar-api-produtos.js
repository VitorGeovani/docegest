import axios from 'axios';

async function testarAPI() {
    try {
        console.log('🧪 Testando endpoints da API...\n');

        // 1. Testar /produto/listar
        console.log('📡 GET http://localhost:5000/produto/listar');
        const response = await axios.get('http://localhost:5000/produto/listar');
        
        console.log(`✅ Status: ${response.status}`);
        console.log(`📊 Total de produtos retornados: ${response.data.length}\n`);

        if (response.data.length > 0) {
            console.log('📋 Estrutura do primeiro produto:');
            console.log(JSON.stringify(response.data[0], null, 2));
            
            console.log('\n📋 Todos os produtos:');
            console.table(response.data.map(p => ({
                ID: p.id,
                Nome: p.nome,
                Valor: `R$ ${p.valor?.toFixed(2) || 'N/A'}`,
                Preço: `R$ ${p.preco?.toFixed(2) || 'N/A'}`,
                Imagem: p.imagem ? '✅' : '❌',
                Categoria: p.categoria || p.id_categoria,
                Ativo: p.ativo
            })));
        } else {
            console.log('⚠️ Nenhum produto retornado pela API!');
        }

        // 2. Testar /categorias/ativas
        console.log('\n📡 GET http://localhost:5000/categorias/ativas');
        const categoriasRes = await axios.get('http://localhost:5000/categorias/ativas');
        console.log(`✅ Status: ${categoriasRes.status}`);
        console.log(`📊 Total de categorias: ${categoriasRes.data.length}\n`);

        if (categoriasRes.data.length > 0) {
            console.log('📂 Categorias:');
            console.table(categoriasRes.data);
        }

        console.log('\n✅ Teste concluído!');
    } catch (error) {
        console.error('❌ Erro ao testar API:');
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error(`Dados:`, error.response.data);
        } else if (error.request) {
            console.error('❌ Servidor não respondeu! Verifique se o backend está rodando em http://localhost:5000');
        } else {
            console.error(error.message);
        }
    }
}

testarAPI();
