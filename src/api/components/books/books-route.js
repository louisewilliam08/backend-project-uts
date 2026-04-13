const express = require('express');

const booksController = require('./books-controller');

const route = express.Router();

module.exports = (app) => {
  app.use('/books', route);

  // Get list of books
  route.get('/', booksController.getBooks);

  // Create a new book
  route.post('/', booksController.createBook);

  // Get a book by id
  route.get('/:id', booksController.getBook);

  // Update a book by id
  route.put('/:id', booksController.updateBook);

  // Delete a book by id
  route.delete('/:id', booksController.deleteBook);
};
