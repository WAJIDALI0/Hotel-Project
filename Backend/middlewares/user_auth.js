import User from '../models/user_model.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Middleware to check if the user is authenticated
export const isAuthenticated = async (req, res, next) => {
  try {
    console.log("Cookies received:", req.cookies); // Log the cookies for debugging
    const { token } = req.cookies;

    if (!token) {
      console.error("Token missing in request cookies.");
      return res.status(401).json({ message: "Unauthorized: Login required." });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log("Decoded token:", decoded);

    req.user = await User.findById(decoded._id);
    next();
  } catch (error) {
    console.error("Token error:", error.message);
    res.status(401).json({ message: "Unauthorized: Invalid token." });
  }
};

// Route to handle user login
export const loginUser = async (req, res) => {
  const { username, password } = req.body;
  
  const user = await User.findOne({ username });
  
  if (!user || !user.comparePassword(password)) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Create JWT token
  const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });

  // Set the token in the cookie
  res.cookie('token', token, {
    httpOnly: true, // Ensures that the cookie is not accessible via JS (increases security)
    secure: process.env.NODE_ENV === 'production', // Only set cookies over HTTPS in production
    sameSite: 'Strict', // Adjust this based on your requirements
  });

  return res.status(200).json({ message: 'Login successful' });
};
