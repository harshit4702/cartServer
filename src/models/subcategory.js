const Joi = require('joi');
const mongoose = require('mongoose');

const SubcategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    }
});

const Subcategory = mongoose.model('Subcategory' , SubcategorySchema) ;

function validateSubcategory(input)
{
    const schema = Joi.object({
        name: Joi.string().required(),
        category: Joi.string().required()
    });
    return result = schema.validate(input);
}

module.exports.Subcategory = Subcategory ;
module.exports.validate= validateSubcategory ;