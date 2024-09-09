const mongoose = require("mongoose");
const User = require("./user.model")

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    validate: {
      validator: async function (value) {
        return User.exists({ _id: value });
      },
      message: "User not found",
    },
  },
  serviceType: {
    type: [String],
    required: true,
    enum: [
      "Oil Change",
      "Brake Inspection",
      "Battery Replacement",
      "Engine Tune-Up",
      "Transmission Service",
      "Air Filter Replacement",
      "AC Service",
      "Suspension Check",
      "Wiper Replacement",
      "Headlight Restoration",
      "Wheel Balancing",
    ],
  },
  vehicleType: {
    type: String,
    required: true,
    trim: true,
  },
  time: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;