const Product = require('../models/product');

const findByCategory = async function (categoryName) {
    const products = await Product.find({ category: { $all: [categoryName] } });
    return products;
}


module.exports.birthdayCake = async (req, res, next) => {
    const searchCategory = 'Birthday Cake';
    const products = await Product.find({ category: { $all: [searchCategory] } });
    res.render('products/showCategory', { products });
}

module.exports.anniversaryCake = async (req, res, next) => {
    const products = await findByCategory("Anniversary Cake");
    res.render('products/showCategory', { products });
}

module.exports.designerCake = async (req, res, next) => {
    const products = await findByCategory("Designer Cake");
    res.render('products/showCategory', { products });
}

module.exports.photoCake = async (req, res, next) => {
    const products = await findByCategory("Photo Cake");
    res.render('products/showCategory', { products });
}

module.exports.popularCake = async (req, res, next) => {
    const products = await findByCategory("Popular Cake");
    res.render('products/showCategory', { products });
}

module.exports.specialCake = async (req, res, next) => {
    const products = await findByCategory("Special Cake");
    res.render('products/showCategory', { products });
}