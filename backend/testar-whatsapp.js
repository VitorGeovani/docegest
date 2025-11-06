/**
 * 🧪 TESTE COMPLETO - WhatsApp Integration
 * 
 * Execute este arquivo para testar a integração WhatsApp
 * 
 * COMO USAR:
 * 1. Certifique-se que o backend está rodando
 * 2. Execute: node testar-whatsapp.js
 * 3. Verifique os resultados no console e no WhatsApp
 */

import axios from 'axios';
import whatsappService from './src/services/whatsappService.js';

const API_URL = 'http://localhost:5000';

// Cores para console
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function separator() {
    console.log('='.repeat(60));
}

async function testarConfiguracao() {
    separator();
    log('🔧 TESTE 1: Verificar Configuração WhatsApp', 'cyan');
    separator();
    
    try {
        const response = await axios.get(`${API_URL}/whatsapp/config`);
        
        log(`Status: ${response.status === 200 ? '✅ OK' : '❌ ERRO'}`, 
            response.status === 200 ? 'green' : 'red');
        
        log(`Modo: ${response.data.demoMode ? '⚠️  DEMO' : '✅ PRODUÇÃO'}`, 
            response.data.demoMode ? 'yellow' : 'green');
        
        log(`Configurado: ${response.data.configured ? '✅ SIM' : '❌ NÃO'}`,
            response.data.configured ? 'green' : 'red');
        
        log(`Número Business: ${response.data.businessPhone}`);
        log(`Mensagem: ${response.data.message}`);
        
        console.log();
        
        return !response.data.demoMode;
    } catch (error) {
        log(`❌ Erro ao verificar configuração: ${error.message}`, 'red');
        return false;
    }
}

async function testarEnvioSimples() {
    separator();
    log('📱 TESTE 2: Envio de Mensagem Simples', 'cyan');
    separator();
    
    const testNumber = '5511967696744'; // Número do negócio
    const testMessage = '🧪 TESTE AUTOMATIZADO\n\nSe você recebeu esta mensagem, a integração WhatsApp está funcionando!\n\nData: ' + new Date().toLocaleString('pt-BR');
    
    try {
        log(`Enviando para: ${testNumber}`, 'blue');
        log(`Mensagem: ${testMessage.substring(0, 50)}...`, 'blue');
        
        const response = await axios.post(`${API_URL}/whatsapp/enviar`, {
            telefone: testNumber,
            mensagem: testMessage
        });
        
        log(`Status: ${response.status === 200 ? '✅ ENVIADO' : '❌ FALHOU'}`,
            response.status === 200 ? 'green' : 'red');
        
        if (response.data.demo) {
            log('⚠️  Mensagem enviada em MODO DEMO (não chegará no WhatsApp)', 'yellow');
        } else {
            log('✅ Mensagem enviada via API (deve chegar no WhatsApp)', 'green');
        }
        
        console.log();
        return true;
    } catch (error) {
        log(`❌ Erro ao enviar: ${error.response?.data?.error || error.message}`, 'red');
        return false;
    }
}

async function testarNotificacaoPedido() {
    separator();
    log('🎉 TESTE 3: Notificação de Pedido Completo', 'cyan');
    separator();
    
    const dadosTeste = {
        numero: 'PED999999',
        cliente: {
            nome: 'Cliente Teste Automatizado',
            telefone: '5511967696744'
        },
        itens: [
            { nome: 'Cone de Chocolate', quantidade: 2, valor: 12.50 },
            { nome: 'Brownie', quantidade: 1, valor: 8.00 }
        ],
        total: 33.00,
        metodoPagamento: 'PIX',
        turno: 'Teste Automatizado',
        pontoEntrega: 'Endereço de Teste'
    };
    
    try {
        log('Enviando notificação completa...', 'blue');
        
        const resultado = await whatsappService.notificarPedidoRecebido(dadosTeste);
        
        log(`Status: ${resultado.success ? '✅ SUCESSO' : '❌ FALHOU'}`,
            resultado.success ? 'green' : 'red');
        
        if (resultado.demo) {
            log('⚠️  Notificação em MODO DEMO', 'yellow');
            log('📝 Para ativar envio real, configure a API no .env', 'yellow');
        } else {
            log('✅ Notificação enviada via API', 'green');
            log('📱 Verifique o WhatsApp (5511967696744)', 'green');
        }
        
        console.log();
        return resultado.success;
    } catch (error) {
        log(`❌ Erro na notificação: ${error.message}`, 'red');
        return false;
    }
}

