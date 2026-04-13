const gachaRepository = require('./gacha-repository');
const usersRepository = require('../users/users-repository'); 

function maskName(name) {
  if (!name) return '***'; // ← biar aman

  return name
    .split(' ')
    .map((word) => {
      if (word.length <= 2) return '*'.repeat(word.length);

      return (
        word[0] +
        '*'.repeat(word.length - 2) +
        word[word.length - 1]
      );
    })
    .join(' ');
}

async function doGacha(userId) {
  console.log('USER ID:', userId);

  const user = await usersRepository.getUser(userId);
  if (!user) {
    return { error: 'User not found' };
  }

  const totalToday = await gachaRepository.countTodayGacha(userId);
  if (totalToday >= 5) {
    return { error: 'Limit gacha hari ini sudah habis, coba lagi besok' };
  }

  const chance = Math.random();
  if (chance < 0.5) {
    await gachaRepository.createHistory(userId, null);

    return {
      hadiah: 'Yahaha, Zonk',
    };
  }

  const hadiahList = await gachaRepository.getAvailableHadiah();

  if (hadiahList.length === 0) {
    await gachaRepository.createHistory(userId, null);

    return {
      hadiah: 'Hadiahnya habis',
    };
  }

  const randomIndex = Math.floor(Math.random() * hadiahList.length);
  const selectedHadiah = hadiahList[randomIndex];

  await gachaRepository.decreaseQuota(selectedHadiah._id);

  await gachaRepository.createHistory(userId, selectedHadiah._id);

  return {
    hadiah: selectedHadiah.name,
  };
}

async function getHistory(userId) {
  const history = await gachaRepository.getHistoryByUser(userId);

  return history.map((item) => ({
    hadiah: item.hadiahId ? item.hadiahId.name : null,
    tanggal: item.createdAt,
  }));
}

async function getHadiahList() {
  const data = await gachaRepository.getAllHadiah();

  return data.map((item) => ({
    name: item.name,
    quota: item.quota,
  }));
}

async function getWinners() {
  const data = await gachaRepository.getWinners();

  return data.map((item) => ({
    name: maskName(item.userId.fullName),
    hadiah: item.hadiahId.name,
  }));
}

module.exports = {
  doGacha,
  getHistory,
  getHadiahList,
  getWinners,
};