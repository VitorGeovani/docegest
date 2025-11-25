import { Router } from 'express';
import connection from '../repository/connection.js';

const endpoints = Router();

/**
 * RF055: Sistema de Preferências de Clientes
 * Controller para gerenciar preferências personalizadas
 */

/**
 * GET /preferencias/:idcliente
 * Buscar preferências de um cliente específico
 */
endpoints.get('/preferencias/:idcliente', async (req, resp) => {
    try {
        const { idcliente } = req.params;
        
        const [resultado] = await connection.query(
            'CALL sp_buscar_preferencias_cliente(?)',
            [idcliente]
        );
        
        if (resultado[0].length === 0) {
            return resp.status(404).send({
                erro: 'Cliente não possui preferências cadastradas'
            });
        }
        
        resp.status(200).send({
            idcliente: parseInt(idcliente),
            preferencias: resultado[0][0].preferencias,
            ultima_atualizacao: resultado[0][0].data_atualizacao
        });
        
    } catch (err) {
        console.error('Erro ao buscar preferências:', err);
        resp.status(500).send({ erro: err.message });
    }
});

/**
 * POST /preferencias/:idcliente
 * Salvar ou atualizar preferências de um cliente
 * Body: { preferencias: {...} }
 */
endpoints.post('/preferencias/:idcliente', async (req, resp) => {
    try {
        const { idcliente } = req.params;
        const { preferencias } = req.body;
        
        if (!preferencias) {
            return resp.status(400).send({
                erro: 'Campo preferencias é obrigatório'
            });
        }
        
        // Validar estrutura JSON
        const preferencasJson = typeof preferencias === 'string' 
            ? JSON.parse(preferencias) 
            : preferencias;
        
        await connection.query(
            'CALL sp_salvar_preferencias_cliente(?, ?)',
            [idcliente, JSON.stringify(preferencasJson)]
        );
        
        resp.status(200).send({
            sucesso: true,
            mensagem: 'Preferências salvas com sucesso',
            idcliente: parseInt(idcliente),
            preferencias: preferencasJson
        });
        
    } catch (err) {
        console.error('Erro ao salvar preferências:', err);
        resp.status(500).send({ erro: err.message });
    }
});

/**
 * GET /preferencias/:idcliente/produtos-favoritos
 * Buscar produtos favoritos de um cliente
 */
endpoints.get('/preferencias/:idcliente/produtos-favoritos', async (req, resp) => {
    try {
        const { idcliente } = req.params;
        
        const [resultado] = await connection.query(
            'CALL sp_buscar_produtos_favoritos(?)',
            [idcliente]
        );
        
        if (resultado[0].length === 0) {
            return resp.status(404).send({
                mensagem: 'Cliente não possui produtos favoritos',
                produtos: []
            });
        }
        
        resp.status(200).send({
            idcliente: parseInt(idcliente),
            produtos_favoritos: resultado[0]
        });
        
    } catch (err) {
        console.error('Erro ao buscar produtos favoritos:', err);
        resp.status(500).send({ erro: err.message });
    }
});

/**
 * POST /preferencias/:idcliente/aplicar-pedido
 * Aplicar preferências ao criar um novo pedido
 * Retorna dados pré-preenchidos baseados nas preferências
 */
endpoints.post('/preferencias/:idcliente/aplicar-pedido', async (req, resp) => {
    try {
        const { idcliente } = req.params;
        
        const [resultado] = await connection.query(`
            CALL sp_aplicar_preferencias_pedido(?, @observacao, @forma_pagamento, @horario);
            SELECT @observacao AS observacao, @forma_pagamento AS forma_pagamento, @horario AS horario;
        `, [idcliente]);
        
        const dados = resultado[1][0];
        
        resp.status(200).send({
            idcliente: parseInt(idcliente),
            dados_preenchidos: {
                observacao: dados.observacao,
                forma_pagamento: dados.forma_pagamento,
                horario_preferido: dados.horario
            }
        });
        
    } catch (err) {
        console.error('Erro ao aplicar preferências:', err);
        resp.status(500).send({ erro: err.message });
    }
});

/**
 * PUT /preferencias/:idcliente/adicionar-favorito
 * Adicionar um produto aos favoritos
 * Body: { idproduto: number }
 */
