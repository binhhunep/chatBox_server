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

    //     await mongoose.connect(process.env.BASE_DB_URL);
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
    origin: [
      "https://client-chat-box-mern-71kg5jwtp-binhhunep.vercel.app/",
      "http://localhost:3000",
      "https://client-chat-box-mern.vercel.app",
    ],
    credentials: true,
  },
});

//dam bao front end 3000 moi ket noi duoc server

//chi server duoc chi dinh moi vao duoc

global.onlineUsers = new Map(); //tao list online server
io.on("connection", (socket) => {
  global.chatSocket = socket; //asset socket duoc bat ki o dau trong bat cu trang nao
  socket.on("client-add-user-server", (userId) => {
    console.log("user connected to chat room:", userId);
    onlineUsers.set(userId, socket.id); //set cho user dang nhap mot id socket tam random
  });
  //add user vao group
  socket.on("client-send-msg-server", (data) => {
    const sendUserSocket = onlineUsers.get(data.to); //goi ra user dang online nhan duoc tin nhan
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("server-msg-receive-client", data.msg); //phan hoi tin nhan tu server len user moi duoc goi
    }
  });
});
//chat 1vs1