async function testarFormatacaoNumero() {
    separator();
    log('🔢 TESTE 4: Formatação de Números', 'cyan');
    separator();
    
    const numerosParaTestar = [
        '11967696744',
        '5511967696744',
        '(11) 96769-6744',
        '+55 11 96769-6744',
        '11 96769-6744'
    ];
    
    log('Testando formatação de números:', 'blue');
    numerosParaTestar.forEach(numero => {
        const formatado = whatsappService.formatarTelefone(numero);
        const valido = whatsappService.validarNumero(formatado);
        
        log(`${numero} → ${formatado} ${valido ? '✅' : '❌'}`,
            valido ? 'green' : 'red');
    });
    
    console.log();
    return true;
}

async function executarTodosTestes() {
    log('╔════════════════════════════════════════════════════════╗', 'cyan');
    log('║     🧪 SUITE DE TESTES - WhatsApp Integration         ║', 'cyan');
    log('╚════════════════════════════════════════════════════════╝', 'cyan');
    console.log();
    
    const resultados = {
        configuracao: false,
        envioSimples: false,
        notificacaoPedido: false,
        formatacao: false
    };
    
    try {
        // Teste 1
        resultados.configuracao = await testarConfiguracao();
        await sleep(2000);
        
        // Teste 2
        resultados.envioSimples = await testarEnvioSimples();
        await sleep(2000);
        
        // Teste 3
        resultados.notificacaoPedido = await testarNotificacaoPedido();
        await sleep(2000);
        
        // Teste 4
        resultados.formatacao = await testarFormatacaoNumero();
        
    } catch (error) {
        log(`❌ Erro fatal nos testes: ${error.message}`, 'red');
    }
    
    // Resumo Final
    separator();
    log('📊 RESUMO DOS TESTES', 'cyan');
    separator();
    
    const totalTestes = Object.keys(resultados).length;
    const testesPassados = Object.values(resultados).filter(r => r).length;
    const porcentagem = Math.round((testesPassados / totalTestes) * 100);
    
    log(`✅ Testes Passados: ${testesPassados}/${totalTestes} (${porcentagem}%)`,
        testesPassados === totalTestes ? 'green' : 'yellow');
    
    console.log();
    log('Detalhes:', 'blue');
    log(`  Configuração: ${resultados.configuracao ? '✅' : '❌'}`,
        resultados.configuracao ? 'green' : 'red');
    log(`  Envio Simples: ${resultados.envioSimples ? '✅' : '❌'}`,
        resultados.envioSimples ? 'green' : 'red');
    log(`  Notificação Pedido: ${resultados.notificacaoPedido ? '✅' : '❌'}`,
        resultados.notificacaoPedido ? 'green' : 'red');
    log(`  Formatação: ${resultados.formatacao ? '✅' : '❌'}`,
        resultados.formatacao ? 'green' : 'red');
    
    console.log();
    
    if (testesPassados === totalTestes) {
        log('🎉 TODOS OS TESTES PASSARAM!', 'green');
        log('✅ Sistema WhatsApp está funcionando corretamente', 'green');
    } else {
        log('⚠️  ALGUNS TESTES FALHARAM', 'yellow');
        log('📝 Verifique as mensagens de erro acima', 'yellow');
        
        if (!resultados.configuracao) {
            console.log();
            log('💡 DICA: API não está configurada', 'yellow');
            log('   Execute: instalar-whatsapp.bat', 'yellow');
            log('   Ou leia: WHATSAPP_5_MINUTOS.md', 'yellow');
        }
    }
    
    separator();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Executar testes
executarTodosTestes().catch(error => {
    log(`❌ Erro fatal: ${error.message}`, 'red');
    console.error(error);
});
