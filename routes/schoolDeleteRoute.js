const express = require("express");
const router = express.Router();
const validators = require("../validators/validateadmin");
const schoolController = require("../controllers/school");
const deleteController = require("../controllers/deleteController");
router.post("/school", validators.validateAdmin, schoolController.deleteSchool);
router.post(
  "/pastquestion",
  validators.validateAdminNew,
  deleteController.deletePastQuestion
);
module.exports = router;
