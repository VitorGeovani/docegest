// Teste dos endpoints do Chat Assistente

const API_URL = 'http://localhost:5000';

console.log('🧪 TESTE DOS ENDPOINTS DO CHAT ASSISTENTE\n');
console.log('='.repeat(60));

async function testarEndpoints() {
    // Teste 1: Saudação
    console.log('\n📋 Teste 1: GET /api/assistente/saudacao');
    console.log('-'.repeat(60));
    try {
        const response = await fetch(`${API_URL}/api/assistente/saudacao`);
        const data = await response.json();
        
        if (data.sucesso && data.saudacao) {
            console.log('✅ SUCESSO');
            console.log('Saudação:', data.saudacao.substring(0, 100) + '...');
        } else {
            console.log('❌ ERRO: Resposta inválida');
            console.log('Data:', data);
        }
    } catch (error) {
        console.log('❌ ERRO:', error.message);
    }

    // Teste 2: Menu
    console.log('\n📋 Teste 2: GET /api/assistente/menu');
    console.log('-'.repeat(60));
    try {
        const response = await fetch(`${API_URL}/api/assistente/menu`);
        const data = await response.json();
        
        if (data.sucesso && data.opcoes) {
            console.log('✅ SUCESSO');
            console.log('Opções disponíveis:', data.opcoes.length);
            data.opcoes.forEach((opcao, i) => {
                console.log(`  ${i + 1}. ${opcao}`);
            });
        } else {
            console.log('❌ ERRO: Resposta inválida');
            console.log('Data:', data);
        }
    } catch (error) {
        console.log('❌ ERRO:', error.message);
    }

    // Teste 3: Mensagem simples
    console.log('\n📋 Teste 3: POST /api/assistente/mensagem');
    console.log('-'.repeat(60));
    try {
        const response = await fetch(`${API_URL}/api/assistente/mensagem`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                mensagem: 'Olá',
                contexto: { origem: 'teste' }
            })
        });
        const data = await response.json();
        
        if (data.sucesso && data.resposta) {
            console.log('✅ SUCESSO');
            console.log('Resposta:', data.resposta.substring(0, 100) + '...');
            console.log('Categoria:', data.categoria);
        } else {
            console.log('❌ ERRO: Resposta inválida');
            console.log('Data:', data);
        }
    } catch (error) {
        console.log('❌ ERRO:', error.message);
    }

    // Teste 4: Busca de pedido
    console.log('\n📋 Teste 4: POST /api/assistente/mensagem (Código de pedido)');
    console.log('-'.repeat(60));
    try {
        const response = await fetch(`${API_URL}/api/assistente/mensagem`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                mensagem: '#PED000037',
                contexto: { origem: 'teste' }
            })
        });
        const data = await response.json();
        
        if (data.sucesso && data.resposta) {
            console.log('✅ SUCESSO');
            console.log('Resposta:', data.resposta.substring(0, 150) + '...');
            console.log('Categoria:', data.categoria);
        } else {
            console.log('❌ ERRO: Resposta inválida');
            console.log('Data:', data);
        }
    } catch (error) {
        console.log('❌ ERRO:', error.message);
    }

    // Teste 5: Feedback
    console.log('\n📋 Teste 5: POST /api/assistente/feedback');
    console.log('-'.repeat(60));
    try {
        const response = await fetch(`${API_URL}/api/assistente/feedback`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                mensagem: 'teste-mensagem',
                feedback: 'positivo'
            })
        });
        const data = await response.json();
        
        if (data.sucesso) {
            console.log('✅ SUCESSO');
            console.log('Mensagem:', data.mensagem);
        } else {
            console.log('⚠️ Feedback não registrado (esperado se mensagem não existir)');
        }
    } catch (error) {
        console.log('❌ ERRO:', error.message);
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ TESTES CONCLUÍDOS!\n');
}

testarEndpoints().catch(console.error);
