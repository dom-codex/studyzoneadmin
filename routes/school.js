const express = require("express");
const router = express.Router();
//controller and helper
const schoolController = require("../controllers/school");
const schoolHelper = require("../helpers/school");
const uploadHelper = require("../helpers/pastquestionupload");
const uploadController = require("../controllers/uploadPastQuestion");
const keyGen = require("../helpers/keyGen");
const keyGenController = require("../controllers/lisenseKey");
const transactionController = require("../controllers/transaction");
const validator = require("../validators/validateadmin");
const vendorController = require("../controllers/vendor");
const multer = require("multer");
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
  (req,res,next)=>{
    uploadHelper.upload(req,res,(err)=>{
      if(err instanceof multer.MulterError){
        console.log(err.message)
        return res.status(401).json({
          message:err.message
        })
      }else if(err){
        return res.status(400).json({
          message:"upload failed"
        })
      }
      else{
        next()
      }
    })
  },
  uploadHelper.validateAdmin,
  uploadHelper.uploadToCloud,
  uploadController.createPastQuestion
);
router.post(
  "/level",
  schoolHelper.validateLevelCredentials,
  schoolController.createLevel
);
router.post("/keys", keyGen.validateKeyGen, keyGenController.genLisenseKey);
router.post("/transaction", transactionController.createTransaction);
router.post(
  "/vendor",
  validator.validateAdminNew,
  vendorController.createVendor
);
module.exports = router;
