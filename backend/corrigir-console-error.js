import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, 'src', 'repository', 'reservaRepository.js');

// Ler o arquivo
let content = fs.readFileSync(filePath, 'utf8');

// Substituir template literals problemáticos por concatenação
content = content.replace(/console\.error\(`Erro ao parsear produtos da reserva \$\{reserva\.id\}:`/g, 
                         "console.error('Erro ao parsear produtos da reserva ' + reserva.id + ':'");
content = content.replace(/console\.error\(`Erro ao parsear qtdReserva da reserva \$\{reserva\.id\}:`/g, 
                         "console.error('Erro ao parsear qtdReserva da reserva ' + reserva.id + ':'");
content = content.replace(/console\.error\(`Erro ao parsear historicoStatus da reserva \$\{reserva\.id\}:`/g, 
                         "console.error('Erro ao parsear historicoStatus da reserva ' + reserva.id + ':'");

// Escrever de volta
fs.writeFileSync(filePath, content);

console.log('✅ Arquivo corrigido com sucesso!');
