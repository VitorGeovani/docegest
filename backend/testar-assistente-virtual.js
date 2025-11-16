import fetch from 'node-fetch';

/**
 * 🧪 SCRIPT: TESTAR ASSISTENTE VIRTUAL
 * Testa todos os endpoints do chatbot
 */

const BASE_URL = 'http://localhost:5000';

async function testarAssistenteVirtual() {
    console.log('🤖 Iniciando testes do Assistente Virtual...\n');
    console.log('═══════════════════════════════════════════════════════════\n');

    let testesPassaram = 0;
    let testesFalharam = 0;

    // ===================================================================
    // TESTE 1: Obter Saudação
    // ===================================================================
    console.log('📝 TESTE 1: GET /api/assistente/saudacao');
    try {
        const response = await fetch(`${BASE_URL}/api/assistente/saudacao?nome=João`);
        const data = await response.json();

        if (response.ok && data.sucesso && data.saudacao) {
            console.log('✅ PASSOU');
            console.log('   Resposta:', data.saudacao.substring(0, 50) + '...');
            testesPassaram++;
        } else {
            throw new Error('Resposta inválida');
        }
    } catch (error) {
        console.log('❌ FALHOU:', error.message);
        testesFalharam++;
    }
    console.log('');

    // ===================================================================
    // TESTE 2: Obter Menu Principal
    // ===================================================================
    console.log('📝 TESTE 2: GET /api/assistente/menu');
    try {
        const response = await fetch(`${BASE_URL}/api/assistente/menu`);
        const data = await response.json();

        if (response.ok && data.sucesso && Array.isArray(data.opcoes)) {
            console.log('✅ PASSOU');
            console.log('   Opções:', data.opcoes.length);
            testesPassaram++;
        } else {
            throw new Error('Resposta inválida');
        }
    } catch (error) {
        console.log('❌ FALHOU:', error.message);
        testesFalharam++;
    }
    console.log('');

    // ===================================================================
    // TESTE 3: Processar Mensagem - Saudação
    // ===================================================================
    console.log('📝 TESTE 3: POST /api/assistente/mensagem (saudação)');
    try {
        const response = await fetch(`${BASE_URL}/api/assistente/mensagem`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                mensagem: 'Olá',
                contexto: { origem: 'teste' }
            })
        });
        const data = await response.json();

        if (response.ok && data.sucesso && data.resposta) {
            console.log('✅ PASSOU');
            console.log('   Resposta:', data.resposta.substring(0, 50) + '...');
            console.log('   Confiança:', data.confianca);
            testesPassaram++;
        } else {
            throw new Error('Resposta inválida');
        }
    } catch (error) {
        console.log('❌ FALHOU:', error.message);
        testesFalharam++;
    }
    console.log('');

    // ===================================================================
    // TESTE 4: Processar Mensagem - Pedido
    // ===================================================================
    console.log('📝 TESTE 4: POST /api/assistente/mensagem (pedido)');
    try {
        const response = await fetch(`${BASE_URL}/api/assistente/mensagem`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                mensagem: 'Como faço um pedido?',
                contexto: { origem: 'teste' }
            })
        });
        const data = await response.json();

        if (response.ok && data.sucesso && data.categoria === 'pedidos') {
            console.log('✅ PASSOU');
            console.log('   Categoria:', data.categoria);
            console.log('   Confiança:', data.confianca);
            console.log('   Resposta:', data.resposta.substring(0, 50) + '...');
            testesPassaram++;
        } else {
            throw new Error('Resposta inválida ou categoria errada');
        }
    } catch (error) {
        console.log('❌ FALHOU:', error.message);
        testesFalharam++;
    }
    console.log('');

    // ===================================================================
    // TESTE 5: Processar Mensagem - Horário
    // ===================================================================
    console.log('📝 TESTE 5: POST /api/assistente/mensagem (horário)');
    try {
        const response = await fetch(`${BASE_URL}/api/assistente/mensagem`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                mensagem: 'Qual o horário de funcionamento?',
                contexto: { origem: 'teste' }
            })
        });
        const data = await response.json();

        if (response.ok && data.sucesso && data.categoria === 'horario') {
            console.log('✅ PASSOU');
            console.log('   Categoria:', data.categoria);
            console.log('   Confiança:', data.confianca);
            testesPassaram++;
        } else {
            throw new Error('Resposta inválida ou categoria errada');
        }
    } catch (error) {
        console.log('❌ FALHOU:', error.message);
        testesFalharam++;
    }
    console.log('');

    // ===================================================================
    // TESTE 6: Processar Mensagem - Formas de Pagamento
    // ===================================================================
    console.log('📝 TESTE 6: POST /api/assistente/mensagem (pagamento)');
    try {
        const response = await fetch(`${BASE_URL}/api/assistente/mensagem`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                mensagem: 'Como posso pagar?',
                contexto: { origem: 'teste' }
            })
        });
        const data = await response.json();

        if (response.ok && data.sucesso && data.categoria === 'pagamento') {
            console.log('✅ PASSOU');
            console.log('   Categoria:', data.categoria);
            console.log('   Confiança:', data.confianca);
            testesPassaram++;
        } else {
            throw new Error('Resposta inválida ou categoria errada');
        }
    } catch (error) {
        console.log('❌ FALHOU:', error.message);
        testesFalharam++;
    }
    console.log('');

    // ===================================================================
    // TESTE 7: Enviar Feedback
    // ===================================================================
    console.log('📝 TESTE 7: POST /api/assistente/feedback');
    try {
        const response = await fetch(`${BASE_URL}/api/assistente/feedback`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                mensagem: 'Como faço um pedido?',
                feedback: 'positivo'
            })
        });
        const data = await response.json();

        if (response.ok && data.sucesso) {
            console.log('✅ PASSOU');
            console.log('   Mensagem:', data.mensagem);
            testesPassaram++;
        } else {
            throw new Error('Resposta inválida');
        }
    } catch (error) {
        console.log('❌ FALHOU:', error.message);
        testesFalharam++;
    }
    console.log('');

    // ===================================================================
    // TESTE 8: Mensagem Não Reconhecida
    // ===================================================================
    console.log('📝 TESTE 8: POST /api/assistente/mensagem (não reconhecida)');
    try {
        const response = await fetch(`${BASE_URL}/api/assistente/mensagem`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                mensagem: 'xyzabc123',
                contexto: { origem: 'teste' }
            })
        });
        const data = await response.json();

        if (response.ok && data.sucesso && data.confianca === 0) {
            console.log('✅ PASSOU');
            console.log('   Confiança:', data.confianca, '(esperado: 0)');
            console.log('   Sugestões:', data.sugestoes?.length || 0);
            testesPassaram++;
        } else {
            throw new Error('Deveria ter confiança 0');
        }
    } catch (error) {
        console.log('❌ FALHOU:', error.message);
        testesFalharam++;
    }
    console.log('');

    // ===================================================================
    // RESUMO FINAL
    // ===================================================================
    console.log('═══════════════════════════════════════════════════════════');
    console.log('📊 RESUMO DOS TESTES');
    console.log('═══════════════════════════════════════════════════════════\n');

    const total = testesPassaram + testesFalharam;
    const porcentagem = ((testesPassaram / total) * 100).toFixed(1);

    console.log(`✅ Testes Passaram: ${testesPassaram}/${total} (${porcentagem}%)`);
    console.log(`❌ Testes Falharam: ${testesFalharam}/${total}`);
    console.log('');

    if (testesFalharam === 0) {
        console.log('🎉 TODOS OS TESTES PASSARAM!');
        console.log('   O Assistente Virtual está funcionando perfeitamente!\n');
    } else {
        console.log('⚠️  ALGUNS TESTES FALHARAM');
        console.log('   Verifique os erros acima e tente novamente.\n');
    }

    console.log('═══════════════════════════════════════════════════════════');
}

// Executar testes
testarAssistenteVirtual().catch(console.error);
