import { Router } from "express";
import { pick } from "lodash";
import { success, error, update, deleteUser } from "helpers/response";
import { BAD_REQUEST, UPDATE_MESSAGE } from "constants/api";
import Event from "models/event";
import { DELETE_MESSAGE } from "../../../constants/api";

const api = Router();

api.get("/", async (req, res) => {
  try {
    const events = await Event.findAll();
    res.json(success(events));
  } catch (error) {
    res.status(400).json(error(BAD_REQUEST, err.message));
  }
});

export default api;
