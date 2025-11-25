// Script para testar endpoints da API
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000';

async function testarEndpoint(nome, url) {
    try {
        console.log(`\n🔍 Testando ${nome}...`);
        const response = await fetch(url);
        const data = await response.json();
        
        if (response.ok) {
            console.log(`✅ ${nome}: OK`);
            console.log(`   Status: ${response.status}`);
            console.log(`   Registros: ${Array.isArray(data) ? data.length : 'N/A'}`);
        } else {
            console.log(`❌ ${nome}: ERRO`);
            console.log(`   Status: ${response.status}`);
            console.log(`   Erro: ${JSON.stringify(data)}`);
        }
    } catch (error) {
        console.log(`❌ ${nome}: FALHA NA CONEXÃO`);
        console.log(`   Erro: ${error.message}`);
    }
}

async function executarTestes() {
    console.log('🚀 Iniciando testes dos endpoints...\n');
    
    await testarEndpoint('Categorias Ativas', `${BASE_URL}/categorias/ativas`);
    await testarEndpoint('Todas Categorias', `${BASE_URL}/categorias`);
    await testarEndpoint('Produtos', `${BASE_URL}/produto/listar`);
    await testarEndpoint('Ingredientes', `${BASE_URL}/ingrediente/listar`);
    await testarEndpoint('Reservas Pendentes', `${BASE_URL}/reserva/pendente`);
    await testarEndpoint('Receita Total', `${BASE_URL}/relatorio/receita-total`);
    await testarEndpoint('Vendas Diárias', `${BASE_URL}/relatorio/vendas-diarias`);
    
    console.log('\n✅ Testes concluídos!\n');
}

executarTestes();
