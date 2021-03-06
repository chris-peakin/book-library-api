// tests/reader.test.js
const { expect } = require('chai');
const request = require('supertest');
const { Reader } = require('../src/models');
const app = require('../src/app');

describe('/readers', () => {
  before(async () => Reader.sequelize.sync());

  beforeEach(async () => {
    await Reader.destroy({ where: {} });
  });

  describe('with no records in the database', () => {
    describe('POST /readers', () => {
      it('creates a new reader in the database', async () => {
        const response = await request(app).post('/readers').send({
          name: 'Elizabeth Bennet',
          email: 'future_ms_darcy@gmail.com',
          password: 'ilovebooks',
        });
        const newReaderRecord = await Reader.findByPk(response.body.id, {
          raw: true,
        });

        expect(response.status).to.equal(201);
        expect(response.body.name).to.equal('Elizabeth Bennet');
        expect(newReaderRecord.name).to.equal('Elizabeth Bennet');
        expect(newReaderRecord.email).to.equal('future_ms_darcy@gmail.com');
        expect(newReaderRecord.password).to.equal('ilovebooks');
        expect(response.body.password).to.equal(undefined);
      });

      it('throws an error if the email is incorrectly formatted', async () => {
        const response = await request(app).post('/readers').send({
          name: 'Elizabeth Bennet',
          email: 'this is not an email address!',
          password: 'ilovebooks',
        });
        const newReaderRecord = await Reader.findByPk(response.body.id, {
          raw: true,
        });

        expect(response.status).to.equal(400);
        expect(response.body).to.haveOwnProperty('errors');
        expect(newReaderRecord).to.equal(null);
      });

      it('throws an error if the password is too short', async () =>{
        const response = await request(app).post('/readers').send({
          name: 'Elizabeth Bennet',
          email: 'future_ms_darcy@gmail.com',
          password: 'nope'
        });
        const newReaderRecord = await Reader.findByPk(response.body.id, {
          raw: true,
        });

        expect(response.status).to.equal(400);
        expect(response.body).to.haveOwnProperty('errors');
        expect(newReaderRecord).to.equal(null);
      });

      it('throws an error if the password is too long', async () =>{
        const response = await request(app).post('/readers').send({
          name: 'Elizabeth Bennet',
          email: 'future_ms_darcy@gmail.com',
          password: 'thisissimplythelongestpasswordihaveeverseeninmylife'
        });
        const newReaderRecord = await Reader.findByPk(response.body.id, {
          raw: true,
        });

        expect(response.status).to.equal(400);
        expect(response.body).to.haveOwnProperty('errors');
        expect(newReaderRecord).to.equal(null);
      });

      it('throws an error if there is no name', async () =>{
        const response = await request(app).post('/readers').send({
          name: null,
          email: 'future_ms_darcy@gmail.com',
          password: 'ilovebooks',
        });
        const newReaderRecord = await Reader.findByPk(response.body.id, {
          raw: true,
        });

        expect(response.status).to.equal(400);
        expect(response.body).to.haveOwnProperty('errors');
        expect(newReaderRecord).to.equal(null);
      });

      it('throws an error if there is no email', async () =>{
        const response = await request(app).post('/readers').send({
          name: 'Elizabeth Bennet',
          email: null,
          password: 'ilovebooks',
        });
        const newReaderRecord = await Reader.findByPk(response.body.id, {
          raw: true,
        });

        expect(response.status).to.equal(400);
        expect(response.body).to.haveOwnProperty('errors');
        expect(newReaderRecord).to.equal(null);
      });

      it('throws an error if there is no password', async () =>{
        const response = await request(app).post('/readers').send({
          name: 'Elizabeth Bennet',
          email: 'future_ms_darcy@gmail.com',
          password: null,
        });
        const newReaderRecord = await Reader.findByPk(response.body.id, {
          raw: true,
        });

        expect(response.status).to.equal(400);
        expect(response.body).to.haveOwnProperty('errors');
        expect(newReaderRecord).to.equal(null);
    });
  });
});

  describe('with records in the database', () => {
    let readers;

    beforeEach(async () => {
      readers = await Promise.all([
        Reader.create({
          name: 'Elizabeth Bennet',
          email: 'future_ms_darcy@gmail.com',
          password: 'ilovebooks',
        }),
        Reader.create({ name: 'Arya Stark', email: 'vmorgul@me.com', password: 'ilovebooks' }),
        Reader.create({ name: 'Lyra Belacqua', email: 'darknorth123@msn.org', password: 'ilovebooks' }),
      ]);
    });

    describe('GET /readers', () => {
      it('gets all readers records', async () => {
        const response = await request(app).get('/readers');

        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(3);

        response.body.forEach((reader) => {
          const expected = readers.find((a) => a.id === reader.id);

          expect(reader.name).to.equal(expected.name);
          expect(reader.email).to.equal(expected.email);
          expect(response.body.password).to.equal(undefined);
        });
      });
    });

    describe('GET /readers/:id', () => {
      it('gets readers record by id', async () => {
        const reader = readers[0];
        const response = await request(app).get(`/readers/${reader.id}`);

        expect(response.status).to.equal(200);
        expect(response.body.name).to.equal(reader.name);
        expect(response.body.email).to.equal(reader.email);
        expect(response.body.password).to.equal(undefined);
      });

      it('returns a 404 if the reader does not exist', async () => {
        const response = await request(app).get('/readers/12345');

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The reader could not be found.');
      });
    });

    describe('PATCH /readers/:id', () => {
      it('updates readers email by id', async () => {
        const reader = readers[0];
        const response = await request(app)
          .patch(`/readers/${reader.id}`)
          .send({ email: 'miss_e_bennet@gmail.com' });
        const updatedReaderRecord = await Reader.findByPk(reader.id, {
          raw: true,
        });

        expect(response.status).to.equal(200);
        expect(updatedReaderRecord.email).to.equal('miss_e_bennet@gmail.com');
      });

      it('returns a 404 if the reader does not exist', async () => {
        const response = await request(app)
          .patch('/readers/12345')
          .send({ email: 'some_new_email@gmail.com' });

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The reader could not be found.');
      });

      it('throws an error if the updated email is incorrectly formatted', async () =>{
        const reader = readers[0];
        const response = await request(app)
        .patch(`/readers/${reader.id}`)
        .send({ email: 'this is not an email!' });

      expect(response.status).to.equal(400);
      expect(response.body).to.haveOwnProperty('errors');
      });

      it('throws an error if the updated password is too short', async () =>{
        const reader = readers[0];
        const response = await request(app)
        .patch(`/readers/${reader.id}`)
        .send({ password: 'nope' });

      expect(response.status).to.equal(400);
      expect(response.body).to.haveOwnProperty('errors');
      });

      it('throws an error if the updated password is too long', async () =>{
        const reader = readers[0];
        const response = await request(app)
        .patch(`/readers/${reader.id}`)
        .send({ password: 'thisissimplythelongestpasswordihaveeverseeninmylife' });

      expect(response.status).to.equal(400);
      expect(response.body).to.haveOwnProperty('errors');
      });

      it('does not return the password when updated', async () => {
        const reader = readers[0];
        const response = await request(app)
          .patch(`/readers/${reader.id}`)
          .send({ password: 'mynewpassword' });

        expect(response.status).to.equal(200);
        expect(response.body.password).to.equal(undefined);
      });

      it('does not return the password when a different property is updated', async () => {
        const reader = readers[0];
        const response = await request(app)
          .patch(`/readers/${reader.id}`)
          .send({ email: 'miss_e_bennet@gmail.com' });
        const updatedReaderRecord = await Reader.findByPk(reader.id, {
          raw: true,
        });

        expect(response.status).to.equal(200);
        expect(updatedReaderRecord.email).to.equal('miss_e_bennet@gmail.com');
        expect(response.body.password).to.equal(undefined);
      });

    });

    describe('DELETE /readers/:id', () => {
      it('deletes reader record by id', async () => {
        const reader = readers[0];
        const response = await request(app).delete(`/readers/${reader.id}`);
        const deletedReader = await Reader.findByPk(reader.id, { raw: true });

        expect(response.status).to.equal(204);
        expect(deletedReader).to.equal(null);
      });

      it('returns a 404 if the reader does not exist', async () => {
        const response = await request(app).delete('/readers/12345');
        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The reader could not be found.');
      });
    });
  });
});