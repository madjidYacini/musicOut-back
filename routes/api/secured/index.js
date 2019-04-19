import { Router } from "express";
import passport from "passport";
import user from "./user";
import event from "./events";
const api = Router({ mergeParams: true });

// a\ users
api.use("/users", passport.authenticate("jwt", { session: false }), user);

//a\ events
api.use("/events", event);

export default api;
