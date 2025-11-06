/**
 * Utilitários para validação de dados
 */

/**
 * Valida se um email é válido
 * @param {string} email - Email a ser validado
 * @returns {boolean} True se o email for válido
 */
export function validarEmail(email) {
    if (!email) return false;
    
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * Valida se um número é positivo
 * @param {*} numero - Número a ser validado
 * @returns {boolean} True se o número for positivo
 */
export function validarNumeroPositivo(numero) {
    return !isNaN(numero) && numero > 0;
}

/**
 * Valida se um número não é negativo
 * @param {*} numero - Número a ser validado
 * @returns {boolean} True se o número não for negativo
 */
export function validarNumeroNaoNegativo(numero) {
    return !isNaN(numero) && numero >= 0;
}

/**
 * Valida se uma string não está vazia
 * @param {string} str - String a ser validada
 * @returns {boolean} True se a string não estiver vazia
 */
export function validarStringNaoVazia(str) {
    return !!(str && str.trim() !== '');
}

/**
 * Valida se um ID é válido
 * @param {*} id - ID a ser validado
 * @returns {boolean} True se o ID for válido
 */
export function validarId(id) {
    return !!(id && !isNaN(id) && parseInt(id) > 0);
}

/**
 * Valida se uma data é válida
 * @param {string} data - Data no formato YYYY-MM-DD
 * @returns {boolean} True se a data for válida
 */
export function validarData(data) {
    if (!data) return false;
    
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(data)) return false;
    
    const date = new Date(data);
    return !isNaN(date.getTime());
}

/**
 * Valida se um horário é válido
 * @param {string} horario - Horário no formato HH:MM
 * @returns {boolean} True se o horário for válido
 */
export function validarHorario(horario) {
    if (!horario) return false;
    
    const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return regex.test(horario);
}

/**
 * Formata um número para moeda brasileira
 * @param {number} valor - Valor a ser formatado
 * @returns {string} Valor formatado
 */
export function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
}

/**
 * Formata uma data para o padrão brasileiro
 * @param {string} data - Data no formato YYYY-MM-DD
 * @returns {string} Data formatada no padrão DD/MM/YYYY
 */
export function formatarDataBR(data) {
    if (!data) return '';
    
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
}

/**
 * Remove caracteres especiais de uma string
 * @param {string} str - String a ser limpa
 * @returns {string} String sem caracteres especiais
 */
export function removerCaracteresEspeciais(str) {
    return str.replace(/[^a-zA-Z0-9\s]/g, '');
}

/**
 * Valida telefone brasileiro
 * @param {string} telefone - Telefone a ser validado
 * @returns {boolean} True se o telefone for válido
 */
export function validarTelefone(telefone) {
    if (!telefone) return false;
    
    // Remove caracteres não numéricos
    const numero = telefone.replace(/\D/g, '');
    
    // Valida tamanho (10 ou 11 dígitos)
    return numero.length === 10 || numero.length === 11;
}
