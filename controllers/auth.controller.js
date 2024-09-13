const User = require("../models/user.model");
const upload = require("../config/file_upload");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userRegistration = async (req, res) => {
  try {
    const { fullname, username, email, contactNumber, password } = req.body;

    if (!fullname || !username || !email || !contactNumber || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      fullname,
      username,
      email,
      contactNumber,
      password: hashPassword,
      profilePicture: req.fileUrl, 
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully", fileUrl: req.fileUrl }); 
  } catch (error) {
    console.error("Error in user registration:", error);
    res.status(500).json({ message: error.message });
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(404).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullname: user.fullname,
        username: user.username,
        email: user.email,
        contactNumber: user.contactNumber,
        profilePicture: user.profilePicture,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error in user login:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  userRegistration,
  userLogin,
};
