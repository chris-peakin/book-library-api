const {expect} = require('chai');
const request = require('supertest');
const {Genre} = require('../src/models');
const app = require('../src/app');

describe('/genres', () =>{
    before(async () => Genre.sequelize.sync());

    beforeEach(async () => {
        await Genre.destroy({where: {}});
    });

    describe('with no records in the database', () => {
        describe('POST /genres', () =>{
            it('creates a new genre in the database', async () => {
                const response = await request(app).post('/genres').send({
                    genre: 'Education',
                });
                const newGenreRecord = await Genre.findByPk(response.body.id, {
                    raw: true,
                });

                expect(response.status).to.equal(201);
                expect(response.body.genre).to.equal('Education');
                expect(newGenreRecord.genre).to.equal('Education');
            });

            it('throws an error if genre isnt provided', async () =>{
                const response = await request(app).post('/genres').send({
                    genre: '',
                });
                const newGenreRecord = await Genre.findByPk(response.body.id, {
                    raw: true,
                });

                expect(response.status).to.equal(400);
                expect(response.body).to.haveOwnProperty('errors');
                expect(newGenreRecord).to.equal(null);
            });
        });
    });

    describe('with records in the database', () =>{
        let genres;

        beforeEach(async () =>{
            genres = await Promise.all([
                Genre.create({genre: 'Education'}),
                Genre.create({genre: 'Science-Fiction'}),
                Genre.create({genre: 'Fantasy'}),
            ]);
        });

        describe('GET /genres', () =>{
            it('gets all genres records', async () =>{
                const response = await request(app).get('/genres');

                expect(response.status).to.equal(200);
                expect(response.body.length).to.equal(3);

                response.body.forEach((genre) => {
                    const expected = genres.find((a) => a.id === genre.id);
                    expect(genre.genre).to.equal(expected.genre);
                })
            })
        });

        describe('GET /genres/:id', () => {
            it('gets genre record by id', async () =>{
                const genre = genres[0];
                const response = await request(app).get(`/genres/${genre.id}`);
                
                expect(response.status).to.equal(200);
                expect(response.body.genre).to.equal(genre.genre);
            });
            
            it('returns a 404 if the genre does not exist', async () =>{
                const response = await request(app).get('/genres/12345');
                expect(response.status).to.equal(404);
                expect(response.body.error).to.equal('The genre could not be found.');
            });
        })

        describe('PATCH /genres/:id', () => {
            it('updates genre by their id', async () =>{
                const genre = genres[0];
                const response = await request(app)
                .patch(`/genres/${genre.id}`)
                .send({genre: 'Academia'});
            const updatedGenreRecord = await Genre.findByPk(genre.id, {
                raw: true,
            });
            
            expect(response.status).to.equal(200);
            expect(updatedGenreRecord.genre).to.equal('Academia');
            });

            it('returns a 404 is the genre does not exist', async () =>{
                const response = await request(app)
                .patch('/genres/12345')
                .send({author: 'Science'});
                
            expect(response.status).to.equal(404);
            expect(response.body.error).to.equal('The genre could not be found.');
            })
        });

        describe('DELETE /genres/:id', () =>{
            it('delete genre record by id', async () =>{
                const genre = genres[0];
                const response = await request(app).delete(`/genres/${genre.id}`);
                const deletedGenre = await Genre.findByPk(genre.id, {raw: true});
                expect(response.status).to.equal(204);
                expect(deletedGenre).to.equal(null);
            });

            it('returns a 404 if the genre does not exist', async () => {
                const response = await request(app).delete('/genres/12345');
                expect(response.status).to.equal(404);
                expect(response.body.error).to.equal('The genre could not be found.');
            });
        });
    });
});
