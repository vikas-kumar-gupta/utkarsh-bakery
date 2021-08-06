const ExpressError = require('./utils/ExpressError');
const User = require('./models/user')
const { productSchema } = require('./schema');


module.exports.validateProduct = (req, res, next) => {
    const { err } = productSchema.validateAsync(req.body);
    if (err) {
        const msg = err.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be logged in');
        return res.redirect('/login');
    }
    next();
}

module.exports.isAdmin = (req, res, next) => {
    if (req.user.role === 'customer' || undefined) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'Sorry! You don\'t have permission to access this');
        return res.redirect('/');
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const newUser = await User.findById(id);
    if (!newUser._id.equals(req.user._id) && (req.user.role === 'customer')) {
        req.flash('error', 'You don\'t have permission');
        return res.redirect('/contact-us');
    }
    next();
}