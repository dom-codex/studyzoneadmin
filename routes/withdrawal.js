const express = require("express");
const router = express.Router();
//imports for helper and controller
const withdrawHelper = require("../helpers/withdrawalHelper");
const withdrawController = require("../controllers/withdrawal");
router.post(
  "/request",
  withdrawHelper.validateWithdrawal,
  withdrawController.processWithDrawal
);
module.exports = router;
