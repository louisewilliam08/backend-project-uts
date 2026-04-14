const express = require('express');
const gachaController = require('./gacha-controller');

module.exports = (app) => {
  const router = express.Router();

  app.use('/gacha', router);

  // POST /api/gacha - Melakukan gacha
  router.post('/', gachaController.doGacha);

  // GET /api/gacha/history/:user_id - Histori gacha user
  router.get('/history/:user_id', gachaController.getHistory);

  // GET /api/gacha/prizes - Daftar hadiah & kuota tersisa 
  router.get('/prizes', gachaController.getPrizes);

  // GET /api/gacha/winners - Daftar pemenang per hadiah 
  router.get('/winners', gachaController.getWinners);
};