const express = require("express");
const router = express.Router();
const multer = require("multer");
//controller and helper
const schoolController = require("../controllers/school");
const schoolHelper = require("../helpers/school");
const uploadHelper = require("../helpers/pastquestionupload");
const uploadController = require("../controllers/uploadPastQuestion");
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
router.post(
  "/pq",
  uploadHelper.upload,
  uploadHelper.uploadToCloud,
  uploadHelper.validateAdmin,
  uploadController.createPastQuestion
);
module.exports = router;
