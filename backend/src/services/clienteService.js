import * as clienteRepository from '../repository/clienteRepository.js';

/**
 * Valida os dados de um cliente
 * @param {Object} cliente - Dados do cliente a serem validados
 * @throws {Error} Se os dados forem inválidos
 */
function validarCliente(cliente) {
    const erros = [];

    if (!cliente.nome || cliente.nome.trim() === '') {
        erros.push('Nome do cliente é obrigatório');
    }

    if (!cliente.email || !cliente.email.includes('@')) {
        erros.push('Email inválido');
    }

    if (!cliente.telefone || cliente.telefone.trim() === '') {
        erros.push('Telefone é obrigatório');
    }

    if (erros.length > 0) {
        throw new Error(erros.join('; '));
    }
}

/**
 * Lista todos os clientes
 * @returns {Promise<Array>} Lista de clientes
 */
export async function listarClientes() {
    try {
        return await clienteRepository.listar();
    } catch (error) {
        throw new Error(`Erro ao listar clientes: ${error.message}`);
    }
}

/**
 * Insere um novo cliente
 * @param {Object} cliente - Dados do cliente
 * @returns {Promise<number>} ID do cliente inserido
 */
export async function inserirCliente(cliente) {
    try {
        validarCliente(cliente);
        return await clienteRepository.inserir(cliente);
    } catch (error) {
        throw new Error(`Erro ao inserir cliente: ${error.message}`);
    }
}

/**
 * Atualiza um cliente existente
 * @param {number} id - ID do cliente
 * @param {Object} cliente - Novos dados do cliente
 * @returns {Promise<number>} Número de linhas afetadas
 */
export async function alterarCliente(id, cliente) {
    try {
        if (!id || isNaN(id)) {
            throw new Error('ID inválido');
        }

        validarCliente(cliente);

        const linhasAfetadas = await clienteRepository.alterar(id, cliente);
        
        if (linhasAfetadas === 0) {
            throw new Error('Cliente não encontrado');
        }

        return linhasAfetadas;
    } catch (error) {
        throw new Error(`Erro ao atualizar cliente: ${error.message}`);
    }
}

/**
 * Remove um cliente
 * @param {number} id - ID do cliente
 * @returns {Promise<number>} Número de linhas afetadas
 */
export async function removerCliente(id) {
    try {
        if (!id || isNaN(id)) {
            throw new Error('ID inválido');
        }

        const linhasAfetadas = await clienteRepository.remover(id);
        
        if (linhasAfetadas === 0) {
            throw new Error('Cliente não encontrado');
        }

        return linhasAfetadas;
    } catch (error) {
        throw new Error(`Erro ao remover cliente: ${error.message}`);
    }
}

/**
 * Verifica se um cliente existe ou cria um novo
 * @param {string} nome - Nome do cliente
 * @param {string} email - Email do cliente
 * @param {string} telefone - Telefone do cliente
 * @returns {Promise<Object>} Dados do cliente
 */
export async function verificarOuCriarCliente(nome, email, telefone) {
    try {
        validarCliente({ nome, email, telefone });

        let cliente = await clienteRepository.buscarPorEmailTelefone(email, telefone);

        if (!cliente) {
            const idcliente = await clienteRepository.inserirCliente(nome, email, telefone);
            cliente = { id_cliente: idcliente, id: idcliente, nome, email, telefone };
        }

        return cliente;
    } catch (error) {
        throw new Error(`Erro ao verificar/criar cliente: ${error.message}`);
    }
}
