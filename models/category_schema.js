const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  cloudinary_id: {
    type : String,
    required: true,
  },
  count : {
    type: Number,
    required: true,
  }
});

module.exports = mongoose.model("catogeries", categorySchema);
