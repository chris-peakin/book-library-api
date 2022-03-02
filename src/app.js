const express = require('express');
const readerRouter = require('./routes/readerRouter');

const app = express();

app.use(express.json());

app.post('/readers', readerRouter);

module.exports = app;