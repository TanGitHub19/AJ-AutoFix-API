const express = require("express");
const router = express.Router();
const auth = require('../middleware/auth')
const { upload, uploadFile } = require("../middleware/file_upload");
const {
  userLogout,
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
router.post("/logout", auth, userLogout);


module.exports = router;
