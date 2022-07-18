import express from "express";
import helmet from "helmet";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import socket from "socket.io";
require("dotenv").config();

import authRouters from "./routers/authRouters";
import messageRouters from "./routers/messageRouters";

const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.USERNAME_DB}:${process.env.PASSWORD_DB}@nodejsfull.qec2ax9.mongodb.net/?retryWrites=true&w=majority`
    );

    //     await mongoose.connect(process.env.BASE_DB_URL, {
    //       useNewUrlParser: true,
    //       useUnifiedTopology: true,
    //       useFindAndModify: false,
    //       useCreateIndex: true,
    //     });
    console.log("connecting mongoDB");
  } catch (error) {
    console.log(error.message);
  }
};

connectDB();

const app = express();

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

authRouters(app);
messageRouters(app);

const PORT = process.env.PORT;
const server = app.listen(PORT, () => {
  console.log(`server connected on PORT: ${PORT}`);
});

//Cau hinh socket.io (chatbox theo thoi gian thuc)

const io = socket(server, {
  cors: {
    origin: "http://localhost:8081",
    credentials: true,
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
});
