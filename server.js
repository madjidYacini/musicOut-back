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
import api from "./routes/api";
import app from "./app";
// ... and finally server listening
app.listen(process.env.PORT, err => {
  if (err) throw err;
  mLog(`Server is running on port ${process.env.PORT}`);
});
