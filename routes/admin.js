const express = require('express');
const router = express.Router();
const admin_controller = require('../controller/admin_controller');
const product_controller = require('../controller/product_controller');
const category_controller = require('../controller/category_controller');
const multer = require('../utils/multer');
/* GET users listing. */
router.get('/',admin_controller.home)
router.get('/customers',admin_controller.customers)
router.get('/products',product_controller.products)
router.get('/show-deleted',product_controller.deleted_products)
router
    .route('/add-product')
    .get(product_controller.add_product)
router.post('/add-product',multer.any(),product_controller.add_a_product)   
router
    .route('/edit_product/:id')
    .get(product_controller.edit_product)
    .post(multer.any(),product_controller.edit_a_product)
router.get('/categories',category_controller.categories)
router
    .route('/add-category')
    .get(category_controller.add_category)
    .post(multer.single('image'),category_controller.add_a_category)
router
    .route('/edit-category/:id')
    .get(category_controller.edit_category)
    .post(multer.single('image'),category_controller.edit_a_category)
router.get('/delete-product/:id', product_controller.delete_product)
router.get('/undo-product/:id',product_controller.undo_product)
router.get('/delete-category/:id', category_controller.delete_category)
router.get('/user-status/:id',admin_controller.blockUser)
module.exports = router;
