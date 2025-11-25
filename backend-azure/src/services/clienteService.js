import * as clienteRepository from '../repository/clienteRepository.js';

/**
 * Remove formatação do telefone (mantém apenas números)
 * @param {string} telefone - Telefone formatado
 * @returns {string} Telefone apenas com números
 */
function limparTelefone(telefone) {
    if (!telefone) return telefone;
    return telefone.replace(/\D/g, ''); // Remove tudo que não é dígito
}

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
    
    // ✅ Validar tamanho do telefone (após limpar formatação)
    const telefoneLimpo = limparTelefone(cliente.telefone);
    if (telefoneLimpo.length < 10 || telefoneLimpo.length > 11) {
        erros.push('Telefone deve ter 10 ou 11 dígitos');
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
        
        // ✅ Limpar telefone antes de inserir
        const clienteLimpo = {
            ...cliente,
            telefone: limparTelefone(cliente.telefone)
        };
        
        return await clienteRepository.inserir(clienteLimpo);
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
        
        // ✅ Limpar telefone antes de atualizar
        const clienteLimpo = {
            ...cliente,
            telefone: limparTelefone(cliente.telefone)
        };

        const linhasAfetadas = await clienteRepository.alterar(id, clienteLimpo);
        
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
        // ✅ Limpar telefone antes de validar/buscar
        const telefoneLimpo = limparTelefone(telefone);
        
        validarCliente({ nome, email, telefone: telefoneLimpo });

        let cliente = await clienteRepository.buscarPorEmailTelefone(email, telefoneLimpo);

        if (!cliente) {
            const idcliente = await clienteRepository.inserirCliente(nome, email, telefoneLimpo);
            cliente = { id_cliente: idcliente, id: idcliente, nome, email, telefone: telefoneLimpo };
        }

        return cliente;
    } catch (error) {
        throw new Error(`Erro ao verificar/criar cliente: ${error.message}`);
    }
}
