const mongoose = require('mongoose');
const orderSchema = require('../models/order_schema')
const Razorpay = require('razorpay');
const cartSchema = require('../models/cart_schema')
const productSchema = require('../models/product_schema')

var instance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

module.exports = {
    placeOrder : (address,cartItems,total,userID)=>{
        let placedOrPending
        if(address.paymentMethod=='COD'){
            placedOrPending='placed'
        }else{
            placedOrPending='pending'
        }
        address.mobile = parseInt(address.mobile)
        return new Promise (async(resolve, reject) => {
            const userId = userID;
            const fullName = address.fullName;
            const mobile = address.mobile;
            const addressTODeliver = address.address;
            const paymentMethod = address.paymentMethod;
            const status = placedOrPending;
            const products=cartItems;
            const totalPrice=total;
            const purchaseDate = new Date(new Date().getTime()+(5.5*60*60*1000));
            const expectedDeliveryDate = new Date(new Date().getTime()+(8*24*60*60*1000)+(5.5*60*60*1000));
            const order = new orderSchema({
                userId:userId,
                paymentMethod : paymentMethod,
                deliveryAddress : [fullName,mobile,addressTODeliver],
                status : status,
                products : products,
                total : totalPrice,
                purchaseDate : purchaseDate,
                expectedDeliveryDate : expectedDeliveryDate
            });
            console.log(new Date(expectedDeliveryDate))
            order
               .save()
               .then((result)=>{
                resolve(result._id)
               })
               .catch((error)=>{
                console.log(error);
               })
        })
        
    },
    generateRazorpay : async(orderId,total)=>{
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

    },
    verifyPayment : async(req,res)=>{
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
            let orderId=req.body.order.receipt
            res.json(orderId)
        }else{
            res.json({onlinePaymentSuccess:false})
        }
    },
    orderPlacedSucessFully : async(req,res)=>{
        let productIds=[]
        let quantities=[]
        let order=await orderSchema.findOne({_id:mongoose.Types.ObjectId(req.query.orderId)})
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
            ).then((res)=>{
                console.log(res)
            })
        }
        res.render('user/order-completed',{"user" : req.session.user,"count":res.count,orderId:req.query.orderId,"userWishListCount":res.userWishListCount})
    },
    viewCurrentOrder : async(req,res)=>{
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
                    date : { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                    quantity : '$products.quantity',
                    price : '$products.total',
                    product : '$products.product',
                }
            }
        ])
        res.render('user/account-placed-order-history',{order,user:req.session.user,count:res.count,userWishListCount:res.userWishListCount})
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
                }
            ])
            console.log(orders)
            res.render('user/account-order-history',{orders,user:req.session.user,count:res.count,userWishListCount:res.userWishListCount})
        } catch (error) {
            
        }


        
    },
}