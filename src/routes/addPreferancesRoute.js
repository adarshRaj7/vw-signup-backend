const signUpController = require("../controllers/signUpController");

const express = require("express");
const router = express.Router();
router.patch("/addPreferences", signUpController.addPreferences);

module.exports = router;
