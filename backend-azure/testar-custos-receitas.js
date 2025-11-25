/**
 * Script de Teste - Custos e Receitas
 * Testa todos os endpoints relacionados à página Custos e Receitas
 * 
 * Execute: node testar-custos-receitas.js
 */

import axios from 'axios';

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
    console.log('\n' + '='.repeat(70) + '\n');
}

async function testarEndpoint(nome, url) {
    try {
        log(`🔍 Testando: ${nome}`, 'cyan');
        log(`   URL: ${url}`, 'blue');
        
        const response = await axios.get(url);
        const dados = response.data;
        
        if (Array.isArray(dados)) {
            log(`   ✅ Sucesso! Retornou ${dados.length} registro(s)`, 'green');
            
            if (dados.length > 0) {
                log(`   📊 Exemplo do primeiro registro:`, 'yellow');
                console.log(JSON.stringify(dados[0], null, 2));
            } else {
                log(`   ⚠️  Array vazio - nenhum dado encontrado`, 'yellow');
            }
        } else {
            log(`   ✅ Sucesso! Dados retornados:`, 'green');
            console.log(JSON.stringify(dados, null, 2));
        }
        
        return { sucesso: true, dados };
        
    } catch (error) {
        log(`   ❌ ERRO: ${error.message}`, 'red');
        if (error.response) {
            log(`   Status: ${error.response.status}`, 'red');
            log(`   Dados: ${JSON.stringify(error.response.data)}`, 'red');
        }
        return { sucesso: false, erro: error.message };
    }
}

async function executarTestes() {
    log('╔═══════════════════════════════════════════════════════════════════╗', 'cyan');
    log('║     TESTE DE ENDPOINTS - CUSTOS E RECEITAS                       ║', 'cyan');
    log('╚═══════════════════════════════════════════════════════════════════╝', 'cyan');
    
    separator();
    
    // Teste 1: Ingredientes com Estoque Baixo
    log('📦 TESTE 1: INGREDIENTES COM ESTOQUE BAIXO', 'yellow');
    separator();
    const test1 = await testarEndpoint(
        'Ingredientes Estoque Baixo',
        `${API_URL}/ingrediente/estoque/baixo`
    );
    
    separator();
    
    // Teste 2: Lista de Compras
    log('🛒 TESTE 2: LISTA DE COMPRAS', 'yellow');
    separator();
    const test2 = await testarEndpoint(
        'Lista de Compras',
        `${API_URL}/ingrediente/lista-compras`
    );
    
    separator();
    
    // Teste 3: Análise de Custos de Produtos
    log('💰 TESTE 3: ANÁLISE DE CUSTOS POR PRODUTO', 'yellow');
    separator();
    const test3 = await testarEndpoint(
        'Análise de Custos',
        `${API_URL}/produto/analise/custos`
    );
    
    separator();
    
    // Teste 4: Listar Produtos (para comparação)
    log('📋 TESTE 4: LISTAR TODOS OS PRODUTOS', 'yellow');
    separator();
    const test4 = await testarEndpoint(
        'Listar Produtos',
        `${API_URL}/produto/listar`
    );
    
    separator();
    
    // Resumo Final
    log('╔═══════════════════════════════════════════════════════════════════╗', 'cyan');
    log('║                        RESUMO DOS TESTES                          ║', 'cyan');
    log('╚═══════════════════════════════════════════════════════════════════╝', 'cyan');
    
    const testes = [
        { nome: 'Ingredientes Estoque Baixo', resultado: test1 },
        { nome: 'Lista de Compras', resultado: test2 },
        { nome: 'Análise de Custos', resultado: test3 },
        { nome: 'Listar Produtos', resultado: test4 }
    ];
    
    let sucessos = 0;
    let falhas = 0;
    
    testes.forEach(teste => {
        const status = teste.resultado.sucesso ? '✅' : '❌';
        const cor = teste.resultado.sucesso ? 'green' : 'red';
        const qtd = Array.isArray(teste.resultado.dados) ? teste.resultado.dados.length : 'N/A';
        
        log(`${status} ${teste.nome}: ${qtd} registro(s)`, cor);
        
        if (teste.resultado.sucesso) {
            sucessos++;
        } else {
            falhas++;
        }
    });
    
    separator();
    log(`Total: ${sucessos} sucessos | ${falhas} falhas`, sucessos === testes.length ? 'green' : 'yellow');
    
    // Análise Detalhada
    separator();
    log('╔═══════════════════════════════════════════════════════════════════╗', 'cyan');
    log('║                      ANÁLISE DETALHADA                            ║', 'cyan');
    log('╚═══════════════════════════════════════════════════════════════════╝', 'cyan');
    
    if (test1.sucesso && test1.dados.length === 0) {
        log('⚠️  ATENÇÃO: Nenhum ingrediente com estoque baixo', 'yellow');
        log('   💡 Dica: Execute o script SQL "testar-custos-receitas.sql" para criar dados de teste', 'yellow');
    }
    
    if (test2.sucesso && test2.dados.length === 0) {
        log('⚠️  ATENÇÃO: Lista de compras vazia', 'yellow');
        log('   💡 Dica: Só aparece quando há ingredientes com estoque <= mínimo', 'yellow');
    }
    
    if (test3.sucesso && test3.dados.length === 0) {
        log('⚠️  ATENÇÃO: Nenhum produto para análise', 'yellow');
        log('   💡 Dica: Cadastre produtos no sistema', 'yellow');
    } else if (test3.sucesso && test3.dados.length > 0) {
        const comReceita = test3.dados.filter(p => p.tem_receita === 1).length;
        const semReceita = test3.dados.filter(p => p.tem_receita === 0).length;
        
        log(`📊 Produtos com receita: ${comReceita}`, 'green');
        log(`📝 Produtos sem receita: ${semReceita}`, semReceita > 0 ? 'yellow' : 'green');
        
        if (semReceita > 0) {
            log('   💡 Dica: Cadastre receitas na aba Ingredientes para cálculo automático de custos', 'yellow');
        }
    }
    
    separator();
    log('🎉 Testes concluídos!', 'green');
    separator();
}

// Executar testes
executarTestes().catch(error => {
    log(`❌ Erro fatal: ${error.message}`, 'red');
    log('Certifique-se de que o backend está rodando em http://localhost:5000', 'yellow');
    process.exit(1);
});
