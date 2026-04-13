const { Hadiah } = require('./models');

async function seedHadiah() {
  const count = await Hadiah.countDocuments();

  if (count > 0) {
    console.log('Seed sudah ada, skip...');
    return;
  }

  await Hadiah.insertMany([
    { name: 'Emas 10 gram', quota: 1 },
    { name: 'Smartphone X', quota: 5 },
    { name: 'Smartwatch Y', quota: 10 },
    { name: 'Voucher Rp100.000', quota: 100 },
    { name: 'Pulsa Rp50.000', quota: 500 },
  ]);

  console.log('Seed hadiah berhasil!');
}

module.exports = seedHadiah;