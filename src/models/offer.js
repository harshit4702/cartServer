const mongoose =require('mongoose');

const Offer = mongoose.model('offers', new mongoose.Schema({
    photo: {
        data: Buffer,
        contentType: String,
    },
    subCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subCategories',
        required: true
    }
},{  timestamps: true }
));

module.exports.Offer = Offer;