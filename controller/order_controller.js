const mongoose = require('mongoose');
const orderSchema = require('../models/order_schema')

module.exports = {
    placeOrder : (address,cartItems,total,userID)=>{
        address.mobile = parseInt(address.mobile)
        return new Promise (async(resolve, reject) => {
            const userId = userID;
            const fullName = address.fullName;
            const mobile = address.mobile;
            const addressTODeliver = address.address;
            const paymentMethod = address.paymentMethod;
            const status = 'placed';
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
                resolve()
               })
               .catch((error)=>{
                console.log(error);
               })
        })
        
    },
    orderPlacedSucessFully : async(req,res)=>{
        res.render('user/order-completed')
    },
}