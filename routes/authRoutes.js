const express = require("express");
const router = express.Router();
const upload = require("../config/file_upload");
const {
  userRegistration,
  userLogin,
} = require("../controllers/auth.controller");

router.post(
  "/registration",
  upload.single("profilePicture"),
  (req, res, next) => {
    //if (!req.file) {
     // return res.status(400).json({ error: "No file uploaded" });
   // }

    //const fileUrl = `uploads/${req.file.filename.replace(/\\/g, "/")}`;
    //req.fileUrl = fileUrl;

    userRegistration(req, res, next);
  }
);

router.post("/login", userLogin);

module.exports = router;
