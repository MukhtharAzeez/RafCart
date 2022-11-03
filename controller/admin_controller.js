const userSchema = require('../models/user_schema')
const adminSchema = require('../models/admin_schema')
const productSchema = require('../models/product_schema')
const categorySchema = require('../models/category_schema')
const cloudinary = require('../utils/cloudinary');
const multer = require('../utils/multer');
const mongoose = require('mongoose');


var path = require('path');


module.exports = {

    home : (req,res)=>{
            res.render('admin/index',{noHeader:true,noFooter:true})        
    },
    login : async(req,res)=>{
        res.render('admin/auth-sign-in',{noHeader:true,noFooter:true})
    },
    postSignup : async(req,res)=>{
        let adminDetails=await adminSchema.findOne({email:req.body.email,password : req.body.password})
        if(adminDetails){
            req.session.admin=adminDetails
            req.session.adminLoggedIn=true
            res.redirect('/admin')
        }else{
            res.redirect('/admin/admin-auth')
        }
    },
    customers : async (req,res)=>{
        let customers = await userSchema.find({}).lean()
        
        res.render('admin/app-customers-list',{noHeader:true,noFooter:true,customers})
    },
    blockUser : async(req,res)=>{
        let user = await userSchema.findById(req.params.id)
        if(user.status){
            userSchema.updateOne(
                {
                    _id : mongoose.Types.ObjectId(req.params.id)
                },
                {
                    $set : {
                        status : false
                    }
                }
            ).then(()=>{
                res.redirect('/admin/customers')
            })
        }else{
            userSchema.updateOne(
                {
                    _id : mongoose.Types.ObjectId(req.params.id)
                },
                {
                    $set : {
                        status :true
                    }
                }
            ).then(()=>{
                res.redirect('/admin/customers')
            })
        }
        
    },
    logout : async(req,res)=>{
        req.session.destroy();
        res.redirect('/admin')
    },
}