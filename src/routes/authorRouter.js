const express = require('express');

const authorController = require('../controllers/authors');

const router = express.Router();

router.post('/', authorController.createAuthor);

router.get('/', authorController.getAuthors);

router.get('/:id', authorController.getAuthorById);

router.patch('/:id', authorController.updateAuthorById);

router.delete('/:id', authorController.deleteAuthorById);

module.exports = router;