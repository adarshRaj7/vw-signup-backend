require("dotenv").config();
const postgres = require("postgres");
const env = require("dotenv");
const express = require("express");
var cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");

const config = (app) => {
  app.use(express.urlencoded({ extended: true, limit: '2048mb' }));
	app.use(express.json({ limit: '2048mb' }));
  let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;

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
