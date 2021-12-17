const express = require("express");
const router = express.Router();
//imports for helper and controller
const withdrawHelper = require("../helpers/withdrawalHelper");
const {processWithDrawal,processWithDrawalRequestStatus,comfirmWithdrawalStatus} = require("../controllers/withdrawal");
const adminValidator = require("../validators/validateadmin");
router.post(
  "/request",
  withdrawHelper.validateWithdrawal,
  processWithDrawal
);
router.post(
  "/update/status",
  adminValidator.validateAdminNew,
  processWithDrawalRequestStatus
);
router.get("/comfirm/status",comfirmWithdrawalStatus)
module.exports = router;
