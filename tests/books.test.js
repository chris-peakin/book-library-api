const { expect } = require('chai');
const request = require('supertest');
const { Book, Author, Genre } = require('../src/models');
const app = require('../src/app');

describe('/books', () => {
    before(async () => Book.sequelize.sync());
    let testGenre;
    let testAuthor;
  
    beforeEach(async () => {
      await Book.destroy({ where: {} });
      await Genre.destroy({ where: {} });
      await Author.destroy({ where: {} });
      testGenre = await Genre.create({ genre: 'Science'});
      testAuthor = await Author.create({ author: 'Andrew Burrows'});
    });
  
    describe('with no records in the database', () => {
      describe('POST /books', () => {
        it('creates a new book in the database', async () => {
          const response = await request(app).post('/books').send({
            title: 'Chemistry3',
            author: testAuthor.author,
            genre: testGenre.genre,
            ISBN: '9780198829980',
          });
          const newBookRecord = await Book.findByPk(response.body.id, {
            raw: true,
          });
  
          expect(response.status).to.equal(201);
          expect(response.body.title).to.equal('Chemistry3');
          expect(newBookRecord.title).to.equal('Chemistry3');
          expect(newBookRecord.author).to.equal(testAuthor.author);
          expect(newBookRecord.genre).to.equal(testGenre.genre);
          expect(newBookRecord.ISBN).to.equal('9780198829980');
        });

        it('throws an error if there is no title', async () =>{
          const response = await request(app).post('/books').send({
            title: null,
            author: 'Andrew Burrows',
            genre: 'Science',
            ISBN: '9780198829980',
          });
          const newBookRecord = await Book.findByPk(response.body.id, {
            raw: true,
          });

          expect(response.status).to.equal(400);
          expect(response.body).to.haveOwnProperty('errors');
          expect(newBookRecord).to.equal(null);
        })

        it('throws an error if there is no author', async () =>{
          const response = await request(app).post('/books').send({
            title: 'Chemistry3',
            author: null,
            genre: 'Science',
            ISBN: '9780198829980',
          });
          const newBookRecord = await Book.findByPk(response.body.id, {
            raw: true,
          });

          expect(response.status).to.equal(400);
          expect(response.body).to.haveOwnProperty('errors');
          expect(newBookRecord).to.equal(null);
        })

        it('does NOT throw an error if there is no genre', async () => {
          const response = await request(app).post('/books').send({
            title: 'Chemistry3',
            author: 'Andrew Burrows',
            genre: null,
            ISBN: '9780198829980',
          });
          const newBookRecord = await Book.findByPk(response.body.id, {
            raw: true,
          });
  
          expect(response.status).to.equal(201);
          expect(response.body.title).to.equal('Chemistry3');
          expect(newBookRecord.title).to.equal('Chemistry3');
          expect(newBookRecord.author).to.equal('Andrew Burrows');
          expect(newBookRecord.genre).to.equal(null);
          expect(newBookRecord.ISBN).to.equal('9780198829980');
        });

        it('does NOT throw an error if there is no ISBN', async () => {
          const response = await request(app).post('/books').send({
            title: 'Chemistry3',
            author: 'Andrew Burrows',
            genre: 'Science',
            ISBN: null,
          });
          const newBookRecord = await Book.findByPk(response.body.id, {
            raw: true,
          });
  
          expect(response.status).to.equal(201);
          expect(response.body.title).to.equal('Chemistry3');
          expect(newBookRecord.title).to.equal('Chemistry3');
          expect(newBookRecord.author).to.equal('Andrew Burrows');
          expect(newBookRecord.genre).to.equal('Science');
          expect(newBookRecord.ISBN).to.equal(null);
        });

      });
    });
  
    describe('with records in the database', () => {
      let books;
  
      beforeEach(async () => {
        books = await Promise.all([
          Book.create({
            title: 'Chemistry3',
            author: 'Andrew Burrows',
            genre: 'Science',
            ISBN: '9780198829980',
          }),
          Book.create({ title: 'The Hunger Games', author: 'Suzanne Collins', genre: 'Sci-Fi', ISBN: '9781407132082' }),
          Book.create({ title: 'The Fellowship of the Ring', author: 'JRR Tolkien', genre: 'Fantasy', ISBN: '9780261103573' }),
        ]);
      });
  
      describe('GET /books', () => {
        it('gets all books records', async () => {
          const response = await request(app).get('/books');
  
          expect(response.status).to.equal(200);
          expect(response.body.length).to.equal(3);
  
          response.body.forEach((book) => {
            const expected = books.find((a) => a.id === book.id);
  
            expect(book.title).to.equal(expected.title);
            expect(book.author).to.equal(expected.author);
            expect(book.genre).to.equal(expected.genre);
            expect(book.ISBN).to.equal(expected.ISBN);
          });
        });
      });
  
      describe('GET /books/:id', () => {
        it('gets books record by id', async () => {
          const book = books[0];
          const response = await request(app).get(`/books/${book.id}`);
  
          expect(response.status).to.equal(200);
          expect(response.body.title).to.equal(book.title);
          expect(response.body.author).to.equal(book.author);
          expect(response.body.genre).to.equal(book.genre);
          expect(response.body.ISBN).to.equal(book.ISBN);
        });
  
        it('returns a 404 if the book does not exist', async () => {
          const response = await request(app).get('/books/12345');
  
          expect(response.status).to.equal(404);
          expect(response.body.error).to.equal('The book could not be found.');
        });
      });
  
      describe('PATCH /books/:id', () => {
        it('updates books genre by id', async () => {
          const book = books[0];
          const response = await request(app)
            .patch(`/books/${book.id}`)
            .send({ genre: 'Education' });
          const updatedBookRecord = await Book.findByPk(book.id, {
            raw: true,
          });
  
          expect(response.status).to.equal(200);
          expect(updatedBookRecord.genre).to.equal('Education');
        });
  
        it('returns a 404 if the book does not exist', async () => {
          const response = await request(app)
            .patch('/books/12345')
            .send({ genre: 'Dark Fantasy' });
  
          expect(response.status).to.equal(404);
          expect(response.body.error).to.equal('The book could not be found.');
        });
      });
  
      describe('DELETE /books/:id', () => {
        it('deletes book record by id', async () => {
          const book = books[0];
          const response = await request(app).delete(`/books/${book.id}`);
          const deletedBook = await Book.findByPk(book.id, { raw: true });
  
          expect(response.status).to.equal(204);
          expect(deletedBook).to.equal(null);
        });
  
        it('returns a 404 if the book does not exist', async () => {
          const response = await request(app).delete('/books/12345');
          expect(response.status).to.equal(404);
          expect(response.body.error).to.equal('The book could not be found.');
        });
      });
    });
  });