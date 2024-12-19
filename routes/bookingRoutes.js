import express from "express";
import {
  getBookings,
  createBooking,
  deleteBooking,
  getUserBookings,
  updateBookingStatus
} from "../controllers/bookingController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, adminMiddleware, getBookings);
router.get("/user_bookings", authMiddleware, getUserBookings);
router.post("/", authMiddleware, createBooking);
router.delete("/:id", authMiddleware, deleteBooking);
router.put("/:id", authMiddleware, adminMiddleware, updateBookingStatus);

export default router;
