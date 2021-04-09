const mongoose =require('mongoose');

const Product= mongoose.model('products', new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    src:{
        type: [{
            data: Buffer,
            contentType: String
        }],
        required: true
    },
    price: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    discount: {
        type: String,
        required: true
    }
},{  timestamps: true }
));

module.exports.Product= Product;