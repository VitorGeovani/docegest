import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, 'src', 'repository', 'reservaRepository.js');

console.log('🔧 Removendo todas as referências a r.turno em queries SQL...\n');

try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Contar quantas vezes r.turno, aparece
    const matches = content.match(/r\.turno,\s*\n/g);
    const count = matches ? matches.length : 0;
    
    console.log(`📊 Encontradas ${count} referências a "r.turno," no arquivo.\n`);
    
    if (count === 0) {
        console.log('✅ Nenhuma referência encontrada! Arquivo já está limpo.\n');
        process.exit(0);
    }
    
    // Remover todas as linhas com r.turno,
    content = content.replace(/\s*r\.turno,\s*\n/g, '\n');
    
    // Salvar arquivo
    fs.writeFileSync(filePath, content, 'utf8');
    
    console.log(`✅ ${count} referências a "r.turno," foram removidas com sucesso!\n`);
    console.log(`📄 Arquivo atualizado: ${filePath}\n`);
    
} catch (error) {
    console.error('❌ Erro ao processar arquivo:', error.message);
    process.exit(1);
}
