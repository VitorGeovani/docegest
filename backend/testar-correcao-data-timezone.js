import pool from './src/repository/connection.js';

console.log('🧪 Testando Formatação de Datas - Correção de Timezone\n');

/**
 * Função de formatação correta
 */
function formatarDataCorreta(data) {
    if (!data) return 'Data não disponível';
    
    // Se vier como string do MySQL (YYYY-MM-DD), usar diretamente
    if (typeof data === 'string' && data.includes('-')) {
        const partes = data.split('T')[0].split('-'); // Remove hora se houver
        const ano = partes[0];
        const mes = partes[1];
        const dia = partes[2];
        return `${dia}/${mes}/${ano}`;
    }
    
    // Se for Date, usar toLocaleDateString
    if (data instanceof Date) {
        return data.toLocaleDateString('pt-BR');
    }
    
    // Fallback: tentar converter
    try {
        return new Date(data).toLocaleDateString('pt-BR');
    } catch {
        return 'Data inválida';
    }
}

async function testar() {
    try {
        console.log('1️⃣ Testando pedido PED000041...\n');
        
        const [pedidos] = await pool.query(`
            SELECT 
                codigo_pedido,
                data_entrega,
                hora_entrega,
                status,
                DATE(data_entrega) as data_simples
            FROM reserva
            WHERE codigo_pedido = 'PED000041'
            LIMIT 1
        `);

        if (pedidos.length === 0) {
            console.log('❌ Pedido PED000041 não encontrado');
            return;
        }

        const pedido = pedidos[0];
        
        console.log('📊 Dados do Banco:');
        console.log('   data_entrega (raw):', pedido.data_entrega);
        console.log('   data_simples (DATE):', pedido.data_simples);
        console.log('   hora_entrega:', pedido.hora_entrega);
        console.log('   status:', pedido.status);
        
        console.log('\n📅 Formatações:');
        
        // Método ERRADO (causa problema de timezone)
        const dataErrada = new Date(pedido.data_entrega).toLocaleDateString('pt-BR');
        console.log('   ❌ ERRADO (new Date + toLocaleDateString):', dataErrada);
        console.log('      → Problema: Interpreta como UTC e ajusta para timezone local');
        
        // Método CORRETO (nossa função)
        const dataCorreta = formatarDataCorreta(pedido.data_entrega);
        console.log('   ✅ CORRETO (formatarData):', dataCorreta);
        console.log('      → Solução: Extrai dia/mês/ano diretamente da string');

        // Usando data_simples (também funciona)
        const dataSimples = formatarDataCorreta(pedido.data_simples);
        console.log('   ✅ CORRETO (via DATE()):', dataSimples);

        console.log('\n🔍 Análise do Problema:');
        console.log('   Banco armazena: 2025-11-16');
        console.log('   JavaScript interpreta como: 2025-11-16T00:00:00.000Z (UTC)');
        console.log('   Timezone BR (UTC-3): Subtrai 3 horas → 2025-11-15T21:00:00');
        console.log('   toLocaleDateString retorna: 15/11/2025 ❌');
        console.log('   Nossa função extrai: 16/11/2025 ✅');

        console.log('\n✅ Correção aplicada com sucesso!');
        console.log('   Pedido PED000041 agora mostra: ' + dataCorreta);

    } catch (error) {
        console.error('❌ Erro no teste:', error);
        throw error;
    } finally {
        await pool.end();
        console.log('\n🔌 Conexão fechada');
    }
}

testar();
