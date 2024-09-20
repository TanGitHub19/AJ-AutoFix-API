const express = require("express");
const userRouter = express.Router();
const auth = require("../middleware/auth");
const requireRole = require("../middleware/role");
const upload = require("../middleware/file_upload");
const {
  userUpdate,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getUsersByAuth
} = require("../controllers/user.controller");

userRouter.get("/", getUsers);
userRouter.get("/:id", getUser);
userRouter.get("/:id", getUser);
userRouter.get("/user/getUser", auth, getUsersByAuth);
userRouter.put("/update/:id", auth, requireRole('user'), userUpdate);
userRouter.put("/:id", auth, updateUser);
userRouter.delete("/:id", deleteUser);
module.exports = userRouter;
