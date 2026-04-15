const express = require('express');
const gachaController = require('./gacha-controller');

module.exports = (app) => {
  const router = express.Router();

  app.use('/gacha', router);

  // Melakukan gacha
  router.post('/', gachaController.doGacha);

  // Histori gacha user
  router.get('/history/:user_id', gachaController.getHistory);

  // Daftar hadiah & kuota tersisa 
  router.get('/prizes', gachaController.getPrizes);

  // Daftar pemenang per hadiah 
  router.get('/winners', gachaController.getWinners);
};