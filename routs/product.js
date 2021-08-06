const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const productController = require('../controller/product.js');

router.get('/:id', catchAsync(productController.showProduct))

module.exports = router;