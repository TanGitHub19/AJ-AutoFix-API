const express = require("express");
const reviewRouter = express.Router();
const auth = require("../middleware/auth");
const {createReviews, getAllReviews} = require("../controllers/review.controller");

reviewRouter.post("/reviews", auth, createReviews);

reviewRouter.get("/reviews", getAllReviews);

module.exports = reviewRouter;