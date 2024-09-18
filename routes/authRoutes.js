const express = require("express");
const router = express.Router();
const { upload, uploadFile } = require("../middleware/file_upload");
const {
  userRegistration,
  userLogin,
} = require("../controllers/auth.controller");

router.post(
  "/registration",
  upload.single("profilePicture"),
  uploadFile,
  userRegistration
);

router.post("/login", userLogin);

module.exports = router;
