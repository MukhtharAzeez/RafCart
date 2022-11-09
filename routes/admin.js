const express = require('express');
const router = express.Router();
const admin_controller = require('../controller/admin_controller');
const product_controller = require('../controller/product_controller');
const category_controller = require('../controller/category_controller');
const banner_controller = require('../controller/banner_controller')
const multer = require('../utils/multer');
const order_controller = require('../controller/order_controller');
const coupon_controller = require('../controller/coupon_controller')
const adminMiddleware=require('../middelwares/admin')





router.get('/',adminMiddleware.verifyAdmin,admin_controller.home)
router.get('/login',admin_controller.login)
router.post('/admin-auth',admin_controller.postSignup)
router.get('/customers',adminMiddleware.verifyAdmin,admin_controller.customers)
router.get('/products',adminMiddleware.verifyAdmin,product_controller.products)
router.get('/banners',adminMiddleware.verifyAdmin,banner_controller.banners)
router.get('/view-orders-list',adminMiddleware.verifyAdmin,order_controller.getAllOrders)
router.get('/user-status/:id',adminMiddleware.verifyAdmin,admin_controller.blockUser)


// Banner Management
router
    .route('/add-banner')
    .get(adminMiddleware.verifyAdmin,banner_controller.add_banner)
    .post(adminMiddleware.verifyAdmin,multer.any(),banner_controller.add_a_banner)
router
    .route('/edit-banner/:id')
    .get(adminMiddleware.verifyAdmin,banner_controller.edit_banner)
    .post(adminMiddleware.verifyAdmin,multer.any(),banner_controller.edit_a_banner)
router.get('/delete-banner/:id', adminMiddleware.verifyAdmin,banner_controller.delete_banner)    


// Product Management
router
    .route('/add-product')
    .get(adminMiddleware.verifyAdmin,product_controller.add_product)
router.post('/add-product',adminMiddleware.verifyAdmin,multer.any(),product_controller.add_a_product)  
router
    .route('/edit_product/:id')
    .get(adminMiddleware.verifyAdmin,product_controller.edit_product)
    .post(adminMiddleware.verifyAdmin,multer.any(),product_controller.edit_a_product)
router.get('/show-deleted',adminMiddleware.verifyAdmin,product_controller.deleted_products)
router.get('/delete-product/:id', adminMiddleware.verifyAdmin,product_controller.delete_product)
router.get('/undo-product/:id',adminMiddleware.verifyAdmin,product_controller.undo_product)


// Category Management
router.get('/categories',adminMiddleware.verifyAdmin,category_controller.categories)
router
    .route('/add-category')
    .get(adminMiddleware.verifyAdmin,category_controller.add_category)
    .post(adminMiddleware.verifyAdmin,multer.single('image'),category_controller.add_a_category)
router
    .route('/edit-category/:id')
    .get(adminMiddleware.verifyAdmin,category_controller.edit_category)
    .post(adminMiddleware.verifyAdmin,multer.single('image'),category_controller.edit_a_category)
router.get('/delete-category/:id', category_controller.delete_category)


// Order Management
router.get('/edit-order-by-admin',adminMiddleware.verifyAdmin,order_controller.edit_a_product)
router.post('/change-order-status',adminMiddleware.verifyAdmin,order_controller.changeCurrentStatus)


// Coupon Management
router.get('/coupons-list',adminMiddleware.verifyAdmin,coupon_controller.couponsList)
router.get('/add-coupon',adminMiddleware.verifyAdmin,coupon_controller.addCoupon)
router.post('/add-a-coupon',adminMiddleware.verifyAdmin,coupon_controller.add_a_coupon)


// Invoices
router.get('/get-salesReport-by-year',adminMiddleware.verifyAdmin,admin_controller.yearInvoice)
router.get('/get-salesReport-by-month',adminMiddleware.verifyAdmin,admin_controller.MonthInvoice)
router.get('/get-salesReport-by-week',adminMiddleware.verifyAdmin,admin_controller.WeekInvoice)




router.get('/logout',adminMiddleware.verifyAdmin,admin_controller.logout)





module.exports = router;