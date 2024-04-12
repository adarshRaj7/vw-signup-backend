const { Pool } = require("pg");
require("dotenv").config();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const createUser = (req, res) => {
  console.log("createUser");
  console.log(req.body);
  const { name, username, email, password } = req.body;
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
        "INSERT INTO users (name, email,username,password) VALUES ($1, $2, $3, $4) RETURNING id",
        [name, email, username, password],
        (error, results) => {
          if (error) {
            throw error;
          }
          res.status(201).json(req.body);
          isValid = false;
          return;
        }
      );
    }
  }
};

const addDetails = (req, res) => {
  const { username, email } = req.params;
  const { location, avatar } = req.body;
  if (avatar) {
    pool.query(
      "UPDATE users SET location = $1, avatar = $2",
      [location, avatar],
      (error, results) => {
        if (error) {
          console.error(error);
          res.status(500).json({ error });
        } else {
          res.status(200).json({ status: "success", message: "User updated" });
        }
      }
    );
  } else {
    pool.query(
      "UPDATE users SET location = $1",
      [location],
      (error, results) => {
        if (error) {
          console.error(error);
          res.status(500).json({ error });
        } else {
          res.status(200).json({ status: "success", message: "User updated" });
        }
      }
    );
  }
};

module.exports = { createUser, addDetails };
