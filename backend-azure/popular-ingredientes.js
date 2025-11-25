/**
 * Script para popular o banco de dados com ingredientes reais
 * Cadastra ingredientes típicos de uma sorveteria/doceria
 */

import { createConnection } from 'mysql2/promise';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ingredientes típicos de sorveteria
const ingredientes = [
    // Chocolates
    {
        nome: 'Chocolate ao Leite',
        unidadeMedida: 'kg',
        precoUnitario: 35.00,
        quantidadeEstoque: 5.000,
        estoqueMinimo: 2.000,
        fornecedor: 'Garoto'
    },
    {
        nome: 'Chocolate Meio Amargo',
        unidadeMedida: 'kg',
        precoUnitario: 42.00,
        quantidadeEstoque: 3.000,
        estoqueMinimo: 1.000,
        fornecedor: 'Nestlé'
    },
    {
        nome: 'Chocolate Branco',
        unidadeMedida: 'kg',
        precoUnitario: 38.00,
        quantidadeEstoque: 2.500,
        estoqueMinimo: 1.000,
        fornecedor: 'Garoto'
    },
    // Leites e Derivados
    {
        nome: 'Leite Condensado',
        unidadeMedida: 'kg',
        precoUnitario: 12.50,
        quantidadeEstoque: 10.000,
        estoqueMinimo: 3.000,
        fornecedor: 'Nestlé'
    },
    {
        nome: 'Creme de Leite',
        unidadeMedida: 'L',
        precoUnitario: 15.00,
        quantidadeEstoque: 8.000,
        estoqueMinimo: 3.000,
        fornecedor: 'Nestlé'
    },
    {
        nome: 'Leite Integral',
        unidadeMedida: 'L',
        precoUnitario: 5.50,
        quantidadeEstoque: 20.000,
        estoqueMinimo: 10.000,
        fornecedor: 'Piracanjuba'
    },
    {
        nome: 'Leite em Pó',
        unidadeMedida: 'kg',
        precoUnitario: 28.00,
        quantidadeEstoque: 5.000,
        estoqueMinimo: 2.000,
        fornecedor: 'Ninho'
    },
    // Açúcares
    {
        nome: 'Açúcar Cristal',
        unidadeMedida: 'kg',
        precoUnitario: 4.50,
        quantidadeEstoque: 25.000,
        estoqueMinimo: 10.000,
        fornecedor: 'União'
    },
    {
        nome: 'Açúcar Refinado',
        unidadeMedida: 'kg',
        precoUnitario: 5.00,
        quantidadeEstoque: 15.000,
        estoqueMinimo: 5.000,
        fornecedor: 'União'
    },
    // Frutas e Polpas
    {
        nome: 'Morango Congelado',
        unidadeMedida: 'kg',
        precoUnitario: 18.00,
        quantidadeEstoque: 10.000,
        estoqueMinimo: 3.000,
        fornecedor: 'Frutas da Serra'
    },
    {
        nome: 'Polpa de Limão',
        unidadeMedida: 'kg',
        precoUnitario: 12.00,
        quantidadeEstoque: 5.000,
        estoqueMinimo: 2.000,
        fornecedor: 'Polpa Norte'
    },
    {
        nome: 'Banana',
        unidadeMedida: 'kg',
        precoUnitario: 6.00,
        quantidadeEstoque: 8.000,
        estoqueMinimo: 3.000,
        fornecedor: 'Ceasa Local'
    },
    // Coberturas e Sabores
    {
        nome: 'Nutella',
        unidadeMedida: 'kg',
        precoUnitario: 65.00,
        quantidadeEstoque: 3.000,
        estoqueMinimo: 1.000,
        fornecedor: 'Ferrero'
    },
    {
        nome: 'Ovomaltine em Pó',
        unidadeMedida: 'kg',
        precoUnitario: 45.00,
        quantidadeEstoque: 2.000,
        estoqueMinimo: 1.000,
        fornecedor: 'Nestlé'
    },
    {
        nome: 'Paçoca Triturada',
        unidadeMedida: 'kg',
        precoUnitario: 22.00,
        quantidadeEstoque: 3.000,
        estoqueMinimo: 1.000,
        fornecedor: 'Santa Helena'
    },
    // Biscoitos e Confeitos
    {
        nome: 'Biscoito Oreo Triturado',
        unidadeMedida: 'kg',
        precoUnitario: 28.00,
        quantidadeEstoque: 4.000,
        estoqueMinimo: 1.500,
        fornecedor: 'Mondelez'
    },
    {
        nome: 'Kit Kat Triturado',
        unidadeMedida: 'kg',
        precoUnitario: 32.00,
        quantidadeEstoque: 2.000,
        estoqueMinimo: 1.000,
        fornecedor: 'Nestlé'
    },
    {
        nome: 'Wafer Recheado',
        unidadeMedida: 'kg',
        precoUnitario: 18.00,
        quantidadeEstoque: 3.000,
        estoqueMinimo: 1.000,
        fornecedor: 'Bauducco'
    },
    // Embalagens
    {
        nome: 'Casquinha de Sorvete',
        unidadeMedida: 'unidade',
        precoUnitario: 0.80,
        quantidadeEstoque: 500.000,
        estoqueMinimo: 200.000,
        fornecedor: 'Embalagens Brasil'
    },
    {
        nome: 'Copinho 250ml',
        unidadeMedida: 'unidade',
        precoUnitario: 0.35,
        quantidadeEstoque: 1000.000,
        estoqueMinimo: 300.000,
        fornecedor: 'Copobras'
    },
    {
        nome: 'Colher Descartável',
        unidadeMedida: 'unidade',
        precoUnitario: 0.08,
        quantidadeEstoque: 2000.000,
        estoqueMinimo: 500.000,
        fornecedor: 'Plasútil'
    },
    // Outros Ingredientes
    {
        nome: 'Essência de Baunilha',
        unidadeMedida: 'ml',
        precoUnitario: 0.15,
        quantidadeEstoque: 1000.000,
        estoqueMinimo: 500.000,
        fornecedor: 'Arcolor'
    },
    {
        nome: 'Corante Alimentício Rosa',
        unidadeMedida: 'ml',
        precoUnitario: 0.10,
        quantidadeEstoque: 500.000,
        estoqueMinimo: 200.000,
        fornecedor: 'Mix'
    },
    {
        nome: 'Chantilly em Pó',
        unidadeMedida: 'kg',
        precoUnitario: 24.00,
        quantidadeEstoque: 5.000,
        estoqueMinimo: 2.000,
        fornecedor: 'Amélia'
    },
    {
        nome: 'Granulado Colorido',
        unidadeMedida: 'kg',
        precoUnitario: 15.00,
        quantidadeEstoque: 3.000,
        estoqueMinimo: 1.000,
        fornecedor: 'Mavalério'
    }
];

