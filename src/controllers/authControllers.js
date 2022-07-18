import * as authServices from "../services/authServices";

const getAllUsers = async (req, res) => {
  try {
    const response = await authServices.showAllUsers(req);
    return await res.status(200).json({
      success: response.success,
      message: response.message,
      data: response.data,
    });
  } catch (error) {
    return await res
      .status(500)
      .json({ success: false, message: "Error from server!" });
  }
};

const login = async (req, res) => {
  try {
    const response = await authServices.login(req);
    return await res.status(200).json({
      success: response.success,
      message: response.message,
      data: response.data,
    });
  } catch (error) {
    return await res
      .status(500)
      .json({ success: false, message: "Error from server!" });
  }
};

const register = async (req, res) => {
  try {
    const data = await authServices.register(req);
    return await res.status(200).json({
      success: data.success,
      message: data.message,
      data: data.data,
    });
  } catch (error) {
    return await res.status(500).json({
      success: false,
      message: "error from server!",
    });
  }
};

const setAvatar = async (req, res) => {
  try {
    const data = await authServices.setAvatar(req);
    return await res.status(200).json({
      success: data.success,
      message: data.message,
      data: data.data,
    });
  } catch (error) {
    return await res.status(500).json({
      success: data.success,
      message: "error from server!",
    });
  }
};

const logout = async (req, res) => {
  try {
    const data = await authServices.logout(req);
    return await res.status(200).json({
      success: data.success,
      message: data.message,
      data: data.data,
    });
  } catch (error) {
    return await res.status(500).json({
      success: data.success,
      message: "error from server!",
    });
  }
};
module.exports = { getAllUsers, login, register, setAvatar, logout };
