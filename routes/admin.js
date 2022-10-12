var express = require('express');
var router = express.Router();
const admin_controller = require('../controller/admin_controller')

/* GET users listing. */
router.get('/',admin_controller.home)
router.get('/customers',admin_controller.customers)
router.get('/products',admin_controller.products)
router
    .route('/add-product')
    .get(admin_controller.add_product)
    .post(admin_controller.add_a_product)
router
    .route('/edit_product/:id')
    .get(admin_controller.edit_product)
    .post(admin_controller.edit_a_product)
router.get('/categories',admin_controller.categories)
router
    .route('/add-category')
    .get(admin_controller.add_category)
    .post(admin_controller.add_a_category)
router
    .route('/edit-category/:id')
    .get(admin_controller.edit_category)
    .post(admin_controller.edit_a_category)
router.get('/delete-product/:id', admin_controller.delete_product)
router.get('/delete-category/:id', admin_controller.delete_category)
router.get('/user-status/:id',admin_controller.blockUser)
module.exports = router;
