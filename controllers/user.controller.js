const User = require("../models/user.model");
const { bucket } = require("../config/firebase"); 

const uploadToFirebase = async (file) => {
  const fileName = `profile_pictures/${Date.now()}_${file.originalname}`;
  const fileUpload = bucket.file(fileName);

  const blobStream = fileUpload.createWriteStream({
    metadata: {
      contentType: file.mimetype,
    },
  });

  return new Promise((resolve, reject) => {
    blobStream.on("error", (error) => {
      reject("Error uploading file: " + error.message);
    });

    blobStream.on("finish", () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;
      resolve(publicUrl);
    });

    blobStream.end(file.buffer); 
  });
};

const getFirebaseImageUrl = async (fileName) => {
  const file = bucket.file(fileName);
  const [exists] = await file.exists();
  
  if (exists) {
    const [metadata] = await file.getMetadata();
    return `https://firebasestorage.googleapis.com/v0/b/${metadata.bucket}/o/${encodeURIComponent(fileName)}?alt=media`;
  } else {
    return null; 
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});

    const usersWithProfilePics = await Promise.all(users.map(async (user) => {
      const profilePictureUrl = user.profilePicture
        ? await getFirebaseImageUrl(user.profilePicture)
        : null;

      return {
        ...user._doc,
        profilePicture: profilePictureUrl,
      };
    }));

    res.status(200).json(usersWithProfilePics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Function to get a single user
const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ message: "User not Found" });
    }

    const profilePictureUrl = user.profilePicture
      ? await getFirebaseImageUrl(user.profilePicture)
      : null;

    const formattedUser = {
      ...user._doc,
      profilePicture: profilePictureUrl,
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
      const fileName = await uploadToFirebase(req.file);
      const fileUrl = await getFirebaseImageUrl(fileName);
      updateData.profilePicture = fileUrl;
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
      profilePicture: user.profilePicture,
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
