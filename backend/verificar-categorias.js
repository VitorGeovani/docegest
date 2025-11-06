import axios from 'axios';

async function verificarCategorias() {
    try {
        console.log('🔍 Verificando categorias ativas...\n');

        const response = await axios.get('http://localhost:5000/categorias/ativas');
        
        console.log(`✅ ${response.data.length} categoria(s) ativa(s) encontrada(s):\n`);
        
        if (response.data.length === 0) {
            console.log('⚠️ PROBLEMA: Não há categorias ativas no banco!');
            console.log('   Isso impedirá o cadastro de novos produtos.\n');
            console.log('💡 Solução: Crie pelo menos uma categoria ativa no sistema.');
        } else {
            response.data.forEach(cat => {
                console.log(`   ID: ${cat.id} | Nome: ${cat.nome}`);
            });
        }

    } catch (error) {
        console.log('❌ Erro ao buscar categorias!\n');
        
        if (error.response) {
            console.log('Status:', error.response.status);
            console.log('Erro:', error.response.data);
        } else if (error.request) {
            console.log('Erro de rede - backend não está respondendo');
        } else {
            console.log('Erro:', error.message);
        }
    }
}

verificarCategorias();
