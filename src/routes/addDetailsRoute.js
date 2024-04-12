const signUpController = require("../controllers/signUpController");

const express = require("express");
const router = express.Router();
router.patch("/addDetails", signUpController.addDetails);

module.exports = router;
