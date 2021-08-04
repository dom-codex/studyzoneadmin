const express = require("express");
const router = express.Router();
//controller import
const authController = require("../controllers/auth");
//helpers imports
const authHelper = require("../helpers/auth");
router.post(
  "/admin/create",
  authHelper.validateUserSignUp,
  authController.createAdmin
);
router.post(
  "/admin/login",
  authHelper.validateLoginDetails,
  authController.login
);
router.post(
  "/admin/verify",
  authHelper.validateVerificationDetails,
  authController.verifyAccount
);
module.exports = router;
