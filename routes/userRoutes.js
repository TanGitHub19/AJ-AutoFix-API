const express = require("express");
const userRouter = express.Router();
const auth = require("../middleware/auth");
const requireRole = require("../middleware/role");
const upload = require("../config/file_upload");
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/user.controller");

userRouter.get("/", getUsers);
userRouter.get("/:id", getUser);

userRouter.put("/:id", auth, upload.single("profilePicture"), updateUser);
userRouter.delete("/:id", deleteUser);
module.exports = userRouter;
