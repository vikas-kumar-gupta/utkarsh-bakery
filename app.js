if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const morgan = require('morgan');
const session = require('express-session');
const MongoDBStore = require('connect-mongo')(session);
const flash = require('connect-flash');
const passport = require('passport');
const passportLocal = require('passport-local');
const Joi = require('joi');
const methodOverride = require('method-override');

const ExpressError = require('./utils/ExpressError');
const Product = require('./models/product');
const User = require('./models/user');
const catchAsync = require('./utils/catchAsync');
const productRoutes = require('./routs/product');
const userRoutes = require('./routs/user');
const categoryRoutes = require('./routs/category');
const adminRoutes = require('./routs/admin');
const orderRoutes = require('./routs/order');

const port = process.env.PORT || 3006;
const secret = process.env.SECRET || 'thisisthesecretkey'
// const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/utkarsh-bakery';       //  Both production and development
const dbUrl = process.env.DB_URL;                                   //  Only for production
// const dbUrl = 'mongodb://localhost:27017/utkarsh-bakery';                //  Only for development

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
    .then((data) => {
    console.log(`Database Conneceted Succesfully`);
    })
    .catch((err) => {
        console.log(`Database Connection Error`);
        console.log(err);
    })

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);

// --------------  MIDDLEWARES  -------------------
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));

const store = new MongoDBStore({
    url: dbUrl,
    secret,
    touchAfter: 7 * 24 * 60 * 60,
    mongooseConnection: mongoose.connection
})

store.on('error', function (err) {
    console.log('Session Store Error', err);    
})

const sessionConfiguration = {
    store,
    secret,
    resave: true,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() +  60 * 60 * 24 * 7,
        maxAge: 1000 + 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfiguration));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    // req.locals.session = req.session;    
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get('/', catchAsync(async (req, res, next) => {
    const products = await Product.find({});
    res.render('home', { products });
}));
    
app.use('/', userRoutes);
app.use('/', categoryRoutes);
app.use('/', orderRoutes);
app.use('/product', productRoutes);
app.use('/admin', adminRoutes);

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404));
})

app.use((err, req, res, next) => {
    const { message = `Something Went Wrong`, status = 500 } = err;
    res.status(status).render('error', { err });
})

app.listen(port, (req, res) => {
    console.log(`listening on port ${port}`);
})