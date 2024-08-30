const Reviews = require("../models/review.model");

const createReviews = async (req, res) => {
  try {
    const reviews = new Reviews(req.body);
    await reviews.save();
    res.status(201).json(reviews);
  } catch (error) {
    res.status(500).json({message: error.message})
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