const {createItem, findAllItems, findItemById, updateItemById, deleteItemById} = require('./helpers');

exports.createAuthor = (req, res) => createItem(res, 'author', req.body);

exports.getAuthors = (_, res) => findAllItems(res, 'author');

exports.getAuthorById = (req, res) => findItemById(res, 'author', req.params.id);

exports.updateAuthorById = (req, res) => updateItemById(res, 'author', req.params.id, req.body);

exports.deleteAuthorById = (req, res) => deleteItemById(res, 'author', req.params.id);