const db = require('../config/connection');
const bcrypt = require('bcrypt');
const userSchema = require('../models/user_schema')
const productSchema = require('../models/product_schema');
const categorySchema = require('../models/category_schema');
const cartSchema = require('../models/cart_schema');
const bannerSchema = require('../models/banner_schema')
const mongoose = require('mongoose');
const { response } = require('express');

const country = require('country-state-city').Country
const state = require('country-state-city').State
const city = require('country-state-city').City


let userSession={}
let code
let indexForAddress =-1
let categoryProducts

module.exports = {
    home : async(req,res)=>{
        const category = await categorySchema.find({}).lean();
        let banners = await bannerSchema.find({}).lean();
        let subBanners
        if(banners.length>=3){
            banners = await bannerSchema.find({}).sort({_id : -1}).skip(2).lean();
            subBanners= await bannerSchema.find({}).sort({_id : -1}).limit(2).lean();
        }
        let count = 0;
        if(req.session.user){
            const cart = await cartSchema.findOne({userId: mongoose.Types.ObjectId(req.session.user._id)})
            if(cart){
                count = cart.products.length;
            }
        }
       
        res.render('user/index-3',{noHeader:true,noFooter:true,"user" : req.session.user,category,count,banners,subBanners});
    },
    login : (req,res)=>{
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
        
        if(user[0]){
            res.redirect('/register')
        }else if(req.body.password !== req.body.confirmPassword){
            res.redirect('/register')
        }else{
            return new Promise (async(resolve, reject) => {
                const userName = req.body.userName;
                const email = req.body.email;
                const phone = req.body.phone;
                const password = await bcrypt.hash(req.body.password,10);

                const user = new userSchema({
                    userName : userName,
                    email : email,
                    phone : phone,
                    password : password,
                    status : true,
                    wishListCount : 0
                });
                req.session.user=user;
                req.session.loggedIn = true;
                userSession=req.session.user
                user
                   .save()
                   .then((result)=>{
                    
                    res.redirect('/')
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
         
            if(result[0]){
                if(result[0].status){
                    bcrypt.compare(req.body.password,result[0].password).then((status)=>{
                        if(status){
                            req.session.user=result[0];
                            req.session.loggedIn = true;
                            userSession=req.session.user
                           res.redirect('/')
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
            
        })
    },
    shop :async (req,res) => {

        let products = await productSchema.find({}).lean()
        let category = await categorySchema.find({}).lean()
       
        
        let count = 0;
        if(req.session.user){
            const cart = await cartSchema.findOne({userId: mongoose.Types.ObjectId(req.session.user._id)})
            if(cart){
                count = cart.products.length;
            }
        }
         
        if(categoryProducts){  
            products=categoryProducts
            res.render('user/shop-grid-2',{products,category,"user":req.session.user,count})        
        }else{
            console.log("kafsjkdljsf");
            res.render('user/shop-grid-2',{products,category,"user":req.session.user,count})
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
        categoryProducts=null
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
        res.render('user/account-manage-address',{user,countries})
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
        indexForAddress=indexForAddress+1;
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
        res.redirect('/view-account')
       })
    },
    editAddress : async (req,res) => {
        let userDetails = await userSchema.findOne({_id : mongoose.Types.ObjectId(req.session.user._id)}).lean()
        index=req.params.index
        userDetails=userDetails.address[index]
        let countries = await country.getAllCountries();
        try {
            res.render('user/account-edit-address',{userDetails,countries,"user":req.session.user,index})
        } catch (error) {
            console.log(error);
        }
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
    logout : (req,res)=>{
        req.session.destroy()
        res.redirect('/')
    }, 
}