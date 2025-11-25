// Popular dados de personalização com ingredientes
import mysql from 'mysql2/promise';

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'P@$$w0rd',
    database: 'segredodosabor'
};

async function popularPersonalizacaoIngredientes() {
    const connection = await mysql.createConnection(dbConfig);
    
    try {
        console.log('\n🎨 POPULANDO INGREDIENTES DE PERSONALIZAÇÃO\n');
        
        // Mapear ingredientes existentes
        const [ingredientes] = await connection.query('SELECT idingrediente, nome FROM ingrediente');
        const ingMap = {};
        ingredientes.forEach(i => {
            ingMap[i.nome.toLowerCase()] = i.idingrediente;
        });
        
        console.log(`✅ ${ingredientes.length} ingredientes encontrados\n`);
        
        // Buscar todos os valores de personalização
        const [valores] = await connection.query(`
            SELECT v.idvalor, v.nome_valor, v.idopcao_fk, o.nome_opcao
            FROM opcao_valores v
            JOIN produto_opcoes_personalizacao o ON v.idopcao_fk = o.idopcao
            WHERE v.disponivel = 1
            ORDER BY o.nome_opcao, v.nome_valor
        `);
        
        console.log(`📋 ${valores.length} valores de personalização encontrados\n`);
        
        // Definir receitas de ingredientes para cada valor
        const receitas = {
            // RECHEIOS
            'brigadeiro': [
                { nome: 'leite condensado', quantidade: 0.05 }, // 50g
                { nome: 'chocolate ao leite', quantidade: 0.1 } // 100g
            ],
            'doce de leite': [
                { nome: 'leite condensado', quantidade: 0.1 }, // 100g
                { nome: 'açúcar refinado', quantidade: 0.05 } // 50g
            ],
            'nutella': [
                { nome: 'chocolate ao leite', quantidade: 0.15 }, // 150g
                { nome: 'leite condensado', quantidade: 0.05 } // 50g
            ],
            'frutas vermelhas': [
                { nome: 'morango congelado', quantidade: 0.1 }, // 100g
                { nome: 'açúcar refinado', quantidade: 0.03 } // 30g
            ],
            'chocolate branco': [
                { nome: 'chocolate branco', quantidade: 0.15 }, // 150g
                { nome: 'leite condensado', quantidade: 0.05 } // 50g
            ],
            'creme de avelã': [
                { nome: 'chocolate ao leite', quantidade: 0.1 }, // 100g
                { nome: 'leite condensado', quantidade: 0.08 } // 80g
            ],
            
            // COBERTURAS
            'chocolate ao leite': [
                { nome: 'chocolate ao leite', quantidade: 0.2 } // 200g
            ],
            'chocolate meio amargo': [
                { nome: 'chocolate meio amargo', quantidade: 0.2 } // 200g
            ],
            'ganache': [
                { nome: 'chocolate ao leite', quantidade: 0.15 }, // 150g
                { nome: 'leite condensado', quantidade: 0.1 } // 100g
            ],
            'chantilly': [
                { nome: 'leite condensado', quantidade: 0.15 }, // 150ml
                { nome: 'açúcar refinado', quantidade: 0.05 } // 50g
            ],
            'glacê': [
                { nome: 'açúcar refinado', quantidade: 0.2 }, // 200g
                { nome: 'leite condensado', quantidade: 0.05 } // 50ml
            ],
            'fondant': [
                { nome: 'açúcar refinado', quantidade: 0.25 } // 250g
            ],
            'chocolate raspado': [
                { nome: 'chocolate ao leite', quantidade: 0.05 } // 50g
            ],
            
            // DECORAÇÕES
            'morangos': [
                { nome: 'morango congelado', quantidade: 0.15 } // 150g
            ],
            'flores comestíveis': [
                { nome: 'açúcar refinado', quantidade: 0.02 } // 20g (base)
            ],
            'confeitos coloridos': [
                { nome: 'açúcar refinado', quantidade: 0.03 } // 30g
            ],
            'confete': [
                { nome: 'açúcar refinado', quantidade: 0.03 } // 30g
            ],
            'granulado colorido': [
                { nome: 'açúcar refinado', quantidade: 0.04 } // 40g
            ],
            'raspas de chocolate': [
                { nome: 'chocolate ao leite', quantidade: 0.05 } // 50g
            ],
            'frutas frescas': [
                { nome: 'morango congelado', quantidade: 0.1 }, // 100g
                { nome: 'banana', quantidade: 0.08 } // 80g
            ],
            
            // TAMANHOS (sem ingredientes específicos, apenas porções)
            'pequena': [],
            'pequena (100g)': [],
            'média': [],
            'média (200g)': [],
            'grande': [],
            'grande (300g)': [],
            'extra grande': [],
            
            // EXTRAS
            'chantilly extra': [
                { nome: 'leite condensado', quantidade: 0.1 }, // 100ml
                { nome: 'açúcar refinado', quantidade: 0.03 } // 30g
            ],
            'cobertura extra': [
                { nome: 'chocolate ao leite', quantidade: 0.15 } // 150g
            ],
            'vela decorativa': [],
            'vela de aniversário': [],
            'mensagem personalizada': [],
            'cartão personalizado': [],
            'embalagem especial': []
        };
        
        let inseridos = 0;
        let erros = 0;
        let pulados = 0;
        
        for (const valor of valores) {
            const nomeValorLower = valor.nome_valor.toLowerCase().trim();
            const receita = receitas[nomeValorLower];
            
            if (!receita) {
                console.log(`⚠️  Receita não definida para: ${valor.nome_valor}`);
                pulados++;
                continue;
            }
            
            if (receita.length === 0) {
                console.log(`ℹ️  ${valor.nome_valor} - Sem ingredientes (OK)`);
                pulados++;
                continue;
            }
            
            // Verificar se já existe vínculo
            const [existente] = await connection.query(
                'SELECT id FROM personalizacao_ingrediente WHERE idvalor_fk = ?',
                [valor.idvalor]
            );
            
            if (existente.length > 0) {
                console.log(`⏭️  ${valor.nome_valor} - Já tem ingredientes`);
                pulados++;
                continue;
            }
            
            // Inserir cada ingrediente da receita
            for (const item of receita) {
                const idIngrediente = ingMap[item.nome.toLowerCase()];
                
                if (!idIngrediente) {
                    console.log(`❌ Ingrediente não encontrado: ${item.nome} (para ${valor.nome_valor})`);
                    erros++;
                    continue;
                }
                
                await connection.query(
                    'INSERT INTO personalizacao_ingrediente (idvalor_fk, idingrediente_fk, quantidade_usada) VALUES (?, ?, ?)',
                    [valor.idvalor, idIngrediente, item.quantidade]
                );
                
                inseridos++;
            }
            
            console.log(`✅ ${valor.nome_valor} - ${receita.length} ingredientes adicionados`);
        }
        
        console.log(`\n📊 RESUMO:`);
        console.log(`  ✅ ${inseridos} vínculos inseridos`);
        console.log(`  ⏭️  ${pulados} itens pulados`);
        console.log(`  ❌ ${erros} erros\n`);
        
    } catch (error) {
        console.error('❌ Erro:', error.message);
    } finally {
        await connection.end();
    }
}

popularPersonalizacaoIngredientes();
