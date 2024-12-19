import Booking from "../models/Booking.js";
import Seminar from "../models/Seminar.js";
import User from "../models/User.js";

const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("seminar").populate("user");
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Error fetching bookings", error });
  }
};

const createBooking = async (req, res) => {
  try {
    const { seminarId } = req.body;

    const seminar = await Seminar.findById(seminarId);
    if (!seminar) return res.status(404).json({ message: "Seminar not found" });
    if (seminar.slotsAvailable <= 0)
      return res.status(400).json({ message: "Seminar is full" });

    const booking = await Booking.create({
      user: req.user.id,
      seminar: seminarId,
    });
    seminar.slotsAvailable -= 1;
    await seminar.save();

    res.status(201).json({ message: "Booking created successfully", booking });
  } catch (error) {
    res.status(500).json({ message: "Error creating booking", error });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const seminar = await Seminar.findById(booking.seminar);
    if (!seminar) {
      return res.status(404).json({ message: "Seminar not found" });
    }

    seminar.slotsAvailable += 1;
    await seminar.save();

    await Booking.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({
        message: "Booking deleted successfully and seminar slots updated",
      });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({ message: "Error deleting booking", error });
  }
};

const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate(
      "seminar"
    );
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings", error });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;

    if (!["pending", "confirmed", "rejected"].includes(paymentStatus)) {
      return res.status(400).json({ message: "Invalid payment status" });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      { paymentStatus },
      { new: true, runValidators: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({
      message: "Booking status updated successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Error updating booking status:", error); // Log the error
    res.status(500).json({ message: "Error updating booking status", error: error.message });
  }
};


export {
  getBookings,
  createBooking,
  deleteBooking,
  getUserBookings,
  updateBookingStatus,
};
