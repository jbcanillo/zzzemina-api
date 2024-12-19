import Seminar from "../models/Seminar.js";
import Booking from "../models/Booking.js";

const getSeminars = async (req, res) => {
  try {
    const seminars = await Seminar.find();
    res.status(200).json(seminars);
  } catch (error) {
    res.status(500).json({ message: "Error fetching seminars", error });
  }
};

const getAvailableSeminars = async (req, res) => {
  try {
    const limit = req.params.limit ? parseInt(req.params.limit) : 0; // Capture the limit from the URL
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set the time to the start of the day (00:00:00.000)

    let seminars;

    if (limit > 0) {
      // Fetch random seminars that are scheduled for today or in the future
      seminars = await Seminar.aggregate([
        { $match: { date: { $gte: today } } }, // Match seminars where date is >= today
        { $sample: { size: limit } }, // Fetch random seminars
      ]);
    } else {
      // Fetch all available seminars that are scheduled for today or in the future
      seminars = await Seminar.find({ date: { $gte: today } }); // Only seminars from today and in the future
    }

    res.status(200).json(seminars);
  } catch (error) {
    res.status(500).json({ message: "Error fetching seminars", error });
  }
};


const createSeminar = async (req, res) => {
  try {
    const seminar = await Seminar.create(req.body);
    res.status(201).json({ message: "Seminar created successfully", seminar });
  } catch (error) {
    res.status(500).json({ message: "Error creating seminar", error });
  }
};

const updateSeminar = async (req, res) => {
  try {
    const updatedSeminar = await Seminar.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json({
      message: "Seminar updated successfully",
      seminar: updatedSeminar,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating seminar", error });
  }
};

const deleteSeminar = async (req, res) => {
  try {
    const bookings = await Booking.find({ seminar: req.params.id });

    if (bookings.length > 0) {
      return res.status(400).json({
        message: "Cannot delete seminar because there are bookings associated with it",
      });
    }

    await Seminar.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Seminar deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting seminar", error });
  }
};

const getSeminarDetails = async (req, res) => {
  try {
    const seminar = await Seminar.findById(req.params.id);
    if (!seminar) return res.status(404).json({ message: "Seminar not found" });
    res.status(200).json(seminar);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching seminar details",
      error: error.message,
    });
  }
};

export {
  getSeminars,
  getAvailableSeminars,
  createSeminar,
  updateSeminar,
  deleteSeminar,
  getSeminarDetails,
};
