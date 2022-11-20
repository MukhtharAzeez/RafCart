const express = require('express');
const router = express.Router();
const controller = require('../controller/user_controller');
const cartController = require('../controller/cart_controller');
const wishListController = require('../controller/wishList_controller')
const orderController=require('../controller/order_controller')
const productController = require('../controller/product_controller')
const couponController = require('../controller/coupon_controller')
const reviewController = require('../controller/review_controller')
const userMiddleware = require('../middleware/user')



/* GET home page. */
router.get('/',userMiddleware.cartAndWishList,controller.home);

router
  .route('/register')
  .get(controller.signup)
  .post(controller.postSignup)

router.get('/verify-through-otp')
router.post('/verify-through-otp',controller.otpVerification)
router.post('/email-password-check',controller.emailAndPasswordValidCheck);
router.get('/check-user-verification',controller.otpPage)
router.get('/check-user-session-exist',controller.checkUserSessionExist);

router
  .route('/login')
  .get(controller.login)
  .post(controller.postLogin)

// Account

router.get('/view-account',userMiddleware.verifyLogin,controller.viewAccount);
router.get('/edit-user-profile',userMiddleware.verifyLogin,controller.editProfilePage)
router.post('/edit-user-profile/:id',userMiddleware.verifyLogin,controller.editUserProfile)
router.get('/add-address',userMiddleware.verifyLogin,controller.addAddress)
router.get('/getAllStates/:countryName',controller.getAllStates)
router.get('/getAllCities/:stateName',controller.getAllCities)
router.post('/add-address/:id',userMiddleware.verifyLogin,controller.postAddAddress)
router.get('/account-edit-address',userMiddleware.verifyLogin,controller.editAddress)
router.post('/edit-address/:id',userMiddleware.verifyLogin,controller.postEditAddress)
router.get('/account-delete-address',userMiddleware.verifyLogin,controller.deleteAddress)
router.get('/forgot_password',userMiddleware.cartAndWishList,controller.forgotPassword)
router.post('/forgot-password-otp',userMiddleware.cartAndWishList,controller.forgotPasswordOTP)
router.get('/password-change-page',userMiddleware.cartAndWishList,controller.passwordChangePage)

// Shop
router.get('/shop',controller.shop)
router.get('/shop-list',controller.shoplist)
router.get('/get-category-product/:name',controller.getCategoryProduct)
router.post('/category-filter',controller.getProductsByFilter)
router.get('/get-all-products',controller.getAllProducts)
router.get('/product-quick-view/:id',controller.quickViewProduct)

// View Single Product
router.get('/view-single-product',userMiddleware.cartAndWishList,productController.viewSingleProduct)

// Cart
router.get('/view-cart',userMiddleware.verifyLogin,userMiddleware.cartAndWishList,cartController.cart)
router.post('/change-product-total-price',userMiddleware.verifyLogin,userMiddleware.cartAndWishList,cartController.updateCart)
router.get('/add-to-cart/:id',userMiddleware.verifyLogin,userMiddleware.cartAndWishList,cartController.addToCart)
router.get('/check-exist-product-in-cart/:id',userMiddleware.verifyLogin,userMiddleware.cartAndWishList,cartController.checkExistProductInCart)
router.post('/change-cart-quantity',userMiddleware.verifyLogin,cartController.changeCartQuantity)
router.post('/removeCartItem',userMiddleware.verifyLogin,userMiddleware.cartAndWishList,cartController.removeCartItem)
router.post('/product-stock-check',userMiddleware.verifyLogin,userMiddleware.cartAndWishList,productController.checkStockLeft)

// Wishlist
router.get('/view-wishlist',userMiddleware.verifyLogin,userMiddleware.cartAndWishList,wishListController.wishlist)
router.get('/add-to-wishList/:id',userMiddleware.verifyLogin,userMiddleware.cartAndWishList,wishListController.addToWishList)
router.get('/remove-from-wish-list/:id',userMiddleware.verifyLogin,userMiddleware.cartAndWishList,wishListController.removeFromWishList)


// Checkout
router.get('/checkout-page',userMiddleware.verifyLogin,userMiddleware.cartAndWishList,controller.checkout)
router.get('/payment-page',userMiddleware.verifyLogin,userMiddleware.cartAndWishList,controller.payment)
router.post('/place-an-order',userMiddleware.verifyLogin,userMiddleware.cartAndWishList,controller.PlaceAnOrder)
router.get('/order-successfully-placed',userMiddleware.verifyLogin,userMiddleware.cartAndWishList,orderController.orderPlacedSucessFully)
router.post('/verify-payment',userMiddleware.verifyLogin,userMiddleware.cartAndWishList,orderController.verifyPayment)

// Coupons
router.get('/available_coupons',userMiddleware.verifyLogin,userMiddleware.cartAndWishList,couponController.couponsPage)
router.get('/check-for-coupon',userMiddleware.verifyLogin,userMiddleware.cartAndWishList,couponController.checkForAvailablity)

router.get('/apply-coupon',userMiddleware.verifyLogin,userMiddleware.cartAndWishList,couponController.applyCoupon)
router.get('/remove-coupon',userMiddleware.verifyLogin,userMiddleware.cartAndWishList,couponController.removeCoupon)
router.get('/coupon-exist-check',userMiddleware.verifyLogin,userMiddleware.cartAndWishList,couponController.couponExistCheck)
router.get('/claim_coupon',userMiddleware.verifyLogin,userMiddleware.cartAndWishList,couponController.claimCoupon)
router.get('/check-cart-exist',userMiddleware.verifyLogin,cartController.checkCartExist)

// Orders
router.get('/check-for-orders',userMiddleware.verifyLogin,orderController.checkForOrders)
router.get('/view-current-order',userMiddleware.verifyLogin,userMiddleware.cartAndWishList,orderController.viewCurrentOrder)
router.get('/view-orders',userMiddleware.verifyLogin,userMiddleware.cartAndWishList,orderController.viewOrders)
router.get('/cancel-order',userMiddleware.verifyLogin,userMiddleware.cartAndWishList,orderController.cancelOrder)

// Review
router.get('/review-for-a-product',userMiddleware.verifyLogin,userMiddleware.cartAndWishList,reviewController.writeReview)
router.post('/write-the-review',userMiddleware.verifyLogin,userMiddleware.cartAndWishList,reviewController.writeAReview)

// Invoice
router.get('/see-order-invoice',userMiddleware.verifyLogin,userMiddleware.cartAndWishList,orderController.seeOrderInvoice) 

// Search Products
router.get('/product-search-result',userMiddleware.cartAndWishList,productController.getProductBySearch)

// Error Page
router.get('/not-found',controller.errorPage)


router.get('/logout',controller.logout)




module.exports = router;
