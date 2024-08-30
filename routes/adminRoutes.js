const express = require("express");
const adminRouter = express.Router();
const { getUsers, getUser, updateUser, deleteUser} = require("../controllers/admin.controller");

adminRouter.get("/", getUsers);
adminRouter.get("/:id", getUser);

adminRouter.put("/:id", updateUser);

adminRouter.delete("/:id", deleteUser);

module.exports = adminRouter;