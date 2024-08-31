const express = require("express");
const contactRouter = express.Router();
const contact = require("../controllers/contact.controller");


contactRouter.post("/contact", contact);

module.exports = contactRouter;