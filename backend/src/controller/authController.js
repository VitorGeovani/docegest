import { Router } from 'express';
import authService from '../services/authService.js';
import { authenticate, isSelfOrAdmin } from '../middleware/authMiddleware.js';

const endpoints = Router();

/**
 * POST /auth/register
 * Registra novo cliente
 */
endpoints.post('/auth/register', async (req, res) => {
    try {
        const cliente = await authService.register(req.body);

        res.status(201).json({
            success: true,
            message: 'Cliente cadastrado com sucesso',
            cliente
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * POST /auth/login
 * Login de cliente
 */
endpoints.post('/auth/login', async (req, res) => {
    try {
        const { email, senha } = req.body;
        const resultado = await authService.login(email, senha);

        res.status(200).json({
            success: true,
            message: 'Login realizado com sucesso',
            ...resultado
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * POST /auth/admin/login
 * Login de administrador
 */
endpoints.post('/auth/admin/login', async (req, res) => {
    try {
        const { email, senha } = req.body;
        const resultado = await authService.loginAdmin(email, senha);

        res.status(200).json({
            success: true,
            message: 'Login de administrador realizado com sucesso',
            ...resultado
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * POST /auth/logout
 * Logout - revoga refresh token
 */
endpoints.post('/auth/logout', async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (refreshToken) {
            await authService.logout(refreshToken);
        }

        res.status(200).json({
            success: true,
            message: 'Logout realizado com sucesso'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * POST /auth/refresh
 * Renova token de acesso
 */
endpoints.post('/auth/refresh', async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                error: 'Refresh token não fornecido'
            });
        }

        const resultado = await authService.refreshAccessToken(refreshToken);

        res.status(200).json({
            success: true,
            ...resultado
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /auth/me
 * Retorna dados do usuário autenticado
 */
endpoints.get('/auth/me', authenticate, async (req, res) => {
    try {
        const cliente = await authService.getUserById(req.user.id);

        res.status(200).json({
            success: true,
            user: cliente
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * PUT /auth/me
 * Atualiza dados do usuário autenticado
 */
endpoints.put('/auth/me', authenticate, async (req, res) => {
    try {
        const cliente = await authService.updateUser(req.user.id, req.body);

        res.status(200).json({
            success: true,
            message: 'Dados atualizados com sucesso',
            user: cliente
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * PUT /auth/change-password
 * Altera senha do usuário autenticado
 */
endpoints.put('/auth/change-password', authenticate, async (req, res) => {
    try {
        const { senhaAtual, novaSenha } = req.body;

        if (!senhaAtual || !novaSenha) {
            return res.status(400).json({
                success: false,
                error: 'Senha atual e nova senha são obrigatórias'
            });
        }

        await authService.changePassword(req.user.id, senhaAtual, novaSenha);

        res.status(200).json({
            success: true,
            message: 'Senha alterada com sucesso'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * POST /auth/forgot-password
 * Solicita recuperação de senha
 */
endpoints.post('/auth/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                error: 'Email é obrigatório'
            });
        }

        const resultado = await authService.forgotPassword(email);

        res.status(200).json({
            success: true,
            ...resultado
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * POST /auth/reset-password
 * Redefine senha usando token de recuperação
 */
endpoints.post('/auth/reset-password', async (req, res) => {
    try {
        const { token, novaSenha } = req.body;

        if (!token || !novaSenha) {
            return res.status(400).json({
                success: false,
                error: 'Token e nova senha são obrigatórios'
            });
        }

        await authService.resetPassword(token, novaSenha);

        res.status(200).json({
            success: true,
            message: 'Senha redefinida com sucesso'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /auth/user/:id
 * Busca dados de um cliente (requer auth)
 */
endpoints.get('/auth/user/:id', authenticate, isSelfOrAdmin, async (req, res) => {
    try {
        const cliente = await authService.getUserById(req.params.id);

        res.status(200).json({
            success: true,
            user: cliente
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            error: error.message
        });
    }
});

export default endpoints;
