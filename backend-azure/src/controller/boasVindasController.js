import { Router } from 'express'
const endpoints = Router();

endpoints.get('/olamundo', (req, resp) => {
resp.send({ mensagem: 'Olá mundo!' });
})

endpoints.get('/ola/:nome', (req, resp) => {
let nome = req.params.nome;
resp.send({ mensagem: 'Olá ' + nome });
})

export default endpoints;