const Booking = require("../models/booking.model");
const mongoose = require("mongoose");
const User = require("../models/user.model");
const { notification } = require("../services/notification");

const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid booking ID format" });
    }
    const booking = await Booking.findById(id).populate("userId", "fullname");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const formattedBooking = {
      id: booking._id,
      userId: booking.userId ? booking.userId._id : null,
      user: booking.userId
        ? {
            fullname: booking.userId.fullname,
          }
        : null,
      serviceType: booking.serviceType,
      vehicleType: booking.vehicleType,
      time: booking.time,
      date: booking.date,
      status: booking.status,
    };

    res.status(200).json(formattedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllBooking = async (req, res) => {
  try {
    const bookings = await Booking.find({}).populate("userId", "fullname");

    const getBookings = bookings.map((booking) => ({
      id: booking._id,
      userId: booking.userId ? booking.userId._id : null,
      user: booking.userId
        ? {
            fullname: booking.userId.fullname,
          }
        : null,
      serviceType: booking.serviceType,
      vehicleType: booking.vehicleType,
      time: booking.time,
      date: booking.date,
      status: booking.status,
    }));

    res.status(200).json(getBookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserBookings = async (req, res) => {
  try {
    const authenticatedUserId = req.user._id; 

    const bookings = await Booking.find({ userId: authenticatedUserId }).populate("userId", "fullname");

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found for this user" });
    }

    const formattedBookings = bookings.map((booking) => ({
      id: booking._id,
      userId: booking.userId ? booking.userId._id : null,
      user: booking.userId
        ? {
            fullname: booking.userId.fullname,
          }
        : null,
      serviceType: booking.serviceType,
      vehicleType: booking.vehicleType,
      time: booking.time,
      date: booking.date,
      status: booking.status,
    }));

    res.status(200).json(formattedBookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getAllPendingBooking = async (req, res) => {
  try {
    const bookings = await Booking.find({ status: "Pending" }).populate(
      "userId",
      "fullname"
    );
    const pendingBookings = bookings.map((booking) => ({
      id: booking._id,
      userId: booking.userId ? booking.userId._id : null,
      user: booking.userId
        ? {
            fullname: booking.userId.fullname,
          }
        : null,
      serviceType: booking.serviceType,
      vehicleType: booking.vehicleType,
      time: booking.time,
      date: booking.date,
      status: booking.status,
    }));

    res.status(200).json(pendingBookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllAcceptedBooking = async (req, res) => {
  try {
    const bookings = await Booking.find({ status: "Approved" }).populate(
      "userId",
      "fullname"
    );
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllAcceptedBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const bookings = await Booking.find({
      _id: id,
      status: "Approved",
    }).populate("userId", "fullname");
    if (bookings.length === 0) {
      return res
        .status(404)
        .json({ message: "No accepted booking found with this ID" });
    }
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createBooking = async (req, res) => {
  try {
    const authenticatedUserId =  req.user._id;
    const bookingData = req.body;

    const user = await User.findById(authenticatedUserId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const booking = new Booking({
      userId: authenticatedUserId,
      ...bookingData,
    });
    await booking.save();

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByIdAndUpdate(id, req.body, {
      new: true,
    }).populate("userId", "fullname");
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json({ message: "Booking updated successfully", booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByIdAndDelete(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const acceptBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByIdAndUpdate(
      id,
      { status: "Approved" },
      { new: true }
    ).populate("userId", "fullname");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    const acceptedBooking = {
      id: booking._id,
      userId: booking.userId ? booking.userId._id : null,
      user: booking.userId
        ? {
            fullname: booking.userId.fullname,
          }
        : null,
      serviceType: booking.serviceType,
      vehicleType: booking.vehicleType,
      time: booking.time,
      date: booking.date,
      status: booking.status,
    };

    const { fullname: userFullName } = booking.userId;
    const userExternalId = booking.userId._id.toString();

    await notification(
      `Hello ${userFullName}, your booking has been approved!`,
      userExternalId
    );

    res.status(200).json({ message: "Booking accepted", booking: acceptedBooking });
  } catch (error) {
    console.error(
      "Error sending notification:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ message: "Internal server error" });
  }
};


const rejectBooking = async (req, res) => {
  try {
    const { id } = req.params;
    
    const booking = await Booking.findByIdAndUpdate(
      id,
      { status: "Rejected" },
      { new: true }
    ).populate("userId", "fullname");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const rejectedBooking = {
      id: booking._id,
      userId: booking.userId ? booking.userId._id : null,
      user: booking.userId
        ? {
            fullname: booking.userId.fullname,
          }
        : null,
      serviceType: booking.serviceType,
      vehicleType: booking.vehicleType,
      time: booking.time,
      date: booking.date,
      status: booking.status,
    };

    res.status(200).json({ message: "Booking rejected", booking: rejectedBooking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  getUserBookings,
  getAllPendingBooking,
  getBookingById,
  getAllBooking,
  createBooking,
  updateBooking,
  deleteBooking,
  acceptBooking,
  rejectBooking,
  getAllAcceptedBooking,
  getAllAcceptedBookingById,
};
