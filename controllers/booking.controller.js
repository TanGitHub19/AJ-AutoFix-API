const Booking = require("../models/booking.model");
const mongoose = require('mongoose');

const getBookingById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid booking ID format" });
        }
        const booking = await Booking.findById(id);
        if(!booking){
            return res.status(404).json({message: "Booking not found"});
        }
        res.status(200).json(booking);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const getAllBooking = async (req, res) => {
    try {
        const bookings = await Booking.find({});
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


const createBooking = async (req, res) => {
    try {
        const booking = new Booking(req.body);
        await booking.save();
        res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const updateBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await Booking.findByIdAndUpdate(id, req.body, {new: true});
        if (!booking){
            return res.status(404).json({message: "Booking not found"});
        }
        res.status(200).json({message: "Booking updated successfully", booking});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const deleteBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await Booking.findByIdAndDelete(id);
        if (!booking){
            return res.status(404).json({message: "Booking not found"});
        }
        res.status(200).json({message: "Booking deleted successfully"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

module.exports = {
    getBookingById,
    getAllBooking,
    createBooking,
    updateBooking,
    deleteBooking
}