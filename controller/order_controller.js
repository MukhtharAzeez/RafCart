const mongoose = require('mongoose');
const orderSchema = require('../models/order_schema')
const Razorpay = require('razorpay');
const cartSchema = require('../models/cart_schema')

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
            const date = new Date();

            const order = new orderSchema({
                userId:userId,
                paymentMethod : paymentMethod,
                deliveryAddress : [fullName,mobile,addressTODeliver],
                status : status,
                products : products,
                total : totalPrice,
                date : date
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
        res.render('user/order-completed',{"user" : req.session.user,"count":res.count,orderId:req.query.orderId,"userWishListCount":res.userWishListCount})
    },
    viewCurrentOrder : async(req,res)=>{
        let order = await orderSchema.findOne({_id : mongoose.Types.ObjectId(req.query.orderId)})
        res.render('user/account-placed-order-history',{user:req.session.user,count:res.count,userWishListCount:res.userWishListCount})
    },
    viewOrders : async(req,res)=>{
        
        try {
            let user= await orderSchema.findOne({userId : mongoose.Types.ObjectId(req.session.user._id)})
            res.render('user/account-order-history',{user:req.session.user,count:res.count,userWishListCount:res.userWishListCount})
        } catch (error) {
            
        }


        
    },
}