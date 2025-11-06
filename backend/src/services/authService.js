import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import connection from '../repository/connection.js';

/**
 * Serviço de Autenticação
 * Gerencia login, registro, tokens JWT e recuperação de senha
 */

class AuthService {
    constructor() {
        this.jwtSecret = process.env.JWT_SECRET || 'segredodosabor_secret_2025';
        this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';
        this.refreshSecret = process.env.JWT_REFRESH_SECRET || 'segredodosabor_refresh_2025';
        this.refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '30d';
        this.saltRounds = 10;
    }

    /**
     * Hash de senha usando bcrypt
     */
    async hashPassword(password) {
        return await bcrypt.hash(password, this.saltRounds);
    }

    /**
     * Verifica se a senha corresponde ao hash
     */
    async comparePassword(password, hash) {
        return await bcrypt.compare(password, hash);
    }

    /**
     * Gera token JWT de acesso
     */
    generateAccessToken(user) {
        const payload = {
            id: user.id_cliente,
            email: user.email,
            nome: user.nome,
            tipo: user.tipo || 'cliente'
        };

        return jwt.sign(payload, this.jwtSecret, { 
            expiresIn: this.jwtExpiresIn 
        });
    }

    /**
     * Gera token JWT de refresh
     */
    generateRefreshToken(user) {
        const payload = {
            id: user.id_cliente,
            email: user.email
        };

        return jwt.sign(payload, this.refreshSecret, { 
            expiresIn: this.refreshExpiresIn 
        });
    }

    /**
     * Verifica e decodifica token de acesso
     */
    verifyAccessToken(token) {
        try {
            return jwt.verify(token, this.jwtSecret);
        } catch (error) {
            throw new Error('Token inválido ou expirado');
        }
    }

    /**
     * Verifica e decodifica token de refresh
     */
    verifyRefreshToken(token) {
        try {
            return jwt.verify(token, this.refreshSecret);
        } catch (error) {
            throw new Error('Token de refresh inválido ou expirado');
        }
    }

    /**
     * Registra novo cliente
     */
    async register(dados) {
        const { nome, email, telefone, senha } = dados;

        // Validações
        if (!nome || !email || !telefone || !senha) {
            throw new Error('Todos os campos são obrigatórios');
        }

        if (senha.length < 6) {
            throw new Error('A senha deve ter no mínimo 6 caracteres');
        }

        // Verificar se email já existe
        const [existente] = await connection.query(
            'SELECT id_cliente FROM tb_cliente WHERE email = ?',
            [email]
        );

        if (existente.length > 0) {
            throw new Error('Este email já está cadastrado');
        }

        // Hash da senha
        const senhaHash = await this.hashPassword(senha);

        // Inserir cliente
        const [resultado] = await connection.query(
            `INSERT INTO tb_cliente (nome, email, telefone, senha, data_cadastro) 
             VALUES (?, ?, ?, ?, NOW())`,
            [nome, email, telefone, senhaHash]
        );

        // Buscar cliente criado
        const [cliente] = await connection.query(
            'SELECT id_cliente, nome, email, telefone, data_cadastro FROM tb_cliente WHERE id_cliente = ?',
            [resultado.insertId]
        );

        return cliente[0];
    }

    /**
     * Login de cliente
     */
    async login(email, senha) {
        if (!email || !senha) {
            throw new Error('Email e senha são obrigatórios');
        }

        // Buscar cliente
        const [clientes] = await connection.query(
            'SELECT * FROM tb_cliente WHERE email = ?',
            [email]
        );

        if (clientes.length === 0) {
            throw new Error('Email ou senha incorretos');
        }

        const cliente = clientes[0];

        // Verificar senha
        if (!cliente.senha) {
            throw new Error('Cliente sem senha cadastrada. Use a recuperação de senha.');
        }

        const senhaCorreta = await this.comparePassword(senha, cliente.senha);
        
        if (!senhaCorreta) {
            throw new Error('Email ou senha incorretos');
        }

        // Atualizar último acesso
        await connection.query(
            'UPDATE tb_cliente SET ultimo_acesso = NOW() WHERE id_cliente = ?',
            [cliente.id_cliente]
        );

        // Gerar tokens
        const accessToken = this.generateAccessToken(cliente);
        const refreshToken = this.generateRefreshToken(cliente);

        // Salvar refresh token no banco
        await this.saveRefreshToken(cliente.id_cliente, refreshToken);

        // Remover senha do retorno
        delete cliente.senha;

        return {
            user: cliente,
            accessToken,
            refreshToken
        };
    }

