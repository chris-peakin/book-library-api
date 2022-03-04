const express = require('express')

const readerController = require('../controllers/readers');

const router = express.Router();

router.post('/', readerController.createReader);

router.get('/', readerController.getReaders);

router.get('/:readerId', readerController.getReaderById);

router.patch('/:readerId', readerController.updateReaderById);

router.delete('/:readerId', readerController.deleteReaderById);

module.exports = router;