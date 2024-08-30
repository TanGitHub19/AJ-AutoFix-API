const express = require("express");
const reviewRouter = express.Router();
const {createReviews, getAllReviews} = require("../controllers/review.controller");

reviewRouter.post("/reviews", createReviews);

reviewRouter.get("/reviews", getAllReviews);

module.exports = reviewRouter;