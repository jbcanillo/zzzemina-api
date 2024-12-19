import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role, name: user.firstName }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d", // Set your expiration time
    }); 

    // Set token in cookies
    res.cookie("authToken", token, {
      httpOnly: true, /* Prevent JavaScript from accessing the cookie */
      secure: process.env.NODE_ENV === "production", /* Use secure flag in production */
      maxAge: 86400000, /* Cookie expires in 1 day */
      sameSite: "none"
    });

    // Send user info without the password
    res.status(200).json({
      user: {
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const logout = (req, res) => {
  res.clearCookie("authToken", {
    httpOnly: true,
    sameSite: "Strict",
  });
  res.status(200).json({ message: "Logged out successfully" });
};

const getStatus = (req, res) => {
  const token = req.cookies.authToken; // Get the token from the httpOnly cookie

  if (!token) {
    return res
      .status(401)
      .json({ message: "No token provided, please log in." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // Verify token
    res.status(200).json({ isAuthenticated: true, user: decoded });
  } catch (err) {
    // If the token is invalid or expired
    return res.status(403).json({ message: "Token is invalid or expired" });
  }
};

export { register, login, logout, getStatus };
