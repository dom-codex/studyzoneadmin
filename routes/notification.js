const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notifications");
const validator = require("../validators/validateadmin");
const notificationHandler = require("../controllers/GET/notifications")
router.post(
  "/post/to/user",
  validator.validateAdminNew,
  notificationController.postNotificationToUser
);
router.get("/get/all",validator.validateAdminOnGetRequest,notificationController.getNotifications)
router.post("/delete",validator.validateAdminNew,notificationController.deleteNotification)
router.post("/send/announcement",validator.validateAdminNew,notificationController.sendAnnouncement)
router.get("/get/announcements",notificationHandler.getAnnouncements)
module.exports = router;
