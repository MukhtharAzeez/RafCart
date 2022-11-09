const mongoose = require('mongoose');
const Schema = mongoose.Schema;

ObjectId = Schema.ObjectId;

const reviewSchema = new Schema({
    userId :{
        type : ObjectId,
        required : true,
    },
    reviews : {
        type : Array,
    },
});

module.exports = mongoose.model("review", reviewSchema);
