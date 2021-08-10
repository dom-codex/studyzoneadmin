const express = require("express");
const router = express.Router();
const validateSch = require("../auth/validateSchoolDetails");
const validateKey = require("../auth/validateKey");
router.post("/school", validateSch);
router.post("/purchasekey", validateKey);
module.exports = router;
