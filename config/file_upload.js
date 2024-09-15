const multer = require("multer");
const path = require("path");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error("Error: Images only!"));
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 10 }, 
  fileFilter: fileFilter,
});

module.exports = upload;
