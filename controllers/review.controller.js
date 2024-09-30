const Reviews = require("../models/review.model");
const User = require("../models/user.model")

const createReviews = async (req, res) => {
  try {
    const authenticatedUserId = req.user._id;
    const { rating, content } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: "Invalid rating. Must be between 1 and 5." });
    }

    const user = await User.findById(authenticatedUserId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let review = await Reviews.findOne({ userId: authenticatedUserId });
    let isUpdate = false;

    if (review) {
      review.rating = rating;
      review.content = content;
      isUpdate = true;
    } else {
      review = new Reviews({ userId: authenticatedUserId, rating, content });
    }

    await review.save();

    return res.status(201).json({ success: true, review, isUpdate });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getAllReviews = async (req, res) => {
  try {
    const reviews = await Reviews.find({}).populate("userId", "fullname");
    return res.status(200).json({ success: true, reviews });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createReviews,
  getAllReviews
};
