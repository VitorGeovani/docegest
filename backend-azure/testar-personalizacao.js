// Script para testar personalização - Popular dados de exemplo
import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

async function testarPersonalizacao() {
    try {
        console.log('🧪 TESTANDO SISTEMA DE PERSONALIZAÇÃO\n');

        // 1. Listar produtos disponíveis
        console.log('📦 Buscando produtos...');
        const produtosResp = await axios.get(`${BASE_URL}/produto/listar`);
        const produtos = produtosResp.data;
        
        if (produtos.length === 0) {
            console.log('❌ Nenhum produto cadastrado!');
            return;
        }

        console.log(`✅ ${produtos.length} produtos encontrados`);
        produtos.slice(0, 3).forEach(p => {
            console.log(`   - ID ${p.idproduto}: ${p.nome}`);
        });

        // 2. Verificar opções existentes
        console.log('\n🎨 Verificando opções de personalização...');
        const opcoesResp = await axios.get(`${BASE_URL}/personalizacao/opcoes`);
        const opcoes = opcoesResp.data;

        console.log(`✅ ${opcoes.length} opções encontradas`);
        opcoes.forEach(o => {
            console.log(`   - ID ${o.idopcao}: ${o.nome_opcao} (${o.tipo_selecao})`);
        });

        if (opcoes.length === 0) {
            console.log('\n⚠️  Nenhuma opção de personalização cadastrada!');
            console.log('Execute a migração primeiro: node executar-migracao-personalizacao.js\n');
            return;
        }

        // 3. Associar primeira opção ao primeiro produto
        const produtoTeste = produtos[0];
        const opcaoTeste = opcoes[0];

        console.log(`\n🔗 Associando "${opcaoTeste.nome_opcao}" ao produto "${produtoTeste.nome}"...`);
        
        try {
            await axios.post(`${BASE_URL}/personalizacao/produtos/${produtoTeste.idproduto}/opcoes`, {
                idopcao: opcaoTeste.idopcao,
                obrigatorio: true
            });
            console.log('✅ Associação criada com sucesso!');
        } catch (error) {
            if (error.response?.status === 400) {
                console.log('⚠️  Associação já existe');
            } else {
                throw error;
            }
        }

        // 4. Verificar opções do produto
        console.log(`\n🔍 Verificando opções do produto ${produtoTeste.idproduto}...`);
        const produtoOpcoesResp = await axios.get(`${BASE_URL}/personalizacao/produtos/${produtoTeste.idproduto}/opcoes`);
        const produtoOpcoes = produtoOpcoesResp.data;

        if (produtoOpcoes.length > 0) {
            console.log(`✅ Produto tem ${produtoOpcoes.length} opção(ões) de personalização!`);
            produtoOpcoes.forEach(o => {
                console.log(`   - ${o.nome_opcao} (${o.valores?.length || 0} valores)`);
                if (o.valores) {
                    o.valores.slice(0, 3).forEach(v => {
                        console.log(`     • ${v.nome_valor} - R$ ${v.preco_adicional.toFixed(2)}`);
                    });
                }
            });
        } else {
            console.log('❌ Produto não tem opções associadas');
        }

        // 5. Testar cálculo de acréscimo
        if (produtoOpcoes.length > 0 && produtoOpcoes[0].valores?.length > 0) {
            console.log('\n💰 Testando cálculo de acréscimo...');
            const valorTeste = produtoOpcoes[0].valores[0];
            
            const calculoResp = await axios.post(`${BASE_URL}/personalizacao/calcular-acrescimo`, {
                personalizacoes: [
                    {
                        idopcao: produtoOpcoes[0].idopcao,
                        idvalor: valorTeste.idvalor
                    }
                ]
            });

            console.log(`✅ Acréscimo calculado: R$ ${calculoResp.data.valor_acrescimo.toFixed(2)}`);
        }

        console.log('\n' + '='.repeat(60));
        console.log('🎉 TESTE CONCLUÍDO COM SUCESSO!');
        console.log('='.repeat(60));
        console.log('\n📝 PRÓXIMOS PASSOS:');
        console.log('1. Acesse o catálogo: http://localhost:3000/catalogo');
        console.log(`2. Clique no produto: "${produtoTeste.nome}"`);
        console.log('3. O modal de personalização deve abrir automaticamente!');
        console.log('\n💡 Para associar mais produtos:');
        console.log('   Acesse: http://localhost:3000/gerenciamentos (seção personalização)');
        console.log('   Ou use a API: POST /personalizacao/produtos/:id/opcoes\n');

    } catch (error) {
        console.error('\n❌ ERRO NO TESTE:');
        console.error(error.response?.data || error.message);
        console.error('\n💡 Verifique se:');
        console.error('   1. O backend está rodando (npm start na pasta backend)');
        console.error('   2. A migração foi executada (node executar-migracao-personalizacao.js)');
        console.error('   3. Existem produtos cadastrados no sistema\n');
    }
}

// Executar
testarPersonalizacao();
