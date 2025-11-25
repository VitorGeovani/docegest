/**
 * Script para criar receitas (vincular ingredientes aos produtos)
 * Define quais ingredientes e quantidades compõem cada produto
 */

import { createConnection } from 'mysql2/promise';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Receitas por produto (quantidades são exemplos - ajustar conforme a realidade)
const receitas = [
    // Ovomaltine (id 2)
    {
        produto: 'Ovomaltine',
        ingredientes: [
            { nome: 'Ovomaltine em Pó', quantidade: 0.060 }, // 60g
            { nome: 'Leite Condensado', quantidade: 0.040 }, // 40g
            { nome: 'Creme de Leite', quantidade: 0.080 }, // 80ml
            { nome: 'Leite em Pó', quantidade: 0.020 }, // 20g
            { nome: 'Casquinha de Sorvete', quantidade: 1.000 } // 1 unidade
        ]
    },
    // Kinder Bueno (id 3)
    {
        produto: 'Kinder Bueno',
        ingredientes: [
            { nome: 'Chocolate ao Leite', quantidade: 0.070 }, // 70g
            { nome: 'Chocolate Branco', quantidade: 0.040 }, // 40g
            { nome: 'Paçoca Triturada', quantidade: 0.030 }, // 30g (avelã)
            { nome: 'Leite Condensado', quantidade: 0.035 }, // 35g
            { nome: 'Creme de Leite', quantidade: 0.080 }, // 80ml
            { nome: 'Casquinha de Sorvete', quantidade: 1.000 } // 1 unidade
        ]
    },
    // Ninho e Nutella (id 11)
    {
        produto: 'Ninho e Nutella',
        ingredientes: [
            { nome: 'Leite em Pó', quantidade: 0.080 }, // 80g
            { nome: 'Nutella', quantidade: 0.040 }, // 40g
            { nome: 'Leite Condensado', quantidade: 0.045 }, // 45g
            { nome: 'Creme de Leite', quantidade: 0.090 }, // 90ml
            { nome: 'Chocolate Branco', quantidade: 0.030 }, // 30g
            { nome: 'Casquinha de Sorvete', quantidade: 1.000 } // 1 unidade
        ]
    },
    // Oreo (id 19)
    {
        produto: 'Oreo',
        ingredientes: [
            { nome: 'Biscoito Oreo Triturado', quantidade: 0.080 }, // 80g
            { nome: 'Creme de Leite', quantidade: 0.100 }, // 100ml
            { nome: 'Leite Condensado', quantidade: 0.040 }, // 40g
            { nome: 'Chantilly em Pó', quantidade: 0.020 }, // 20g
            { nome: 'Casquinha de Sorvete', quantidade: 1.000 } // 1 unidade
        ]
    },
    // Mousse de Limão (id 20)
    {
        produto: 'Mousse de Limão',
        ingredientes: [
            { nome: 'Polpa de Limão', quantidade: 0.100 }, // 100g
            { nome: 'Leite Condensado', quantidade: 0.050 }, // 50g
            { nome: 'Creme de Leite', quantidade: 0.080 }, // 80ml
            { nome: 'Açúcar Cristal', quantidade: 0.030 }, // 30g
            { nome: 'Essência de Baunilha', quantidade: 2.000 }, // 2ml
            { nome: 'Copinho 250ml', quantidade: 1.000 } // 1 unidade
        ]
    },
    // Ferrero Rocher (id 21)
    {
        produto: 'Ferrero Rocher',
        ingredientes: [
            { nome: 'Chocolate ao Leite', quantidade: 0.060 }, // 60g
            { nome: 'Chocolate Meio Amargo', quantidade: 0.030 }, // 30g
            { nome: 'Paçoca Triturada', quantidade: 0.040 }, // 40g (avelã)
            { nome: 'Leite Condensado', quantidade: 0.035 }, // 35g
            { nome: 'Creme de Leite', quantidade: 0.080 }, // 80ml
            { nome: 'Granulado Colorido', quantidade: 0.010 }, // 10g
            { nome: 'Casquinha de Sorvete', quantidade: 1.000 } // 1 unidade
        ]
    },
    // Kit-Kat (id 22)
    {
        produto: 'Kit- Kat',
        ingredientes: [
            { nome: 'Kit Kat Triturado', quantidade: 0.070 }, // 70g
            { nome: 'Chocolate ao Leite', quantidade: 0.050 }, // 50g
            { nome: 'Leite Condensado', quantidade: 0.035 }, // 35g
            { nome: 'Creme de Leite', quantidade: 0.070 }, // 70ml
            { nome: 'Wafer Recheado', quantidade: 0.030 }, // 30g
            { nome: 'Casquinha de Sorvete', quantidade: 1.000 } // 1 unidade
        ]
    },
    // Limão com Chocolate (id 24)
    {
        produto: 'Limão com Chocolate',
        ingredientes: [
            { nome: 'Polpa de Limão', quantidade: 0.090 }, // 90g
            { nome: 'Chocolate Meio Amargo', quantidade: 0.060 }, // 60g
            { nome: 'Leite Condensado', quantidade: 0.045 }, // 45g
            { nome: 'Creme de Leite', quantidade: 0.080 }, // 80ml
            { nome: 'Açúcar Cristal', quantidade: 0.025 }, // 25g
            { nome: 'Casquinha de Sorvete', quantidade: 1.000 } // 1 unidade
        ]
    }
];

