const express = require("express");
const bookingRouter = express.Router();
const auth = require("../middleware/auth");
const requireRole = require("../middleware/role");
const {
  getBookingById,
  getAllBooking,
  createBooking,
  updateBooking,
  deleteBooking,
  acceptBooking,
  rejectBooking,
  getAllAcceptedBooking,
  getAllAcceptedBookingById,
} = require("../controllers/booking.controller");

bookingRouter.get("/bookings/:id", getBookingById);

bookingRouter.get("/bookings/", getAllBooking);

bookingRouter.get(
  "/admin/bookings/accepted",
  auth,
  requireRole("admin"),
  getAllAcceptedBooking
);

bookingRouter.get(
  "/admin/bookings/accepted/:id",
  auth,
  requireRole("admin"),
  getAllAcceptedBookingById
);

bookingRouter.post("/bookings", auth, createBooking);

bookingRouter.put("/bookings/:id", auth, updateBooking);

bookingRouter.put(
  "/bookings/:id/accept",
  auth,
  requireRole("admin", "service manager"),
  acceptBooking
);

bookingRouter.put(
  "/bookings/:id/reject",
  auth,
  requireRole("admin", "service manager"),
  rejectBooking
);

bookingRouter.delete("/bookings/:id", auth, deleteBooking);

module.exports = bookingRouter;
