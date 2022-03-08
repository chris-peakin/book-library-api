# :books: Book Library API - Manchester Codes - Chris Peakin - Oct 2021 Cohort :books:

## Introduction

This is a simple API designed to create a database of books and readers. This project has been made as part of the backend module of the Manchester Codes Software Engineer fast-track course.

## Installation

Firstly, you will need Docker Desktop, MySQLWorkbench and Postman installed if you haven't already. Links are provided below.

Secondly, to install the dependencies after having cloned the repo, run the following in terminal:

`npm install`

Thirdly, pull the Northwind Docker image and create a container using the following commands in terminal (these apply if using an M1 Mac; `:m1` should be removed from these if that's not what you're using):

`docker pull mcrcodes/northwind`

`docker build -f ./M1/Dockerfile . -t mcrcodes/northwind:m1`

`docker run -d -p 3307:3306 --name northwind -e MYSQL_ROOT_PASSWORD=password mcrcodes/northwind:m1`

Port `3307` and password `MYSQL_ROOT_PASSWORD=password` can be changed if desired. You can then use MySQLWorkbench to create a connection and interact with the database that way.

Fourthly, create two files `.env` and `.env.test` with the following contents:

 `DB_PASSWORD=password` (or what your choice of password is)

 `DB_NAME=book_library_api` in .env; `DB_NAME=book_library_api_test` in .env.test.

 `DB_USER=user`

 `DB_HOST=localhost`

 `DB_PORT=3307` (or what your choice of port is)

 `PORT=3000`

 ## Testing

 This repo includes CRUD tests for books, authors, genres and readers. To run these tests, run `npm test` in the terminal.

 ## Using the Database

 Run `npm start` in your terminal and you can then use Postman to interact with the database on port 3000 (or whichever has been set in `.env`). MySQLWorkbench can be used to query the database.

 ## Links
### Software to download

Docker: https://docs.docker.com/get-docker/

MySQLWorkbench: https://www.mysql.com/products/workbench/

Postman: https://www.postman.com/

### Dependencies

MySQL2: https://www.npmjs.com/package/mysql2

Express: https://expressjs.com/

Sequelize: https://sequelize.org/

### Development Dependencies

Chai: https://www.chaijs.com/guide/

Dotenv: https://www.npmjs.com/package/dotenv

Mocha: https://mochajs.org/

Nodemon: https://www.npmjs.com/package/nodemon

Supertest: https://www.npmjs.com/package/supertest