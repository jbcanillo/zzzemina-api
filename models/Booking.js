import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    seminar: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seminar",
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "confirmed","rejected"],
      default: "pending",
    },
    proofOfPayment: String,
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
