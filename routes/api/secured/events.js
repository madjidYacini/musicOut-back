import { Router } from "express";
import { pick } from "lodash";
import { success, error, update, deleteUser } from "helpers/response";
import { BAD_REQUEST, UPDATE_MESSAGE, DELETE_MESSAGE } from "constants/api";
import Event from "models/event";
import passport from "passport";
import multer from "multer";
import multerS3 from "multer-s3";
import * as AWS from "aws-sdk";
const api = Router();
let imageUrl = "";
import schedule from "node-schedule";
//schedule database to update the event if no one did it
schedule.scheduleJob(" 00 00 00 * * *", async () => {
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
});
AWS.config.update({
  secretAccessKey: process.env.ACCES_KEY_AWS_SECRET,
  accessKeyId: process.env.ACCES_KEY_AWS_ID,
  region: "eu-west-3"
});
const s3 = new AWS.S3({
  credentials: {
    accessKeyId: process.env.ACCES_KEY_AWS_ID,
    secretAccessKey: process.env.ACCES_KEY_AWS_SECRET
  }
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "musicout-bucket",
    acl: "public-read",
    metadata: function(req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function(req, file, cb) {
      let imageName = Date.now().toString() + "_" + file.originalname;
      imageUrl =
        "https://s3.eu-west-3.amazonaws.com/musicout-bucket/" + imageName;
      cb(null, imageName);
    }
  })
});

api.get("/", async (req, res) => {
  try {
    const events = await Event.findAll();
    res.json(success(events));
  } catch (error) {
    res.status(400).json(error(BAD_REQUEST, error.message));
  }
});

api.get("/getEventUser", async (req, res) => {
  try {
    const events = await Event.findAll();
    res.json(success(events));
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
    // res.status(400).json(error(BAD_REQUEST, error.message));
  }
});
api.post("/addEvent", upload.single("image"), async (req, res) => {
  try {
    const { description, title, latitude, longitude } = req.body;
    const event = new Event({
      description: description,
      title: title,
      latitude: latitude,
      longitude: longitude,
      picture: imageUrl
    });
    await event.save();
    res.status(201).json(success({ event }));
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
    res.status(400).json(error(BAD_REQUEST, error.message));
  }
});
api.post(
  "/:uuid/addEvent",
  passport.authenticate("jwt", { session: false }),
  upload.single("image"),
  async (req, res) => {
    try {
      const { uuid } = req.params;
      const {
        description,
        title,
        latitude,
        longitude,
        duration,
        schedule
      } = req.body;
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
api.put("/:id/stat", upload.single("image"), async (req, res) => {
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
