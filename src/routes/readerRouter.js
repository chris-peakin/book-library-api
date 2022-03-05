const express = require('express')

const readerController = require('../controllers/readers');

const router = express.Router();

router.post('/', readerController.createReader);

router.get('/', readerController.getReaders);

router.get('/:id', readerController.getReaderById);

router.patch('/:id', readerController.updateReaderById);

router.delete('/:id', readerController.deleteReaderById);

module.exports = router;