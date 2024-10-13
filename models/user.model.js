const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    profilePicture: {
      type: String,
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 255,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 255,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address",
      ],
      minlength: 5,
      maxlength: 255,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 6,
      maxlength: 128,
    },
    role: {
      type: String,
      enum: ["user", "admin", "service manager"],
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      default: null,
    },
    otp: { 
      type: String, 
      default: null 
    }, 
    otpExpiration: { 
      type: Date, 
      default: null 
    },
    timestamps: true,
  }
);

UserSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();

  if (!update.password) {
    delete update.password;
  } else if (update.password === "") {
    return next(new Error("Password cannot be empty"));
  }

  this.options.runValidators = true;

  next();
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
