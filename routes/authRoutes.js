const express = require("express");
const router = express.Router();
const auth = require('../middleware/auth')
const { upload, uploadFile } = require("../middleware/file_upload");
const {
  resendVerificationEmail,
  userLogout,
  userRegistration,
  userLogin,
  userVerification,
  requestOtp,
  resetPasswordWithOtp
} = require("../controllers/auth.controller");

router.post(
  "/registration",
  upload.single("profilePicture"),
  uploadFile,
  userRegistration
);

router.post('/resend-verification', resendVerificationEmail);
router.post("/request-otp", requestOtp);
router.post("/reset-password-otp", resetPasswordWithOtp);
router.get('/verify-email', userVerification);
router.post("/login", userLogin);
router.post("/logout", auth, userLogout);


module.exports = router;
