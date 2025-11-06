import boasVindas from './controller/boasVindasController.js'
import cliente from './controller/clienteController.js'
import produto from './controller/produtoController.js'
import reserva from './controller/reservaController.js'
import pedido from './controller/pedidoController.js'
import relatorioController from './controller/relatorioController.js';
import ingrediente from './controller/ingredienteController.js'
import categoria from './controller/categoriaController.js'
import exportacao from './controller/exportacaoController.js'
import whatsapp from './controller/whatsappController.js'
import auth from './controller/authController.js'
import receita from './controller/receitaController.js'
import preferencias from './controller/preferenciasController.js'
import reenvioConfirmacao from './controller/reenvioConfirmacaoController.js'
import simulacao from './controller/simulacaoController.js'
import whatsappHistorico from './controller/whatsappHistoricoController.js'
import { adicionarRotas as personalizacaoRotas } from './controller/personalizacaoController.js'
import express from 'express'


export default function adicionarRotas(servidor) {
    servidor.use(boasVindas);
    servidor.use(auth);
    servidor.use(cliente);
    servidor.use(produto);
    servidor.use(reserva);
    servidor.use(pedido);
    servidor.use(relatorioController);
    servidor.use(ingrediente);
    servidor.use(categoria);
    servidor.use(exportacao);
    servidor.use(whatsapp);
    servidor.use(receita);
    servidor.use(preferencias);
    servidor.use(reenvioConfirmacao);
    servidor.use(simulacao);
    servidor.use(whatsappHistorico);
    personalizacaoRotas(servidor);
    servidor.use('/storage', express.static('./storage'));
}