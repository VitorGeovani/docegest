import mysql from 'mysql2/promise';
import axios from 'axios';

const API_URL = 'http://localhost:5000';

async function testeCompleto() {
    const conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'P@$$w0rd',
        database: 'segredodosabor'
    });

    try {
        console.log('\n==========================================');
        console.log('✅ TESTE FINAL - DUPLICAÇÕES REMOVIDAS');
        console.log('==========================================\n');

        // 1. Verificar banco de dados
        console.log('1️⃣ Verificando banco de dados:\n');
        
        const [opcoesDup] = await conn.query(`
            SELECT nome_opcao, COUNT(*) as qtd
            FROM produto_opcoes_personalizacao
            WHERE ativo = 1
            GROUP BY nome_opcao
            HAVING COUNT(*) > 1
        `);

        if (opcoesDup.length > 0) {
            console.log('   ❌ Ainda há opções duplicadas:');
            console.table(opcoesDup);
        } else {
            console.log('   ✅ Nenhuma opção duplicada!\n');
        }

        const [valoresDup] = await conn.query(`
            SELECT 
                o.nome_opcao,
                v.nome_valor,
                COUNT(*) as qtd
            FROM opcao_valores v
            INNER JOIN produto_opcoes_personalizacao o ON v.idopcao_fk = o.idopcao
            WHERE v.disponivel = 1 AND o.ativo = 1
            GROUP BY o.idopcao, v.nome_valor
            HAVING COUNT(*) > 1
        `);

        if (valoresDup.length > 0) {
            console.log('   ❌ Ainda há valores duplicados:');
            console.table(valoresDup);
        } else {
            console.log('   ✅ Nenhum valor duplicado!\n');
        }

        // 2. Testar API
        console.log('2️⃣ Testando API de personalização:\n');
        
        try {
            const respAPI = await axios.get(`${API_URL}/personalizacao/produtos/2/opcoes`);
            const opcoesAPI = respAPI.data;

            console.log(`   ✅ API retornou ${opcoesAPI.length} opções:\n`);
            
            opcoesAPI.forEach((opcao, idx) => {
                console.log(`   ${idx + 1}. ${opcao.nome} (${opcao.tipo})`);
                console.log(`      Valores: ${opcao.valores ? opcao.valores.length : 0}`);
                
                if (opcao.valores && opcao.valores.length > 0) {
                    // Verificar duplicatas nos valores
                    const nomes = opcao.valores.map(v => v.nome);
                    const nomesUnicos = [...new Set(nomes)];
                    
                    if (nomes.length !== nomesUnicos.length) {
                        console.log(`      ❌ DUPLICATA ENCONTRADA!`);
                        const duplicados = nomes.filter((nome, idx) => nomes.indexOf(nome) !== idx);
                        console.log(`         Duplicados: ${duplicados.join(', ')}`);
                    } else {
                        console.log(`      ✅ Sem duplicatas`);
                    }
                }
                console.log('');
            });

            // 3. Testar Brigadeiro especificamente
            console.log('3️⃣ Testando Brigadeiro:\n');
            
            const opcaoRecheio = opcoesAPI.find(o => o.nome === 'Recheio');
            if (opcaoRecheio) {
                const brigadeiros = opcaoRecheio.valores.filter(v => v.nome === 'Brigadeiro');
                
                if (brigadeiros.length === 0) {
                    console.log('   ❌ Brigadeiro não encontrado!\n');
                } else if (brigadeiros.length > 1) {
                    console.log(`   ❌ ${brigadeiros.length} Brigadeiros encontrados (DUPLICADO):`);
                    brigadeiros.forEach((b, idx) => {
                        console.log(`      ${idx + 1}. ID: ${b.idvalor}, Preço: R$ ${parseFloat(b.preco).toFixed(2)}`);
                    });
                    console.log('');
                } else {
                    const brigadeiro = brigadeiros[0];
                    console.log('   ✅ Apenas 1 Brigadeiro encontrado:');
                    console.log(`      ID: ${brigadeiro.idvalor}`);
                    console.log(`      Preço: R$ ${parseFloat(brigadeiro.preco).toFixed(2)}\n`);
                }
            }

            // 4. Testar cálculo de acréscimo
            console.log('4️⃣ Testando cálculo de acréscimo:\n');
            
            const personalizacaoTeste = {
                personalizacoes: [
                    { idopcao: 1, idvalor: 3 }, // Nutella R$ 5,00
                    { idopcao: 2, idvalor: 9 }  // Ganache R$ 3,00
                ]
            };

            const respCalculo = await axios.post(
                `${API_URL}/personalizacao/calcular-acrescimo`,
                personalizacaoTeste
            );

            const valorEsperado = 8.00; // 5,00 + 3,00
            const valorRecebido = parseFloat(respCalculo.data.valor_acrescimo);

            console.log(`   Valores selecionados:`);
            console.log(`      - Nutella: R$ 5,00`);
            console.log(`      - Ganache: R$ 3,00`);
            console.log(`   Esperado: R$ ${valorEsperado.toFixed(2)}`);
            console.log(`   Recebido: R$ ${valorRecebido.toFixed(2)}`);
            
            if (Math.abs(valorRecebido - valorEsperado) < 0.01) {
                console.log(`   ✅ Cálculo correto!\n`);
            } else {
                console.log(`   ❌ Cálculo incorreto!\n`);
            }

        } catch (error) {
            console.log(`   ❌ Erro ao testar API: ${error.message}\n`);
            console.log('   Certifique-se de que o backend está rodando!\n');
        }

        console.log('==========================================');
        console.log('✅ TESTE CONCLUÍDO!');
        console.log('==========================================\n');

        console.log('📝 RESUMO:');
        console.log(`   - Opções duplicadas no banco: ${opcoesDup.length}`);
        console.log(`   - Valores duplicados no banco: ${valoresDup.length}`);
        console.log('   - API funcional: ' + (valoresDup.length === 0 && opcoesDup.length === 0 ? 'Sim' : 'Verificar acima'));
        console.log('');
        console.log('🎉 Se todos os testes passaram, o problema está resolvido!');
        console.log('🔄 Recarregue o frontend e teste a personalização.\n');

    } catch (error) {
        console.error('\n❌ Erro:', error.message);
    } finally {
        await conn.end();
    }
}

testeCompleto();
