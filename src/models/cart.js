const mongoose =require('mongoose');

const Cart= mongoose.model('cart', new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    value:{
        type: Number,
        required: true
    }
},{  timestamps: true }
));

module.exports.Cart= Cart;