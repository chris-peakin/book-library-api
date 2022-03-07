const {createItem, findAllItems, findItemById, updateItemById, deleteItemById} = require('./helpers');

exports.createBook = (req, res) => createItem(res, 'book', req.body);

exports.getBooks = (_, res) => findAllItems(res, 'book');

exports.getBookById = (req, res) => findItemById (res, 'book', req.params.id);

exports.updateBookById = (req, res) => updateItemById(res, 'book', req.params.id, req.body);

exports.deleteBookById = (req, res) => deleteItemById(res, 'book', req.params.id);

// const {Book} = require('../models');

// exports.create = async (req, res) => {
//     try{
//         const newBook = await Book.create(req.body);
//         res.status(201).json(newBook);
//     } catch (err){
//         res.status(400).json({errors: err});
//     }
// }

// exports.findAll = async (_, res) => {
//     const books = await Book.findAll();
//     res.status(200).json(books);
// }

// exports.findByPk = async (req, res) => {
//     const {bookId} = req.params;
//     const foundBook = await Book.findByPk(bookId);

//     if (!foundBook){
//         res.status(404).json({error: 'The book could not be found.'});
//     } else {
//         res.status(200).json(foundBook);
//     }
// }

// exports.update = async (req, res) => {
//     const {bookId} = req.params;
//     const foundBook = await Book.findByPk(bookId);
//     const newData = req.body;

//     if(!foundBook){
//         res.status(404).json({error: 'The book could not be found.'});
//     } else {
//         const [updatedRows] = await Book.update(newData, {where: {}});
//         return res.send();
//     }
// }

// exports.delete = async (req, res) => {
//     const {bookId} = req.params;
//     const foundBook = await Book.findByPk(bookId);

//     if (!foundBook){
//         res.status(404).json({error: 'The book could not be found.'});
//     } else {
//         const deletedBook = await Book.destroy({where: {id: bookId}});
//         return res.status(204).json();
//     }
// }