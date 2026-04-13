const { Hadiah, GachaHistory } = require('../../../models');

async function getAvailableHadiah() {
  return Hadiah.find({ quota: { $gt: 0 } });
}

async function decreaseQuota(id) {
  return Hadiah.updateOne({ _id: id }, { $inc: { quota: -1 } });
}

async function createHistory(userId, hadiahId) {
  return GachaHistory.create({ userId, hadiahId });
}

async function countTodayGacha(userId) {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  return GachaHistory.countDocuments({
    userId,
    createdAt: { $gte: start },
  });
}

async function getHistoryByUser(userId) {
  return GachaHistory.find({ userId })
    .populate('hadiahId')
    .sort({ createdAt: -1 });
}

async function getAllHadiah() {
  return Hadiah.find({});
}

async function getWinners() {
  return GachaHistory.find({ hadiahId: { $ne: null } })
    .populate('hadiahId')
    .populate('userId');
}

module.exports = {
  getAvailableHadiah,
  decreaseQuota,
  createHistory,
  countTodayGacha,
  getHistoryByUser,
  getAllHadiah, 
  getWinners,
};