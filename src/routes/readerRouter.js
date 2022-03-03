const express = require('express')

const readerController = require('../controllers/readers');

const router = express.Router();

router.post('/', readerController.create);

router.get('/', readerController.findAll);

router.get('/:readerId', readerController.findByPk);

router.patch('/:readerId', readerController.update);

router.delete('/:readerId', readerController.delete);

module.exports = router;