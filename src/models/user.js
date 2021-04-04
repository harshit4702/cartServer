const mongoose =require('mongoose');

const User= mongoose.model('users', new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'cart'
    }
},{  timestamps: true }
));

module.exports.User= User;