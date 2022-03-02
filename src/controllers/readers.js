const getDb = require('../services/db');
const {Reader} = require('../models');


exports.create = async (req, res) =>{
    const newReader = awaitReader.create(req.body);
    res.status(201).json(newReader);
};