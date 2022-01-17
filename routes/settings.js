const express = require("express");
const router = express.Router();
const validator = require("../validators/validateadmin");
const settingsController = require("../controllers/settings");
router.get(
  "/get/all",
  validator.validateAdminOnGetRequest,
  settingsController.getSettings
);
router.post(
  "/update",
  validator.validateAdminNew,
  settingsController.upDateSettings
);
router.get("/get/setting",settingsController.getSetting)
module.exports = router;
