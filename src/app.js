const express = require('express');
const readerRouter = require('./routes/readerRouter');
const bookRouter = require('./routes/bookRouter');

const app = express();

app.use(express.json());

app.use('/readers', readerRouter);

app.use('/books', bookRouter);

module.exports = app;