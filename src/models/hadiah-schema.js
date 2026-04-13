module.exports = (db) =>
  db.model(
    'Hadiah',
    db.Schema({
      name: String,
      quota: Number,
    })
  );