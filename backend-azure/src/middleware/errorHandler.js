/**
 * Middleware de tratamento de erros centralizado
 * Este middleware captura todos os erros não tratados na aplicação
 * e retorna uma resposta padronizada
 */

export function errorHandler(err, req, res, next) {
    console.error('Erro capturado:', err);

    // Define o código de status padrão
    const statusCode = err.statusCode || 500;

    // Mensagem de erro
    const message = err.message || 'Erro interno do servidor';

    // Resposta padronizada
    res.status(statusCode).json({
        erro: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
}

/**
 * Middleware para capturar rotas não encontradas
 */
export function notFoundHandler(req, res) {
    res.status(404).json({
        erro: `Rota não encontrada: ${req.method} ${req.url}`
    });
}

/**
 * Wrapper para funções async que automaticamente captura erros
 * e passa para o middleware de erro
 */
export function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
