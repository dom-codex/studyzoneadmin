const express = require("express");
const router = express.Router();
//controller and helper
const schoolController = require("../controllers/school");
const schoolHelper = require("../helpers/school");
router.post(
  "/school",
  schoolHelper.validateSchoolCreationDetails,
  schoolController.createSchool
);
router.post(
  "/faculty",
  schoolHelper.validateFacultyDetails,
  schoolController.createFaculty
);
router.post(
  "/department",
  schoolHelper.validateDepartmentCredentials,
  schoolController.createDepartment
);
module.exports = router;
