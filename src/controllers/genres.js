const {createItem, findAllItems, findItemById, updateItemById, deleteItemById} = require('./helpers');

exports.createGenre = (req, res) => createItem(res, 'genre', req.body);

exports.getGenres = (_, res) => findAllItems(res, 'genre');

exports.getGenreById = (req, res) => findItemById(res, 'genre', req.params.id);

exports.updateGenreById = (req, res) => updateItemById(res, 'genre', req.params.id, req.body);

exports.deleteGenreById = (req, res) => deleteItemById(res, 'genre', req.params.id);