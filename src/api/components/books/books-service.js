const booksRepository = require('./books-repository');

async function getBooks() {
  return booksRepository.getBooks();
}

async function create(title) {
  return booksRepository.create(title);
}

async function getBook(id) {
  return booksRepository.getBook(id);
}

async function updateBook(id, title) {
  return booksRepository.updateBook(id, title);
} 

async function deleteBook(id) {
  return booksRepository.deleteBook(id);
}

module.exports = {
  getBooks,
  create,
  getBook,
  updateBook,
  deleteBook, 
};
