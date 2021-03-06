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
//new
const {
  getPastQuestions,
  checkFreeTrialAvailability,
  getPastQuestionPrice,
} = require("../requestsFromUserController/pastquestions");
const {
  createTransaction,
  createTransactionForKeyOrCardPayment,
  confirmTransaction,
  getCardPaymentSettings
} = require("../requestsFromUserController/transactions");
router.get("/get/school",(req,res,next)=> schController.fetchSchoolsDetails(req,res,next,true));
router.get(
  "/get/school/faculty",
  schValidator.validateSchoolForUserRequest,
  (req,res,next)=>facultyController(req,res,next,true)
);
router.get(
  "/get/school/faculty/department",
  schValidator.validateSchoolForUserRequest,
  facultyValidator.validateFaculty,
  (req,res,next)=>departmentController.fetchDepartment(req,res,next,true)
);
router.get(
  "/get/school/faculty/department/levels",
  schValidator.validateSchoolForUserRequest,
  facultyValidator.validateFaculty,
  departmentValidator.validateDepartment,
  levelsController
);
//to delete
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
//new method
router.get("/get/pastquestions/only", getPastQuestions);
router.get("/get/freetrial/settings", checkFreeTrialAvailability);
router.get("/get/pastquestions/price", getPastQuestionPrice);
router.post("/new/transaction", createTransaction);
router.post(
  "/create/new/payment/transaction",
  createTransactionForKeyOrCardPayment
);
router.get("/get/transaction/status", confirmTransaction);
router.get("/get/payment/settings",getCardPaymentSettings)
module.exports = router;
