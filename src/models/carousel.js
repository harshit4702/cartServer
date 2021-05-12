const mongoose =require('mongoose');

const Carousel = mongoose.model('carousel', new mongoose.Schema({
    photo: {
        data: Buffer,
        contentType: String,
    },
    category: {
        type: String,
    }
},{  timestamps: true }
));

module.exports.Carousel= Carousel;