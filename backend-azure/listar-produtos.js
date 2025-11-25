import { createConnection } from 'mysql2/promise';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function listarProdutos() {
    const envContent = readFileSync(join(__dirname, '.env'), 'utf-8');
    const config = {};
    envContent.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
            config[key.trim()] = valueParts.join('=').trim();
        }
    });
    
    const connectionConfig = {
        host: config.HOST || 'localhost',
        user: config.USER || 'root',
        database: config.DATABASE || 'segredodosabor'
    };
    
    if (config.PASSWORD && config.PASSWORD.length > 0) {
        connectionConfig.password = config.PASSWORD;
    }
    
    const connection = await createConnection(connectionConfig);
    const [produtos] = await connection.query('SELECT idproduto, nome, preco FROM produto LIMIT 20');
    
    console.log('\n📋 PRODUTOS CADASTRADOS:\n');
    produtos.forEach(p => {
        console.log(`  ${p.idproduto}. ${p.nome} - R$ ${parseFloat(p.preco).toFixed(2)}`);
    });
    
    await connection.end();
}

listarProdutos();
