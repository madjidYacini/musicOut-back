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

export const addEventFan = async (req, res) => {
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
    console.log("====================================");
    console.log(error);
    console.log("====================================");
    res.status(400).json(error(BAD_REQUEST, error.message));
  }
};

export const updateEventStats = async (req, res) => {
  try {
    const event = await Event.findOne({ where: { id: req.params.id } });
    if (event) {
      const fields = pick(req.body, ["like", "dislike"], "finish");
      if (fields.like) {
        fields.like = event.like + 1;
      }
      if (fields.dislike) {
        fields.dislike = event.dislike + 1;
      }
      if (fields.finish) {
        fields.finish = true;
      }
      event.update(fields);
    }
    await res.status(201).json(success({ event }));
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
    res.status(400).json(error(BAD_REQUEST, error.message));
  }
};
export const getEventByID = async (req, res) => {
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

export const addEventArtist = async (req, res) => {
  //transfrom the base64 to image

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
    console.log("====================================");
    console.log(error);
    console.log("====================================");
    res.status(400).json(error(BAD_REQUEST, error.message));
  }
};
