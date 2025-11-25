import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import adicionarRotas from './routes.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'

const servidor = express();
servidor.use(express.json());
servidor.use(cors());

adicionarRotas(servidor);

// Middleware para rotas não encontradas (deve vir depois das rotas)
servidor.use(notFoundHandler);

// Middleware de tratamento de erros (deve vir por último)
servidor.use(errorHandler);

const PORT = process.env.PORT || 5000;
servidor.listen(
    PORT,
    () => console.log(`API subiu na porta ${PORT}!`));