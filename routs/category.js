const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const categoryController = require('../controller/category');

router.get('/anniversary-cake', catchAsync(categoryController.anniversaryCake));
router.get('/birthday-cake', catchAsync(categoryController.birthdayCake));
router.get('/designer-cake', catchAsync(categoryController.designerCake));
router.get('/photo-cake', catchAsync(categoryController.photoCake));
router.get('/popular-cake', catchAsync(categoryController.popularCake));
router.get('/special-cake', catchAsync(categoryController.specialCake));

module.exports = router;