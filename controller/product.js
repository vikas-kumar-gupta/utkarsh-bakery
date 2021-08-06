const Product = require('../models/product');





module.exports.showProduct = async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render('products/show', { product });
}

