const express = require("express");
const router = express.Router();
const multer = require("multer");
//controller and helper
const schoolController = require("../controllers/school");
const schoolHelper = require("../helpers/school");
const uploadHelper = require("../helpers/pastquestionupload");
const uploadController = require("../controllers/uploadPastQuestion");
const keyGen = require("../helpers/keyGen");
const keyGenController = require("../controllers/lisenseKey");
const transactionController = require("../controllers/transaction");
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
router.post(
  "/level",
  schoolHelper.validateLevelCredentials,
  schoolController.createLevel
);
router.post("/keys", keyGen.validateKeyGen, keyGenController.genLisenseKey);
router.post("/transaction", transactionController.createTransaction);
module.exports = router;
