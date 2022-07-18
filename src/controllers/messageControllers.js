import messageServices from "../services/messageServices";

const getMessages = async (req, res) => {
  try {
    const data = await messageServices.getMessages(req);
    return await res.status(200).json({
      success: data.success,
      message: data.message,
      data: data.data,
    });
  } catch (error) {
    return await res.status(400).json({
      success: false,
      message: "Error from server",
    });
  }
};

const addMessage = async (req, res) => {
  try {
    const data = await messageServices.addMessage(req);
    return res.status(200).json({
      success: data.success,
      message: data.message,
      data: data.data,
    });
  } catch (error) {
    return await res.status(400).json({
      success: false,
      message: "Error from server",
    });
  }
};

module.exports = { getMessages, addMessage };
