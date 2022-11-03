const express = require('express');
const router = express.Router();
const admin_controller = require('../controller/admin_controller');
const product_controller = require('../controller/product_controller');
const category_controller = require('../controller/category_controller');
const banner_controller = require('../controller/banner_controller')
const multer = require('../utils/multer');
const order_controller = require('../controller/order_controller');
const coupon_controller = require('../controller/coupon_controller')



verifyAdmin = (req,res,next)=>{
    if(req.session.admin){
        next()
    }else{
        res.redirect('/admin/login')
    }
  }

/* User Management. */
router.get('/',verifyAdmin,admin_controller.home)
router.get('/login',admin_controller.login)
router.post('/admin-auth',admin_controller.postSignup)
router.get('/customers',verifyAdmin,admin_controller.customers)
router.get('/products',verifyAdmin,product_controller.products)
router.get('/banners',verifyAdmin,banner_controller.banners)
router.get('/view-orders-list',verifyAdmin,order_controller.getAllOrders)
router.get('/user-status/:id',verifyAdmin,admin_controller.blockUser)

// Banner Management
router
    .route('/add-banner')
    .get(verifyAdmin,banner_controller.add_banner)
    .post(verifyAdmin,multer.any(),banner_controller.add_a_banner)
router
    .route('/edit-banner/:id')
    .get(verifyAdmin,banner_controller.edit_banner)
    .post(verifyAdmin,multer.any(),banner_controller.edit_a_banner)
router.get('/delete-banner/:id', verifyAdmin,banner_controller.delete_banner)    

// Product Management
router
    .route('/add-product')
    .get(verifyAdmin,product_controller.add_product)
router.post('/add-product',verifyAdmin,multer.any(),product_controller.add_a_product)  
router
    .route('/edit_product/:id')
    .get(verifyAdmin,product_controller.edit_product)
    .post(verifyAdmin,multer.any(),product_controller.edit_a_product)
router.get('/show-deleted',verifyAdmin,product_controller.deleted_products)
router.get('/delete-product/:id', verifyAdmin,product_controller.delete_product)
router.get('/undo-product/:id',verifyAdmin,product_controller.undo_product)

// Category Management
router.get('/categories',verifyAdmin,category_controller.categories)
router
    .route('/add-category')
    .get(verifyAdmin,category_controller.add_category)
    .post(verifyAdmin,multer.single('image'),category_controller.add_a_category)
router
    .route('/edit-category/:id')
    .get(verifyAdmin,category_controller.edit_category)
    .post(verifyAdmin,multer.single('image'),category_controller.edit_a_category)
router.get('/delete-category/:id', category_controller.delete_category)

// Order Management
router.get('/edit-order-by-admin',verifyAdmin,order_controller.edit_a_product)
router.post('/change-order-status',verifyAdmin,order_controller.changeCurrentStatus)


// Coupon Management
router.get('/coupons-list',verifyAdmin,coupon_controller.couponsList)
router.get('/add-coupon',verifyAdmin,coupon_controller.addCoupon)
router.post('/add-a-coupon',verifyAdmin,coupon_controller.add_a_coupon)


router.get('/logout',verifyAdmin,admin_controller.logout)
module.exports = router;
