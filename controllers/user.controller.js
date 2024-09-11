const User = require("../models/user.model");
const fs = require("fs");
const path = require("path");

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});

    const usersWithProfilePics = users.map((user) => ({
      ...user._doc,
      profilePicture: user.profilePicture
        ? `${req.protocol}://${req.get("host")}/${user.profilePicture}`
        : null,
    }));

    res.status(200).json(usersWithProfilePics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not Found" });
    }
    const formattedUser = {
      ...user._doc,
      profilePicture: user.profilePicture
        ? `${req.protocol}://${req.get("host")}/${user.profilePicture}`
        : null,
    };
    res.status(200).json(formattedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, ...updateData } = req.body;

    const requestRole = req.user?.role;

    if (requestRole !== "admin") {
      return res.status(403).json({ message: "Access denied. Only admins can update user data." });
    }

    if (role && !["user", "admin", "service manager"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (role) {
      updateData.role = role;
    }

    if (req.file) {
      updateData.profilePicture = req.fileUrl;
    }
    
    const user = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userWithProfilePic = {
      ...user._doc,
      profilePicture: user.profilePicture
        ? `${req.protocol}://${req.get('host')}/${user.profilePicture}`
        : null,
    };

    res.status(200).json({ message: "User data updated successfully", user: userWithProfilePic });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: error.message });
  }
};



const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User not Found" });
    }
    res.status(200).json({ message: "User data deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
