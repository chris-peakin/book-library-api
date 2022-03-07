const {Reader, Book} = require('../models');

const get404Error = (model) => ({error: `The ${model} could not be found.`});

const getModel = (model) => {
    const models ={
        book: Book,
        reader: Reader,
    };

    return models[model];
};

const removePassword = (obj) => {
    if (obj.hasOwnProperty('password')){
        delete obj.password;
    }
    return obj;
}

exports.createItem = async (res, model, item) => {
    const Model = getModel(model);

    try{
        const newItem = await Model.create(item);
        const itemWithoutPassword = removePassword(newItem.dataValues);
        res.status(201).json(itemWithoutPassword);
    } catch (err){
        res.status(400).json({errors: err});
    };
};

exports.findAllItems = async (res, model) => {
    const Model = getModel(model);
    const items = await Model.findAll();

    const itemsWithoutPassword = items.map((item) =>{
        return removePassword(item.dataValues);
    });

    res.status(200).json(itemsWithoutPassword);
};

exports.findItemById = async (res, model, id) => {
    const Model = getModel(model);
    const item = await Model.findByPk(id);
    if (!item){
        res.status(404).json(get404Error(model));
    } else {
        const itemWithoutPassword = removePassword(item.dataValues);
        res.status(200).json(itemWithoutPassword);
    }
};

exports.updateItemById = async (res, model, id, item) => {
    const Model = getModel(model);
    try{
        const [ itemsUpdated ] = await Model.update(item, {where: {id}});
        
        if (!itemsUpdated){
            res.status(404).json(get404Error(model));
        } else {
            const updatedItem = await Model.findByPk(id);
            // console.log(updatedItem);
            const itemWithoutPassword = removePassword(updatedItem.dataValues);
            console.log(itemWithoutPassword);
            res.status(200).json(itemWithoutPassword);
        }
    } catch (err){
        res.status(400).json({errors: err});
    };
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