const chatDb = require("../models/chat");
const chatListDb = require("../models/chatlist");
const {
  sendIONotification,
  sendNotificationToChatWall,
} = require("../utility/notification");
const axios = require("axios");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const nanoid = require("nanoid").nanoid
const { Dropbox } = require("dropbox")
const getLink = require("../utility/createOrGetLink")
exports.receiveMessageFromUser = async (req, res, next) => {
  try {
    const {
      sender,
      group,
      message,
      time,
      chatId,
      name,
      email,
      mediaName,
      mediaUrl,
    } = req.body;
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
    } else {
      //create chat
      const newChat = await chatDb.create({
        sender: sender,
        message: message,
        time: time,
        chatId: chatId,
        group: group,
        messageType: mediaName ? "RECEIVER_WITH_MEDIA" : "RECEIVER",
        mediaName: mediaName,
        mediaUrl: mediaUrl,
      });
      //update chatListDb
      chatlistUser.lastMessage = message;
      await chatlistUser.save();
    }
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
      messageType: mediaName ? "RECEIVER_WITH_MEDIA" : "RECEIVER",
      mediaName: mediaName,
      mediaUrl: mediaUrl,
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

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    const name = `study_img_${nanoid()}_${file.originalname}`;
    req.fileName = name;
    cb(null, name);
  },
  //add mime type and size filter
});
exports.imageUploader = multer({ storage: storage }).single("chatImage");
//FILE UNLINK FUNCTION
const deleteFile = (path, cb) => {
  fs.unlink(path, (e) => {
    cb()
  })
}
exports.sendMediaMessageToUser = async (req, res, next) => {
  const { fileName } = req
  try {
    const { canProceed } = req;
    if (!canProceed) {
      console.log("could not upload file");
      return res.status(404).json({
        code: 404,
        message: "could not upload file",
      });
    }
    //save image to cloud
    const pathTofile = path.join(`./uploads/${fileName}`);
    const dropbox = new Dropbox({ accessToken: process.env.dropboxToken })
    const result = await dropbox.filesUpload({ path: `/support/${fileName}` })
    //GET LINK TO UPLOADED IMAGE
    const newLink= await getLink("support",fileName)
    
    const { message, group, sender, time, receiver } = req.body;
    const newChat = await chatDb.build({
      message: message,
      time: time,
      sender: sender,
      group: group,
      messageType: "SENDER_WITH_MEDIA",
      mediaName: fileName,
      mediaUrl: newLink,
    });
    //send message to user
    const uri = `${process.env.userBase}/support/send/message/to/user`;
    const { data } = await axios.post(uri, {
      message,
      group,
      time,
      sender,
      chatId: newChat.chatId,
      mediaName: fileName,
      mediaUrl: newLink,
    });
    //if successful commit to dataBase
    if (data.code != 200) {
      //UNLINK FILE FROM SERVER
      deleteFile(pathTofile,()=>{
        return res.status(401).json({
        code: 401,
        message: "an error occured",
      }); 
      })
     
    }
    await newChat.save();
    //update chat list last messageType
    await chatListDb.update(
      { lastMessage: message },
      {
        where: {
          user: receiver,
        },
      }
    );
    //UNLINK FROM FROM SERVER
    deleteFile(pathTofile,()=>{
      res.status(200).json({
      code: 200,
      chatId: newChat.chatId,
      message: "sent",
    });
    })
    
  } catch (e) {
    console.log(e);
    //UNLINK FILE FROM SERVER
    const pathTofile = path.join(`./uploads/${fileName}`);
    deleteFile(pathTofile,()=>{
       res.status(500).json({
      code: 500,
      message: "an error occurred",
    });
    })
   
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
    const { message, group, sender, time, receiver } = req.body;
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
      chatId: newChat.chatId,
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
    await chatListDb.update(
      { lastMessage: message },
      {
        where: {
          user: receiver,
        },
      }
    );
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
