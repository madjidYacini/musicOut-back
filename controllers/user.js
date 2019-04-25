import User from "models/user";
import Event from "models/event";
import {
  success,
  error,
  update,
  deleteUser,
  userProfile
} from "helpers/response";
import { BAD_REQUEST, UPDATE_MESSAGE, DELETE_MESSAGE } from "constants/api";
import { pick } from "lodash";
export const getUserByIdController = async (req, res) => {
  try {
    const user = await User.findOne({ where: { uuid: req.params.uuid } });

    const event = await Event.findAll({
      where: { user_uuid: req.params.uuid }
    });
    let stats = {
      like: 0,
      dislike: 0
    };
    event.forEach(oneEvent => {
      if (oneEvent.dataValues.like !== null) {
        stats.like += oneEvent.dataValues.like;
      }
      if (oneEvent.dataValues.dislike !== null) {
        stats.dislike += oneEvent.dataValues.dislike;
      }
    });

    if (user) {
      res.json(userProfile(user, stats));
    } else {
      res.json(
        error(BAD_REQUEST, `Oops, user ${req.params.uuid} doesn't exist`)
      );
    }
  } catch (err) {
    res.status(400).json(error(BAD_REQUEST, err.message));
  }
};
export const updateUserInformationController = async (req, res) => {
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
};

export const deleteUserController = async (req, res) => {
  try {
    const user = await User.findOne({ where: { uuid: req.params.uuid } });
    if (user) {
      await user.destroy({ force: true });

      res.json(deleteUser(DELETE_MESSAGE));
    }
  } catch (err) {
    res.status(400).json(error(BAD_REQUEST, err.message));
  }
};
