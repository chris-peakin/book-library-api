const {Reader} = require('../models');

exports.create = async (req, res) =>{
    const newReader = await Reader.create(req.body);
    res.status(201).json(newReader);
};

exports.findAll = async (_, res) => {
    const readers = await Reader.findAll();
    res.status(200).json(readers);
};

exports.findByPk = async (req, res) => {
    const {readerId} = req.params;
    const foundReader = await Reader.findByPk(readerId)

    if (!foundReader){
        res.status(404).json({error: 'The reader could not be found.'});
    } else {
        res.status(200).json(foundReader);
    }
}

exports.update = async (req, res) => {
    const {readerId} = req.params;
    const foundReader = await Reader.findByPk(readerId);
    const newData = req.body;

    if (!foundReader){
        res.status(404).json({error: 'The reader could not be found.'});
    } else {
        const [ updatedRows ] = await Reader.update(newData, {where: {} });
        return res.send();
    }
}

exports.delete = async (req, res) => {
    const {readerId} = req.params;
    const foundReader = await Reader.findByPk(readerId);

    if (!foundReader){
        res.status(404).json({error: 'The reader could not be found.'});
    } else {
        const deletedReader = await Reader.destroy({where: {id: readerId}});
        return res.status(204).json();
    }
}