const booksService = require('./books-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

async function getBooks(request, response, next) {
  try {
    const books = await booksService.getBooks();
    return response.status(200).json(books);
  } catch (error) {
    return next(error);
  }
}

async function createBook(request, response, next) {
  try {
    const { title } = request.body;

    if (!title) {
      throw errorResponder(errorTypes.VALIDATION_ERROR, 'Title is required');
    }

    const book = await booksService.create(title);
    return response.status(200).json(book);
  } catch (error) {
    return next(error);
  }
}

async function getBook(request, response, next) {
  try {
    const book = await booksService.getBook(request.params.id);

    if (!book) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Book not found');
    }

    return response.status(200).json(book);
  } catch (error) {
    return next(error);
  }
}

async function updateBook(request, response, next) {
  try {
    const { title } = request.body;

    if (!title) {
      throw errorResponder(errorTypes.VALIDATION_ERROR, 'Title is required');
    }

    const success = await booksService.updateBook(request.params.id, title);

    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update book'
      );
    }

    return response.status(200).json({
      message: 'Book updated successfully',
    });
  } catch (error) {
    return next(error);
  }
}

async function deleteBook(request, response, next) {
  try {
    const success = await booksService.deleteBook(request.params.id);

    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete book'
      );
    }

    return response.status(200).json({
      message: 'Book deleted successfully',
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getBooks,
  createBook,
  getBook,
  updateBook,
  deleteBook,
};
