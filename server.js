"use strict";
require("dotenv/config");
import express from "express";
import path from "path";
import bodyParser from "body-parser";

const app = express();
// Parse incoming request available "req.body"
app.use(bodyParser.json());

// respond with "hello world" when a GET request is made to the homepage
app.get("/", function(req, res) {
  res.send("hello world");
});

app.listen(process.env.PORT, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`)
);
