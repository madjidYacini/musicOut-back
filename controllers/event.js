import Event from "models/event";
import { Op } from "sequelize";
import { success, error, update, deleteUser } from "helpers/response";
import { storageS3 } from "services/storageS3";
import { BAD_REQUEST, UPDATE_MESSAGE, DELETE_MESSAGE } from "constants/api";
import { pick } from "lodash";

export async function getEventController(req, res) {
  try {
    const events = await Event.findAll({
      where: {
        finish: {
          [Op.or]: [false, null]
        }
      }
    });
    res.json(success(events));
  } catch (error) {
    res.status(400).json(error(BAD_REQUEST, error.message));
  }
}

export const addEventFanController = async (req, res) => {
  try {
    const { description, title, latitude, longitude, picture, kind } = req.body;
    //transfrom the base64 to image
    let imageUrl = storageS3(picture);
    const event = new Event({
      description: description,
      title: title,
      latitude: latitude,
      longitude: longitude,
      picture: imageUrl,
      kind: kind
    });
    // SAVE THE EVENT
    await event.save();
    res.status(201).json(success({ event }));
  } catch (error) {
    res.status(400).json(error(BAD_REQUEST, error.message));
  }
};

export const updateEventStatsLikeController = async (req, res) => {
  try {
    const event = await Event.findOne({ where: { id: req.params.id } });
    if (event) {
      const fields = pick(req.body, "like");

      fields.like = event.like + 1;

      event.update(fields);
    }
    await res.status(201).json(success({ event }));
  } catch (error) {
    res.status(400).json(error(BAD_REQUEST, error.message));
  }
};
export const updateEventStatsDislikeController = async (req, res) => {
  try {
    const event = await Event.findOne({ where: { id: req.params.id } });
    if (event) {
      const fields = pick(req.body, "dislike");

      fields.like = event.dislike + 1;

      event.update(fields);
    }
    await res.status(201).json(success({ event }));
  } catch (error) {
    res.status(400).json(error(BAD_REQUEST, error.message));
  }
};
export const updateEventFinishController = async (req, res) => {
  try {
    const { id } = req.params;

    let fields = { finish: true };
    await Event.update(fields, { where: { id: id } });
    res.json(update(UPDATE_MESSAGE));
  } catch (err) {
    res.status(400).json(error(BAD_REQUEST, error.message));
  }
};
export const getEventByIDController = async (req, res) => {
  try {
    const event = await Event.findOne({ where: { id: req.params.id } });

    if (event) {
      res.json(success(event));
    } else {
      res.json(error(BAD_REQUEST, `Oops, user ${req.params.id} doesn't exist`));
    }
  } catch (err) {
    res.status(400).json(error(BAD_REQUEST, err.message));
  }
};

export const addEventArtistController = async (req, res) => {
  try {
    const { uuid } = req.params;
    const {
      description,
      title,
      latitude,
      longitude,
      duration,
      schedule,
      picture,
      kind
    } = req.body;

    // upload the image in AWS-S3 and return the URL to store it in DB
    let imageUrl = storageS3(picture);

    //store the event
    const event = new Event({
      description: description,
      title: title,
      latitude: latitude,
      longitude: longitude,
      picture: imageUrl,
      user_uuid: uuid,
      schedule: schedule,
      duration: duration,
      kind: kind
    });
    await event.save();

    res.status(201).json(success({ event }));
  } catch (error) {
    res.status(400).json(error(BAD_REQUEST, error));
  }
};

export const deleteEventController = async (req, res) => {
  try {
    const event = await Event.findOne({ where: { id: req.params.id } });
    if (event) {
      await event.destroy({ force: true });

      res.json(deleteUser(DELETE_MESSAGE));
    } else {
      res.status(400).json({
        message: "the event is already deleted"
      });
    }
  } catch (err) {
    res.status(400).json(error(BAD_REQUEST, err.message));
  }
};