endpoints.put('/preferencias/:idcliente/adicionar-favorito', async (req, resp) => {
    try {
        const { idcliente } = req.params;
        const { idproduto } = req.body;
        
        if (!idproduto) {
            return resp.status(400).send({
                erro: 'Campo idproduto é obrigatório'
            });
        }
        
        // Buscar preferências atuais
        const [resultado] = await connection.query(
            'SELECT preferencias FROM cliente_preferencias WHERE idcliente_fk = ? AND ativo = TRUE',
            [idcliente]
        );
        
        let preferencias = {};
        
        if (resultado.length > 0) {
            preferencias = resultado[0].preferencias;
        }
        
        // Adicionar produto aos favoritos
        if (!preferencias.produtos_favoritos) {
            preferencias.produtos_favoritos = [];
        }
        
        if (!preferencias.produtos_favoritos.includes(idproduto)) {
            preferencias.produtos_favoritos.push(idproduto);
        }
        
        // Salvar preferências atualizadas
        await connection.query(
            'CALL sp_salvar_preferencias_cliente(?, ?)',
            [idcliente, JSON.stringify(preferencias)]
        );
        
        resp.status(200).send({
            sucesso: true,
            mensagem: 'Produto adicionado aos favoritos',
            produtos_favoritos: preferencias.produtos_favoritos
        });
        
    } catch (err) {
        console.error('Erro ao adicionar favorito:', err);
        resp.status(500).send({ erro: err.message });
    }
});

/**
 * DELETE /preferencias/:idcliente/remover-favorito/:idproduto
 * Remover um produto dos favoritos
 */
endpoints.delete('/preferencias/:idcliente/remover-favorito/:idproduto', async (req, resp) => {
    try {
        const { idcliente, idproduto } = req.params;
        
        // Buscar preferências atuais
        const [resultado] = await connection.query(
            'SELECT preferencias FROM cliente_preferencias WHERE idcliente_fk = ? AND ativo = TRUE',
            [idcliente]
        );
        
        if (resultado.length === 0) {
            return resp.status(404).send({
                erro: 'Cliente não possui preferências'
            });
        }
        
        let preferencias = resultado[0].preferencias;
        
        if (!preferencias.produtos_favoritos) {
            return resp.status(404).send({
                erro: 'Cliente não possui produtos favoritos'
            });
        }
        
        // Remover produto dos favoritos
        preferencias.produtos_favoritos = preferencias.produtos_favoritos.filter(
            id => id !== parseInt(idproduto)
        );
        
        // Salvar preferências atualizadas
        await connection.query(
            'CALL sp_salvar_preferencias_cliente(?, ?)',
            [idcliente, JSON.stringify(preferencias)]
        );
        
        resp.status(200).send({
            sucesso: true,
            mensagem: 'Produto removido dos favoritos',
            produtos_favoritos: preferencias.produtos_favoritos
        });
        
    } catch (err) {
        console.error('Erro ao remover favorito:', err);
        resp.status(500).send({ erro: err.message });
    }
});

/**
 * GET /preferencias/relatorio
 * Relatório de clientes com preferências
 * Apenas para admin
 */
endpoints.get('/preferencias/relatorio', async (req, resp) => {
    try {
        const [resultado] = await connection.query(`
            SELECT * FROM vw_relatorio_clientes_preferencias
            LIMIT 100
        `);
        
        resp.status(200).send({
            total: resultado.length,
            clientes: resultado
        });
        
    } catch (err) {
        console.error('Erro ao gerar relatório:', err);
        resp.status(500).send({ erro: err.message });
    }
});

/**
 * GET /preferencias/:idcliente/historico
 * Buscar histórico de alterações de preferências
 */
endpoints.get('/preferencias/:idcliente/historico', async (req, resp) => {
    try {
        const { idcliente } = req.params;
        
        const [resultado] = await connection.query(`
            SELECT 
                idhistorico,
                preferencias_antigas,
                preferencias_novas,
                data_alteracao
            FROM cliente_preferencias_historico
            WHERE idcliente_fk = ?
            ORDER BY data_alteracao DESC
            LIMIT 10
        `, [idcliente]);
        
        resp.status(200).send({
            idcliente: parseInt(idcliente),
            historico: resultado
        });
        
    } catch (err) {
        console.error('Erro ao buscar histórico:', err);
        resp.status(500).send({ erro: err.message });
    }
});

export default endpoints;
