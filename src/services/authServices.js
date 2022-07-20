import authModel from "../models/authModel";
import authValidate from "../validations/authValidate";

import bcrypt from "bcrypt";
const saltRounds = 10;

const showAllUsers = async (req) => {
  const users = await authModel
    .find({ _id: { $ne: req.params.id } }) //tim tat ca tai lieu khong co id la id req truyen vao
    .sort({ _id: 1 })
    .select({
      username: 1,
      email: 1,
      avatarImage: 1,
      _id: 1,
      isAvatarImageSet: 1,
    });
  if (users) {
    return { success: true, message: "Get all users success!", data: users };
  }
  return { success: false, message: "Get all users fail!", data: users };
};

const login = async (req) => {
  const { username, password } = req.body;
  const { error } = authValidate({ username, password });
  if (error) {
    return { success: false, message: error.message };
  }
  const user = await authModel.findOne({ username });
  if (user) {
    const checkPassword = await bcrypt.compareSync(password, user.password);
    if (checkPassword) {
      return {
        success: true,
        message: "Login success",
        data: user,
      };
    }
  }
  return {
    success: false,
    message: "User or password no exact!",
  };
};

const register = async (req) => {
  const { username, password, email, repeat_password } = req.body;

  if (!email || !repeat_password) {
    return {
      success: false,
      message: "parameters is required",
    };
  }
  const { error } = authValidate({
    username,
    password,
    email,
    repeat_password,
  });
  if (error) {
    return { success: false, message: error.message };
  }
  try {
    const user1 = await authModel.findOne({ username });
    console.log(JSON.stringify(user1, 1, 2));
    if (user1) {
      return { success: false, message: "User already exist" };
    }
    const user2 = await authModel.findOne({ email });
    if (user2) {
      return { success: false, message: "User already exist" };
    }
    const hashPassword = bcrypt.hashSync(password, saltRounds);
    const newUser = await new authModel({
      username,
      email,
      password: hashPassword,
      repeat_password,
    });
    await newUser.save();
    return {
      success: true,
      message: "Created new user success",
      data: newUser,
    };
  } catch (error) {
    return { success: false, message: "server is disconnected" };
  }
};

const setAvatar = async (req) => {
  try {
    const userIdObject = await req.params.id;
    if (!userIdObject) {
      return { success: false, message: "missing params_idObject" };
    }
    const avatarImage = await req.body.avatarImage;
    if (!avatarImage) {
      return { success: false, message: "missing avatarImage" };
    }
    const user = await authModel
      .findOneAndUpdate(
        { _id: req.params.id },
        {
          isAvatarImageSet: true,
          avatarImage: req.body.avatarImage,
        },
        { new: true }
      )
      .select({ username: 1, email: 1, avatarImage: 1, _id: 1 });
    console.log(user);
    return { success: true, message: "Set Avatar success", data: user };
  } catch (error) {
    return { success: false, message: "server is disconnected" };
  }
};

const logout = async (req) => {
  const userId = await req.params.id;
  const onlineUser = await authModel.findOne({ _id: userId });
  try {
    if (!userId) {
      return { success: false, message: "UserId params is required" };
    }
    const userLogout = onlineUser.delete(userId);
    return { success: true, message: "User logout", data: userLogout };
  } catch (error) {
    return { success: false, message: "server disconnect" };
  }
};
module.exports = { showAllUsers, login, register, setAvatar, logout };
