import express from "express";
import {
  getUsers,
  createUser,
  sendPassword,
  updateUser,
  deleteUser,
  getProfile,
  updateProfile,
} from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, adminMiddleware, getUsers);
router.post("/", authMiddleware, adminMiddleware, createUser);
router.post("/sendPassword", authMiddleware, adminMiddleware, sendPassword);
router.put("/:id", authMiddleware, adminMiddleware, updateUser);
router.delete("/:id", authMiddleware, adminMiddleware, deleteUser);
router.get("/profile", authMiddleware, getProfile);
router.put("/profile/:id", authMiddleware, updateProfile);

export default router;
