const getDb = require('../services/db');

exports.create = async (req, res) =>{
    const db = await getDb();
    const {name, email} = req.body;

    res.sendStatus(201);
    done();
};