const express = require('express');
const router = express.Router();
const controller = require('../controller/user_controller');
const cartController = require('../controller/cart_controller');
const cartSchema = require('../models/cart_schema');
const mongoose = require('mongoose')

verifyLogin = (req,res,next)=>{
  if(req.session.user){
      next()
  }else{
      res.redirect('/login')
  }
}


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
router.get('/view-account',verifyLogin,controller.viewAccount);
router.get('/edit-user-profile',verifyLogin,controller.editProfilePage)
router.post('/edit-user-profile/:id',verifyLogin,controller.editUserProfile)
router.get('/add-address',verifyLogin,controller.addAddress)
router.get('/getAllStates/:countryName',controller.getAllStates)
router.get('/getAllCities/:stateName',controller.getAllCities)
router.post('/add-address/:id',verifyLogin,controller.postAddAddress)
router.get('/account-edit-address/:index',verifyLogin,controller.editAddress)
router.post('/edit-address/:id',verifyLogin,controller.postEditAddress)
router.get('/shop',controller.shop)
router.get('/shop-list',controller.shoplist)
router.get('/get-category-product/:name',controller.getCategoryProduct)
router.post('/category-filter',controller.getProductsByFilter)
router.get('/get-all-products',controller.getAllProducts)
router.get('/view-cart',verifyLogin,cartController.cart)
router.post('/change-product-total-price',cartController.updateCart)
router.get('/add-to-cart/:id',cartController.addToCart)
router.get('/check-exist-product-in-cart/:id',cartController.checkExistProductInCart)
router.post('/change-cart-quantity',cartController.changeCartQuantity)
router.post('/removeCartItem',cartController.removeCartItem)


router.get('/logout',controller.logout)


module.exports = router;
