const express = require("express");
const contactRouter = express.Router();
const contact = require("../controllers/contact.controller");


contactRouter.post("/contacts", contact);

module.exports = contactRouter;