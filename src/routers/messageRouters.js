import { Router } from "express";
import messageControllers from "../controllers/messageControllers";
const router = Router();

const messageRouters = (app) => {
  router.post("/getMsg", messageControllers.getMessages);
  router.post("/addMsg", messageControllers.addMessage);
  return app.use("/api/chatBox/message", router);
};

module.exports = messageRouters;
