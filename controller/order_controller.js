const mongoose = require('mongoose');
const orderSchema = require('../models/order_schema')
const Razorpay = require('razorpay');
const cartSchema = require('../models/cart_schema')
const productSchema = require('../models/product_schema')
const couponSchema = require('../models/coupon_schema')
const userSchema = require('../models/user_schema')


var instance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });


    
module.exports = {

    // User Side
    placeOrder : async(address,cartItems,total,userID)=>{
       try {
        let placedOrPending
        
        if(address.paymentMethod=='COD'){
            placedOrPending='placed'
            let coupons=await couponSchema.find({couponType:'fromToTo'})
            for(var i=0;i<coupons.length;i++){
                if(total>=coupons[i].lowerLimitToGaveCoupon && total <= coupons[i].upperLimitToGaveCoupon){
                    await userSchema.updateOne(
                        {
                            _id : mongoose.Types.ObjectId(userID)
                        },
                        {
                            $push : {
                                couponsToClaim : coupons[i].code
                            }
                        }
                    )
                }
            }

        }else{
            placedOrPending='pending'
        }
        address.mobile = parseInt(address.mobile)
        return new Promise (async(resolve, reject) => {
            const userId = userID;
            const {fullName,mobile,addressToDeliver,paymentMethod} = address;
            const status = placedOrPending;
            const products=cartItems;
            const totalPrice=total;
            const purchaseDate = new Date(new Date().getTime()+(5.5*60*60*1000));
            const expectedDeliveryDate = new Date(new Date().getTime()+(8*24*60*60*1000)+(5.5*60*60*1000));
            const order = new orderSchema({
                userId,
                paymentMethod,
                deliveryAddress : [fullName,mobile,addressToDeliver],
                status : status,
                products : products,
                total : totalPrice,
                purchaseDate : purchaseDate,
                expectedDeliveryDate : expectedDeliveryDate
            });
            order
               .save()
               .then((result)=>{
                resolve(result._id)
               })
               .catch((error)=>{
                console.log(error);
               })
        })
       } catch (error) {
        res.redirect('/not-found')
       } 
    },
    generateRazorpay : async(orderId,total)=>{
        try {
            orderId=orderId.toString();
        var options = {
            amount: total*100,  
            currency: "INR",
            receipt: orderId
        };
        try{
            let order = await instance.orders.create(options)
            return order
        }catch(e){
            console.log(e);
        }
        } catch (error) {
            res.redirect('/not-found')
        }

    },
    verifyPayment : async(req,res)=>{
       try {
         
        const crypto = require("crypto");
        const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);

        hmac.update(req.body.paymentDetails.razorpay_order_id + "|" +req.body.paymentDetails.razorpay_payment_id)
        let generatedSignature = hmac.digest('hex');

        let isSignatureValid = generatedSignature == req.body.paymentDetails.razorpay_signature;
        if(isSignatureValid){
            await orderSchema.updateOne(
                {
                    _id : mongoose.Types.ObjectId(req.body.order.receipt)
                },
                {
                    $set : {
                        status : 'placed'
                    }
                }
            )
            await cartSchema.deleteOne({userId : mongoose.Types.ObjectId(req.session.user._id)})
            let coupons=await couponSchema.find({couponType:'fromToTo'})
            for(var i=0;i<coupons.length;i++){
                if(req.session.total>=coupons[i].lowerLimitToGaveCoupon && req.session.total <= coupons[i].upperLimitToGaveCoupon){
                    await userSchema.updateOne(
                        {
                            _id : mongoose.Types.ObjectId(req.session.user._id)
                        },
                        {
                            $push : {
                                couponsToClaim : coupons[i].code
                            },
                            $pull : {
                                claimedCoupons : coupons[i].code
                             }
                        }
                    )
                    await couponSchema.updateOne(
                        {
                            code : cart.coupon
                        },
                        {
                            $inc : {
                                usedCounts : 1
                            }
                        }
                    )
                }
            }
            let orderId=req.body.order.receipt
            res.json(orderId)
        }else{
            res.json({onlinePaymentSuccess:false})
        }
       } catch (error) {
        res.redirect('/not-found')
       }
    },
    orderPlacedSucessFully : async(req,res)=>{
       try {
        let order=await orderSchema.findOne({_id:mongoose.Types.ObjectId(req.query.orderId)})
        console.log(order)
        for(var i=0;i<order.products.length;i++) {
            order.products[i].product._id=order.products[i].product._id.toString()
            await productSchema.updateOne(
                {
                    _id : mongoose.Types.ObjectId(order.products[i].product._id)
                },
                {
                    $inc : {
                        stock:-(order.products[i].quantity)
                    }
                }
            )
            await productSchema.updateMany(
                {
                    stock : 0
                },
                {
                    $set : {
                        onStock : false
                    }
                }
            ).then((result)=>{
                console.log(result)
            })
        }
        res.render('user/order-completed',{"user" : req.session.user,"count":res.count,orderId:req.query.orderId,"userWishListCount":res.userWishListCount})
       } catch (error) {
        res.redirect('/not-found')
       }
    },
    cancelOrder : async(req,res)=>{
        try {
            let order=await orderSchema.findOne({_id:mongoose.Types.ObjectId(req.query.orderId)})
        for(var i=0;i<order.products.length;i++) {
            order.products[i].product._id=order.products[i].product._id.toString()
            await productSchema.updateOne(
                {
                    _id : mongoose.Types.ObjectId(order.products[i].product._id)
                },
                {
                    $inc : {
                        stock:(order.products[i].quantity)
                    }
                }
            )
            await productSchema.updateMany(
                {
                    stock : {$gt : 0}
                },
                {
                    $set : {
                        onStock : true
                    }
                }
            ).then((result)=>{
                console.log(result)
            })
            
        }
        
        await orderSchema.updateOne(
            {
                _id : mongoose.Types.ObjectId(req.query.orderId)
            },
            {
                $set : {
                    status:'order cancelled'
                }
            }
        )
        res.json({status:true})
        } catch (error) {
            res.redirect('/not-found')
        }
    },
    checkForOrders : async(req,res)=>{
        try {
            let orders=await orderSchema.find({userId : mongoose.Types.ObjectId(req.session.user._id)})
        if(orders[0]){
            res.json({status:true})
        }else{
            res.json({status:false})
        }
        } catch (error) {
            res.redirect('/not-found')
        }
    },
    viewCurrentOrder : async(req,res)=>{
        try {
            let order = await orderSchema.aggregate([
                {
                    $match : {
                        _id : mongoose.Types.ObjectId(req.query.orderId)
                    }
                },
                {
                    $unwind : {
                        path : '$products'
                    }
                },
                {
                    $project : {
                        userId : 1,
                        total :1,
                        status :1,
                        purchaseDate : { $dateToString: { format: "%Y-%m-%d", date: "$purchaseDate" } },
                        deliveredDate : { $dateToString: { format: "%Y-%m-%d", date: "$deliveredDate" } },
                        quantity : '$products.quantity',
                        price : '$products.total',
                        product : '$products.product',
                    }
                }
            ])
            if(order[0].status=='placed'){
                order[0].placed=true
            }else if(order[0].status=='shipped'){
                order[0].shipped=true
            }else if(order[0].status=='delivered'){
                order[0].delivered=true
            }
            res.render('user/account-order-details',{order,user:req.session.user,count:res.count,userWishListCount:res.userWishListCount})
        } catch (error) {
            res.redirect('/not-found')
        }
    },
    viewOrders : async(req,res)=>{
        
        try {
            let orders = await orderSchema.aggregate([
                {
                    $match : {
                        userId : mongoose.Types.ObjectId(req.session.user._id)
                    }
                },
                {
                    $project : {
                        userId : 1,
                        total :1,
                        status :1,
                        purchaseDate : { $dateToString: { format: "%Y-%m-%d", date: "$purchaseDate" } },
                        expectedDeliveryDate : { $dateToString: { format: "%Y-%m-%d", date: "$expectedDeliveryDate" } },
                        products : 1,
                        
                    }
                },
            ]).sort({purchaseDate : -1})
            
            for(var i=0;i<orders.length;i++){
                if(orders[i].status=='order cancelled'){
                    orders[i].cancelled = true;
                }else if(orders[i].status=='placed'){
                    orders[i].placed = true;
                }
            }
            
            res.render('user/account-order-history',{orders,user:req.session.user,count:res.count,userWishListCount:res.userWishListCount})
        } catch (error) {
            res.redirect('/not-found')
        }


        
    },
    seeOrderInvoice : async(req,res)=>{
        try {
            let order = await orderSchema.aggregate([
                {
                    $match : {
                        _id : mongoose.Types.ObjectId(req.query.orderId)
                    }
                },
                {
                    $unwind : {
                        path : '$products'
                    }
                },
                {
                    $project : {
                        userId : 1,
                        total :1,
                        status :1,
                        paymentMethod : 1,
                        deliveryAddress: 1,
                        purchaseDate : { $dateToString: { format: "%Y-%m-%d", date: "$purchaseDate" } },
                        quantity : '$products.quantity',
                        price : '$products.total',
                        product : '$products.product',
                    }
                },
                {
                    $lookup : {
                        from : 'users',
                        localField : 'userId',
                        foreignField : '_id',
                        as : 'user'
                    }
                },
               
            ])
            let orderId=order[0]._id.toString().slice(18,24)
            order[0].id=orderId
            res.render('user/order-invoice',{count:res.count,userWishListCount:res.userWishListCount,order,user:req.session.user})
        } catch (error) {
            res.redirect('/not-found')
        }
    },

    // Admin Side
    getAllOrders : async(req,res)=>{
        try {
            let orders=await orderSchema.aggregate([
                {
                    $lookup:{
                        from : 'users',
                        localField : 'userId',
                        foreignField : '_id',
                        as : 'userDetails',
                    },
                },
                {
                    $project : {
                        paymentMethod : 1,
                        total : 1,
                        status : 1,
                        products : 1,
                        purchaseDate : { $dateToString: { format: "%Y-%m-%d", date: "$purchaseDate" } },
                        expectedDeliveryDate : { $dateToString: { format: "%Y-%m-%d", date: "$expectedDeliveryDate" } },
                        userDetails : {$arrayElemAt : ["$userDetails",0]}
                    }
                },
            ]).sort({purchaseDate : -1})
           
            for(var i=0;i<orders.length;i++){
                orders[i].items=orders[i].products.length
                if(orders[i].paymentMethod=='COD'){
                    orders[i].paid=false
                 }else{
                     orders[i].paid=true
                 }
            }
            res.render('admin/app-orders-list',{noHeader:true,noFooter:true,orders});
        } catch (error) {
            res.redirect('/admin/not-found')
        }
    },
    edit_a_product : async(req,res)=>{
        try {
            let orderDetails=await orderSchema.aggregate([
                {
                    $match : {
                        _id : mongoose.Types.ObjectId(req.query.orderId)
                    }
                },
                {
                    $lookup : {
                        from : 'users',
                        localField : 'userId',
                        foreignField : '_id',
                        as : 'userDetails',
                    }
                },
                {
                    $project : {
                        paymentMethod : 1,
                        products :1,
                        total : 1,
                        status : 1,
                        deliveryAddress : 1,
                        userDetails : {$arrayElemAt : ['$userDetails',0]},
                        purchaseDate : { $dateToString: { format: "%Y-%m-%d", date: "$purchaseDate" } },
                        expectedDeliveryDate : { $dateToString: { format: "%Y-%m-%d", date: "$expectedDeliveryDate" } },
                    }
                },
            ])
            // orderDetails=orderDetails[0]
            res.render('admin/app-order',{noHeader:true,noFooter:true,orderDetails})
        } catch (error) {
            res.redirect('/admin/not-found')
        }
    },
    changeCurrentStatus : async(req,res)=>{
        
       try {
        if(req.body.changeStatus=='delivered'){
            let order=await orderSchema.updateOne(
                {
                    _id : mongoose.Types.ObjectId(req.body.orderId),
                },
                {
                    $set : {
                        status : req.body.changeStatus,
                        deliveredDate : new Date(),
                    },
                }
            )
        }else{
            let order=await orderSchema.updateOne(
                {
                    _id : mongoose.Types.ObjectId(req.body.orderId),
                },
                {
                    $set : {
                        status : req.body.changeStatus
                    },
                }
            )
        }
        
       
        res.json({status:true})
       } catch (error) {
        res.json({status : false})
       }
    }
}