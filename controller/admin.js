const Product = require('../models/product');
const ContactUs = require('../models/contact-us');
const User = require('../models/user');
const Order = require('../models/order');
const { cloudinary } = require('../cloudinary');

module.exports.addNewProduct = (req, res) => {
    res.render('adminPortal/addProduct');
}

module.exports.uploadNewProduct = async (req, res, next) => {
    let product = new Product(req.body.product);
    product.images = req.files.map((f) => ({
      url: f.path,
      filename: f.filename,
    })); 
    await product.save();
    req.flash('success', `New Product ${product.name} Added Successfully`);
    res.redirect(`/product/${product._id}`)
}

module.exports.editProduct = async (req, res, next) => {
    const { id } = req.params;
    let product = await Product.findById(id);
    await product.save();
    res.render('adminPortal/editProduct', { product });
}

module.exports.updateProduct = async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, { ...req.body.product });
    let imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
    product.images.push(...imgs);
    await product.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
      await product.updateOne({
        $pull: { images: { filename: { $in: req.body.deleteImages } } },
      });
    }
    req.flash("success", "Product updated successfully");
    res.redirect(`/product/${id}`);
}


module.exports.allProducts = async (req, res, next) => {
    const products = await Product.find({});
    res.render('adminPortal/allProducts', { products });
}

module.exports.customerQuerry = async (req, res, next) => {
    const querries = await ContactUs.find({});
    res.render('adminPortal/customerQuerry', { querries });
}

module.exports.showQuerry = async (req, res, next) => {
    const { id } = req.params;
    const querry = await ContactUs.findById(id);
    if (!querry) {
        req.flash('error', 'Searched querry does not exist');
        return res.redirect('/admin/customer-querry');
    }
    res.render('adminPortal/showQuerry', { querry });
}

module.exports.allUserAccounts = async (req, res, next) => {
    const admins = await User.find({ role: 'admin' });
    const customers = await User.find({ role: 'customer' });
    res.render('adminPortal/allUserAccounts', { admins, customers });
}

module.exports.allOrders = async (req, res, next) => {
    const orders = await Order.find({}).populate('customer').populate('products');
    res.render('adminPortal/allOrders', { orders });
}

module.exports.showOrder = async (req, res, next) => {
    const { id } = req.params;
    const order = await Order.findById(id).populate('customer').populate('products');
    res.render('adminPortal/showOrder', { order });
}

module.exports.updateOrder = async (req, res, next) => {
    const { id } = req.params;
    const order = await Order.findByIdAndUpdate(id, { ...req.body.order });
    await order.save();
    req.flash('success', `Order status updated successfully`);
    res.redirect(`/admin/all-orders/${id}`);
}

module.exports.customerOrders = async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findById(id).populate({
        path: 'orders',
        populate: {
            path: 'products'
        }
    }).populate('products');
    res.render('adminPortal/customerOrders', { user });
}