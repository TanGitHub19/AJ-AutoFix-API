const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  serviceType: {
    type: String,
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
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "rejected"],
    default: "pending",
  },
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;