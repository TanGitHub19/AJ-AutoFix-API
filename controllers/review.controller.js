const Reviews = require("../models/review.model");
const User = require("../models/user.model")

const createReviews = async (req, res) => {
  try {
    const { userId, rating, content } = req.body; 

    const user = await User.findById(userId); 
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const existingReview = await Reviews.findOne({ userId });
    if (existingReview) {
      return res.status(400).json({ message: "User has already submitted a review" });
    }

    const review = new Reviews({ userId, rating, content });
    await review.save(); 
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message }); 
  }
};

const getAllReviews = async (req, res) => {
    try {
        const reviews = await Reviews.find({});
        res.status(200).json(reviews)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

module.exports = {
    createReviews,
    getAllReviews
}