const chatDb = require("../models/chat");
const chatListDb = require("../models/chatlist");
const { sendIONotification,sendNotificationToChatWall } = require("../utility/notification");
const axios = require("axios");
exports.receiveMessageFromUser = async (req, res, next) => {
  try {
    const { sender, group, message, time, chatId, name, email } = req.body;
    //find user in chatlist
    const chatlistUser = await chatListDb.findOne({
      where: {
        user: sender,
      },
      attributes: ["id", "user", "lastMessage"],
    });
    //check if user is in chat list already
    if (!chatlistUser) {
      //create new chat user
      const newChatListUser = await chatListDb.create({
        user: sender,
        lastMessage: message,
        time: time,
        group: group,
        name,
        email,
      });
    }
    //create chat
    const newChat = await chatDb.create({
      sender: sender,
      message: message,
      time: time,
      chatId: chatId,
      group: group,
      messageType: "RECEIVER",
    });
    //update chatListDb
    chatlistUser.lastMessage = message
    await chatlistUser.save()
    sendIONotification("onUpdateChatlist", {
      name: name,
      email: email,
      sender: sender,
      group: group,
      message: message,
      time: time,
    });
    sendNotificationToChatWall("newMessage", {
      message: message,
      name: name,
      email: email,
      sender: sender,
      group: group,
      message: message,
      time: time,
      chatId: chatId,
    });
    res.status(200).json({
      code: 200,
      message: "message sent",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ code: 500, message: "an error occured" });
  }
};
exports.sendMessageToUser = async (req, res, next) => {
  try {
    const { canProceed } = req;
    if (!canProceed) {
      return res.status(404).json({
        code: 404,
        message: "admin does not exist",
      });
    }
    const { message, group, sender, time,receiver } = req.body;
    const newChat = await chatDb.build({
      message: message,
      time: time,
      sender: sender,
      group: group,
      messageType: "SENDER",
    });
    //send message to user
    const uri = `${process.env.userBase}/support/send/message/to/user`;
    const { data } = await axios.post(uri, {
      message,
      group,
      time,
      sender,
      chatId:newChat.chatId
    });
    //if successful commit to dataBase
    if (data.code != 200) {
      return res.status(401).json({
        code: 401,
        message: "an error occured",
      });
    }
    await newChat.save();
    //update chat list last messageType
    await chatListDb.update({lastMessage:message},{
      where:{
        user:receiver
      }
    })
    res.status(200).json({
      code: 200,
      chatId: newChat.chatId,
      message: "sent",
    });
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
};
