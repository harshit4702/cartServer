const Joi = require('joi');
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

const Category = mongoose.model('Category' , categorySchema) ;

function validateCategory(input)
{
    const schema = Joi.object({
        name: Joi.string().required(),
    });
    return result = schema.validate(input);
}

module.exports.Category = Category ;
module.exports.validate = validateCategory ;