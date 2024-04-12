const signUpController = require("../controllers/signUpController");

const express = require("express");
const router = express.Router();
router.post("/signup", signUpController.createUser);

module.exports = router;
