const db = require('../config/connection');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userSchema = require('../models/user_schema')
const productSchema = require('../models/product_schema');
const categorySchema = require('../models/category_schema');
const cartSchema = require('../models/cart_schema');
const bannerSchema = require('../models/banner_schema')
const cart_controller = require('../controller/cart_controller')
const order_controller = require('../controller/order_controller')
const OtpCheck = require('../utils/twilio')
const couponSchema = require('../models/coupon_schema')



const country = require('country-state-city').Country
const state = require('country-state-city').State
const city = require('country-state-city').City


let userSession={}
let code
let indexForAddress =-1
let categoryProducts
let mobileNumber
let userDetails

module.exports = {
    home : async(req,res)=>{
        try {
            const category = await categorySchema.find({}).lean();
            const topCategory = await categorySchema.find({}).limit(8).lean();
        let banners = await bannerSchema.find({}).lean();
        let subBanners
        if(banners.length>=3){
            banners = await bannerSchema.find({}).sort({_id : -1}).skip(2).lean();
            subBanners= await bannerSchema.find({}).sort({_id : -1}).limit(2).lean();
        }

        let recommendedProducts = await productSchema.find({}).lean()
        let latestProduct = await productSchema.find({}).limit(3).lean();
        
        res.render('user/index-3',{noHeader:true,noFooter:true,recommendedProducts,latestProduct,"user" : req.session.user,topCategory,category,"count":res.count,banners,subBanners,"userWishListCount":res.userWishListCount});
        } catch (error) {
            
        }
    },
    login : (req,res)=>{
        req.session.url
        if(req.session.loggedIn){
          res.redirect('/')
        }else{
            res.render('user/login',{noHeader:true,noFooter:true});
        }
    },
    signup : (req,res)=>{
        if(req.session.loggedIn){
            res.redirect('/')
        }else{
            res.render('user/register',{noHeader:true,noFooter:true});
        }
    },
    postSignup : async (req,res)=>{
       
        let user =await userSchema.find({email:req.body.email})
        let userWithPhone = await userSchema.findOne({email:req.body.phone})
        if(user[0] || userWithPhone){
            res.redirect('/register')
        }else if(req.body.password !== req.body.confirmPassword){
            res.redirect('/register')
        }else{
            return new Promise (async(resolve, reject) => {
                const userName = req.body.userName;
                const email = req.body.email;
                const phone = req.body.phone;
                const password = await bcrypt.hash(req.body.password,10);
                let number=parseInt(phone)
                console.log(number);
                
                const user = new userSchema({
                    userName : userName,
                    email : email,
                    phone : phone,
                    password : password,
                    status : true,
                    verification : 'pending',
                    wishListCount : 0,
                    createdDate : new Date(),
                });
                
                mobileNumber=number;
                
                user
                   .save()
                   .then((result)=>{
                    userSession=result
                    userDetails=result;
                    userSession.password = null
                    OtpCheck.sendOtp(number)
                    res.render('user/otp-verification')
                   })
                   .catch((error)=>{
                    console.log(error);
                   })
            })
        }
    },
    emailAndPasswordValidCheck : async(req,res)=>{
        let validation={}
        let user =await userSchema.findOne({email:req.body.email})
        
        if(user){
        
            validation.email=true
            if(user.status){
                let password = await  bcrypt.compare(req.body.password,user.password)
                if(password){
                    res.json({password:true,email:true}) 
                }else{
                    res.json({password:false,email:true})
                }
            }else{
                res.json({userBlocked:true})
            }
           
        }else{
            res.json({email:false})       
        }
        
        
    },
    postLogin : (req,res)=>{
        userSchema.find({email:req.body.email}).then((result)=>{
         if(result[0].verification=='success'){
            if(result[0]){
                if(result[0].status){
                    bcrypt.compare(req.body.password,result[0].password).then((status)=>{
                        if(status){
                            
                            req.session.user=result[0];
                            req.session.user.password=null
                            req.session.loggedIn = true;
                            userSession=req.session.user
                            if(req.session.url){
                                res.redirect(req.session.url)
                            }else{
                                res.redirect('/')
                            }
                        }else{
                           res.redirect('/login')
                        }
                    })
                }else{
                    res.redirect('/login')
                }
            }else{
                res.redirect('/login')
            }
         }else{
            userDetails=result[0];
            userDetails.password=null
            OtpCheck.sendOtp(result[0].phone)
            res.render('user/check-user-verification')
         }
            
            
        })
    },
    otpVerification : async(req,res)=>{   
        console.log(req.body)
        let otp=Object.values(req.body)
        console.log("First",otp)
        otp = otp.join()   
        console.log('Second',otp)
        otp = otp.split(",").join('') 
        console.log("Third",otp)    
        let otpStatus=await OtpCheck.verifyOtp(mobileNumber,otp)     
        if(otpStatus.valid){
            req.session.user=userDetails
            req.session.loggedIn = true;
            await userSchema.updateOne(
                {
                    _id : mongoose.Types.ObjectId(req.session.user._id)
                },
                {
                    $set :{
                        verification : 'success'
                    }
                }
            )
           
            res.json({status:true})
        }else{
            req.session.destroy();
            res.json({status:false})
        }
    },
    checkUserSessionExist : async(  req,res)=>{
        if(req.session.user){
            res.json({status : true})
        }else{
            res.json({status : false})
        }
    },
    shop :async (req,res) => {

        let products = await productSchema.find({}).lean()
        
        let category = await categorySchema.find({}).lean()
       
        
        let count = 0;
        var userWishListCount=0
        let user
        if(req.session.user){
            const cart = await cartSchema.findOne({userId: mongoose.Types.ObjectId(req.session.user._id)})
            if(cart){
                count = cart.products.length;
                cartCount = count
            }

            // compare product and favourite product to set favourite icon
            user = await userSchema.aggregate([
                {
                    $match : {
                        _id: mongoose.Types.ObjectId(req.session.user._id)
                    }
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
            ])
            
            for(var i=0;i<user.length;i++){
                for(var j=0;j<products.length;j++){
                    if(user[i].wishListProducts.toString()==products[j]._id.toString()){
                        products[j].favourite=true
                    }
                }
            }

            // aggregate to get count of wish list products
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
                {   
                    $group: {
                         _id: null, count: { $sum: 1 } 
                    } 
                }
            ])
            userWishListCount[0]?userWishListCount=userWishListCount[0].count:userWishListCount=0 
            userWishListCount[0]?wishListCount=userWishListCount[0].count:wishListCount=0
        }
        
        if(categoryProducts){
            if(req.session.user){
                for(var i=0;i<user.length;i++){
                    for(var j=0;j<categoryProducts.length;j++){
                        if(user[i].wishListProducts.toString()==categoryProducts[j]._id.toString()){
                            categoryProducts[j].favourite=true
                        }
                    }
                }
            }
            console.log(categoryProducts);
            products=categoryProducts
            categoryProducts=null
            res.render('user/shop-grid-2',{products,category,user:req.session.user,count,userWishListCount})        
        }else{      
            res.render('user/shop-grid-2',{products,category,"user":req.session.user,count,userWishListCount})
        }
        
    },
    shoplist : async(req,res) => {
        
        let products = await productSchema.find({}).lean()
        let category = await categorySchema.find({}).lean()
        let count = 0;
        if(req.session.user){
            const cart = await cartSchema.findOne({userId: mongoose.Types.ObjectId(req.session.user._id)})
            count = cart.products.length;
        }
        res.render('user/shop-list',{products,category,"user":req.session.user,count})
    },
    getCategoryProduct : async(req,res)=>{
        
        let products= await productSchema.find({category : req.params.name}).lean()
        categoryProducts = products;
        res.redirect('/shop')
        
    },
    getProductsByFilter : async(req,res)=>{
        let products
        

        if(Object.keys(req.body).length !== 0){
            products = await productSchema.find(
                {
                    category:{
                        $in : [
                            ...req.body.category
                        ]
                    }
                }
            ).lean()
            
        }else{
            products= await productSchema.find({}).lean()
        }

        // To set favourite icon if user add any product as favourite
        if(req.session.user){
            let user = await userSchema.aggregate([
                {
                    $match : {
                        _id: mongoose.Types.ObjectId(req.session.user._id)
                    }
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
            ])
            
            for(var i=0;i<user.length;i++){
                for(var j=0;j<products.length;j++){
                    if(user[i].wishListProducts.toString()==products[j]._id.toString()){
                        products[j].favourite=true
                    }
                }
            }
        }
       
        res.json(products)
        
    },
    quickViewProduct : async(req,res)=>{
        
        let products = await productSchema.find({_id:mongoose.Types.ObjectId(req.params.id)}).lean()
        
        res.json(products[0])
    },
    getAllProducts : async(req,res)=>{
        let products = await productSchema.find({}).lean()
        res.json(products)     
    },
    getTotalAmount : async function (productId) {
        try {
            //Get total amount
            let total = await cartSchema.aggregate([
                {
                    $match :{userId:mongoose.Types.ObjectId(userSession._id)} 
                },
                {
                    $project : {
                        products : 1,
                    }
                },
                {
                    $unwind : {
                        path : "$products"
                    }
                },
                {
                    $project :{
                        item : "$products.item",
                        quantity : "$products.quantity",
                    }
                },
                {
                    $lookup :{
                        from : 'products',
                        localField : 'item',
                        foreignField : '_id',
                        as : 'product'
                    }
                },
                {
                    $project : {
                        item : 1,
                        quantity : 1,
                        product : {$arrayElemAt : ["$product",0]}
                    }
                },
                {
                    $group :{
                        _id:null,
                        total : {$sum:{$multiply :['$quantity','$product.discount']}},
                       
                    }
                },
            ])

            // Get product total amount
        
         
            let productTotal = await cartSchema.aggregate([
                {
                    $match :{
                        userId:mongoose.Types.ObjectId(userSession._id),
                    },
                },
                {
                    $unwind :{
                        path : "$products"
                    }
                },
                {
                    $match:{
                        'products.item': mongoose.Types.ObjectId(productId)
                    }
                },
                {
                    $project :{ 
                        products : 1,  
                    }
                },
                {
                    $lookup:{
                        from : 'products',
                        localField : 'products.item',
                        foreignField : '_id',
                        as : 'product'
                    }
                },
                {
                    $project:{
                        products:1,
                        product : {$arrayElemAt : ["$product",0]}
                    }
                },
                {
                    $project :{
                        productTotal :{$multiply :['$products.quantity','$product.discount']}
                    }
                }
            ]
                
            )
            if(total[0]){
                result = {
                    total:total[0].total,
                    productTotal : productTotal[0]
                }
                return result;
            }else{
                let total=0
                console.log(total);
                return total 
            }
            
        } catch (error) {
            console.log(error);
        }
        
        
         
    },
    viewAccount : async(req,res)=>{
        let count = 0;
        if(req.session.user){
            const cart = await cartSchema.findOne({userId: mongoose.Types.ObjectId(req.session.user._id)})
            if(cart){
                count = cart.products.length;
            }
           
        }
        let userDetails = await userSchema.findOne({_id : mongoose.Types.ObjectId(req.session.user._id)}).lean()
        res.render('user/account',{userDetails,"user":req.session.user,count})
    },
    editProfilePage : async(req,res)=>{
        let user = await userSchema.findOne({_id : mongoose.Types.ObjectId(req.session.user._id)}).lean()
        res.render('user/account-profile-info',{user})
    },
    editUserProfile : async(req,res)=>{
        await userSchema.updateOne(
            {
                _id:mongoose.Types.ObjectId(req.params.id)
            },
            {
                $set :{
                    userName:req.body.userName,
                    gender : req.body.gender,
                    email : req.body.email,
                    phone : req.body.phone,
                }
            },
        ).then((response)=>{
            
            res.redirect('/view-account')
        })
    },
    addAddress : async(req,res)=>{
        
        let countries = await country.getAllCountries();
        let user = await userSchema.findOne({_id : mongoose.Types.ObjectId(req.session.user._id)}).lean() 
        res.render('user/account-manage-address',{user,countries,addingPlace:req.query.addingPlace})
    },
    getAllStates: async(req,res)=>{
        let countries = await country.getAllCountries();
        for(var i=0; i<countries.length; i++){
            if(countries[i].name==req.params.countryName){
                code = countries[i].isoCode;
            }
        }
        let states = await state.getStatesOfCountry(code);
        res.json(states)
    },
    getAllCities : async(req,res)=>{
        let states = await state.getStatesOfCountry(code);
        let stateCode
        for(var i=0; i<states.length; i++){
            if(states[i].name==req.params.stateName){
                stateCode = states[i].isoCode;
            }
        }
        let cities = await city.getCitiesOfState(code,stateCode)
        res.json(cities)
        
    },
    postAddAddress : async(req,res)=>{
        let addressIndex = await userSchema.findOne({_id : mongoose.Types.ObjectId(req.session.user._id)})
        indexForAddress = addressIndex.address.length
       await userSchema.updateOne(
        {
            _id : mongoose.Types.ObjectId(req.params.id)
        },
        {
            $push : {
                address :{
                    index : indexForAddress,
                    fullName : req.body.fullName,
                    phone : req.body.phone,
                    country : req.body.country,
                    state : req.body.state,
                    city : req.body.city,
                    address : req.body.address,
                },
            },
            

        }
       ).then(()=>{
        if(req.body.addingPlace=='checkout'){
            res.redirect('/checkout-page')
        }else{
            res.redirect('/view-account')
        }
        
       })
    },
    editAddress : async (req,res) => {
        let userDetails = await userSchema.findOne({_id : mongoose.Types.ObjectId(req.session.user._id)}).lean()
        index=req.query.index
        userDetails=userDetails.address[index]
        let countries = await country.getAllCountries();
        try {
            res.render('user/account-edit-address',{userDetails,countries,"user":req.session.user,index})
        } catch (error) {
            console.log(error);
        }
    },
    deleteAddress : async(req,res)=>{
        
        req.query.index=parseInt(req.query.index)
        await userSchema.updateOne(
            {
                _id : mongoose.Types.ObjectId(req.session.user._id),
            },
            {
                $pull : {
                    address : {
                        index : req.query.index
                    }
                },
            }
        )
        res.redirect('/view-account')
           
    },
    postEditAddress : async(req,res)=>{
        
        index=parseInt(req.body.index)

        await userSchema.updateOne(
            {
                _id : mongoose.Types.ObjectId(req.params.id),
                'address.index':index,
            },
            {
                $set : {
                  
                        'address.$.fullName' : req.body.fullName,
                        'address.$.phone'  : req.body.phone,
                        'address.$.country'  : req.body.country,
                        'address.$.state'  : req.body.state,
                        'address.$.city'  : req.body.city,
                        'address.$.address'  : req.body.address,
                   
                },
                
    
            }
           ).then((response)=>{
            console.log(response);
            res.redirect('/view-account')
           })
    },
    checkout : async(req,res)=>{
        
        let userAddresses= await userSchema.findOne({_id : mongoose.Types.ObjectId(req.session.user._id)})
        let userAddress = userAddresses.address
        for(var i=0;i<userAddress.length;i++){
            userAddress[i].index=userAddress[i].index+1
        }        
        //  cartItems to list
        let cartItems = await cartSchema.aggregate([
            {
                $match :{userId:mongoose.Types.ObjectId(req.session.user._id)} 
            },
            {
                $project : {
                    coupon : 1,
                    products : 1,
                }
            },
            {
                $unwind : {
                    path : "$products"
                }
            },
            {
                $project :{
                    item : "$products.item",
                    quantity : "$products.quantity",
                    total : "$products.total",
                    coupon : 1,
                }
            },
            {
                $lookup :{
                    from : 'products',
                    localField : 'item',
                    foreignField : '_id',
                    as : 'product'
                }
            },
            {
                $project : {
                    coupon : 1,
                    item : 1,
                    quantity : 1,
                    total: 1,
                    product : {$arrayElemAt : ["$product",0]}
                }
            }
        ])
       
        let total = await cartSchema.aggregate([
            {
                $match :{userId:mongoose.Types.ObjectId(req.session.user._id)} 
            },
            {
                $project : {
                    products : 1,
                }
            },
            {
                $unwind : {
                    path : "$products"
                }
            },
            {
                $project :{
                    item : "$products.item",
                    quantity : "$products.quantity",
                    total : "$products.total"
                }
            },
            {
                $lookup :{
                    from : 'products',
                    localField : 'item',
                    foreignField : '_id',
                    as : 'product'
                }
            },
            {
                $project : {
                    item : 1,
                    quantity : 1,
                    total :1,
                    product : {$arrayElemAt : ["$product",0]}
                }
            },
            {
                $group :{
                    _id:null,
                    total : {$sum:{$multiply :['$quantity','$product.discount']}}, 
                }
            },
        ])
        if(total[0]){
            total = total[0].total;
        }else{
            total = 0
        }

        let couponCheck = await couponSchema.findOne({code : cartItems[0].coupon})
        let discount
        if(couponCheck){
            if(couponCheck.type=='Percentage'){
                total=total-(total*couponCheck.discountValue)/100
                discount=(total*couponCheck.discountValue)/100
            }else if(couponCheck.type=='Flat Discount'){
                total=total-couponCheck.discountValue
                discount=couponCheck.discountValue
            }else{
            }
        }
        


        res.render('user/checkout',{count:res.count,userWishListCount:res.userWishListCount,userAddress,user:req.session.user,cartItems,total})
    },
    payment : async(req,res)=>{
        let cartItemsCoupon = await cartSchema.findOne({ userId: mongoose.Types.ObjectId(req.session.user._id) })
        let cartItems = await cartSchema.aggregate([
            {
                $match :{userId:mongoose.Types.ObjectId(req.session.user._id)} 
            },
            {
                $project : {
                    products : 1,
                }
            },
            {
                $unwind : {
                    path : "$products"
                }
            },
            {
                $project :{
                    item : "$products.item",
                    quantity : "$products.quantity",
                    total : "$products.total"
                }
            },
            {
                $lookup :{
                    from : 'products',
                    localField : 'item',
                    foreignField : '_id',
                    as : 'product'
                }
            },
            {
                $project : {
                    item : 1,
                    quantity : 1,
                    total: 1,
                    product : {$arrayElemAt : ["$product",0]}
                }
            }  
        ])
       
        let total = await cartSchema.aggregate([
            {
                $match :{userId:mongoose.Types.ObjectId(req.session.user._id)} 
            },
            {
                $project : {
                    products : 1,
                }
            },
            {
                $unwind : {
                    path : "$products"
                }
            },
            {
                $project :{
                    item : "$products.item",
                    quantity : "$products.quantity",
                    total : "$products.total"
                }
            },
            {
                $lookup :{
                    from : 'products',
                    localField : 'item',
                    foreignField : '_id',
                    as : 'product'
                }
            },
            {
                $project : {
                    item : 1,
                    quantity : 1,
                    total :1,
                    product : {$arrayElemAt : ["$product",0]}
                }
            },
            {
                $group :{
                    _id:null,
                    total : {$sum:{$multiply :['$quantity','$product.discount']}}, 
                }
            },
        ])
        if(total[0]){
            total = total[0].total;
        }else{
            total = 0
        }
        let couponCheck = await couponSchema.findOne({ code: cartItemsCoupon.coupon })
                let discount
                if (couponCheck) {
                    if (couponCheck.type == 'Percentage') {
                        total = total - (total * couponCheck.discountValue) / 100
                        discount = (total * couponCheck.discountValue) / 100
                    } else if (couponCheck.type == 'Flat Discount') {
                        total = total - couponCheck.discountValue
                        discount = couponCheck.discountValue
                    } else {
                    }
                }
        index=parseInt(req.query.index)
        let userAddress = await userSchema.aggregate([
            {
                $match :{
                    _id : mongoose.Types.ObjectId(req.session.user._id),
                },
            },
            {
                $project : {
                    address : 1
                }
            },
            {
                $unwind :{
                    path : "$address"
                }
            },
            {
                $match : {
                    'address.index' : index-1
                }
            }
        ])
        userAddress=userAddress[0]
        res.render('user/payment',{count:res.count,userWishListCount:res.userWishListCount,user:req.session.user,cartItems,total,userAddress})
    },
    PlaceAnOrder : async(req,res)=>{
        
        let total = await cartSchema.aggregate([
            {
                $match :{userId:mongoose.Types.ObjectId(req.session.user._id)} 
            },
            {
                $project : {
                    products : 1,
                }
            },
            {
                $unwind : {
                    path : "$products"
                }
            },
            {
                $project :{
                    item : "$products.item",
                    quantity : "$products.quantity",
                    total : "$products.total"
                }
            },
            {
                $lookup :{
                    from : 'products',
                    localField : 'item',
                    foreignField : '_id',
                    as : 'product'
                }
            },
            {
                $project : {
                    item : 1,
                    quantity : 1,
                    total :1,
                    product : {$arrayElemAt : ["$product",0]}
                }
            },
            {
                $group :{
                    _id:null,
                    total : {$sum:{$multiply :['$quantity','$product.discount']}}, 
                }
            },
        ])
        if(total[0]){
            total = total[0].total;
        }else{
            total = 0
        }
        
        let cart=await cartSchema.findOne({userId : mongoose.Types.ObjectId(req.session.user._id)})
        let couponCheck = await couponSchema.findOne({ code: cart.coupon })
        
        let discount
        if (couponCheck) {
            if (couponCheck.type == 'Percentage') {
                total = total - (total * couponCheck.discountValue) / 100
                discount = (total * couponCheck.discountValue) / 100
            } else if (couponCheck.type == 'Flat Discount') {
                total = total - couponCheck.discountValue
                discount = couponCheck.discountValue
            } else {
            }

            await userSchema.updateOne(
                {
                    _id : mongoose.Types.ObjectId(req.session.user._id)
                },
                {
                    $push : {
                        usedCoupons : cart.coupon
                    },
                     $pull : {
                        claimedCoupons : cart.coupon
                     }
                }
            )
            await couponSchema.updateOne(
                {
                    code : cart.coupon
                },
                {
                    $inc : {
                        usedCounts : 1
                    }
                }
            )
        }


        let cartItems =await cart_controller.getCartItems(req.session.user._id);
        let orderId =await order_controller.placeOrder(req.body,cartItems,total,req.session.user._id)
        req.session.total=total
        if(req.body.paymentMethod=='COD'){
            await cartSchema.deleteOne({userId : mongoose.Types.ObjectId(req.session.user._id)})
            res.json(orderId)
        }else{
            let order = await order_controller.generateRazorpay(orderId,total)
            res.json(order)
        }      
    },
    logout : (req,res)=>{
        req.session.destroy()
        res.redirect('/')
    },
}