import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';

const config = {
    host: 'localhost',
    user: 'root',
    password: 'P@$$w0rd',
    database: 'segredodosabor'
};

async function criarAdmin() {
    let connection;
    
    try {
        console.log('🔌 Conectando ao banco de dados...');
        connection = await mysql.createConnection(config);
        
        // Criar tabela de administradores se não existir
        console.log('📋 Verificando tabela de administradores...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS administrador (
                idadministrador INT PRIMARY KEY AUTO_INCREMENT,
                nome VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                cpf VARCHAR(14) UNIQUE,
                senha VARCHAR(255) NOT NULL,
                data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
                ultimo_acesso DATETIME,
                ativo BOOLEAN DEFAULT TRUE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);
        console.log('✅ Tabela de administradores verificada!');
        
        // Verificar se já existe admin
        const [existente] = await connection.query(
            'SELECT * FROM administrador WHERE email = ?',
            ['admin@segredodosabor.com']
        );
        
        if (existente.length > 0) {
            console.log('⚠️  Admin já existe no banco de dados!');
            console.log('📧 Email: admin@segredodosabor.com');
            console.log('🔑 Senha: admin123');
            return;
        }
        
        // Hash da senha
        console.log('🔐 Gerando hash da senha...');
        const senhaHash = await bcrypt.hash('admin123', 10);
        
        // Inserir admin padrão
        console.log('👤 Criando administrador...');
        await connection.query(`
            INSERT INTO administrador (nome, email, cpf, senha) 
            VALUES (?, ?, ?, ?)
        `, ['Administrador', 'admin@segredodosabor.com', '000.000.000-00', senhaHash]);
        
        console.log('\n✅ Administrador criado com sucesso!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📧 Email: admin@segredodosabor.com');
        console.log('🔑 Senha: admin123');
        console.log('📝 CPF: 000.000.000-00');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        
    } catch (error) {
        console.error('❌ Erro:', error.message);
    } finally {
        if (connection) {
            await connection.end();
            console.log('🔌 Conexão fechada.');
        }
    }
}

criarAdmin();
