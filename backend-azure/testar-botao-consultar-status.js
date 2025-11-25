// Teste: Botão "Consultar Status"
import assistente from './src/services/assistenteVirtualService.js';

console.log('🧪 TESTE: Botão "Consultar Status"\n');
console.log('='.repeat(60));

async function testarConsultarStatus() {
    const testeCases = [
        {
            nome: 'Teste 1: Botão "Consultar status"',
            mensagem: 'Consultar status',
            esperado: 'Deve pedir código do pedido'
        },
        {
            nome: 'Teste 2: Variação "consultar status"',
            mensagem: 'consultar status',
            esperado: 'Deve pedir código do pedido'
        },
        {
            nome: 'Teste 3: "status"',
            mensagem: 'status',
            esperado: 'Deve pedir código do pedido'
        },
        {
            nome: 'Teste 4: "Status do pedido"',
            mensagem: 'Status do pedido',
            esperado: 'Deve pedir código do pedido'
        },
        {
            nome: 'Teste 5: "Qual o status do meu pedido?"',
            mensagem: 'Qual o status do meu pedido?',
            esperado: 'Deve pedir código do pedido'
        },
        {
            nome: 'Teste 6: "Quero consultar meu pedido"',
            mensagem: 'Quero consultar meu pedido',
            esperado: 'Deve pedir código do pedido'
        },
        {
            nome: 'Teste 7: "Ver status"',
            mensagem: 'Ver status',
            esperado: 'Deve pedir código do pedido'
        },
        {
            nome: 'Teste 8: "Rastrear pedido"',
            mensagem: 'Rastrear pedido',
            esperado: 'Deve pedir código do pedido'
        }
    ];

    for (const teste of testeCases) {
        console.log(`\n📋 ${teste.nome}`);
        console.log(`📝 Mensagem: "${teste.mensagem}"`);
        console.log(`🎯 Esperado: ${teste.esperado}`);
        console.log('-'.repeat(60));

        try {
            const resposta = await assistente.processarMensagem(teste.mensagem, {});
            
            console.log(`\n📱 RESPOSTA DO BOT:\n`);
            console.log(resposta.resposta.substring(0, 200) + '...');
            console.log(`\n📊 Categoria: ${resposta.categoria}`);
            console.log(`📈 Confiança: ${(resposta.confianca * 100).toFixed(0)}%`);
            
            // Verificar se detectou status
            if (resposta.categoria === 'status' || resposta.acaoEspecial === 'buscarPedido') {
                console.log(`✅ SUCESSO: Detectou consulta de status!`);
            } else if (resposta.categoria === 'solicitacaoDados' || resposta.aguardandoDados) {
                console.log(`✅ SUCESSO: Está pedindo código do pedido!`);
            } else {
                console.log(`⚠️  Categoria inesperada: ${resposta.categoria}`);
            }
            
        } catch (error) {
            console.log(`❌ ERRO: ${error.message}`);
        }
        
        console.log('='.repeat(60));
    }

    console.log('\n\n✅ TESTE COMPLETO FINALIZADO!\n');
}

testarConsultarStatus().catch(console.error);
