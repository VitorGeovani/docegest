// Script para verificar TODOS os dados de personalização no banco
import mysql from 'mysql2/promise';

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'P@$$w0rd',
    database: 'segredodosabor',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

async function verificarDadosPersonalizacao() {
    const connection = await mysql.createConnection(dbConfig);
    
    try {
        console.log('\n🔍 VERIFICANDO DADOS DE PERSONALIZAÇÃO\n');
        
        // 1. Opções de Personalização
        console.log('📋 OPÇÕES DE PERSONALIZAÇÃO:');
        const [opcoes] = await connection.query(`
            SELECT DISTINCT 
                opcao,
                tipo
            FROM produto_opcoes_personalizacao
            WHERE ativo = 1
            ORDER BY opcao
        `);
        console.log(`Total: ${opcoes.length} opções\n`);
        opcoes.forEach((op, idx) => {
            console.log(`  ${idx + 1}. ${op.opcao} (${op.tipo})`);
        });
        
        // 2. Valores por opção
        console.log('\n🎨 VALORES DE PERSONALIZAÇÃO:');
        for (const opcao of opcoes) {
            const [valores] = await connection.query(`
                SELECT * FROM opcao_valores 
                WHERE opcao_tipo = ? 
                AND ativo = 1
                ORDER BY descricao
            `, [opcao.opcao]);
            
            console.log(`\n  ${opcao.opcao}:`);
            valores.forEach(v => {
                console.log(`    - ${v.descricao} (R$ ${v.acrescimo_preco || 0})`);
            });
            console.log(`  Total: ${valores.length} valores`);
        }
        
        // 3. Vínculos com ingredientes
        console.log('\n🔗 VÍNCULOS COM INGREDIENTES:');
        const [vinculos] = await connection.query(`
            SELECT 
                v.opcao_tipo AS nome_opcao,
                v.descricao AS valor,
                i.nome AS ingrediente,
                pi.quantidade_usada,
                i.unidade_medida
            FROM personalizacao_ingrediente pi
            JOIN opcao_valores v ON pi.idopcao_valor = v.idopcao_valor
            JOIN ingrediente i ON pi.idingrediente = i.idingrediente
            ORDER BY v.opcao_tipo, v.descricao
        `);
        
        console.log(`Total de vínculos: ${vinculos.length}\n`);
        
        let opcaoAtual = '';
        let valorAtual = '';
        
        vinculos.forEach(v => {
            if (v.nome_opcao !== opcaoAtual) {
                opcaoAtual = v.nome_opcao;
                console.log(`\n  ${opcaoAtual}:`);
            }
            if (v.valor !== valorAtual) {
                valorAtual = v.valor;
                console.log(`    ${valorAtual}:`);
            }
            console.log(`      • ${v.ingrediente}: ${v.quantidade_usada}${v.unidade_medida}`);
        });
        
        // 4. Valores SEM ingredientes vinculados
        console.log('\n⚠️  VALORES SEM INGREDIENTES VINCULADOS:');
        const [semVinculo] = await connection.query(`
            SELECT 
                v.opcao_tipo AS nome_opcao,
                v.descricao,
                v.acrescimo_preco
            FROM opcao_valores v
            LEFT JOIN personalizacao_ingrediente pi ON v.idopcao_valor = pi.idopcao_valor
            WHERE v.ativo = 1 AND pi.idpersonalizacao_ingrediente IS NULL
            ORDER BY v.opcao_tipo, v.descricao
        `);
        
        if (semVinculo.length > 0) {
            semVinculo.forEach(s => {
                console.log(`  • ${s.nome_opcao} - ${s.descricao} (R$ ${s.acrescimo_preco})`);
            });
        } else {
            console.log('  ✅ Todos os valores têm ingredientes vinculados!');
        }
        
        // 5. Resumo
        console.log('\n📊 RESUMO:');
        console.log(`  • ${opcoes.length} opções de personalização`);
        const [totalValores] = await connection.query(`
            SELECT COUNT(*) as total FROM opcao_valores WHERE ativo = 1
        `);
        console.log(`  • ${totalValores[0].total} valores disponíveis`);
        console.log(`  • ${vinculos.length} vínculos com ingredientes`);
        console.log(`  • ${semVinculo.length} valores sem ingredientes\n`);
        
    } catch (error) {
        console.error('❌ Erro:', error.message);
    } finally {
        await connection.end();
    }
}

verificarDadosPersonalizacao();
