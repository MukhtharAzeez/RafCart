const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const couponSchema = new Schema({
  code: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  discountValue: {
    type : Number,
  },
  usageLimit : {
    type : Number,
    required: true,
  },
  status : {
    type: Boolean,
    required: true,
  },
  isFinished : {
    type: Boolean,
    required: true,
  },
  startDate : {
    type: Date,
    required: true,
  },
  expiryDate : {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("coupons", couponSchema);
