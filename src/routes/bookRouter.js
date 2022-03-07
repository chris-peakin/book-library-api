const express = require('express');

const bookController = require('../controllers/books');

const router = express.Router();

router.post('/', bookController.createBook);

router.get('/', bookController.getBooks);

router.get('/:id', bookController.getBookById);

router.patch('/:id', bookController.updateBookById);

router.delete('/:id', bookController.deleteBookById);

module.exports = router;