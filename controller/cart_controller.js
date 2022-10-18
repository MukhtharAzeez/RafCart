const mongoose = require('mongoose');
const cartSchema = require('../models/cart_schema');
const { login } = require('./user_controller');


module.exports = {
    cart : async(req,res)=>{
        if(req.session.user){
            let cartExist = await cartSchema.findOne({userId : mongoose.Types.ObjectId(req.session.user._id)})
            if(cartExist){
                let cartItems = await cartSchema.aggregate([
                    {
                        $match :{userId:mongoose.Types.ObjectId(req.session.user._id)} 
                    },
                    {
                        $project : {
                            products : 1,
                            _id :0
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
                    // {
                    //     $lookup : {
                    //         from : 'products',
                    //         let : {prodList : '$products'},
                    //         pipeline : [
                    //             {
                    //                 $match : {
                    //                     $expr :{
                    //                         $in : ["$_id","$$prodList"]
                    //                     }
                    //                 }
                    //             }
                    //         ],
                    //         as : "cartItems"
                    //     }
                    // }   
                ])
                // cartItems = cartItems[0].cartItems
                res.render('user/shopping-cart',{cartItems,"user":req.session.user})
            }else{
                res.redirect('/shop')   
            }
            
        }else{
            res.redirect('/shop')
        }
        
    },
    addToCart : async(req,res)=>{
        let productObj={
            item :mongoose.Types.ObjectId(req.params.id),
            quantity : 1 
        }
        if(req.session.user){
            let cartExist = await cartSchema.findOne({userId : mongoose.Types.ObjectId(req.session.user._id)})
            if(cartExist){
                let productExist =  cartExist.products.findIndex(product=>product.item==req.params.id)
                if(productExist!=-1){
                  
                    cartSchema.updateOne(
                        {
                            'products.item' : mongoose.Types.ObjectId(req.params.id)
                        },
                        {
                            $inc : {
                                'products.$.quantity':1
                            }
                        }
                    ).then((response)=>{
                        res.json({status:true})
                    })
                }else{
                    cartSchema.updateOne(
                        {
                            userId : mongoose.Types.ObjectId(req.session.user._id)
                        },
                        {
                            $push : {
                                products :productObj
                            }, 
                        },
                        
                    ).then(()=>{
                        res.json({status:true})
                    })
                }
                
            }else{
                const cartItems = new cartSchema({
                    userId : req.session.user._id,
                    products : [productObj],
                })
                
                cartItems.save().then((response)=>{
                    res.json({status:true})
                })
            }
        }else{
            res.redirect('/shop')
        }
        
    },
}