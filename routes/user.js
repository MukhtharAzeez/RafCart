const express = require('express');
const router = express.Router();
const controller = require('../controller/user_controller');
const cartController = require('../controller/cart_controller');
const cartSchema = require('../models/cart_schema');
const wishListController = require('../controller/wishList_controller')
const orderController=require('../controller/order_controller')
const productController = require('../controller/product_controller')
const couponController = require('../controller/coupon_controller')
const userSchema = require('../models/user_schema')
const mongoose = require('mongoose')

verifyLogin = (req,res,next)=>{
  if(req.session.user){
      next()
  }else{
      res.redirect('/login')
  }
}

cartAndWishList = async(req,res,next)=>{
 
        if(req.session.user){
            const cart = await cartSchema.findOne({userId: mongoose.Types.ObjectId(req.session.user._id)})
            if(cart){
                res.count = cart.products.length
            }else{
                res.count=0
            }
            userWishListCount = await userSchema.aggregate([
                {
                    $match : {_id : mongoose.Types.ObjectId(req.session.user._id)},
                },
                {
                    $project : {
                        
                        wishListProducts : 1
                    }
                },
                {
                    $unwind : {
                        path : "$wishListProducts"
                    }
                },
                
                { $group: { _id: null, count: { $sum: 1 } } }

            ])
            
            userWishListCount[0]?res.userWishListCount=userWishListCount[0].count:res.userWishListCount=0 
        }else{
          res.count=0
          res.userWishListCount=0
        }
        next();
}

/* GET home page. */
router.get('/',cartAndWishList,controller.home);

router
  .route('/register')
  .get(controller.signup)
  .post(controller.postSignup)

router.get('/verify-through-otp')
router.post('/verify-through-otp',controller.otpVerification)
router.post('/email-password-check',controller.emailAndPasswordValidCheck);


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
router.get('/product-quick-view/:id',controller.quickViewProduct)

// Cart
router.get('/view-cart',verifyLogin,cartAndWishList,cartController.cart)
router.post('/change-product-total-price',verifyLogin,cartAndWishList,cartController.updateCart)
router.get('/add-to-cart/:id',verifyLogin,cartAndWishList,cartController.addToCart)
router.get('/check-exist-product-in-cart/:id',verifyLogin,cartAndWishList,cartController.checkExistProductInCart)
router.post('/change-cart-quantity',verifyLogin,cartAndWishList,cartController.changeCartQuantity)
router.post('/removeCartItem',verifyLogin,cartAndWishList,cartController.removeCartItem)
router.post('/product-stock-check',verifyLogin,cartAndWishList,productController.checkStockLeft)

// Wishlist
router.get('/view-wishlist',verifyLogin,cartAndWishList,wishListController.wishlist)
router.get('/add-to-wishList/:id',verifyLogin,cartAndWishList,wishListController.addToWishList)
router.get('/remove-from-wish-list/:id',verifyLogin,cartAndWishList,wishListController.removeFromWishList)


// Checkout
router.get('/checkout-page',verifyLogin,cartAndWishList,controller.checkout)
router.get('/payment-page/:index',verifyLogin,cartAndWishList,controller.payment)
router.post('/place-an-order',verifyLogin,cartAndWishList,controller.PlaceAnOrder)
router.get('/order-successfully-placed',verifyLogin,cartAndWishList,orderController.orderPlacedSucessFully)
router.post('/verify-payment',verifyLogin,cartAndWishList,orderController.verifyPayment)

// Coupons
router.get('/available_coupons',verifyLogin,cartAndWishList,couponController.couponsPage)
router.get('/check-for-coupon',verifyLogin,cartAndWishList,couponController.checkForAvailablity)
router.get('/apply-coupon',verifyLogin,cartAndWishList,couponController.applyCoupon)

// Orders
router.get('/check-for-orders',verifyLogin,orderController.checkForOrders)
router.get('/view-current-order',verifyLogin,cartAndWishList,orderController.viewCurrentOrder)
router.get('/view-orders',verifyLogin,cartAndWishList,orderController.viewOrders)



router.get('/logout',controller.logout)


module.exports = router;
