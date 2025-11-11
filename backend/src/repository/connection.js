import mysql from 'mysql2/promise'
import 'dotenv/config'

// =========================================================
// POOL DE CONEXÕES OTIMIZADO
// Melhor performance e gerenciamento de conexões
// =========================================================

const pool = mysql.createPool({
  // Configurações de conexão
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_DATABASE || 'segredodosabor',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'P@$$w0rd',
  port: process.env.DB_PORT || 3306,
  
  // Configurações do pool
  waitForConnections: true,         // Aguarda conexão disponível
  connectionLimit: 10,               // Máximo 10 conexões simultâneas
  maxIdle: 10,                       // Máximo de conexões ociosas
  idleTimeout: 60000,                // Timeout de 60s para conexões ociosas
  queueLimit: 0,                     // Sem limite de fila
  enableKeepAlive: true,             // Mantém conexões ativas
  keepAliveInitialDelay: 0,          // Delay inicial do keep-alive
  
  // Configurações de charset e timezone
  charset: 'utf8mb4',
  timezone: 'local',
  
  // Configurações de performance
  multipleStatements: false,         // Segurança: desabilitar múltiplos statements
  namedPlaceholders: true,           // Usar placeholders nomeados
  
  // Configurações de segurança
  decimalNumbers: true,              // Retornar decimais como números
  bigNumberStrings: false,           // Não converter big numbers para strings
  supportBigNumbers: true,           // Suportar números grandes
  dateStrings: false,                // Retornar datas como objetos Date
  
  // Configurações de debug (desenvolvimento)
  debug: process.env.NODE_ENV === 'development' ? ['ComQueryPacket'] : false,
  
  // Configurações de timeout
  connectTimeout: 10000              // 10s para conectar
});

// =========================================================
// EVENTOS DO POOL
// =========================================================

// Evento: nova conexão criada (silencioso)
pool.on('connection', (connection) => {
  // Conexão criada - log desabilitado para não poluir o terminal
});

// Evento: conexão adquirida do pool (silencioso)
pool.on('acquire', (connection) => {
  // Conexão adquirida - log desabilitado para não poluir o terminal
});

// Evento: conexão liberada de volta ao pool (silencioso)
pool.on('release', (connection) => {
  // Conexão liberada - log desabilitado para não poluir o terminal
});

// Evento: erro no pool (apenas erros são logados)
pool.on('error', (err) => {
  console.error('❌ Erro no pool de conexões:', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.error('Conexão com banco perdida. Reconectando...');
  }
});

// =========================================================
// TESTAR CONEXÃO INICIAL (de forma assíncrona)
// =========================================================

(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('🚀 Pool de conexões criado com sucesso!');
    console.log('Conexão com banco realizada!');
    connection.release();
  } catch (error) {
    console.error('❌ Erro ao criar pool de conexões:', error.message);
    console.error('⚠️ Verifique as configurações do banco de dados no arquivo .env');
  }
})();

// =========================================================
// HELPER FUNCTIONS
// =========================================================

/**
 * Executa query com tratamento de erro
 * @param {string} sql - Query SQL
 * @param {Array} params - Parâmetros da query
 * @returns {Promise<Array>} Resultado da query
 */
export async function executeQuery(sql, params = []) {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.execute(sql, params);
    return rows;
  } catch (error) {
    console.error('Erro ao executar query:', error);
    throw error;
  } finally {
    if (connection) connection.release();
  }
}

/**
 * Executa transação
 * @param {Function} callback - Função com as operações da transação
 * @returns {Promise<any>} Resultado da transação
 */
export async function executeTransaction(callback) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    console.error('Erro na transação:', error);
    throw error;
  } finally {
    connection.release();
  }
}

/**
 * Fecha todas as conexões do pool
 * @returns {Promise<void>}
 */
export async function closePool() {
  try {
    await pool.end();
    console.log('Pool de conexões fechado com sucesso');
  } catch (error) {
    console.error('Erro ao fechar pool:', error);
    throw error;
  }
}

// =========================================================
// EXPORTAR POOL E HELPERS
// =========================================================

export default pool;