    /**
     * Login de administrador
     */
    async loginAdmin(emailOuCpf, senha) {
        if (!emailOuCpf || !senha) {
            throw new Error('Email/CPF e senha são obrigatórios');
        }

        // Buscar admin por email ou CPF
        const [admins] = await connection.query(
            'SELECT * FROM administrador WHERE (email = ? OR cpf = ?) AND ativo = TRUE',
            [emailOuCpf, emailOuCpf]
        );

        if (admins.length === 0) {
            throw new Error('Credenciais inválidas');
        }

        const admin = admins[0];

        // Verificar senha
        const senhaCorreta = await this.comparePassword(senha, admin.senha);
        
        if (!senhaCorreta) {
            throw new Error('Credenciais inválidas');
        }

        // Atualizar último acesso
        await connection.query(
            'UPDATE administrador SET ultimo_acesso = NOW() WHERE idadministrador = ?',
            [admin.idadministrador]
        );

        // Gerar token com tipo admin
        const adminData = {
            id_cliente: admin.idadministrador,
            email: admin.email,
            nome: admin.nome,
            tipo: 'admin'
        };

        const accessToken = this.generateAccessToken(adminData);
        const refreshToken = this.generateRefreshToken(adminData);

        // Remover senha do retorno
        delete admin.senha;

        return {
            user: {
                ...admin,
                tipo: 'admin'
            },
            accessToken,
            refreshToken
        };
    }

    /**
     * Salva refresh token no banco
     */
    async saveRefreshToken(clienteId, token) {
        const dataExpiracao = new Date();
        dataExpiracao.setDate(dataExpiracao.getDate() + 30); // 30 dias

        await connection.query(
            `INSERT INTO tb_refresh_tokens (id_cliente, token, data_expiracao) 
             VALUES (?, ?, ?)`,
            [clienteId, token, dataExpiracao]
        );
    }

    /**
     * Renova token de acesso usando refresh token
     */
    async refreshAccessToken(refreshToken) {
        // Verificar refresh token
        const decoded = this.verifyRefreshToken(refreshToken);

        // Verificar se token existe no banco e não foi revogado
        const [tokens] = await connection.query(
            `SELECT * FROM tb_refresh_tokens 
             WHERE token = ? AND revogado = FALSE AND data_expiracao > NOW()`,
            [refreshToken]
        );

        if (tokens.length === 0) {
            throw new Error('Refresh token inválido ou revogado');
        }

        // Buscar cliente
        const [clientes] = await connection.query(
            'SELECT * FROM tb_cliente WHERE id_cliente = ?',
            [decoded.id]
        );

        if (clientes.length === 0) {
            throw new Error('Cliente não encontrado');
        }

        const cliente = clientes[0];
        delete cliente.senha;

        // Gerar novo access token
        const accessToken = this.generateAccessToken(cliente);

        return {
            accessToken,
            user: cliente
        };
    }

    /**
     * Logout - revoga refresh token
     */
    async logout(refreshToken) {
        await connection.query(
            'UPDATE tb_refresh_tokens SET revogado = TRUE WHERE token = ?',
            [refreshToken]
        );
    }

    /**
     * Busca dados do usuário pelo ID
     */
    async getUserById(id) {
        const [clientes] = await connection.query(
            'SELECT id_cliente, nome, email, telefone, data_cadastro, ultimo_acesso FROM tb_cliente WHERE id_cliente = ?',
            [id]
        );

        if (clientes.length === 0) {
            throw new Error('Cliente não encontrado');
        }

        return clientes[0];
    }

