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
  console.log("Before bcrypt", password);
  const password_hash = await bcrypt.hash(password, saltRounds);
  
  console.log("After bcrypt", password_hash);

  let isEmailUnique = true;
  let isUsernameUnique = true;
  pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email],
    (error, results) => {
      if (error) {
        throw error;
      }
      if (results.rows.length > 0) {
        isEmailUnique = false;
      }
    }
  );
  if (!isEmailUnique) {
    res.status(409).send("Email already exists");
    return;
  } else {
    pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username],
      (error, results) => {
        if (error) {
          throw error;
        }
        if (results.rows.length > 0) {
          isUsernameUnique = false;
        }
      }
    );
    if (!isUsernameUnique) {
      res.status(409).send("Username already exists");
      return;
    } else {
      pool.query(
        "INSERT INTO users (name, email,username,password_hash) VALUES ($1, $2, $3, $4) RETURNING id",
        [name, email, username, password_hash],
        (error, results) => {
          if (error) {
            throw error;
          }
          console.log(password_hash);
          res.status(201).json(results.rows[0]);
          isValid = false;
          return;
        }
      );
    }
  }
};

const addDetails = async (req, res) => {
  const avatar = req.file;

  const { location, id } = req.body;
  let avatar_link = "abcd";

  if (!location || !id) {
    return res.status(400).json({ error: "location and id are required" });
  }

  if (avatar) {
    console.log("Avatar inside ", avatar);
    await cloudinary.uploader
      .upload(`./uploads/${avatar.filename}`)
      .then((result) => {
        console.log(result);
        avatar_link = result.secure_url;
      })
      .catch((error) => console.log("error", error));
    console.log("after cloudinary ", avatar_link);

    pool.query(
      `UPDATE users SET location = $1, avatar = $2 where id = $3`,
      [location, avatar_link, id],
      (error, results) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ error });
        } else {
          res.status(200).json({ status: "success", message: "User updated" });
        }
      }
    );
  } else {
    pool.query(
      `UPDATE users SET location = $1 where id = $2`,
      [location, id],
      (error, results) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ error });
        } else {
          res.status(200).json({ status: "success", message: "User updated" });
        }
      }
    );
  }
};

const addPreferences = (req, res) => {
  console.log(req.body);
  const { id, interests } = req.body;
  console.log(id, interests);
  if (!id || !interests) {
    return res.status(400).json({ error: "id and preferences are required" });
  }
  pool.query(
    `UPDATE users SET interests = $1 where id = $2`,
    [interests, id],
    async (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error });
      } else {
        await sendEmail(req.body.email, req.body.name, req.body.username);
        res
          .status(200)
          .json({ status: "success", message: "Preferences updated" });
      }
    }
  );
};

module.exports = { createUser, addDetails, addPreferences };