async function popularIngredientes() {
    let connection;
    
    try {
        console.log('🔄 Iniciando população de ingredientes...\n');
        
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
        
        // Verifica se já existem ingredientes
        const [existentes] = await connection.query('SELECT COUNT(*) as total FROM ingrediente');
        
        if (existentes[0].total > 0) {
            console.log(`⚠️  Já existem ${existentes[0].total} ingredientes cadastrados.`);
            console.log('💡 Deseja substituir? Este script irá inserir apenas os novos.\n');
        }
        
        // Insere cada ingrediente
        let inseridos = 0;
        let duplicados = 0;
        
        for (let i = 0; i < ingredientes.length; i++) {
            const ing = ingredientes[i];
            
            try {
                process.stdout.write(`[${i + 1}/${ingredientes.length}] Inserindo "${ing.nome}"... `);
                
                await connection.query(`
                    INSERT INTO ingrediente 
                    (nome, unidade_medida, preco_unitario, quantidade_estoque, estoque_minimo, fornecedor)
                    VALUES (?, ?, ?, ?, ?, ?)
                `, [ing.nome, ing.unidadeMedida, ing.precoUnitario, ing.quantidadeEstoque, ing.estoqueMinimo, ing.fornecedor]);
                
                console.log('✅');
                inseridos++;
                
            } catch (error) {
                if (error.code === 'ER_DUP_ENTRY') {
                    console.log('⚠️  (já existe)');
                    duplicados++;
                } else {
                    console.log(`❌ ERRO: ${error.message}`);
                }
            }
        }
        
        console.log('\n' + '='.repeat(60));
        console.log('📊 RESULTADO:');
        console.log('='.repeat(60));
        console.log(`✅ Ingredientes inseridos: ${inseridos}`);
        console.log(`⚠️  Ingredientes duplicados: ${duplicados}`);
        console.log(`📦 Total no banco: ${inseridos + existentes[0].total}`);
        console.log('='.repeat(60));
        
        // Lista os ingredientes cadastrados
        console.log('\n📋 INGREDIENTES CADASTRADOS:\n');
        const [todos] = await connection.query(`
            SELECT idingrediente, nome, unidade_medida, preco_unitario, quantidade_estoque, estoque_minimo
            FROM ingrediente 
            WHERE ativo = 1
            ORDER BY nome
        `);
        
        todos.forEach(ing => {
            const preco = parseFloat(ing.preco_unitario);
            const estoque = parseFloat(ing.quantidade_estoque);
            const minimo = parseFloat(ing.estoque_minimo);
            console.log(`  ${ing.idingrediente}. ${ing.nome} - R$ ${preco.toFixed(2)}/${ing.unidade_medida}`);
            console.log(`     Estoque: ${estoque} | Mínimo: ${minimo}`);
        });
        
        console.log('\n✨ População de ingredientes concluída com sucesso!\n');
        
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

// Executa a população
popularIngredientes();
