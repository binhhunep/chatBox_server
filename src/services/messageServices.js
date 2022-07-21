import messageModel from "../models/messageModel";

const getMessages = async (req) => {
  try {
    const { from, to } = await req.body;
    if (!from || !to) {
      return { success: false, message: "No one online" };
    }
    const messages = await messageModel
      .find({
        users: { $all: [from, to] },
      })
      .sort({ updateAt: 1 });

    const projectedMessages = messages.map((msg) => {
      return {
        fromSeft: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });
    return {
      success: true,
      message: "Get all Message from sender",
      data: projectedMessages,
    };
  } catch (error) {
    return { success: false, message: "Server disconnect" };
  }
};

const addMessage = async (req) => {
  const { from, to, message } = await req.body;
  const data = await messageModel.create({
    message: { text: message },
    users: [from, to],
    sender: from,
  });

  if (data) {
    await data.save();
    return { success: true, message: "Message added successfully", data: data };
  }
  return { success: false, message: "Failed to add message to the database" };
};

module.exports = { getMessages, addMessage };
