const express = require('express');

const bookController = require('../controllers/books');

const router = express.Router();

router.post('/', bookController.create);

router.get('/', bookController.findAll);

router.get('/:bookId', bookController.findByPk);

router.patch('/:bookId', bookController.update);

router.delete('/:bookId', bookController.delete);

module.exports = router;