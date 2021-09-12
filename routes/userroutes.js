const express = require("express");
const router = express.Router();
const schController = require("../controllers/GET/school");
const facultyController = require("../controllers/GET/faculties");
const departmentController = require("../controllers/GET/department");
const pastQuestionController = require("../controllers/GET/pastquestions");
const levelsController = require("../controllers/GET/level");
const paymentVerify = require("../controllers/userverify");
const schValidator = require("../validators/validateSchool");
const facultyValidator = require("../validators/validateFaculty");
const departmentValidator = require("../validators/validateDepartment");
const levelValidator = require("../validators/validateLevel");
const userController = require("../controllers/user");
const { validateAdminNew } = require("../validators/validateadmin");
router.get("/get/school", schController.fetchSchoolsDetails);
router.get(
  "/get/school/faculty",
  schValidator.validateSchoolForUserRequest,
  facultyController
);
router.get(
  "/get/school/faculty/department",
  schValidator.validateSchoolForUserRequest,
  facultyValidator.validateFaculty,
  departmentController.fetchDepartment
);
router.get(
  "/get/school/faculty/department/levels",
  schValidator.validateSchoolForUserRequest,
  facultyValidator.validateFaculty,
  departmentValidator.validateDepartment,
  levelsController
);
router.get(
  "/get/pastquestions",
  schValidator.validateSchoolForUserRequest,
  facultyValidator.validateFaculty,
  departmentValidator.validateDepartment,
  levelValidator.validateLevel,
  pastQuestionController
);
router.post("/verify/payment", paymentVerify.verifyUserPayment);
router.post(
  "/toggle/status",
  validateAdminNew,
  userController.toggleUserStatus
);
module.exports = router;
