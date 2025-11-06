import mysql from 'mysql2/promise'
import 'dotenv/config'

const connection = await mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_DATABASE || 'segredodosabor',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'P@$$w0rd'
})

console.log('Conexão com banco realizada!');
export default connection;