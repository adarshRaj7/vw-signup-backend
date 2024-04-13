const cloudinary = require("cloudinary").v2;
require("dotenv").config();
const postgres = require("postgres");
const env = require("dotenv");
const express = require("express");
var cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");

const config = (app) => {
  app.use(express.urlencoded({ extended: true, limit: "2048mb" }));
  app.use(express.json({ limit: "2048mb" }));
  let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;
  let { CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
    process.env;

  cloudinary.config({
    cloud_name: "dkmruy5hn",
    api_key: "833578577267291",
    api_secret: "lw4f6l3TwjXOAy6eTx43tIgPNLs",
    // cloud_name: process.env.CLOUDINARY_NAME,
    // api_key: process.env.CLOUDINARY_API_KEY,
    // api_secret: process.env.CLOUDINARY_API_SECRET
  });

  const sql = postgres({
    host: PGHOST,
    database: PGDATABASE,
    username: PGUSER,
    password: PGPASSWORD,
    port: 5432,
    ssl: "require",
    connection: {
      options: `project=${ENDPOINT_ID}`,
    },
  });

  /*end of postgress*/

  env.config(); // to use the .env file
  app.use(cors());
};
module.exports = { config };
