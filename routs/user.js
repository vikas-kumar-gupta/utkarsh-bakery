const express = require('express');
const passport = require('passport');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const userController = require('../controller/user');
const { isLoggedIn, isOwner } = require('../middleware');

router.route('/contact-us')
    .get(userController.renderContactUs)
    .post(catchAsync(userController.contactUs))

router.route('/register')
    .get(userController.renderRegister)
    .post(catchAsync(userController.register))

router.route('/login')
    .get(userController.renderLogIn)
       //  passport.authenticate is used for authentication of the user
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), userController.logIn)

router.get('/logout', userController.logout);

router.get('/user/:id/profile', isLoggedIn, isOwner, userController.userProfile);
router.get('/orders', isLoggedIn, userController.orders);
router.get('/orders/:id', isLoggedIn, userController.showOrder);

module.exports = router;