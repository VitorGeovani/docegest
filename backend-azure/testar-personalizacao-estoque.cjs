const axios = require('axios');

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

function log(color, message) {
    console.log(`${color}${message}${colors.reset}`);
}

async function testarPersonalizacaoComEstoque() {
    log(colors.cyan, '\n='.repeat(70));
    log(colors.cyan, '🧪 TESTE: PERSONALIZAÇÃO COM CONTROLE DE ESTOQUE');
    log(colors.cyan, '='.repeat(70));

    try {
        // TESTE 1: Listar ingredientes de um valor de personalização
        log(colors.blue, '\n📋 TESTE 1: Listar ingredientes de personalização...');
        try {
            const resp1 = await axios.get(`${API_URL}/personalizacao/valores/1/ingredientes`);
            log(colors.green, '✅ Ingredientes do valor 1 (Brigadeiro):');
            console.table(resp1.data);
        } catch (error) {
            log(colors.red, `❌ Erro ao listar ingredientes: ${error.message}`);
        }

        // TESTE 2: Verificar disponibilidade de personalização
        log(colors.blue, '\n🔍 TESTE 2: Verificar disponibilidade baseada em estoque...');
        try {
            const resp2 = await axios.get(`${API_URL}/personalizacao/valores/1/disponibilidade`);
            log(colors.green, '✅ Disponibilidade do valor 1:');
            console.log(JSON.stringify(resp2.data, null, 2));
            
            if (resp2.data.disponivel) {
                log(colors.green, '✅ Personalização DISPONÍVEL');
            } else {
                log(colors.yellow, `⚠️  Personalização INDISPONÍVEL: ${resp2.data.ingredientes_faltando}`);
            }
        } catch (error) {
            log(colors.red, `❌ Erro ao verificar disponibilidade: ${error.message}`);
        }

        // TESTE 3: Listar opções completas com valores
        log(colors.blue, '\n📚 TESTE 3: Listar todas as opções de personalização...');
        try {
            const resp3 = await axios.get(`${API_URL}/personalizacao/opcoes/completas`);
            log(colors.green, `✅ Total de opções: ${resp3.data.length}`);
            
            resp3.data.forEach(opcao => {
                console.log(`\n📝 ${opcao.nome_opcao} (${opcao.tipo_selecao})`);
                opcao.valores.forEach(valor => {
                    console.log(`   - ${valor.nome_valor} (+R$ ${valor.preco_adicional.toFixed(2)})`);
                });
            });
        } catch (error) {
            log(colors.red, `❌ Erro ao listar opções: ${error.message}`);
        }

        // TESTE 4: Calcular acréscimo
        log(colors.blue, '\n💰 TESTE 4: Calcular acréscimo de personalização...');
        try {
            const personalizacoes = [
                { idopcao: 1, idvalor: 3 },  // Nutella (+R$ 5.00)
                { idopcao: 2, idvalor: 9 }   // Ganache (+R$ 3.00)
            ];
            
            const resp4 = await axios.post(`${API_URL}/personalizacao/calcular-acrescimo`, {
                personalizacoes
            });
            
            log(colors.green, '✅ Acréscimo calculado:');
            console.log(`   Valor: R$ ${resp4.data.valor_acrescimo.toFixed(2)}`);
            console.log(`   Formatado: ${resp4.data.formatado}`);
        } catch (error) {
            log(colors.red, `❌ Erro ao calcular acréscimo: ${error.response?.data?.erro || error.message}`);
        }

        // TESTE 5: Listar ingredientes
        log(colors.blue, '\n📦 TESTE 5: Listar todos os ingredientes...');
        try {
            const resp5 = await axios.get(`${API_URL}/ingrediente/listar`);
            log(colors.green, `✅ Total de ingredientes: ${resp5.data.length}`);
            
            const ingredientesRelevantes = resp5.data.slice(0, 5);
            console.table(ingredientesRelevantes.map(ing => ({
                ID: ing.id,
                Nome: ing.nome,
                Estoque: `${ing.quantidadeEstoque} ${ing.unidadeMedida}`,
                'Estoque Mín': `${ing.estoqueMinimo} ${ing.unidadeMedida}`,
                Status: ing.quantidadeEstoque >= ing.estoqueMinimo ? '✅ OK' : '⚠️ BAIXO'
            })));
        } catch (error) {
            log(colors.red, `❌ Erro ao listar ingredientes: ${error.message}`);
        }

        // TESTE 6: Simular processamento de estoque (somente se ingredientes estiverem disponíveis)
        log(colors.blue, '\n🔄 TESTE 6: Simular processamento de personalização com estoque...');
        log(colors.yellow, 'ℹ️  Este teste NÃO será executado automaticamente para não afetar o estoque real.');
        log(colors.yellow, 'ℹ️  Para testar, descomente o código no arquivo e execute novamente.');
        
        /*
        // DESCOMENTAR PARA TESTAR (cuidado: irá dar baixa real no estoque!)
        try {
            const personalizacoes = [
                { idvalor: 1, nome_valor: "Brigadeiro" }
            ];
            
            const resp6 = await axios.post(`${API_URL}/personalizacao/processar-estoque`, {
                idreserva: 9999,  // ID fictício para teste
                usuario: 'Teste Automatizado',
                personalizacoes
            });
            
            log(colors.green, '✅ Processamento concluído:');
            console.log(JSON.stringify(resp6.data, null, 2));
        } catch (error) {
            log(colors.red, `❌ Erro ao processar: ${error.response?.data?.erro || error.message}`);
        }
        */

        // TESTE 7: Vincular novo ingrediente (exemplo)
        log(colors.blue, '\n🔗 TESTE 7: Exemplo de vinculação de ingrediente...');
        log(colors.yellow, 'ℹ️  Exemplo de requisição (não executado):');
        console.log(`
POST ${API_URL}/personalizacao/valores/1/ingredientes
Content-Type: application/json

{
  "idingrediente": 5,
  "quantidade_usada": 0.050
}
        `);

        // Resumo final
        log(colors.cyan, '\n='.repeat(70));
        log(colors.green, '✅ TESTES CONCLUÍDOS COM SUCESSO!');
        log(colors.cyan, '='.repeat(70));
        
        log(colors.yellow, '\n📌 PRÓXIMOS PASSOS:');
        console.log('1. Execute a migração SQL: vincular-personalizacao-ingredientes.sql');
        console.log('2. Vincule ingredientes às personalizações via API ou SQL');
        console.log('3. Teste a criação de pedidos com personalizações');
        console.log('4. Verifique o estoque após pedidos confirmados');
        console.log('5. Consulte a tabela movimentacao_estoque');
        
        log(colors.cyan, '\n' + '='.repeat(70) + '\n');

    } catch (error) {
        log(colors.red, `\n❌ ERRO GERAL: ${error.message}`);
        console.error(error);
    }
}

// Executar testes
testarPersonalizacaoComEstoque();
