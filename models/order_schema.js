const mongoose = require('mongoose');

const Schema=mongoose.Schema

const orderSchema = new Schema({
    userId : {
        type : ObjectId,
        required : true
    },
    paymentMethod : {
        type : String,
        required : true
    },
    products : {
        type : Array,
        required : true
    },
    total : {
        type : Number,
        required : true
    },
    status : {
        type : String,
        required : true
    },
    deliveryAddress : {
        type : Array,
        required : true
    },
    date: {
        type : Date,
    }, 
})

module.exports =mongoose.model('order',orderSchema)