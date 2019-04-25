import { Router } from "express";
import { pick } from "lodash";
import { success, error, update, deleteUser } from "helpers/response";
import { BAD_REQUEST, UPDATE_MESSAGE, DELETE_MESSAGE } from "constants/api";
import User from "models/user";
import passport from "passport";
import {
  getUserByIdController,
  updateUserInformationController,
  deleteUserController
} from "controllers/user";
const api = Router();

api.get("/:uuid", getUserByIdController);
api.put(
  "/:uuid",
  passport.authenticate("jwt", { session: false }),
  updateUserInformationController
);
api.delete(
  "/:uuid",
  passport.authenticate("jwt", { session: false }),
  deleteUserController
);
export default api;
