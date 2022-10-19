const db = require('../config/connection');
const bcrypt = require('bcrypt');
const userSchema = require('../models/user_schema')
const productSchema = require('../models/product_schema');
const categorySchema = require('../models/category_schema');
const cartSchema = require('../models/cart_schema');
const mongoose = require('mongoose');

const country = require('country-state-city').Country
const state = require('country-state-city').State
const city = require('country-state-city').City

module.exports = {
    home : async(req,res)=>{
        const category = await categorySchema.find({}).lean();
        let count = 0;
        if(req.session.user){
            const cart = await cartSchema.findOne({userId: mongoose.Types.ObjectId(req.session.user._id)})
            if(cart){
                count = cart.products.length;
            }
        }
       
        res.render('user/index-3',{noHeader:true,noFooter:true,"user" : req.session.user,category,count});
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
                    status : true
                });
                req.session.user=user;
                req.session.loggedIn = true;
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
    postLogin : (req,res)=>{
        userSchema.find({email:req.body.email}).then((result)=>{
         
            if(result[0]){
                if(result[0].status){
                    bcrypt.compare(req.body.password,result[0].password).then((status)=>{
                        if(status){
                            req.session.user=result[0];
                            req.session.loggedIn = true;
                            
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
        res.render('user/shop-grid-2',{products,category,"user":req.session.user,count})
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
        let products= await productSchema.find({name : req.params.name}).lean()
    },
    getTotalAmount : async function (id) {
        try {
            let total = await cartSchema.aggregate([
                {
                    $match :{userId:mongoose.Types.ObjectId(id)} 
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
            if(total[0]){
                console.log(total);
                return total[0].total;
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
        let userDetails = await userSchema.findOne({_id : mongoose.Types.ObjectId(req.session.user._id)}).lean()
        res.render('user/account',{userDetails,"user":req.session.user})
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
        res.render('user/account-manage-address',{"user":req.session.user,countries})
    },
    getAllStates: async(req,res)=>{
        let states = await state.getAllStates();
        res.json(states)
    },
    logout : (req,res)=>{
        req.session.destroy()
        res.redirect('/')
    }, 
}