async function criarReceitas() {
    let connection;
    
    try {
        console.log('🔄 Iniciando criação de receitas...\n');
        
        // Lê as configurações do .env
        const envContent = readFileSync(join(__dirname, '.env'), 'utf-8');
        const config = {};
        
        envContent.split('\n').forEach(line => {
            const [key, ...valueParts] = line.split('=');
            if (key && valueParts.length > 0) {
                config[key.trim()] = valueParts.join('=').trim();
            }
        });
        
        console.log('📡 Conectando ao banco de dados...');
        
        // Prepara configurações de conexão
        const connectionConfig = {
            host: config.HOST || 'localhost',
            user: config.USER || 'root',
            database: config.DATABASE || 'segredodosabor',
            multipleStatements: true
        };
        
        // Adiciona senha apenas se estiver definida
        if (config.PASSWORD && config.PASSWORD.length > 0) {
            connectionConfig.password = config.PASSWORD;
        }
        
        // Conecta ao MySQL
        connection = await createConnection(connectionConfig);
        
        console.log('✅ Conexão estabelecida!\n');
        
        // Limpar receitas existentes
        console.log('🗑️  Limpando receitas antigas...');
        await connection.query('DELETE FROM receita');
        console.log('✅ Receitas antigas removidas\n');
        
        let totalInseridos = 0;
        let erros = 0;
        
        // Processar cada produto
        for (const receita of receitas) {
            console.log(`📦 Criando receita para: ${receita.produto}`);
            
            // Buscar ID do produto
            const [produtos] = await connection.query(
                'SELECT idproduto FROM produto WHERE nome LIKE ? LIMIT 1',
                [`%${receita.produto}%`]
            );
            
            if (produtos.length === 0) {
                console.log(`   ⚠️  Produto "${receita.produto}" não encontrado`);
                continue;
            }
            
            const idProduto = produtos[0].idproduto;
            
            // Inserir cada ingrediente da receita
            for (const item of receita.ingredientes) {
                try {
                    // Buscar ID do ingrediente
                    const [ingredientes] = await connection.query(
                        'SELECT idingrediente FROM ingrediente WHERE nome LIKE ? AND ativo = 1 LIMIT 1',
                        [`%${item.nome}%`]
                    );
                    
                    if (ingredientes.length === 0) {
                        console.log(`   ⚠️  Ingrediente "${item.nome}" não encontrado`);
                        erros++;
                        continue;
                    }
                    
                    const idIngrediente = ingredientes[0].idingrediente;
                    
                    // Inserir na tabela receita
                    await connection.query(
                        'INSERT INTO receita (idproduto, idingrediente, quantidade) VALUES (?, ?, ?)',
                        [idProduto, idIngrediente, item.quantidade]
                    );
                    
                    console.log(`   ✅ ${item.nome}: ${item.quantidade}`);
                    totalInseridos++;
                    
                } catch (error) {
                    console.log(`   ❌ Erro ao inserir "${item.nome}": ${error.message}`);
                    erros++;
                }
            }
            
            console.log('');
        }
        
        console.log('='.repeat(60));
        console.log('📊 RESULTADO:');
        console.log('='.repeat(60));
        console.log(`✅ Itens de receita inseridos: ${totalInseridos}`);
        console.log(`❌ Erros: ${erros}`);
        console.log(`📦 Produtos com receita: ${receitas.length}`);
        console.log('='.repeat(60));
        
        // Calcular custos de cada produto
        console.log('\n💰 Calculando custos de produção...\n');
        
        for (const receita of receitas) {
            const [produtos] = await connection.query(
                'SELECT idproduto FROM produto WHERE nome LIKE ? LIMIT 1',
                [`%${receita.produto}%`]
            );
            
            if (produtos.length > 0) {
                try {
                    await connection.query('CALL sp_calcular_custo_produto(?)', [produtos[0].idproduto]);
                    console.log(`✅ Custo calculado para: ${receita.produto}`);
                } catch (error) {
                    console.log(`⚠️  Erro ao calcular custo de "${receita.produto}": ${error.message}`);
                }
            }
        }
        
        // Exibir resumo dos produtos com custos
        console.log('\n📋 RESUMO DE CUSTOS E MARGENS:\n');
        const [produtosComCusto] = await connection.query(`
            SELECT 
                p.nome,
                p.preco,
                p.custo_producao,
                p.margem_lucro,
                (p.preco - IFNULL(p.custo_producao, 0)) as lucro_unitario
            FROM produto p
            WHERE p.custo_producao IS NOT NULL
            ORDER BY p.nome
        `);
        
        produtosComCusto.forEach(p => {
            const custo = parseFloat(p.custo_producao || 0);
            const preco = parseFloat(p.preco);
            const margem = parseFloat(p.margem_lucro || 0);
            const lucro = parseFloat(p.lucro_unitario || 0);
            const margemReal = custo > 0 ? ((lucro / custo) * 100) : 0;
            
            console.log(`\n🍦 ${p.nome}`);
            console.log(`   💵 Preço de venda: R$ ${preco.toFixed(2)}`);
            console.log(`   🏭 Custo de produção: R$ ${custo.toFixed(2)}`);
            console.log(`   💰 Lucro unitário: R$ ${lucro.toFixed(2)}`);
            console.log(`   📊 Margem de lucro: ${margemReal.toFixed(1)}%`);
        });
        
        console.log('\n✨ Receitas criadas e custos calculados com sucesso!\n');
        
    } catch (error) {
        console.error('\n❌ ERRO FATAL:', error.message);
        console.error('💡 Verifique as configurações do banco de dados no arquivo .env\n');
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Executa a criação de receitas
criarReceitas();
