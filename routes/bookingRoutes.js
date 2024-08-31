const express = require("express");
const bookingRouter = express.Router();
const auth = require("../middleware/auth");
const requireRole = require("../middleware/role")
const { getBookingById, getAllBooking, createBooking, updateBooking, deleteBooking, acceptBooking, rejectBooking } = require("../controllers/booking.controller");

bookingRouter.get('/bookings/:id', getBookingById);
bookingRouter.get('/bookings/', getAllBooking);  

bookingRouter.post('/bookings', createBooking);

bookingRouter.put('/bookings/:id', updateBooking);
bookingRouter.put('/bookings/:id/accept', auth, requireRole("admin"), acceptBooking);
bookingRouter.put('/bookings/:id/reject', auth, requireRole("admin"), rejectBooking);

bookingRouter.delete('/bookings/:id', deleteBooking);

module.exports = bookingRouter;
