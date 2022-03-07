const express = require('express');
const readerRouter = require('./routes/readerRouter');
const bookRouter = require('./routes/bookRouter');
const authorRouter = require('./routes/authorRouter');
const genreRouter = require('./routes/genreRouter');

const app = express();

app.use(express.json());

app.use('/readers', readerRouter);

app.use('/books', bookRouter);

app.use('/authors', authorRouter);

app.use('/genres', genreRouter);

module.exports = app;