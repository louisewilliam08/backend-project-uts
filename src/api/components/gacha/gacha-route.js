const express = require('express');
const gachaController = require('./gacha-controller');

const route = express.Router();

module.exports = (app) => {
  app.use('/gacha', route);

  route.post('/', gachaController.gacha);
  route.get('/history/:userId', gachaController.getHistory);
  route.get('/hadiah', gachaController.getHadiah);
  route.get('/winners', gachaController.getWinners);
};