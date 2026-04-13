module.exports = (db) =>
  db.model(
    'GachaHistory',
    db.Schema({
      userId: db.Schema.Types.ObjectId,
      hadiahId: {
        type: db.Schema.Types.ObjectId,
        ref: 'Hadiah',
        default: null,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    })
  );