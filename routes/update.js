const express = require("express");
const router = express.Router();
const keyController = require("../controllers/lisenseKey");
const transactionController = require("../controllers/transaction");
const vendorController = require("../controllers/vendor");
const adminValidator = require("../validators/validateadmin");
const settingsController = require("../controllers/settings");
const pricingController = require("../controllers/pastquestion");
router.post("/key", keyController.updateKeyStatus);
router.post("/delete/transaction", transactionController.deleteTransaction);
router.post(
  "/settings",
  adminValidator.validateAdminNew,
  settingsController.upDateSettings
);
router.post(
  "/pastquestions/price",
  adminValidator.validateAdminNew,
  pricingController.setPastQuestionsPrice
);
router.post(
  "/key/price",
  adminValidator.validateAdminNew,
  keyController.updateKeyPrice
);
router.post(
  "/delete/key",
  adminValidator.validateAdminNew,
  keyController.deleteKey
);
router.post(
  "/delete/vendor",
  adminValidator.validateAdminNew,
  vendorController.deleteVendor
);
module.exports = router;
