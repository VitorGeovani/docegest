/**
 * 🧪 TESTE RÁPIDO - WhatsApp Evolution API
 * 
 * Este script testa se o WhatsApp está funcionando corretamente
 */

import whatsappService from './src/services/whatsappService_EVOLUTION.js';

async function testarWhatsApp() {
    console.log('🧪 Teste Evolution API - Segredos do Sabor\n');
    console.log('='.repeat(50));
    
    // Verifica o modo
    if (whatsappService.isDemoMode()) {
        console.log('\n⚠️  MODO DEMO ATIVO');
        console.log('📱 Configure o .env para usar WhatsApp real\n');
    } else {
        console.log('\n✅ WhatsApp configurado!\n');
    }
    
    // Dados de teste
    const pedidoTeste = {
        numero: '12345',
        cliente: {
            nome: 'Cliente Teste',
            telefone: '11987654321' // COLOQUE SEU NÚMERO AQUI
        },
        itens: [
            { quantidade: 2, nome: 'Brigadeiro Gourmet' },
            { quantidade: 1, nome: 'Torta de Morango' }
        ],
        total: 45.90,
        metodoPagamento: 'PIX',
        pontoEntrega: 'Rua Exemplo, 123 - São Paulo/SP'
    };
    
    try {
        console.log('📤 Enviando notificação de pedido recebido...\n');
        
        const resultado = await whatsappService.notificarPedidoRecebido(pedidoTeste);
        
        if (resultado.success) {
            if (resultado.demo) {
                console.log('\n✅ Teste em MODO DEMO funcionou!');
                console.log('💡 Configure o .env para enviar mensagens reais\n');
            } else {
                console.log('\n🎉 Mensagem enviada com SUCESSO!');
                console.log('📱 Verifique seu WhatsApp!\n');
            }
        }
        
    } catch (error) {
        console.error('\n❌ ERRO ao enviar mensagem:');
        console.error(error.message);
        console.error('\n🔧 Verifique:');
        console.error('   1. Evolution API está rodando? (http://localhost:8080)');
        console.error('   2. Instância criada e QR Code escaneado?');
        console.error('   3. API Key correta no .env?');
        console.error('   4. Número de telefone no formato correto?\n');
    }
    
    console.log('='.repeat(50));
}

// Executa o teste
testarWhatsApp();
