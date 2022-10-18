const express = require('express');
const router = express.Router();
const controller = require('../controller/user_controller');
const cartController = require('../controller/cart_controller');

/* GET home page. */
router.get('/',controller.home);

router
  .route('/register')
  .get(controller.signup)
  .post(controller.postSignup)

router
  .route('/login')
  .get(controller.login)
  .post(controller.postLogin)

router.get('/shop',controller.shop)
router.get('/shop-list',controller.shoplist)
router.get('/get-category-product/:name',controller.getCategoryProduct)
router.get('/view-cart',cartController.cart)
router.get('/add-to-cart/:id',cartController.addToCart)
router.get('/logout',controller.logout)


module.exports = router;
