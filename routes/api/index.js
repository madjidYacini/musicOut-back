import { Router } from "express";

import auth from "./auth";
import secured from "./secured";

const api = Router();

// a\ health-check endpoint
api.get("/", (req, res) => {
  res.json({
    api: "musicOut",
    meta: {
      status: "running",
      version: "v1.0"
    }
  });
});

// a\ authentication
api.use("/auth", auth);

api.use("/", secured);

export default api;
