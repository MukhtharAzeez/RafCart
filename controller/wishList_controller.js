const productSchema = require('../models/product_schema')
const userSchema = require('../models/user_schema')
const mongoose = require('mongoose');


module.exports = {
    wishlist : async(req,res)=>{
        try {
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
            res.render('user/wish-list.hbs',{wishListProducts,userDetails,"count":res.count,"userWishListCount":res.userWishListCount})
        } catch (error) {
            res.redirectt('/not-found')
        }
    },
    addToWishList : async(req,res)=>{
       try {
        if(req.session.user){
            let productExist=await userSchema.findOne(
                {
                    _id : mongoose.Types.ObjectId(req.session.user._id),
                    wishListProducts : mongoose.Types.ObjectId(req.params.id)
                },
            )
            
            if(productExist){
                await userSchema.updateOne(
                    {
                        _id : mongoose.Types.ObjectId(req.session.user._id),
                        wishListProducts : mongoose.Types.ObjectId(req.params.id)
                    },
                    {
                        $pull : {
                            wishListProducts : mongoose.Types.ObjectId(req.params.id)
                        }
                    }
                ).then(()=>{
                    res.json({productExist:true})
                })
                
            }else{
               await userSchema.updateOne(
                {
                    _id : mongoose.Types.ObjectId(req.session.user._id)
                },
                {
                    $push : {
                        wishListProducts : mongoose.Types.ObjectId(req.params.id)
                    },
                }
                ).then(()=>{
                   res.json({status : true})
                }) 
            }
            
        }else{
            res.json({status:false})
        }
       } catch (error) {
        res.redirect('/not-found')
       }
    },
    removeFromWishList : async(req,res)=>{
       try {
        await userSchema.updateOne(
            {
                _id : mongoose.Types.ObjectId(req.session.user._id),
            },
            {
                $pull : {
                    wishListProducts : mongoose.Types.ObjectId(req.params.id)
                },
            }
        ).then(()=>{
            res.json({status:true})
        })
       } catch (error) {
        res.redirect('/not-found')
       }
        
    },
}