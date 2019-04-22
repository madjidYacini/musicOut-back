import { Router } from "express";
import { pick } from "lodash";
import { success, error, update, deleteUser } from "helpers/response";
import { BAD_REQUEST, UPDATE_MESSAGE, DELETE_MESSAGE } from "constants/api";
import { storageS3 } from "services/storageS3";
import Event from "models/event";
import passport from "passport";
import * as AWS from "aws-sdk";
import { CronJob } from "cron";
import { Op } from "sequelize";

const api = Router();

//CRON JOB TO UPDATE THE STATUS OF AN EVENT
new CronJob(
  " 59 06 18 * * *",
  async () => {
    try {
      const eventUser = await Event.findAll({
        attributes: ["user_uuid", "id"]
      });
      let uuidArray = [];
      eventUser.forEach(element => {
        if (element.dataValues.user_uuid !== null) {
          uuidArray.push(element.dataValues.user_uuid);
        }
      });
      let fields = { finish: true };
      await Event.update(fields, { where: { user_uuid: uuidArray } });
    } catch (error) {
      res.status(400).json(error(BAD_REQUEST, error.message));
    }
  },
  null,
  true,
  "America/Los_Angeles"
);

api.get("/", async (req, res) => {
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
    console.log("====================================");
    console.log(error);
    console.log("====================================");
    res.status(400).json(error(BAD_REQUEST, error.message));
  }
});

// ADD EVENT BY A FAN
api.post("/addEvent", async (req, res) => {
  try {
    const { description, title, latitude, longitude, picture } = req.body;
    //transfrom the base64 to image
    let imageUrl = storageS3(picture);
    const event = new Event({
      description: description,
      title: title,
      latitude: latitude,
      longitude: longitude,
      picture: imageUrl
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
});

// ADD EVENT BY ARTIST
api.post(
  "/:uuid/addEvent",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
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
        imageBase64
      } = req.body;

      // upload the image in AWS-S3 and return the URL to store it in DB
      let imageUrl = storageS3(imageBase64);

      //store the event
      const event = new Event({
        description: description,
        title: title,
        latitude: latitude,
        longitude: longitude,
        picture: imageUrl,
        user_uuid: uuid,
        schedule: schedule,
        duration: duration
      });
      await event.save();

      res.status(201).json(success({ event }));
    } catch (error) {
      res.status(400).json(error(BAD_REQUEST, error.message));
    }
  }
);
//update statistics of an event
api.put("/:id/stat", async (req, res) => {
  try {
    const event = await Event.findOne({ where: { id: req.params.id } });
    if (event) {
      const fields = pick(req.body, ["like", "dislike"]);
      if (fields.like) {
        fields.like = event.like + 1;
      }
      if (fields.dislike) {
        fields.dislike = event.dislike + 1;
      }
      event.update(fields);
    }
    await res.status(201).json(success({ event }));
  } catch (error) {
    res.status(400).json(error(BAD_REQUEST, error.message));
  }
});

//GET AN EVENT BY ID
api.get("/:id/", async (req, res) => {
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
});
api.put("/:id/finish", async (req, res) => {
  try {
    const { id } = req.params;

    let fields = { finish: true };
    await Event.update(fields, { where: { id: id } });
    res.json(update(UPDATE_MESSAGE));
  } catch (err) {
    res.status(400).json(error(BAD_REQUEST, error.message));
  }
});
export default api;
