import { Router } from "express";
import Event from "models/event";
import passport from "passport";
import { CronJob } from "cron";
import {
  getEventController,
  addEventFanController,
  getEventByIDController,
  addEventArtistController,
  updateEventStatsDislikeController,
  updateEventStatsLikeController,
  updateEventFinishController
} from "controllers/event";
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

api.get("/", getEventController);

// ADD EVENT BY A FAN
api.post("/addEvent", addEventFanController);

// ADD EVENT BY ARTIST
api.post(
  "/:uuid/addEvent",
  passport.authenticate("jwt", { session: false }),
  addEventArtistController
);
//update statistics of an event
api.put("/:id/stat/like", updateEventStatsLikeController);
api.put("/:id/stat/dislike", updateEventStatsDislikeController);

//GET AN EVENT BY ID
api.get("/:id/", getEventByIDController);
//
api.put("/:id/finish", updateEventFinishController);
export default api;
