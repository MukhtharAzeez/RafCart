const productSchema = require('../models/product_schema')
const userSchema = require('../models/user_schema')
const mongoose = require('mongoose');


module.exports = {
    wishlist : async(req,res)=>{
        let wishListProducts = await userSchema.aggregate([
            {
                $match :{
                    _id : mongoose.Types.ObjectId(req.session.user._id)
                }
            },
            {
                $project :{
                    wishListProducts : 1
                }
            },
            {
                $unwind : {
                    path : "$wishListProducts"
                } 
            },
            {
                $lookup : {
                    from : 'products',
                    localField : 'wishListProducts',
                    foreignField : '_id',
                    as : 'product'
                }
            },
            {
                $project : {
                    product:{ $arrayElemAt:['$product',0] }
                }
            }
        ])
        let userDetails = await userSchema.findOne({_id : mongoose.Types.ObjectId(req.session.user._id)})
        res.render('user/wish-list.hbs',{wishListProducts,userDetails})
    },
    addToWishList : async(req,res)=>{
        console.log(req.params.id);
        if(req.session.user){
            let productExist=await userSchema.findOne(
                {
                    _id : mongoose.Types.ObjectId(req.session.user._id),
                    wishListProducts : mongoose.Types.ObjectId(req.params.id)
                }
            )
            if(productExist){
                res.json({productExist:true})
            }else{
               await userSchema.updateOne(
                {
                    _id : mongoose.Types.ObjectId(req.session.user._id)
                },
                {
                    $push : {
                        wishListProducts : mongoose.Types.ObjectId(req.params.id)
                    },
                    $inc : {
                        wishListCount : 1
                    }
                    
                }
                ).then(()=>{
                   res.json({status : true})
                }) 
            }
            
        }else{
            res.json({status:false})
        }
    },
    removeFromWishList : async(req,res)=>{
        console.log(req.params.id);
        await userSchema.updateOne(
            {
                _id : mongoose.Types.ObjectId(req.session.user._id),
            },
            {
                $pull : {
                    wishListProducts : mongoose.Types.ObjectId(req.params.id)
                },
                $inc :{
                    wishListCount : -1
                }
            }
        ).then(()=>{
            res.json({status:true})
        })
        
    },
}