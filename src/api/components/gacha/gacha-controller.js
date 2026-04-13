const gachaService = require('./gacha-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

async function gacha(request, response, next) {
  console.log('BODY:', request.body);
  try {
    const { userId } = request.body;

    if (!userId) {
      throw errorResponder(errorTypes.VALIDATION_ERROR, 'User ID is required');
    }

    const result = await gachaService.doGacha(userId);

    if (result.error) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, result.error);
    }

    return response.status(200).json(result);
  } catch (error) {
  console.log('ERROR ASLI:', error); // 🔥 WAJIB
  return next(error);
}
}

async function getHistory(request, response, next) {
  try {
    const { userId } = request.params;

    if (!userId) {
      throw errorResponder(errorTypes.VALIDATION_ERROR, 'User ID is required');
    }

    const result = await gachaService.getHistory(userId);

    return response.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

async function getHadiah(request, response, next) {
  try {
    const result = await gachaService.getHadiahList();

    return response.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

async function getWinners(request, response, next) {
  try {
    const result = await gachaService.getWinners();

    return response.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

async function getHadiah(request, response, next) {
  try {
    const result = await gachaService.getHadiahList();

    return response.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

async function getWinners(request, response, next) {
  try {
    const result = await gachaService.getWinners();

    return response.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  gacha,
  getHistory,
  getHadiah, 
  getWinners, 
};