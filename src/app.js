const express = require('express');

const app = express();

const readerController = require('./controllers/readers');

const router = express.Router();

app.post('/readers', readerController.create);

module.exports = app;