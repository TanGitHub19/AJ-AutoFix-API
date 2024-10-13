const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {
  sendVerificationEmail,
  sendOtpEmail,
} = require("../config/emailService");

const generateVerificationToken = (email) => {
  const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  console.log("Generated Verification Token:", verificationToken);

  return verificationToken;
};

const userRegistration = async (req, res) => {
  try {
    const { fullname, username, email, contactNumber, password } = req.body;
    const profilePictureUrl = req.fileUrl || null;

    if (!fullname || !username || !email || !contactNumber || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    const disallowedDomains = ["company.com", "example.com"];
    const emailDomain = email.split("@")[1];
    if (disallowedDomains.includes(emailDomain)) {
      return res
        .status(400)
        .json({ message: "Please use a personal email address." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(password, saltRounds);

    const verificationToken = generateVerificationToken(email);

    const newUser = new User({
      fullname,
      username,
      email,
      contactNumber,
      password: hashPassword,
      profilePicture: profilePictureUrl,
      verificationToken,
    });

    await newUser.save();

    await sendVerificationEmail(email, verificationToken);

    res.status(201).json({
      message:
        "User registered successfully. Please check your email for verification.",
    });
  } catch (error) {
    console.error("Error in user registration:", error);
    res.status(500).json({ message: error.message });
  }
};

const userVerification = async (req, res) => {
  console.log("Received request for email verification with query:", req.query);

  const { token } = req.query;

  if (!token) {
    return res.status(400).send("No token provided");
  }
  console.log("Received Token in Verification:", token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("User not found");
    }

    if (user.isVerified) {
      console.log("Is user verified:", user.isVerified);
      return res.status(200).send("Email is already verified.");
    }

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    if (user.isVerified) {
      console.log("Email verified successfully!", user.isVerified);
      return res.status(200).send("Email verified successfully!");
    }

    res.send("Email verified successfully!");
  } catch (error) {
    console.error("Error verifying email:", error);
    res.status(400).send("Invalid or expired token");
  }
};


const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found with this email." });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User is already verified." });
    }

    const verificationToken = generateVerificationToken(email);
    user.verificationToken = verificationToken;
    await user.save({ validateBeforeSave: false });

    await sendVerificationEmail(email, verificationToken);
    res.status(200).json({
      status: "success",
      message: "Verification email resent! Please check your inbox.",
    });
  } catch (error) {
    console.error("Error in resending verification email:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: "Email not verified" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
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
        _id: user._id,
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
    res
      .status(500)
      .json({ message: "An unexpected error occurred. Please try again." });
  }
};

const userLogout = async (req, res) => {
  try {
    res.status(200).json({ message: "Logout Successful" });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ message: "Logout Failed" });
  }
};

const requestOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendOtpEmail(email, otp);
    res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error("Error in requesting OTP:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const resetPasswordWithOtp = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    if (!user.otp || user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (Date.now() > user.otpExpires) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    user.password = hashedPassword;

    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error in resetting password:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  resendVerificationEmail,
  userLogout,
  userRegistration,
  userLogin,
  userVerification,
  requestOtp,
  resetPasswordWithOtp,
};
