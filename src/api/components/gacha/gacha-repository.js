const { GachaLog, Users } = require('../../../models');

const PRIZESSS = [
  { id: 1, name: 'Emas 10 gram', quota: 1 },
  { id: 2, name: 'Smartphone X', quota: 5 },
  { id: 3, name: 'Smartwatch Y', quota: 10 },
  { id: 4, name: 'Voucher Rp100.000', quota: 100 },
  { id: 5, name: 'Pulsa Rp50.000', quota: 500 },
];

const MAX_GACHA_PER_DAY = 5;

// Fungsi untuk menghitung berapa kali user sudah melakukan gacha hari ini
async function getTodayGachaCount(userId) {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  return GachaLog.countDocuments({
    user_id: userId,
    timestamp: { $gte: startOfDay, $lte: endOfDay },
  });
}

// Fungsi untuk menghitung berapa kali setiap hadiah sudah dimenangkan
async function getPrizeWinnerCounts() {
  const counts = await GachaLog.aggregate([
    { $match: { prize_id: { $ne: null } } },
    { $group: { _id: '$prize_id', count: { $sum: 1 } } },
  ]);

  const countMap = {};
  counts.forEach((item) => {
    countMap[item._id] = item.count;
  });
  return countMap;
}

// Fungsi main untuk melakukan gacha
async function performGacha(userId) {
  const todayCount = await getTodayGachaCount(userId);
  if (todayCount >= MAX_GACHA_PER_DAY) {
    return { error: 'QUOTA_EXCEEDED', todayCount };
  }

  const winnerCounts = await getPrizeWinnerCounts();

  const availablePRIZESSS = PRIZESSS.filter(
    (prize) => (winnerCounts[prize.id] || 0) < prize.quota
  );


  const totalRemainingSlots = availablePRIZESSS.reduce(
    (sum, p) => sum + (p.quota - (winnerCounts[p.id] || 0)),
    0
  );
  const totalInitialSlots = PRIZESSS.reduce((sum, p) => sum + p.quota, 0);

  const winProbability = totalRemainingSlots / (totalInitialSlots * 2);
  const isWinner = Math.random() < winProbability && availablePRIZESSS.length > 0;

  let prize = null;
  let prizeId = null;

  if (isWinner) {
    const totalWeight = availablePRIZESSS.reduce(
      (sum, p) => sum + (p.quota - (winnerCounts[p.id] || 0)),
      0
    );
    let random = Math.random() * totalWeight;

    for (const p of availablePRIZESSS) {
      const remainingQuota = p.quota - (winnerCounts[p.id] || 0);
      random -= remainingQuota;
      if (random <= 0) {
        prize = p.name;
        prizeId = p.id;
        break;
      }
    }
  }

  // Simpan log gacha
  const log = await GachaLog.create({
    user_id: userId,
    timestamp: new Date(),
    prize,
    prize_id: prizeId,
  });

  return {
    error: null,
    gachaId: log._id,
    userId,
    prize,
    prizeId,
    todayCount: todayCount + 1,
    remainingToday: MAX_GACHA_PER_DAY - (todayCount + 1),
  };
}

// Fungsi untuk mendapatkan histori gacha user tertentu
async function getUserHistory(userId) {
  return GachaLog.find({ user_id: userId }).sort({ timestamp: -1 }).lean();
}

// Fungsi untuk menampilkan daftar hadiah yang tersedia beserta kuota tersisa
async function getPrizesWithRemainingQuota() {
  const winnerCounts = await getPrizeWinnerCounts();

  return PRIZESSS.map((prize) => ({
    id: prize.id,
    name: prize.name,
    total_quota: prize.quota,
    winners_count: winnerCounts[prize.id] || 0,
    remaining_quota: prize.quota - (winnerCounts[prize.id] || 0),
  }));
}

// Fungsi untuk menampilkan daftar pemenang per hadiah
async function getPrizeWinners() {
  const winners = await GachaLog.find({ prize_id: { $ne: null } })
    .sort({ timestamp: 1 })
    .lean();

  const prizeWinners = {};
  PRIZESSS.forEach((prize) => {
    prizeWinners[prize.id] = {
      prize_id: prize.id,
      prize_name: prize.name,
      winners: [],
    };
  });

  for (const log of winners) {
    const user = await Users.findById(log.user_id).lean();

    const name = user ? user.fullName : log.user_id;

    if (log.prize_id && prizeWinners[log.prize_id]) {
      prizeWinners[log.prize_id].winners.push({
        name: maskName(name),
        timestamp: log.timestamp,
      });
    }
  }

  return Object.values(prizeWinners);
}

// Function untuk menyamarkan nama 
function maskName(name) {
  if (!name) return '';

  const parts = name.split(' ');

  const masked = parts.map((part) => {
    if (part.length <= 2) return part;

    const first = part[0];
    const last = part[part.length - 1];
    const middle = '*'.repeat(part.length - 2);

    return first + middle + last;
  });

  return masked.join(' ');
}

module.exports = {
  performGacha,
  getUserHistory,
  getPrizesWithRemainingQuota,
  getPrizeWinners,
  MAX_GACHA_PER_DAY,
  PRIZESSS,
};