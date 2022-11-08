const mongoose = require("mongoose");
const Numbers = require("twilio/lib/rest/Numbers");

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
  upperLimit : {
    type: Number,
    required: true,
  },
  lowerLimit : {
    type: Number,
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
  },
  expiryDate : {
    type: Date,
  },
  couponFor : {
    type: Boolean,
  },
  couponType : {
    type: String,
  },
  lowerLimitToGaveCoupon : {
    type: Number,
  },
  upperLimitToGaveCoupon : {
    type: Number,
  },
  orderToReach:  {
    type: Number,
  },
  priceToReach : {
    type: Number,
  },
  usedCounts : {
    type : Number,
  }

});

module.exports = mongoose.model("coupons", couponSchema);
