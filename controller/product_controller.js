const userSchema = require('../models/user_schema')
const productSchema = require('../models/product_schema')
const categorySchema = require('../models/category_schema')
const reviewSchema = require('../models/review_schema')
const cloudinary = require('../utils/cloudinary');
const multer = require('../utils/multer');
const mongoose = require('mongoose');




module.exports={

    products : async(req,res)=>{
        let products
        if(req.query.category){
             products = await productSchema.find({isAvailable : true,category:req.query.category}).lean()
        }else{
             products = await productSchema.find({isAvailable : true}).lean()
        }
        res.render('admin/app-products-list',{noHeader:true,noFooter:true,products})
    },
    deleted_products : async(req,res)=>{
        let products = await productSchema.find({isAvailable : false}).lean()
        res.render('admin/product-deleted-list',{noHeader:true,noFooter:true,products})
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
            await categorySchema.updateOne(
                {
                    name : req.body.category
                },
                {
                    $inc:{count: 1 } 
                }
            )
            let result;
            let arr=[];
            try{
             for(var i=0;i<req.files.length;i++){
                result = await cloudinary.uploader.upload(req.files[i].path,{
                    folder :'La Bonnz',
                    use_filename :true,
                });
                let image = req.files[i].fieldname;
                arr.push({
                    // [image] : result.secure_url,
                    image : result.secure_url,
                    cloudinary_id:result.public_id
                })
             }
            }catch(err){
                console.log(err);
            }
            
            if(req.body.stock>0){
                onStock = true;
            }else{
                onStock = false;
            }
            const product = new productSchema({
                name : req.body.name,
                category : req.body.category,
                stock : req.body.stock,
                tags : req.body.tags,
                price : req.body.price,
                discount : req.body.discount_price,
                description : req.body.description,
                onStock : onStock,
                isAvailable : true,
                images : arr
    
            });
            
            product
                .save()
                .then(async(result)=>{
                    res.redirect('/admin/products')
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
        if(products.isAvailable){
            res.render('admin/edit-products',{noHeader:true,noFooter:true,products,category})
        }else{
            res.redirect('/admin/products');
        }
        
    },
    edit_a_product : async(req,res) => {
        let products=await productSchema.findById(req.params.id) 
        
        if(req.file){
            for(var i=0;i<products.images.length;i++){
                await cloudinary.uploader.destroy(products.images[i].cloudinary_id)  
            }
        }
        
        let arr=[]
        let result;
           
            try{
             for(var i=0;i<req.files.length;i++){
                result = await cloudinary.uploader.upload(req.files[i].path,{
                    folder :'La Bonnz',
                    use_filename :true,
                });
                let image = req.files[i].fieldname;
                arr.push({
                    // [image] : result.secure_url,
                    image : result.secure_url,
                    cloudinary_id:result.public_id
                })
             }
            }catch(err){
                console.log(err);
            }
        
                    
                 if(req.body.stock>0){
                     onStock = true;
                 }else{
                     onStock = false;
                 }
            if(req.files[0]){
                // await categorySchema.updateOne(
                //     {
                //         name : req.body.category
                //     },
                //     {
                //         $inc:{count: 1 } 
                //     }
                // )
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
                                description : req.body.description,
                                onStock : onStock,
                                images : arr
                        }
                    }
                ).then((result)=>{
                    res.redirect('/admin/products')
                })
            }else{
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
                                description : req.body.description,
                                onStock : onStock,
                                
                        }
                    }
                ).then((result)=>{
                    res.redirect('/admin/products')
                })
            }
            
    },
    delete_product : async(req,res)=>{
        productSchema.updateOne(
            {
                _id : req.params.id
            },
            {
                $set : {
                    stock : 0,
                    onStock : false,
                    isAvailable : false
                }
            }
            ).then(()=>{
            res.redirect('/admin/products')
        })
    },
    undo_product : async(req,res)=>{
        productSchema.updateOne(
            {
                _id : req.params.id
            },
            {
                $set : {
                    isAvailable : true
                }
            }
            ).then(()=>{
            res.redirect('/admin/show-deleted')
        })
    },
    checkStockLeft : async(req,res)=>{
       let product=await productSchema.findOne({_id:mongoose.Types.ObjectId(req.body.productId)})
       if(req.body.count==1){
        if(product.stock>req.body.quantity){
            res.json({status:true})
           }else{
            res.json({status:false})
           }
       }else{
        res.json({status:true})
       }
       
    },
    viewSingleProduct : async(req,res) => {
        let product = await productSchema.findOne({_id : mongoose.Types.ObjectId(req.query.productId)}).lean()
        let review = await reviewSchema.aggregate([
            {
                $unwind : {
                    path : "$reviews"
                }
            },
            {
                $match : {
                    'reviews.productId' : mongoose.Types.ObjectId(req.query.productId)
                }
            }
        ])
        // let counts = await reviewSchema.aggregate([
        //     {
        //         $unwind : {
        //             path : "$reviews"
        //         }
        //     },
        //     {
        //         $match : {
        //             'reviews.productId' : mongoose.Types.ObjectId(req.query.productId)
        //         }
        //     },{
        //         $group : {
        //             _id : {
        //                 $sum : 'review.rating'
        //             }
        //         }
        //     }
        // ])
       
      
        length=review.length
        res.render('user/product-view',{product,review,length,"count":res.count,"userWishListCount":res.userWishListCount})
    },
}


