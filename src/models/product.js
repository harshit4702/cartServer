const mongoose =require('mongoose');

const Product = mongoose.model('products', new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    src:{
        type: [{
            data: Buffer,
            contentType: String
        }],
    },
    price: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    // category: {
    //     type: String,
    //     required: true
    // },
    // subcategory: {
    //     type: String,
    //     required: true
    // },
    discount: {
        type: String,
        required: true
    }
},{  timestamps: true }
));

module.exports.Product= Product;