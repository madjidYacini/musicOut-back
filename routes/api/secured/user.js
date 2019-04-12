import { Router } from "express";
import { pick } from "lodash";
import { success, error, update, deleteUser } from "helpers/response";
import { BAD_REQUEST, UPDATE_MESSAGE } from "constants/api";
import User from "models/user";
import { DELETE_MESSAGE } from "../../../constants/api";

const api = Router();

api.get("/:uuid", async (req, res) => {
  try {
    const user = await User.findOne({ where: { uuid: req.params.uuid } });

    if (user) {
      res.json(success(user));
    } else {
      res.json(
        error(BAD_REQUEST, `Oops, user ${req.params.uuid} doesn't exist`)
      );
    }
  } catch (err) {
    res.status(400).json(error(BAD_REQUEST, err.message));
  }
});
api.put("/:uuid", async (req, res) => {
  try {
    const user = await User.findOne({ where: { uuid: req.params.uuid } });

    if (user) {
      const fields = pick(req.body, [
        "nickname",
        "email",
        "password",
        "password_confirmation"
      ]);

      await user.update(fields);

      res.json(update(UPDATE_MESSAGE));
    }
  } catch (err) {
    res.status(400).json(error(BAD_REQUEST, err.message));
  }
});
api.delete("/:uuid", async (req, res) => {
  try {
    const user = await User.findOne({ where: { uuid: req.params.uuid } });
    if (user) {
      await user.destroy({ force: true });

      res.json(deleteUser(DELETE_MESSAGE));
    }
  } catch (err) {
    res.status(400).json(error(BAD_REQUEST, err.message));
  }
});
export default api;
