import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

async function testarEndpointsWhatsApp() {
    console.log('🧪 Testando endpoints WhatsApp...\n');

    try {
        // 1. Testar configuração
        console.log('1️⃣ GET /whatsapp/config');
        const config = await axios.get(`${BASE_URL}/whatsapp/config`);
        console.log('✅ Configuração:', config.data);
        console.log('');

        // 2. Testar status do bot
        console.log('2️⃣ GET /whatsapp/status');
        const status = await axios.get(`${BASE_URL}/whatsapp/status`);
        console.log('✅ Status:', status.data);
        console.log('');

        // 3. Testar estatísticas
        console.log('3️⃣ GET /whatsapp/estatisticas');
        const stats = await axios.get(`${BASE_URL}/whatsapp/estatisticas`);
        console.log('✅ Estatísticas:', stats.data);
        console.log('');

        // 4. Testar envio de mensagem
        console.log('4️⃣ POST /whatsapp/enviar');
        const envio = await axios.post(`${BASE_URL}/whatsapp/enviar`, {
            telefone: '5511999999999',
            mensagem: '🧪 Teste de mensagem do sistema'
        });
        console.log('✅ Mensagem enviada:', envio.data);
        console.log('');

        // 5. Testar histórico
        console.log('5️⃣ GET /whatsapp/historico/5511999999999');
        const historico = await axios.get(`${BASE_URL}/whatsapp/historico/5511999999999`);
        console.log('✅ Histórico:', historico.data);
        console.log('');

        console.log('🎉 Todos os testes passaram com sucesso!\n');
        console.log('📊 Resumo:');
        console.log(`   - API configurada: ${!config.data.demoMode}`);
        console.log(`   - Status bot: ${status.data.status.status_bot || 'N/A'}`);
        console.log(`   - Mensagens hoje: ${status.data.status.mensagens_hoje || 0}`);
        console.log(`   - Histórico: ${historico.data.total || 0} mensagens`);

    } catch (error) {
        console.error('❌ Erro no teste:', error.response?.data || error.message);
        if (error.code === 'ECONNREFUSED') {
            console.log('\n⚠️  Backend não está rodando!');
            console.log('   Execute: npm start');
        }
    }
}

testarEndpointsWhatsApp();
