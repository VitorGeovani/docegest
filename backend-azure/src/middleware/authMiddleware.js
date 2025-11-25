import authService from '../services/authService.js';

/**
 * Middleware de Autenticação
 * Verifica se o usuário está autenticado via JWT
 */

/**
 * Verifica se há token JWT válido
 */
export const authenticate = (req, res, next) => {
    try {
        // Buscar token no header Authorization
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ 
                error: 'Token não fornecido',
                message: 'É necessário estar autenticado para acessar este recurso'
            });
        }

        // Formato esperado: "Bearer TOKEN"
        const parts = authHeader.split(' ');

        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return res.status(401).json({ 
                error: 'Token mal formatado',
                message: 'Formato esperado: Bearer TOKEN'
            });
        }

        const token = parts[1];

        // Verificar token
        const decoded = authService.verifyAccessToken(token);

        // Adicionar dados do usuário na requisição
        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({ 
            error: 'Token inválido',
            message: error.message
        });
    }
};

/**
 * Middleware opcional - continua mesmo sem token
 */
export const optionalAuth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader) {
            const parts = authHeader.split(' ');
            
            if (parts.length === 2 && parts[0] === 'Bearer') {
                const token = parts[1];
                const decoded = authService.verifyAccessToken(token);
                req.user = decoded;
            }
        }
    } catch (error) {
        // Ignora erro - auth é opcional
    }

    next();
};

/**
 * Verifica se usuário é administrador
 */
export const isAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ 
            error: 'Não autenticado',
            message: 'É necessário estar autenticado'
        });
    }

    if (req.user.tipo !== 'admin') {
        return res.status(403).json({ 
            error: 'Acesso negado',
            message: 'Apenas administradores podem acessar este recurso'
        });
    }

    next();
};

/**
 * Verifica se usuário está acessando seus próprios dados
 */
export const isSelfOrAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ 
            error: 'Não autenticado',
            message: 'É necessário estar autenticado'
        });
    }

    const userId = parseInt(req.params.id || req.params.clienteId);

    if (req.user.id !== userId && req.user.tipo !== 'admin') {
        return res.status(403).json({ 
            error: 'Acesso negado',
            message: 'Você só pode acessar seus próprios dados'
        });
    }

    next();
};

export default {
    authenticate,
    optionalAuth,
    isAdmin,
    isSelfOrAdmin
};
