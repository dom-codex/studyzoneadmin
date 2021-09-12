const express = require("express");
const router = express.Router();
const keyController = require("../controllers/lisenseKey");
const transactionController = require("../controllers/transaction");
const withdrawalController = require("../controllers/withdrawal");
const adminValidator = require("../validators/validateadmin");
const settingsController = require("../controllers/settings");
router.post("/key", keyController.updateKeyStatus);
router.post("/delete/transaction", transactionController.deleteTransaction);
router.post(
  "/settings",
  adminValidator.validateAdminNew,
  settingsController.upDateSettings
);
module.exports = router;
