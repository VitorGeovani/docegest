import assistenteVirtualService from './src/services/assistenteVirtualService.js';

/**
 * Script para testar as intenções do Assistente Virtual
 */

async function testarIntencoes() {
    console.log('\n🧪 TESTE: Intenções do Assistente Virtual\n');
    console.log('='.repeat(60));
    
    const testes = [
        {
            nome: 'Fazer um pedido',
            mensagem: 'Fazer um pedido',
            esperado: 'pedido',
            descricao: 'Deve retornar instruções de como fazer pedido'
        },
        {
            nome: 'Consultar status',
            mensagem: 'Consultar status',
            esperado: 'status',
            descricao: 'Deve pedir código do pedido'
        },
        {
            nome: 'Como fazer um pedido',
            mensagem: 'Como fazer um pedido',
            esperado: 'pedido',
            descricao: 'Deve retornar instruções de como fazer pedido'
        },
        {
            nome: 'Ver status do pedido',
            mensagem: 'Ver status do meu pedido',
            esperado: 'status',
            descricao: 'Deve pedir código do pedido'
        },
        {
            nome: 'Código PED000037',
            mensagem: '#PED000037',
            esperado: 'statusPedido',
            descricao: 'Deve buscar o pedido específico'
        },
        {
            nome: 'Código sem #',
            mensagem: 'PED000037',
            esperado: 'statusPedido',
            descricao: 'Deve buscar o pedido específico'
        },
        {
            nome: 'Código PED000038',
            mensagem: '#PED000038',
            esperado: 'statusPedido',
            descricao: 'Deve buscar o pedido PED000038'
        },
        {
            nome: 'PED000038 sem #',
            mensagem: 'PED000038',
            esperado: 'statusPedido',
            descricao: 'Deve buscar o pedido PED000038 sem #'
        }
    ];
    
    for (const teste of testes) {
        console.log(`\n📋 Teste: ${teste.nome}`);
        console.log(`   Mensagem: "${teste.mensagem}"`);
        console.log(`   Esperado: ${teste.esperado}`);
        console.log(`   ─────────────────────────────────────────`);
        
        try {
            const resposta = await assistenteVirtualService.processarMensagem(teste.mensagem);
            
            const sucesso = resposta.categoria === teste.esperado;
            const status = sucesso ? '✅' : '❌';
            
            console.log(`   ${status} Resultado: ${resposta.categoria}`);
            console.log(`   Confiança: ${(resposta.confianca * 100).toFixed(1)}%`);
            
            // Mostrar primeiras 3 linhas da resposta
            const linhasResposta = resposta.resposta.split('\n').slice(0, 3);
            console.log(`   Resposta:`);
            linhasResposta.forEach(linha => {
                if (linha.trim()) {
                    console.log(`     ${linha.substring(0, 50)}${linha.length > 50 ? '...' : ''}`);
                }
            });
            
            if (!sucesso) {
                console.log(`   ⚠️ FALHA: Esperava "${teste.esperado}" mas recebeu "${resposta.categoria}"`);
            }
            
        } catch (error) {
            console.log(`   ❌ ERRO: ${error.message}`);
        }
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ Testes concluídos!\n');
    
    process.exit(0);
}

// Executar testes
testarIntencoes();
