const express = require('express');

const genreController = require('../controllers/genres');

const router = express.Router();

router.post('/', genreController.createGenre);

router.get('/', genreController.getGenres);

router.get('/:id', genreController.getGenreById);

router.patch('/:id', genreController.updateGenreById);

router.delete('/:id', genreController.deleteGenreById);

module.exports = router;