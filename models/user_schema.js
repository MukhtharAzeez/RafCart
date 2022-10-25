const mongoose = require('mongoose');

const Schema=mongoose.Schema

const userSchema = new Schema({
    userName : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    phone : {
        type : Number,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    status : {
        type : Boolean,
        required : true
    },
    address : {
        type : Array,
    },
    gender: {
        type : String,
    },
    wishListProducts : {
        type : Array,
    },
    wishListCount : {
        type : Number,
    }
   
})

module.exports =mongoose.model('User',userSchema)