const cloudinary = require("cloudinary").v2;
const { Pool } = require("pg");
const { sendEmail } = require("../helpers/resend");
const bcrypt = require("bcrypt");
const saltRounds = 10;
require("dotenv").config();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const createUser = async (req, res) => {
  const { name, username, email, password } = req.body;
  if (password.length < 7) {
    return res.status(422).json({ error: "Password too short" });
  }
  const password_hash = await bcrypt.hash(password, saltRounds);
  try {
    const emailCount = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (emailCount.rowCount > 0) {
      return res.status(409).json({ error: "Email already exists" });
    }
    const usernameCount = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    if (usernameCount.rowCount > 0) {
      return res.status(409).json({ error: "Username already exists" });
    }
    const result = await pool.query(
      "INSERT INTO users (name, email,username,password_hash) VALUES ($1, $2, $3, $4) RETURNING id",
      [name, email, username, password_hash]
    );
    return res.status(201).json({ id: result.rows[0].id });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const addDetails = async (req, res) => {
  const avatar = req.file;

  const { location, id } = req.body;
  let avatar_link = "";

  if (!location || !id) {
    return res.status(400).json({ error: "location and id are required" });
  }
  try {
    pool.query(`UPDATE users SET location = $1 where id = $2`, [location, id]);
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }

  if (avatar) {
    try {
      const result = await cloudinary.uploader.upload(
        `./uploads/${avatar.filename}`
      );
      avatar_link = result.secure_url;
      await pool.query(`UPDATE users SET avatar = $1 where id = $2`, [
        avatar_link,
        id,
      ]);
    } catch (error) {
      return res.status(500).json({ error: "Something went wrong" });
    }
  }
  return res
    .status(200)
    .json({ status: "success", message: "User updated successfully",avatar_link});
};

const addPreferences = async (req, res) => {
  console.log(req.body);
  const { id, interests } = req.body;
  console.log(id, interests);
  if (!id || !interests) {
    return res.status(400).json({ error: "id and preferences are required" });
  }
  try {
    pool.query(`UPDATE users SET interests = $1 where id = $2`, [
      interests,
      id,
    ]);
    const result = await sendEmail(
      req.body.email,
      req.body.name,
      req.body.username
    );
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({ error });
  }

  return res
    .status(200)
    .json({ status: "success", message: "Preferences updated" });
};

module.exports = { createUser, addDetails, addPreferences };
