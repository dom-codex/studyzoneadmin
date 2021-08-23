const express = require("express");
const router = express.Router();
const validators = require("../validators/validateadmin");
const schoolController = require("../controllers/school");
router.post(
  "/school",
  validators.validateAdmin,
  schoolController.deleteSchool
);
module.exports = router;
