const mongoose =require('mongoose');

const Offer = mongoose.model('offers', new mongoose.Schema({
    photo: {
        data: Buffer,
        contentType: String,
    },
    subcategory: {
        type: String,
    }
},{  timestamps: true }
));

module.exports.Offer = Offer;