const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const orderController = require('../controller/order');
const { isLoggedIn} = require('../middleware')

router.route('/:id/place-order')
    .get(isLoggedIn, catchAsync(orderController.renderPlaceOrder))
    .post(isLoggedIn, catchAsync(orderController.placeOrder))
    .put(isLoggedIn, catchAsync(orderController.confirmOrder))


module.exports = router;