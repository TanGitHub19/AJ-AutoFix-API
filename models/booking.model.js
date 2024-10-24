const mongoose = require("mongoose");
const User = require("./user.model");

const bookingSchema = new mongoose.Schema(
  {
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
        "Power Window Motor Installation",
        "Power Window Cable Replacement",
        "Powerlock (1pc) Installation",
        "Powerlock Set Installation",
        "Door Lock Replacement",
        "Door Handle Replacement",
        "Door Lock Repair Service",
        "Door Handle Repair Service",
        "Coolant Flush Service",
        "Engine Change Oil Service",
        "Spark Plug Replacement",
        "Air Filter Replacement",
        "Fuel Injector Cleaning Service",
        "Timing Belt Replacememt",
        "Tire Replacement Service",
        "Wheel Alignment Service",
        "Brake Pad Set Replacememt",
        "Brake Fluid Replacememt",
        "Alternator Repair Sevice",
        "Fuse Replacement Sevice",
        "Car Alarm Installation",
        "Battery Replacement Service",
        "HeadLight Bulb Replacement",
        "Power Window Switch Replacement",
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
      enum: ["Pending", "Approved", "Rejected", "Completed", "Canceled"],
      default: "Pending",
    },
    viewedByUser: {
      type: Boolean,
      default: false,
    },
    viewedByAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
