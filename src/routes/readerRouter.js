const express = require('express')

const readerController = require('../controllers/readers');

const router = express.Router();

router.post('/readers', readerController.create);

module.exports = router;