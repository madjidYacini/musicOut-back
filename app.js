import express from "express";
import bodyParser from "body-parser";
import passport from "passport";
import cors from "cors";
import mLog from "utils/mLog";
import "./middleware/passport";
import { db as database } from "./models";
import api from "./routes/api";
const app = express();

(async () => {
  await database.authenticate();
  mLog("Connected to SQL database!", "green");
  // creates tables from models
  database.sync({
    force: false,
    logging(str) {
      mLog(str, "magenta");
    }
  });
})();

// authentication middleware
app.use(passport.initialize());
// body data en+decoding
app.use(
  bodyParser.urlencoded({
    limit: "10000mb",
    extended: true,
    parameterLimit: 1000000000000000
  })
);
app.use(bodyParser.json({ limit: "10000mb" }));
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
  res.setHeader("Access-Control-Allow-Credentials", true);
  // pass to next layer of middleware
  next();
});
app.get("/", (req, res) => {
  res.send(`Please feel free to use our api ${process.env.PORT}/api`);
});
// About routes definition
app.use("/api", api);

// Catching 404 error and forwarding to error handler
app.use((req, res, next) => {
  const err = new Error("Routes not found");
  err.status = 404;
  res.status(404).send({ err: err.message });
  mLog(`API ERROR: ${err.message} -- STATUS: ${404}`, "red");
  // next(err);
});
// error handler
app.use((err, req, res) => {
  res.status(err.status || 500).json({ err: err.message });
});

export default app;
