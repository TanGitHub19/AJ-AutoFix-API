const express = require("express");
const contactRouter = express.Router();
const auth = require("../middleware/auth");
const contact = require("../controllers/contact.controller");


contactRouter.post("/contacts", auth ,contact);

module.exports = contactRouter;