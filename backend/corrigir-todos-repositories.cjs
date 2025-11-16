const fs = require('fs');
const path = require('path');

const files = [
    'src/repository/relatorioRepository.js',
    'src/repository/produtoRepository.js',
    'src/repository/personalizacaoRepository.js',
    'src/repository/mensagemWhatsAppRepository.js',
    'src/repository/ingredienteRepository.js',
    'src/repository/clienteRepository.js',
    'src/repository/categoriaRepository.js'
];

console.log('🔧 Corrigindo todos os repositories...\n');

files.forEach(file => {
    console.log(`📝 Processando ${path.basename(file)}...`);
    
    let content = fs.readFileSync(file, 'utf8');
    
    // Substituir import
    content = content.replace(/import connection from ['"]\.\/connection\.js['"]/g, "import pool from './connection.js'");
    
    // Substituir connection.query por pool.query
    content = content.replace(/connection\.query/g, 'pool.query');
    content = content.replace(/connection\.execute/g, 'pool.execute');
    
    fs.writeFileSync(file, content);
    
    console.log(`   ✅ ${path.basename(file)} corrigido`);
});

console.log('\n🎉 Todos os repositories corrigidos com sucesso!');
console.log('\n📋 Resumo:');
console.log('   - Substituído: import connection -> import pool');
console.log('   - Substituído: connection.query() -> pool.query()');
console.log('   - Substituído: connection.execute() -> pool.execute()');
