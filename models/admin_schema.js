const mongoose = require('mongoose');

const Schema=mongoose.Schema

const adminSchema = new Schema({
    adminName : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : Number,
        required : true
    },
    
   
})

module.exports =mongoose.model('admin',adminSchema)