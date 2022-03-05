const {createItem, findAllItems, findItemById, updateItemById, deleteItemById} = require('./helpers');

exports.createReader = (req, res) => createItem(res, 'reader', req.body);

exports.getReaders = (_, res) => findAllItems(res, 'reader');

exports.getReaderById = (req, res) => findItemById(res, 'reader', req.params.id);

exports.updateReaderById = (req, res) => {
    //verification should be going here - check email is correct format and password is right length
    return updateItemById(res, 'reader', req.params.id, req.body);
}

exports.deleteReaderById = (req, res) => deleteItemById(res, 'reader', req.params.id);

// const {Reader} = require('../models');

// exports.create = async (req, res) =>{
//     try {
//         const newReader = await Reader.create(req.body);
//         res.status(201).json(newReader);
//     } catch (err) {
//         res.status(400).json({errors: err});
//     }
// };

// exports.findAll = async (_, res) => {
//     const readers = await Reader.findAll();
//     res.status(200).json(readers);
// };

// exports.findByPk = async (req, res) => {
//     const {readerId} = req.params;
//     const foundReader = await Reader.findByPk(readerId)

//     if (!foundReader){
//         res.status(404).json({error: 'The reader could not be found.'});
//     } else {
//         res.status(200).json(foundReader);
//     }
// }

// exports.update = async (req, res) => {
//     const {readerId} = req.params;
//     const foundReader = await Reader.findByPk(readerId);
//     const newData = req.body;

//     try{
//         if (!foundReader){
//             res.status(404).json({error: 'The reader could not be found.'});
//         } else {
//             const [ updatedRows ] = await Reader.update(newData, {where: {} });
//             return res.send();
//         }
//     } catch (err){
//         res.status(400).json({errors: err});
//     };
// }

// exports.delete = async (req, res) => {
//     const {readerId} = req.params;
//     const foundReader = await Reader.findByPk(readerId);

//     if (!foundReader){
//         res.status(404).json({error: 'The reader could not be found.'});
//     } else {
//         const deletedReader = await Reader.destroy({where: {id: readerId}});
//         return res.status(204).json();
//     }
// }