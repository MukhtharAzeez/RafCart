const db = require('../config/connection');
const bcrypt = require('bcrypt');
const userSchema = require('../models/user_schema')
const productSchema = require('../models/product_schema');
const categorySchema = require('../models/category_schema');
const cartSchema = require('../models/cart_schema');
const mongoose = require('mongoose');
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
            
            bcrypt.compare(req.body.password,result[0].password).then((status)=>{
                if(status){
                    req.session.user=result[0];
                    req.session.loggedIn = true;
                    
                   res.redirect('/')
                }else{
                   res.redirect('/login')
                }
            })
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
    logout : (req,res)=>{
        req.session.destroy()
        res.redirect('/')
    },
    getCategoryProduct : async(req,res)=>{
        let products= await productSchema.find({name : req.params.name}).lean()
    },
    
}