import { Router } from "express";
import * as authController from "../controllers/authControllers";

const router = Router();

const authRouters = (app) => {
  router.post("/login", authController.login);
  router.post("/register", authController.register);
  router.get("/allUsers/:id", authController.getAllUsers);
  router.post("/setAvatar/:id", authController.setAvatar);
  router.get("/logout/:id", authController.logout);

  return app.use("/api/chatBox/auth", router);
};

module.exports = authRouters;
