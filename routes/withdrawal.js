const express = require("express");
const router = express.Router();
//imports for helper and controller
const withdrawHelper = require("../helpers/withdrawalHelper");
const withdrawController = require("../controllers/withdrawal");
const adminValidator = require("../validators/validateadmin");
router.post(
  "/request",
  withdrawHelper.validateWithdrawal,
  withdrawController.processWithDrawal
);
router.post(
  "/update/status",
  adminValidator.validateAdminNew,
  withdrawController.processWithDrawalRequestStatus
);
module.exports = router;
