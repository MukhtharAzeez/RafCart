const mongoose = require('mongoose');
const cart_schema = require('../models/cart_schema');
const cartSchema = require('../models/cart_schema');
const { login } = require('./user_controller');
const userController = require('../controller/user_controller')
const productSchema = require('../models/product_schema');




module.exports = {
    
    cart : async(req,res)=>{
        let count = 0;
        if(req.session.user){
            const cart = await cartSchema.findOne({userId: mongoose.Types.ObjectId(req.session.user._id)})
            if(cart){
                count = cart.products.length;
            }
        }
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
                            total : "$products.total"
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
                            total: 1,
                            product : {$arrayElemAt : ["$product",0]}
                        }
                    }
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
                let total = await cartSchema.aggregate([
                    {
                        $match :{userId:mongoose.Types.ObjectId(req.session.user._id)} 
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
                            total : "$products.total"
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
                            total :1,
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
                    total = total[0].total;
                }else{
                    total = 0
                }
                res.render('user/shopping-cart',{cartItems,"user":req.session.user,count,total})
            }else{
                res.redirect('back')   
            }
            
        }else{
           
            res.redirect('/shop')
        }
        
    },
    addToCart : async(req,res)=>{
              
        let product = await productSchema.findOne({_id: mongoose.Types.ObjectId(req.params.id)})
        let productObj={
            item :mongoose.Types.ObjectId(req.params.id),
            quantity : 1 ,
            total:product.discount
        }
        if(req.session.user){
            let cartExist = await cartSchema.findOne({userId : mongoose.Types.ObjectId(req.session.user._id)})
            if(cartExist){
                let productExist =  cartExist.products.findIndex(product=>product.item==req.params.id)
                if(productExist!=-1){
                  
                    // cartSchema.updateOne(
                    //     {
                    //         userId : mongoose.Types.ObjectId(req.session.user._id),
                    //         'products.item' : mongoose.Types.ObjectId(req.params.id)
                    //     },
                    //     {
                    //         $inc : {
                    //             'products.$.quantity':1
                    //         }
                    //     }
                    // ).then((response)=>{
                        res.json({status:false})
                    // })
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
            res.json({status:false})
        }
        
    },
    checkExistProductInCart : async(req,res)=>{
        if(req.session.user){
            
            let product = await cartSchema.findOne({userId:mongoose.Types.ObjectId(req.session.user._id),
                'products.item' : mongoose.Types.ObjectId(req.params.id)},
                
            )
         
            if(product){
                res.json({productExist : true})
            }else{
                res.json({productExist : false})
            }
        }else{
            res.json({userExist : false})
        }
    },
    
    changeCartQuantity : async(req,res)=>{
        
        count = parseInt(req.body.count)
        if(req.body.quantity == 1 && count===-1){
            cart_schema.updateOne(
                {
                    _id:mongoose.Types.ObjectId(req.body.cartId)
                },
                {
                    $pull : {
                        products :{item : mongoose.Types.ObjectId(req.body.productId)},
                    }
                }
            ).then(async()=>{
                
                let total =await userController.getTotalAmount(req.body.productId)
                res.json({status : false,total});
            })
        }else{
            cartSchema.updateOne(
                {
                    _id : mongoose.Types.ObjectId(req.body.cartId),
                    'products.item' : mongoose.Types.ObjectId(req.body.productId)
                },
                {
                    $inc : {
                        'products.$.quantity':count
                    }
                }
            ).then(async(response)=>{
                let total =await userController.getTotalAmount(req.body.productId)
                res.json({status:true,total})
            })
        }
        
        
        
    },
    removeCartItem : async(req,res)=>{
        cart_schema.updateOne(
            {
                _id:mongoose.Types.ObjectId(req.body.cartId)
            },
            {
                $pull : {
                    products :{item : mongoose.Types.ObjectId(req.body.productId)},
                }
            }
        ).then(async()=>{
            
            let total =await userController.getTotalAmount(req.session.user._id)
            
            res.json({status : true,total});
        })
    },
    updateCart : async(req,res)=>{
        total = parseInt(req.body.total)
        await cartSchema.updateOne(
            {
                _id : mongoose.Types.ObjectId(req.body.cartId),
                'products.item' : mongoose.Types.ObjectId(req.body.productId)
            },
            {
                $set : {
                    'products.$.total' : total,
                }
            }
        ).then(()=>{
            res.json({status:true})
        })
    },
    
}