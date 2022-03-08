const {createItem, findAllItems, findItemById, updateItemById, deleteItemById, getAllBooks} = require('./helpers');

exports.createBook = (req, res) => createItem(res, 'book', req.body);

exports.getBooks = (_, res) => getAllBooks(res, 'book');

exports.getBookById = (req, res) => findItemById (res, 'book', req.params.id);

exports.updateBookById = (req, res) => updateItemById(res, 'book', req.params.id, req.body);

exports.deleteBookById = (req, res) => deleteItemById(res, 'book', req.params.id);