const signUpController = require("../controllers/signUpController");
const path = require("path");

const multer = require("multer");
const express = require("express");
const router = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(file.buffer);
    cb(null, path.join(path.dirname(__dirname), "../uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });
router.patch(
  "/addDetails",
  (req, res, next) => {
    upload.single("avatar")(req, res, (err) => {
      if (err) {
        return res.status(400).json({ error: err });
      }
      //   console.log(req.file);
      req.customData = { ...req.body, filename: req.file.filename };
      next();
    });
  },
  signUpController.addDetails
);

module.exports = router;
