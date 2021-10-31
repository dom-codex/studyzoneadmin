const express = require("express");
const router = express.Router();
const validator = require("../validators/validateadmin");
const chatController = require("../controllers/GET/chat");
const chatcontroller = require("../controllers/chat");
router.get("/get/group/details", chatController.getGroupChatDetails);
router.post("/send/message/to/admin", chatcontroller.receiveMessageFromUser);
router.post(
  "/send/message/to/user",
  validator.validateAdminNew,
  chatcontroller.sendMessageToUser
);
router.post(
  "/send/media/message",
  chatcontroller.imageUploader,
  validator.validateAdminNew,
  chatcontroller.sendMediaMessageToUser
);
router.get(
  "/get/chatlist",
  validator.validateAdminOnGetRequest,
  chatController.getChatList
);
router.get(
  "/get/chats",
  validator.validateAdminOnGetRequest,
  chatController.getChats
);
router.post("/get/offline/chats", chatController.getOfflineChats);
module.exports = router;
