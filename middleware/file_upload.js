const multer = require("multer");
const admin = require("firebase-admin");

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "autofix-3cbff.appspot.com",
});

const bucket = admin.storage().bucket();
const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadFile = async (req, res, next) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).send("No file uploaded.");
    }

    const fileName = `${Date.now()}-${file.originalname}`;
    const fileUpload = bucket.file(fileName);
    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    stream.on("error", (err) => {
      console.error("Error uploading file:", err);
      return res.status(500).send("Error uploading file");
    });

    stream.on("finish", async () => {
      const [url] = await fileUpload.getSignedUrl({
        action: "read",
        expires: "03-09-2491",
      });

      req.fileUrl = url; 
      next(); 
    });

    stream.end(file.buffer);
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).send("Error uploading file");
  }
};

module.exports = {
  upload,
  uploadFile,
};
