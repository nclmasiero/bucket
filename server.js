// ENVIRONMENT SETUP
require("dotenv").config();

// IMPORTS
const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");

// ROUTERS
const api = require("./routers/api");
const key = require("./routers/key");

// INIT
const app = express();
app.listen(process.env.PORT, console.log("app running on port: " + process.env.PORT + " and environment: " + process.env.ENVIRONMENT));
if (!fs.existsSync("./public")) { // check if the public directory exists
  // if not, create it
  console.log("Public dir not found. Creating one...");
  fs.mkdirSync("./public");
}

// MIDDLEWARE USES
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb' }));
app.use(express.static("public"));
app.use("/api", key);
app.use("/api", api);