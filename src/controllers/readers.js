const {createItem, findAllItems, findItemById, updateItemById, deleteItemById} = require('./helpers');

exports.createReader = (req, res) => createItem(res, 'reader', req.body);

exports.getReaders = (_, res) => findAllItems(res, 'reader');

exports.getReaderById = (req, res) => findItemById(res, 'reader', req.params.id);

exports.updateReaderById = (req, res) => updateItemById(res, 'reader', req.params.id, req.body);

exports.deleteReaderById = (req, res) => deleteItemById(res, 'reader', req.params.id);