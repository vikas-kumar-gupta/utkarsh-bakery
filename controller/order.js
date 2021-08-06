const Order = require('../models/order');
const Product = require('../models/product');
const User = require('../models/user');

module.exports.renderPlaceOrder = async (req, res, next) => {
    const { id } = req.params;
    await Product.findById(id)
        .then(async () => {
            const product = await Product.findById(id);
        res.render('order/orderForm', { product });
    })
        .catch(err => {
            req.flash('error', 'Product not found');
            res.redirect('/');
    })
}

module.exports.placeOrder = async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    const order = new Order(req.body.placeOrder);
    order.isOrderCompleted = false;
    order.customer = req.user._id;
    order.products.push(id);
    order.orderDate = new Date().toLocaleString();
    order.orderStatus = 'Processing';
    if (order.deliveryMethod === 'Home delivery') {
        order.deliveryCharge = 50;
    } else {
        order.deliveryCharge = 0;
    }
    order.populate('products');
    await order.save();
    const user = await (await User.findByIdAndUpdate(req.user._id, { $push: { orders: order._id } }, { upssert: true, new: true }));
    res.render('order/confirmOrder', { order, product });
}

module.exports.confirmOrder = async (req, res, next) => {
    const { id } = req.params;
    const { totalPrice } = req.body;
    const price = parseInt(totalPrice);
    let order = await Order.findOneAndUpdate(id, { totalPrice: price, isOrderCompleted: true }, { new: true});
    await order.save();
    req.flash('success', 'Successfully ordered your product');
    res.redirect('/orders');
}