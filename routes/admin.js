const express = require('express');
const router = express.Router();
const admin_controller = require('../controller/admin_controller');
const product_controller = require('../controller/product_controller');
const category_controller = require('../controller/category_controller');
const banner_controller = require('../controller/banner_controller')
const multer = require('../utils/multer');
const order_controller = require('../controller/order_controller');
const coupon_controller = require('../controller/coupon_controller')

/* User Management. */
router.get('/',admin_controller.home)
router.get('/customers',admin_controller.customers)
router.get('/products',product_controller.products)
router.get('/banners',banner_controller.banners)
router.get('/view-orders-list',order_controller.getAllOrders)
router.get('/user-status/:id',admin_controller.blockUser)

// Banner Management
router
    .route('/add-banner')
    .get(banner_controller.add_banner)
    .post(multer.any(),banner_controller.add_a_banner)
router
    .route('/edit-banner/:id')
    .get(banner_controller.edit_banner)
    .post(multer.any(),banner_controller.edit_a_banner)
router.get('/delete-banner/:id', banner_controller.delete_banner)    

// Product Management
router
    .route('/add-product')
    .get(product_controller.add_product)
router.post('/add-product',multer.any(),product_controller.add_a_product)  
router
    .route('/edit_product/:id')
    .get(product_controller.edit_product)
    .post(multer.any(),product_controller.edit_a_product)
router.get('/show-deleted',product_controller.deleted_products)
router.get('/delete-product/:id', product_controller.delete_product)
router.get('/undo-product/:id',product_controller.undo_product)

// Category Management
router.get('/categories',category_controller.categories)
router
    .route('/add-category')
    .get(category_controller.add_category)
    .post(multer.single('image'),category_controller.add_a_category)
router
    .route('/edit-category/:id')
    .get(category_controller.edit_category)
    .post(multer.single('image'),category_controller.edit_a_category)
router.get('/delete-category/:id', category_controller.delete_category)

// Order Management
router.get('/edit-order-by-admin',order_controller.edit_a_product)
router.post('/change-order-status',order_controller.changeCurrentStatus)


// Coupon Management
router.get('/coupons-list',coupon_controller.couponsList)
router.get('/add-coupon',coupon_controller.addCoupon)
router.post('/add-a-coupon',coupon_controller.add_a_coupon)

module.exports = router;
