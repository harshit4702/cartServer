const mongoose =require('mongoose');

const User= mongoose.model('users', new mongoose.Schema({
    name: {
        type: String
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
        type: String
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'cart',
        required:true
    }
},{  timestamps: true }
));

module.exports.User= User;