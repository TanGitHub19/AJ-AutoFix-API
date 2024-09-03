const express = require("express");
const userRouter = express.Router();
const auth = require('../middleware/auth');
const requireRole = require("../middleware/role");
const { getUsers, getUser, updateUser, deleteUser} = require("../controllers/user.controller");
const updateUserRole  = require("../controllers/admin.controller");

userRouter.get("/", getUsers);
userRouter.get("/:id", getUser);

userRouter.put('/update-role/:id', auth, requireRole("admin"), updateUserRole); 
userRouter.put("/:id", auth, updateUser);

userRouter.delete("/:id", deleteUser); 
module.exports = userRouter;