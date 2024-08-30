const express = require("express");
const bookingRouter = express.Router();
const { getBookingById, getAllBooking, createBooking, updateBooking, deleteBooking } = require("../controllers/booking.controller");

bookingRouter.get('/bookings/:id', getBookingById);
bookingRouter.get('/bookings/', getAllBooking);  

bookingRouter.post('/bookings', createBooking);

bookingRouter.put('/bookings/:id', updateBooking);

bookingRouter.delete('/bookings/:id', deleteBooking);

module.exports = bookingRouter;
