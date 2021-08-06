const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const adminController = require('../controller/admin');
const { validateProduct, isLoggedIn, isAdmin } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/add-product')
    .get(isLoggedIn, isAdmin , validateProduct,  adminController.addNewProduct)
    .post(isLoggedIn, isAdmin, upload.array('image'), validateProduct, catchAsync(adminController.uploadNewProduct))

router.put('/:id', isAdmin, isLoggedIn, upload.array('image'), validateProduct, catchAsync(adminController.updateProduct))

router.get('/all-user-acc', isAdmin, isLoggedIn,  catchAsync(adminController.allUserAccounts));
router.get('/all-products', isAdmin, isLoggedIn, catchAsync(adminController.allProducts));
router.get('/customer-querry', isAdmin, isLoggedIn, catchAsync(adminController.customerQuerry));
router.get('/customer/:id/orders', isAdmin, isLoggedIn, catchAsync(adminController.customerOrders));
router.get('/querry/:id', isAdmin,  isLoggedIn,  catchAsync(adminController.showQuerry));
router.get('/:id/edit', isAdmin, isLoggedIn, catchAsync(adminController.editProduct));
router.get('/all-orders', isAdmin, isLoggedIn, catchAsync(adminController.allOrders));
router.route('/all-orders/:id')
    .get(isAdmin, isLoggedIn, catchAsync(adminController.showOrder))
    .put(isAdmin, isLoggedIn, catchAsync(adminController.updateOrder))



module.exports = router;