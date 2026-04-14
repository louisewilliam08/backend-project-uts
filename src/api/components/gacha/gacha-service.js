const gachaRepository = require('./gacha-repository');

async function doGacha(userId) {
  return gachaRepository.performGacha(userId);
}

async function getHistory(userId) {
  return gachaRepository.getUserHistory(userId);
}

async function getPrizes() {
  return gachaRepository.getPrizesWithRemainingQuota();
}

async function getWinners() {
  return gachaRepository.getPrizeWinners();
}

module.exports = {
  doGacha,
  getHistory,
  getPrizes,
  getWinners,
};