const { Books } = require('../../../models');

async function getBooks() {
  return Books.find({});
}

async function create(title) {
  return Books.create({ title });
}

async function getBook(id) {
  return Books.findById(id);
}

async function updateBook(id, title) {
  const result = await Books.updateOne(
    { _id: id },
    { $set : { title } },
  );

  return result.modifiedCount > 0;
}

async function deleteBook(id) {
  const result = await Books.deleteOne({ _id: id });

  return result.deletedCount > 0;
}

module.exports = {
  getBooks,
  create,
  getBook,
  updateBook,
  deleteBook,
};
