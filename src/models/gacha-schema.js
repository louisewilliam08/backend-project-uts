module.exports = (db) =>
  db.model(
    'GachaLog',
    db.Schema(
      {
        user_id: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        prize: {
          type: String,
          default: null,
        },
        prize_id: {
          type: Number,
          default: null,
        },
      },
      { collection: 'gacha_logs' }
    )
  );

  // hanya GachaLog yang disimpan di database, Kenapa history, prizes, dan winners tidak pelu database?
  // karena ketiga hal tersebut bisa diderived dari GachaLog