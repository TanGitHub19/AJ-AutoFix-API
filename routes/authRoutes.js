const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { upload, uploadFile } = require("../middleware/file_upload");
const {
  userRegistration,
  userLogin,
  userLogout
} = require("../controllers/auth.controller");

router.post(
  "/registration",
  upload.single("profilePicture"),
  uploadFile,
  userRegistration
);

router.post("/login", userLogin);

app.post('/logout', userLogout);


module.exports = router;
