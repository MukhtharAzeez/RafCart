const userSchema = require('../models/user_schema')
const productSchema = require('../models/product_schema')
const categorySchema = require('../models/category_schema')
const cloudinary = require('../utils/cloudinary');
const multer = require('../utils/multer');
const mongoose = require('mongoose');


var path = require('path');

const category_schema = require('../models/category_schema');
const { request } = require('http');
const { log } = require('console');
const { array } = require('../utils/multer');
module.exports = {

    home : (req,res)=>{
        res.render('admin/index',{noHeader:true,noFooter:true})
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
}