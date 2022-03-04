const {Reader, Book} = require('../models');

const get404Error = (model) => ({error: `The ${model} could not be found.`});

const getModel = (model) => {
    const models ={
        book: Book,
        reader: Reader,
    };

    return models[model];
};

exports.createItem = async (res, model, item) => {
    const Model = getModel(model);

    try{
        const newItem = await Model.create(item);
        res.status(201).json(newItem);
    } catch (err){
        res.status(400).json({errors: err});
    };
};

exports.findAllItems = (res, model) => {
    const Model = getModel(model);
    return Model.findAll().then((allItems) =>{
        res.status(200).json(allItems);
    });
};

exports.findItemById = async (res, model, id) => {
    const Model = getModel(model);
    const item = await Model.findByPk(id);

    if (!item){
        res.status(404).json(get404Error(model));
    } else {
        res.status(200).json(item);
    }
};

exports.updateItemById = async (res, model, item, id) => {
    const Model = getModel(model);
    const [ itemsUpdated ] = await Model.update(item, {where: {id}});

    if (!itemsUpdated){
        res.status(404).json(get404Error(model));
    } else {
        const updatedItem = await Model.findByPk(id);
        res.status(200).json(updatedItem);
    }
};

exports.deleteItemById = async (res, model, id) => {
    const Model = getModel(model);
    const deletedItem = await Model.destroy({where: {id}});

    if (!deletedItem){
        res.status(404).json(get404Error(model));
    } else {
        res.status(204).send();
    }
};