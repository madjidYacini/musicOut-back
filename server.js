// "use strict";
// require("dotenv/config");
// import express from "express";
// import path from "path";
// import bodyParser from "body-parser";

// const app = express();
// // Parse incoming request available "req.body"
// app.use(bodyParser.json());

// // respond with "hello world" when a GET request is made to the homepage
// app.get("/", function(req, res) {
//   res.send("hello world");
// });

// app.listen(process.env.PORT, () =>
//   console.log(`Example app listening on port ${process.env.PORT}!`)
// );

import { PORT } from "@env";
import express from "express";
import bodyParser from "body-parser";
import passport from "passport";
import cors from "cors";
import os from "os";
import path from "path";
import mArg from "utils/mArg";
import mLog from "utils/mLog";
import "./middleware/passport";
import { db as database } from "./models";
// import api from "./routes/api";
// Entry point function
const start = async () => {
  // const args = mArg({
  //   "--port": Number,
  //   // aliases
  //   "-p": "--port"
  // });
  const port = 5000;
  // database synchronization ...
  await database.authenticate();
  mLog("Connected to SQL database!", "green");

  mLog("Synchronizing database!");
  // creates tables from models
  database.sync({
    force: false,
    logging(str) {
      mLog(str, "magenta");
    }
  });

  const app = express();
  // authentication middleware
  // app.use(passport.initialize());
  // body data en+decoding
  app.use(bodyParser.urlencoded());
  app.use(bodyParser.json());
  app.use(cors());
  app.use((req, res, next) => {
    // version the media type and extend the language for api versionning
    res.setHeader("Accept", "application/vnd.upload.island.v1+json");
    // website we wish to allow to connect
    res.setHeader("Access-Control-Allow-Origin", "*");
    // request methods we wish to allow
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
    // request headers we wish to allow
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With, Accept, Authorization, Content-Type"
    );
    // set to true if we need the website to include cookies in the requests sent
    // to the API (e.g. in case we use sessions)
    res.setHeader("Access-Control-Allow-Credentials", true);
    // pass to next layer of middleware
    next();
  });
  app.get("/", (req, res) => {
    res.send(`Please feel free to use our api ${process.env.PORT}/api`);
  });
  // About routes definition
  // app.use("/api", api);
  // Catching 404 error and forwarding to error handler
  // app.use((req, res, next) => {
  //   const err = new Error("Routes not found");
  //   err.status = 404;
  //   next(err);
  // });
  // error handler
  // app.use((err, req, res) => {
  //   res.status(err.status || 500).json({ err: err.message });
  // });
  // ... and finally server listening
  app.listen(process.env.PORT, err => {
    if (err) throw err;
    mLog(`Server is running on port ${process.env.PORT}`);
  });
};
// Let's Rock!
start();
