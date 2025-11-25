/**
 * Script de Teste - Notificações Automáticas
 * Valida a implementação das atualizações Azure → Local
 * 
 * COMO USAR:
 * 1. Certifique-se que o backend está rodando (npm start)
 * 2. Execute: node testar-notificacoes-automaticas.js
 * 3. Verifique os logs no console do backend
 */

const axios = require('axios');

const API_URL = 'http://localhost:5000';

// Cores para output
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

async function testarNotificacoes() {
    console.log('\n' + '='.repeat(70));
    log('🧪 TESTE DE NOTIFICAÇÕES AUTOMÁTICAS - VERSÃO LOCAL', 'cyan');
    console.log('='.repeat(70) + '\n');

    try {
        // 1. Verificar se backend está rodando
        log('1️⃣  Verificando conexão com backend...', 'blue');
        await axios.get(`${API_URL}/`);
        log('   ✅ Backend respondendo em http://localhost:5000', 'green');

        // 2. Listar reservas disponíveis
        log('\n2️⃣  Listando pedidos disponíveis...', 'blue');
        const reservasResponse = await axios.get(`${API_URL}/reserva/todas`);
        const reservas = reservasResponse.data;

        if (!reservas || reservas.length === 0) {
            log('   ⚠️  Nenhum pedido encontrado no sistema', 'yellow');
            log('   💡 Crie um pedido pelo site antes de testar', 'yellow');
            return;
        }

        log(`   ✅ Encontrados ${reservas.length} pedidos`, 'green');
        
        // Pegar o primeiro pedido pendente
        const pedidoTeste = reservas.find(r => r.status === 'Pendente' || r.status === 'Confirmado');
        
        if (!pedidoTeste) {
            log('   ⚠️  Nenhum pedido Pendente ou Confirmado encontrado', 'yellow');
            log('   💡 Use um pedido com status inicial para testar', 'yellow');
            return;
        }

        log(`\n   📦 Pedido selecionado para teste:`, 'cyan');
        log(`      ID: ${pedidoTeste.id}`, 'cyan');
        log(`      Número: ${pedidoTeste.numero_pedido || `PED${String(pedidoTeste.id).padStart(6, '0')}`}`, 'cyan');
        log(`      Status Atual: ${pedidoTeste.status}`, 'cyan');
        log(`      Cliente: ${pedidoTeste.cliente_nome || 'N/A'}`, 'cyan');

        // 3. Testar mudanças de status
        const statusTestes = [
            { status: 'Confirmado', descricao: 'Pagamento confirmado' },
            { status: 'Preparando', descricao: 'Pedido em preparação' },
            { status: 'Pronto', descricao: 'Pedido pronto para retirada' },
            { status: 'Entregue', descricao: 'Pedido entregue' }
        ];

        log('\n3️⃣  Testando notificações automáticas...', 'blue');
        log('   ⚠️  Aguarde 2 segundos entre cada teste\n', 'yellow');

        for (let i = 0; i < statusTestes.length; i++) {
            const teste = statusTestes[i];
            
            try {
                log(`   📱 Teste ${i + 1}/${statusTestes.length}: ${teste.status} (${teste.descricao})`, 'blue');
                
                const response = await axios.put(
                    `${API_URL}/reserva/${pedidoTeste.id}/status`,
                    { status: teste.status },
                    { headers: { 'Content-Type': 'application/json' } }
                );

                if (response.status === 200) {
                    log(`      ✅ Status atualizado com sucesso`, 'green');
                    log(`      📊 Linhas afetadas: ${response.data.linhasAfetadas || 1}`, 'green');
                    log(`      💬 Verifique os logs do backend para ver a notificação!`, 'cyan');
                } else {
                    log(`      ⚠️  Resposta inesperada: ${response.status}`, 'yellow');
                }

                // Aguardar 2 segundos antes do próximo teste
                if (i < statusTestes.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 2000));
                }

            } catch (error) {
                if (error.response) {
                    log(`      ❌ Erro: ${error.response.data.message || error.response.statusText}`, 'red');
                } else {
                    log(`      ❌ Erro de conexão: ${error.message}`, 'red');
                }
            }
        }

        // 4. Resumo
        log('\n4️⃣  Resumo do Teste', 'blue');
        log('   ✅ Teste concluído!', 'green');
        log('\n   📋 O que verificar nos logs do backend:', 'cyan');
        log('      • "📱 Enviando notificação de..."', 'cyan');
        log('      • "✅ Mensagem WhatsApp enviada para..."', 'cyan');
        log('      • "✅ Notificação de status ... processada"', 'cyan');
        log('\n   🔍 Se aparecer "MODO DEMO":', 'yellow');
        log('      • As notificações serão logadas mas não enviadas', 'yellow');
        log('      • Configure Evolution API para enviar mensagens reais', 'yellow');

    } catch (error) {
        log('\n❌ Erro ao executar testes:', 'red');
        if (error.response) {
            log(`   Status: ${error.response.status}`, 'red');
            log(`   Mensagem: ${error.response.data.message || error.response.statusText}`, 'red');
        } else if (error.request) {
            log('   Backend não está respondendo!', 'red');
            log('   Execute: cd backend && npm start', 'yellow');
        } else {
            log(`   ${error.message}`, 'red');
        }
    }

    console.log('\n' + '='.repeat(70));
    log('🏁 FIM DOS TESTES', 'cyan');
    console.log('='.repeat(70) + '\n');
}

// Executar testes
testarNotificacoes();
