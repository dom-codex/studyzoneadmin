const express = require("express");
const router = express.Router();
const validateSch = require("../auth/validateSchoolDetails");
const validateKey = require("../auth/validateKey");
const {
  verifyLisenseKey,
} = require("../requestsFromUserController/lisenseKey");
router.post("/school", validateSch);
router.post(
  "/purchasekey",
  validateKey.validateCredentials,
  validateKey.validateKey
);
router.post("/lisensekey", verifyLisenseKey);
module.exports = router;
