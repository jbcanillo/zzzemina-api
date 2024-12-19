import jwt from "jsonwebtoken";
import User from "../models/User.js"; // Assuming you have a User model

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.authToken;
  if (!token) {
    return res.status(403).json({ error: "Token required" });
  }

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Fetch the user from the database using the decoded userId
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Attach user data to req.user (for use in adminMiddleware)
    req.user = user; // Add user to request object

    next(); // Proceed to next middleware or route handler
  } catch (error) {
    res.status(403).json({ message: "Token is not valid" });
    
  }
};

export default authMiddleware;
