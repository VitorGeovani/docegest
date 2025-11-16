import mysql from 'mysql2/promise';

async function listarTabelas() {
    const conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'P@$$w0rd',
        database: 'segredodosabor'
    });

    try {
        // Listar tabelas relacionadas
        const [allTables] = await conn.query("SHOW TABLES");
        const relacionadas = allTables
            .map(t => Object.values(t)[0])
            .filter(name => name.includes('person') || name.includes('opcao'));
        
        console.log('\n📊 Tabelas relacionadas a personalização:');
        relacionadas.forEach(t => console.log(`   - ${t}`));

        // Verificar se existe tabela de vínculo produto-opcao
        console.log('\n🔍 Buscando tabela de vínculo produto-opção...');
        const vinculos = relacionadas.filter(t => t.includes('produto') && t.includes('opcao'));
        
        if (vinculos.length > 0) {
            console.log(`✅ Encontradas: ${vinculos.join(', ')}\n`);
            
            for (const tabela of vinculos) {
                console.log(`📋 Estrutura de ${tabela}:`);
                const [structure] = await conn.query(`DESCRIBE ${tabela}`);
                console.table(structure);
            }
        } else {
            console.log('❌ Nenhuma tabela de vínculo produto-opção encontrada');
            console.log('   Será necessário usar a tabela personalizacao_produto\n');
        }

    } catch (error) {
        console.error('Erro:', error.message);
    } finally {
        await conn.end();
    }
}

listarTabelas();
