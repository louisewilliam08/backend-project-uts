const gachaService = require('./gacha-service');
const { errorResponder, errorTypes } = require('../../../core/errors');
const { MAX_GACHA_PER_DAY } = require('./gacha-repository');

async function doGacha(request, response, next) {
  try {
    const { user_id: userId } = request.body;

    if (!userId) {
      throw errorResponder(
        errorTypes.VALIDATION_ERROR,
        'user_id is required in request body'
      );
    }

    const result = await gachaService.doGacha(userId);

    if (result.error === 'QUOTA_EXCEEDED') {
      throw errorResponder(
        errorTypes.FORBIDDEN,
        `Gacha limit reached. You have used ${result.todayCount}/${MAX_GACHA_PER_DAY} gacha today. Please try again tomorrow.`
      );
    }

    if (result.prize) {
      return response.status(200).json({
        success: true,
        message: `Congratulations! You won: ${result.prize}`,
        data: {
          user_id: result.userId,
          prize: result.prize,
          prize_id: result.prizeId,
          gacha_count_today: result.todayCount,
          remaining_gacha_today: result.remainingToday,
        },
      });
    } else {
      return response.status(200).json({
        success: true,
        message: 'Hahaha, You got ZONK!!!',
        data: {
          user_id: result.userId,
          prize: "ZONK",
          gacha_count_today: result.todayCount,
          remaining_gacha_today: result.remainingToday,
        },
      });
    }
  } catch (error) {
    return next(error);
  }
}

async function getHistory(request, response, next) {
  try {
    const { user_id: userId } = request.params;

    if (!userId) {
      throw errorResponder(errorTypes.VALIDATION_ERROR, 'user_id is required');
    }

    const history = await gachaService.getHistory(userId);

    const summary = {
      user_id: userId,
      total_gacha: history.length,
      total_wins: history.filter((h) => h.prize !== null).length,
      history: history.map((h) => ({
        id: h._id,
        timestamp: h.timestamp,
        prize: h.prize || 'No Prizes',
        is_winner: h.prize !== null,
      })),
    };

    return response.status(200).json(summary);
  } catch (error) {
    return next(error);
  }
}

async function getPrizes(request, response, next) {
  try {
    const prizes = await gachaService.getPrizes();

    return response.status(200).json({
      success: true,
      data: prizes,
    });
  } catch (error) {
    return next(error);
  }
}

async function getWinners(request, response, next) {
  try {
    const winners = await gachaService.getWinners();

    return response.status(200).json({
      success: true,
      note: 'Names are masked for privacy',
      data: winners,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  doGacha,
  getHistory,
  getPrizes,
  getWinners,
};