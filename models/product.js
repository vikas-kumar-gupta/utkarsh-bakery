const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const productSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    images: [ImageSchema],
    salePrice: {
        type: Number,
        min: [0, 'Value Should be eual or greater to Zero (0)'],
        required: true
    },
    price: {
        type: Number,
        min: [0, 'Value Should be eual or greater to Zero (0)'],
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    shape: {
        type: String,
        enum: ['Circle', 'Square', 'Oval', 'Heart'],
        required: true
    },
    flavour: {
        type: String,
        enum: ['Chocolate', 'Fruit', 'Exotic', 'Black Forest', 'Butter Scotch', 'Vanilla', 'Coffee', 'Strawberry'],
        required: true
    },
    category: {
        type: [String],
        enum: ['Popular Cake', 'Photo Cake', 'Designer Cake', 'Special Cake', 'Anniversary Cake', 'Birthday Cake'],
        required: true
    },
    tier: {
        type: String,
        enum: ['Single', 'Double', 'Triple', 'Four'],
        require: true
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    availability: {
        type: String,
        enum: ['In Stock', 'Out of Stock'],
        required: true
    }
})

const Product = mongoose.model('Product', productSchema);

module.exports = Product;