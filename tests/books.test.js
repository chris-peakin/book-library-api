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
            AuthorId: testAuthor.id,
            GenreId: testGenre.id,
            ISBN: '9780198829980',
          });
          const newBookRecord = await Book.findByPk(response.body.id, {
            raw: true,
          });
  
          expect(response.status).to.equal(201);
          expect(response.body.title).to.equal('Chemistry3');
          expect(newBookRecord.title).to.equal('Chemistry3');
          expect(newBookRecord.AuthorId).to.equal(testAuthor.id);
          expect(newBookRecord.GenreId).to.equal(testGenre.id);
          expect(newBookRecord.ISBN).to.equal('9780198829980');
        });

        it('throws an error if there is no title', async () =>{
          const response = await request(app).post('/books').send({
            title: null,
            AuthorId: testAuthor.id,
            GenreId: testGenre.id,
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
            AuthorId: '',
            GenreId: testGenre.id,
            ISBN: '9780198829980',
          });
          const newBookRecord = await Book.findByPk(response.body.id, {
            raw: true,
          });

          expect(response.status).to.equal(400);
          expect(response.body).to.haveOwnProperty('errors');
          expect(newBookRecord).to.equal(null);
        })

        it('throws an error if there is no genre', async () => {
          const response = await request(app).post('/books').send({
            title: 'Chemistry3',
            AuthorId: testAuthor.id,
            GenreId: '',
            ISBN: '9780198829980',
          });

          const newBookRecord = await Book.findByPk(response.body.id, {
            raw: true,
          });

          expect(response.status).to.equal(400);
          expect(response.body).to.haveOwnProperty('errors');
          expect(newBookRecord).to.equal(null);
        });

        it('does NOT throw an error if there is no ISBN', async () => {
          const response = await request(app).post('/books').send({
            title: 'Chemistry3',
            AuthorId: testAuthor.id,
            GenreId: testGenre.id,
            ISBN: null,
          });
          const newBookRecord = await Book.findByPk(response.body.id, {
            raw: true,
          });
  
          expect(response.status).to.equal(201);
          expect(response.body.title).to.equal('Chemistry3');
          expect(newBookRecord.title).to.equal('Chemistry3');
          expect(newBookRecord.ISBN).to.equal(null);
        });

        it('throws an error if the ISBN is not a number', async () =>{
          const response = await request(app).post('/books').send({
            title: 'Chemistry3',
            AuthorId: testAuthor.id,
            GenreId: testGenre.id,
            ISBN: 'IAmNotANumber',
          });
          const newBookRecord = await Book.findByPk(response.body.id, {
            raw: true,
          });

          expect(response.status).to.equal(400);
          expect(response.body).to.haveOwnProperty('errors');
          expect(newBookRecord).to.equal(null);
        })

        it('throws an error if the ISBN is less than 10 digits', async () =>{
          const response = await request(app).post('/books').send({
            title: 'Chemistry3',
            AuthorId: testAuthor.id,
            GenreId: testGenre.id,
            ISBN: '1234',
          });
          const newBookRecord = await Book.findByPk(response.body.id, {
            raw: true,
          });

          expect(response.status).to.equal(400);
          expect(response.body).to.haveOwnProperty('errors');
          expect(newBookRecord).to.equal(null);
        })

        it('throws an error if the ISBN is more than 13 digits', async() =>{
          const response = await request(app).post('/books').send({
            title: 'Chemistry3',
            AuthorId: testAuthor.id,
            GenreId: testGenre.id,
            ISBN: '123456789123456789',
          });
          const newBookRecord = await Book.findByPk(response.body.id, {
            raw: true,
          });

          expect(response.status).to.equal(400);
          expect(response.body).to.haveOwnProperty('errors');
          expect(newBookRecord).to.equal(null);
        })

        it('throws an error if the ISBN is 11 digits', async() =>{
          const response = await request(app).post('/books').send({
            title: 'Chemistry3',
            AuthorId: testAuthor.id,
            GenreId: testGenre.id,
            ISBN: '12345678910',
          });
          const newBookRecord = await Book.findByPk(response.body.id, {
            raw: true,
          });

          expect(response.status).to.equal(400);
          expect(response.body).to.haveOwnProperty('errors');
          expect(newBookRecord).to.equal(null);
        })

        it('throws an error if the ISBN is 12 digits', async() =>{
          const response = await request(app).post('/books').send({
            title: 'Chemistry3',
            AuthorId: testAuthor.id,
            GenreId: testGenre.id,
            ISBN: '123456789101',
          });
          const newBookRecord = await Book.findByPk(response.body.id, {
            raw: true,
          });

          expect(response.status).to.equal(400);
          expect(response.body).to.haveOwnProperty('errors');
          expect(newBookRecord).to.equal(null);
        })

      });
    });
  
    describe('with records in the database', () => {
      let books;
  
      beforeEach(async () => {
        await Book.destroy({where: {}});

        const testAuthorOne = Author.create({author: 'Andrew Burrows'});
        const testAuthorTwo = Author.create({author: 'Suzanne Collins'});
        const testAuthorThree = Author.create({author: 'JRR Tolkien'});
        const testGenreOne = Genre.create({genre: 'Science'});
        const testGenreTwo = Genre.create({genre: 'Sci-Fi'});
        const testGenreThree = Genre.create({genre: 'Fantasy'});

        books = await Promise.all([
          Book.create({
            title: 'Chemistry3',
            author: testAuthorOne.id,
            genre: testGenreOne.id,
            ISBN: '9780198829980',
          }),
          Book.create({ title: 'The Hunger Games', author: testAuthorTwo.id, genre: testGenreTwo.id, ISBN: '9781407132082' }),
          Book.create({ title: 'The Fellowship of the Ring', author: testAuthorThree.id, genre: testGenreThree.id, ISBN: '9780261103573' }),
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
        it('updates books title by id', async () => {
          const book = books[0];
          const response = await request(app)
            .patch(`/books/${book.id}`)
            .send({ title: 'Chemistry3: Introducing inorganic, organic and physical chemistry' });
          const updatedBookRecord = await Book.findByPk(book.id, {
            raw: true,
          });
  
          expect(response.status).to.equal(200);
          expect(updatedBookRecord.title).to.equal('Chemistry3: Introducing inorganic, organic and physical chemistry');
        });
  
        it('throws an error is the new ISBN is too short', async () =>{
          const book = books[0];
          const response = await request(app)
            .patch(`/books/${book.id}`)
            .send({ ISBN: '1234'});
    
            expect(response.status).to.equal(400);
            expect(response.body).to.haveOwnProperty('errors');
        });

        it('throws an error is the new ISBN is too long', async () =>{
          const book = books[0];
          const response = await request(app)
            .patch(`/books/${book.id}`)
            .send({ ISBN: '123456789123456789'});
    
            expect(response.status).to.equal(400);
            expect(response.body).to.haveOwnProperty('errors');
        });

        it('throws an error is the new ISBN is 11 digits', async () =>{
          const book = books[0];
          const response = await request(app)
            .patch(`/books/${book.id}`)
            .send({ ISBN: '12345678910'});
    
            expect(response.status).to.equal(400);
            expect(response.body).to.haveOwnProperty('errors');
        });

        it('throws an error is the new ISBN is 12 digits', async () =>{
          const book = books[0];
          const response = await request(app)
            .patch(`/books/${book.id}`)
            .send({ ISBN: '123456789101'});
    
            expect(response.status).to.equal(400);
            expect(response.body).to.haveOwnProperty('errors');
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