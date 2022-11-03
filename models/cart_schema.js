const mongoose = require('mongoose');
const Schema = mongoose.Schema;

ObjectId = Schema.ObjectId;

const cartSchema = new Schema({
    userId :{
        type : ObjectId,
        required : true,
    },
    products : {
        type : Array,
    },
    coupon : {
        type : String,
    }
    
    
});

module.exports = mongoose.model("cart", cartSchema);
