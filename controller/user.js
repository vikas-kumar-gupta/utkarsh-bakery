const User = require('../models/user');
const ContactUs = require('../models/contact-us');
const Order = require('../models/order');

module.exports.renderContactUs = (req, res) => {
    res.render('users/contact-us');
}

module.exports.contactUs = async (req, res, next) => {
    const { name, email, number, address, subject, body } = req.body.contactUss;
    const date = new Date().toLocaleString();
    const contactUs = new ContactUs({ name, email, number, address, subject, body , date});
    await contactUs.save();
    req.flash('success', 'Your query is submitted successfully. Seller will contact you soon.');
    res.redirect('/contact-us');
}

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res, next) => {
    try {
        const { username, password, firstName, lastName, dob, number, email, address } = req.body.registerUser;
        const joinDate = new Date().toLocaleString();
        const  role  = 'customer';
        const user = new User({ username, role, firstName, lastName, joinDate, dob, number, email, address });
        const newUser = await User.register(user, password);
        req.login(newUser, err => {                                     //  Logging in the user after successfully registration through #passport
            if (err) return next();
            req.flash('success', 'Welcome to Utkarsh bakery');
            res.redirect('/');
        })
    } catch (err) {
        req.flash('error', err.message);
        res.redirect('/register');
    }
    
}

module.exports.renderLogIn = (req, res) => {
    res.render('users/login');
}

module.exports.logIn = (req, res) => {
    const redirectUrl = req.session.returnTo || '/';
    delete req.session.returnTo;
    req.flash('success', 'Welcome Back');
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'Logged You Out');
    res.redirect('/');
}

module.exports.userProfile = async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findById(id);
    res.render('users/profile', { user });
}

module.exports.orders = async (req, res, next) => {
    const user = await User.findById(req.user._id).populate({
        path: 'orders',
        populate: {
            path: 'products'
        }
    }).populate('products');
    const orders = user.orders;
    res.render('users/orders', { orders });
}

module.exports.showOrder = async (req, res, next) => {
    const { id } = req.params;
    const order = await Order.findById(id).populate('products');
    res.render('users/showOrder', { order });
}
