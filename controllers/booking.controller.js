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
      createdAt: booking.createdAt,
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
    const acceptedBooking = bookings.map((booking) => ({
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
    res.status(200).json(acceptedBooking);
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
    const authenticatedUserId = req.user._id;
    const { serviceType, vehicleType, time, date, status } = req.body;

    const user = await User.findById(authenticatedUserId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const existingBooking = await Booking.findOne({
      time,
      date,
      status: { $nin: ["Rejected", "Completed", "Canceled"] },
    });
    if (existingBooking) {
      return res.status(400).json({
        message:
          "The selected time is already occupied. Please choose another time.",
      });
    }

    const booking = new Booking({
      userId: authenticatedUserId,
      serviceType,
      vehicleType,
      time,
      date,
      status,
    });

    await booking.save();

    res.status(201).json({
      id: booking._id,
      userId: booking.userId,
      serviceType: booking.serviceType,
      vehicleType: booking.vehicleType,
      time: booking.time,
      date: booking.date,
      status: booking.status,
      createdAt: booking.createdAt,
    });
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

    res
      .status(200)
      .json({ message: "Booking accepted", booking: acceptedBooking });
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

    res
      .status(200)
      .json({ message: "Booking rejected", booking: rejectedBooking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserBookings = async (req, res) => {
  try {
    const authenticatedUserId = req.user._id;

    const bookings = await Booking.find({
      userId: authenticatedUserId,
    }).populate("userId", "fullname");

    if (!bookings || bookings.length === 0) {
      return res
        .status(404)
        .json({ message: "No bookings found for this user" });
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

const completedBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByIdAndUpdate(
      id,
      { status: "Completed", viewedByUser: false },
      { new: true }
    ).populate("userId", "fullname");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status !== "Completed") {
      return res
        .status(400)
        .json({ message: "Booking was not approved before completing" });
    }

    const completedBooking = {
      id: booking._id,
      userId: booking.userId ? booking.userId._id : null,
      user: booking.userId ? { fullname: booking.userId.fullname } : null,
      serviceType: booking.serviceType,
      vehicleType: booking.vehicleType,
      time: booking.time,
      date: booking.date,
      status: booking.status,
    };

    res
      .status(200)
      .json({ message: "Booking completed", booking: completedBooking });
  } catch (error) {
    console.error("Error completing booking:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const authenticatedUserId = req.user._id;

    const booking = await Booking.findOneAndUpdate(
      { _id: id, userId: authenticatedUserId },
      { status: "Canceled" },
      { new: true }
    ).populate("userId", "fullname");

    if (!booking) {
      return res
        .status(404)
        .json({ message: "Booking not found or not authorized" });
    }

    res.status(200).json({ message: "Booking canceled successfully", booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getNewBookingCount = async (req, res) => {
  try {
    const newBookingCount = await Booking.countDocuments({
      viewedByAdmin: false,
    });
    res.status(200).json({ count: newBookingCount });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching new booking count for admin", error });
  }
};

const markBookingsAsViewed = async (req, res) => {
  try {
    await Booking.updateMany({ viewedByAdmin: false }, { viewedByAdmin: true });

    res.status(200).json({ message: "All bookings marked as viewed by admin" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error marking bookings as viewed by admin", error });
  }
};
const getNewUserBookingCount = async (req, res) => {
  try {
    const authenticatedUserId = req.user._id;

    const approvedBookingCount = await Booking.countDocuments({
      userId: authenticatedUserId,
      status: "Approved",
      viewedByUser: false,
    });

    const rejectedBookingCount = await Booking.countDocuments({
      userId: authenticatedUserId,
      status: "Rejected",
      viewedByUser: false,
    });

    const completedBookingCount = await Booking.countDocuments({
      userId: authenticatedUserId,
      status: "Completed",
      viewedByUser: false,
    });

    const totalBookingCount =
      approvedBookingCount + rejectedBookingCount + completedBookingCount;

    res.status(200).json({
      totalCount: totalBookingCount,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching new user booking counts", error });
  }
};

const markUserBookingsAsViewed = async (req, res) => {
  try {
    const authenticatedUserId = req.user._id;

    await Booking.updateMany(
      { userId: authenticatedUserId, viewedByUser: false },
      { viewedByUser: true }
    );

    res
      .status(200)
      .json({ message: "All user bookings marked as viewed by user" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error marking bookings as viewed by user", error });
  }
};

module.exports = {
  completedBooking,
  getUserBookings,
  getAllPendingBooking,
  getBookingById,
  getAllBooking,
  createBooking,
  updateBooking,
  deleteBooking,
  acceptBooking,
  rejectBooking,
  cancelBooking,
  getAllAcceptedBooking,
  getAllAcceptedBookingById,
  getNewBookingCount,
  markBookingsAsViewed,
  getNewUserBookingCount,
  markUserBookingsAsViewed,
};
