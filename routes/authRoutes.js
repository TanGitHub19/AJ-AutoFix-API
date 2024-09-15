const express = require("express");
const router = express.Router();
const upload = require("../config/file_upload");
const {
  userRegistration,
  userLogin,
} = require("../controllers/auth.controller");

router.post("/registration", upload.single("profilePicture"), userRegistration);

router.post("/login", userLogin);

module.exports = router;
