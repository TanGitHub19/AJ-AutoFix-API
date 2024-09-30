const mongoose = require("mongoose");
const User = require('../models/user.model');

const reviewsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    validate: {
      validator: async function (value) {
        return User.exists({ _id: value });
      },
      message: "User not found"
    }
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  content: {
    type: String,
    required: true,
  },
});

const Review = mongoose.model("Review", reviewsSchema);

module.exports = Review;
