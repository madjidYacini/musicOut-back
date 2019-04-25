import { Router } from "express";
import user from "./user";
import event from "./events";
const api = Router({ mergeParams: true });

// a\ users
api.use("/users", user);

//a\ events
api.use("/events", event);

export default api;
