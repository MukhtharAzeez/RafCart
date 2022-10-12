const userSchema = require('../models/user_schema')
const productSchema = require('../models/product_schema')
const categorySchema = require('../models/category_schema')
const mongoose = require('mongoose');


var path = require('path');
const { log } = require('console');
const { accessSync } = require('fs');
const category_schema = require('../models/category_schema');
module.exports = {

    home : (req,res)=>{
        res.render('admin/index',{noHeader:true,noFooter:true})
    },
    customers : async (req,res)=>{
        let customers = await userSchema.find({}).lean()
        
        res.render('admin/app-customers-list',{noHeader:true,noFooter:true,customers})
    },
    products : async(req,res)=>{
        let products = await productSchema.find({}).lean()
        res.render('admin/app-products-list',{noHeader:true,noFooter:true,products})
    },
    add_product : async(req,res)=>{
        let category = await categorySchema.find({}).lean()
        res.render('admin/add-product',{noHeader:true,noFooter:true,category})
    },
    add_a_product : async(req,res)=>{
     
        let productExist = await productSchema.findOne({name : req.body.name})
        
        if(productExist){
            res.redirect('/admin/add-product')
        }else if(req.files){
            
            const product = new productSchema({
                name : req.body.name,
                category : req.body.category,
                stock : req.body.stock,
                tags : req.body.tags,
                price : req.body.price,
                discount : req.body.discount_price,
                description : req.body.description
            });
            
            product
                .save()
                .then(async(result)=>{
                    
                    let image = req.files.thumbnail_image;
                    await image.mv('./public/product_images/'+result.id+'.jpg',(err,done)=>{
                        if(!err){
                            res.redirect('/admin/products')
                        }else{
                            console.log(err);
                        }
                    })
                   
                })
                .catch((error)=>{
                    console.log(error);
                })
         }else{
            res.redirect('/admin/add-product')
         }
    },
    edit_product : async(req,res)=>{
        let products=await productSchema.findById(req.params.id).lean()
        let category = await categorySchema.find({}).lean()
        res.render('admin/edit-products',{noHeader:true,noFooter:true,products,category})
    },
    edit_a_product : async(req,res) => {
            productSchema.updateOne(
                {
                    _id : mongoose.Types.ObjectId(req.params.id)
                },
                {
                    $set : {
                            name : req.body.name,
                            category : req.body.category,
                            stock : req.body.stock,
                            tags : req.body.tags,
                            price : req.body.price,
                            discount : req.body.discount_price,
                            description : req.body.description
                    }
                }
            ).then((result)=>{
                res.redirect('/admin/products')
            })
    },
    categories : async(req,res)=>{
        let category = await categorySchema.find({}).lean()
        res.render('admin/app-categories-list',{noHeader:true,noFooter:true,category})
    },
    add_category : (req,res)=>{
        res.render('admin/add-category',{noHeader:true,noFooter:true})
    },
    add_a_category : async(req,res)=>{
        let category = await categorySchema.findOne({name : req.body.name})
       
        if(category){
            
            res.redirect('/admin/add-category')
        }else {   
            const category = new categorySchema({
                name : req.body.name,
            });
            category
                .save()
                .then((result)=>{
                   res.redirect('/admin/categories')
                })
                .catch((error)=>{
                    console.log(error);
                })
         }
    },
    edit_category : async(req,res)=>{
        let category = await categorySchema.findById(req.params.id).lean();
        res.render('admin/edit-category',{noHeader:true,noFooter:true,category});
    },
    edit_a_category : async(req,res) => {
        categorySchema.updateOne(
            {
                _id : mongoose.Types.ObjectId(req.params.id)
            },
            {
                $set : {
                        name : req.body.name,
                }
            }
        ).then((result)=>{
            res.redirect('/admin/categories')
        })
    },
    delete_product : (req,res)=>{
        console.log(req.params.id);
        productSchema.deleteOne({_id : req.params.id}).then(()=>{
            res.redirect('/admin/products')
        })
    },
    delete_category : (req,res)=>{
        console.log(req.params.id);
        categorySchema.deleteOne({_id : req.params.id}).then(()=>{
            res.redirect('/admin/categories')
        })
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
        
    }
}