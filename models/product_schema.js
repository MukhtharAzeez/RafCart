const mongoose = require('mongoose');

const Schema=mongoose.Schema

const productSchema = new Schema({
    name : {
        type : String,
        required : true,
    },
    category : {
        type : String,
        required : true
    },
    stock : {
        type : Number,
        required : true
    },
    tags : {
        type : String,
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    discount : {
        type : Number,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    onStock : {
        type : Boolean,
        required : true
    },
    images : {
        type : Array,
    },
    isAvailable : {
        type : Boolean,
        required : true
    }
   
})

module.exports =mongoose.model('products',productSchema)