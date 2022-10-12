var express = require('express');
var router = express.Router();
const controller = require('../controller/user_controller')


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
router.get('/logout',controller.logout)
router.get('/get-category-product/:name',controller.getCategoryProduct)

module.exports = router;