    /**
     * Atualiza dados do cliente
     */
    async updateUser(id, dados) {
        const { nome, telefone } = dados;

        await connection.query(
            'UPDATE tb_cliente SET nome = ?, telefone = ? WHERE id_cliente = ?',
            [nome, telefone, id]
        );

        return await this.getUserById(id);
    }

    /**
     * Altera senha do cliente
     */
    async changePassword(id, senhaAtual, novaSenha) {
        // Buscar cliente
        const [clientes] = await connection.query(
            'SELECT senha FROM tb_cliente WHERE id_cliente = ?',
            [id]
        );

        if (clientes.length === 0) {
            throw new Error('Cliente não encontrado');
        }

        const cliente = clientes[0];

        // Verificar senha atual
        const senhaCorreta = await this.comparePassword(senhaAtual, cliente.senha);
        
        if (!senhaCorreta) {
            throw new Error('Senha atual incorreta');
        }

        // Validar nova senha
        if (novaSenha.length < 6) {
            throw new Error('A nova senha deve ter no mínimo 6 caracteres');
        }

        // Hash da nova senha
        const novaSenhaHash = await this.hashPassword(novaSenha);

        // Atualizar senha
        await connection.query(
            'UPDATE tb_cliente SET senha = ? WHERE id_cliente = ?',
            [novaSenhaHash, id]
        );
    }

    /**
     * Gera token de recuperação de senha
     */
    async forgotPassword(email) {
        // Buscar cliente
        const [clientes] = await connection.query(
            'SELECT id_cliente, nome FROM tb_cliente WHERE email = ?',
            [email]
        );

        if (clientes.length === 0) {
            // Não revelar se email existe ou não (segurança)
            return { message: 'Se o email existir, você receberá instruções de recuperação' };
        }

        const cliente = clientes[0];

        // Gerar token de recuperação (válido por 1 hora)
        const token = jwt.sign(
            { id: cliente.id_cliente, email },
            this.jwtSecret,
            { expiresIn: '1h' }
        );

        // Salvar token no banco
        const dataExpiracao = new Date();
        dataExpiracao.setHours(dataExpiracao.getHours() + 1);

        await connection.query(
            'UPDATE tb_cliente SET token_recuperacao = ?, data_token_recuperacao = ? WHERE id_cliente = ?',
            [token, dataExpiracao, cliente.id_cliente]
        );

        // TODO: Enviar email com link de recuperação
        console.log(`🔑 Token de recuperação para ${email}: ${token}`);

        return { 
            message: 'Se o email existir, você receberá instruções de recuperação',
            token // Apenas para desenvolvimento - remover em produção
        };
    }

    /**
     * Redefine senha usando token de recuperação
     */
    async resetPassword(token, novaSenha) {
        // Verificar token
        let decoded;
        try {
            decoded = jwt.verify(token, this.jwtSecret);
        } catch (error) {
            throw new Error('Token inválido ou expirado');
        }

        // Buscar cliente e verificar token
        const [clientes] = await connection.query(
            `SELECT id_cliente FROM tb_cliente 
             WHERE id_cliente = ? AND token_recuperacao = ? 
             AND data_token_recuperacao > NOW()`,
            [decoded.id, token]
        );

        if (clientes.length === 0) {
            throw new Error('Token inválido ou expirado');
        }

        // Validar nova senha
        if (novaSenha.length < 6) {
            throw new Error('A senha deve ter no mínimo 6 caracteres');
        }

        // Hash da nova senha
        const novaSenhaHash = await this.hashPassword(novaSenha);

        // Atualizar senha e limpar token
        await connection.query(
            `UPDATE tb_cliente 
             SET senha = ?, token_recuperacao = NULL, data_token_recuperacao = NULL 
             WHERE id_cliente = ?`,
            [novaSenhaHash, decoded.id]
        );
    }
}

export default new AuthService();
