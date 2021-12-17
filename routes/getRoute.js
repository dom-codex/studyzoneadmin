const express = require("express");
const router = express.Router();
const getController = require("../controllers/GET/mainData");
const schoolController = require("../controllers/GET/school");
const facultyController = require("../controllers/GET/faculties");
const deptController = require("../controllers/GET/department");
const pastQuestiongetController = require("../controllers/GET/pastquestions");
const transactionController = require("../controllers/GET/transaction");
const withdrawalRequestController = require("../controllers/GET/withdrawalRequests");
const userInfoController = require("../controllers/GET/userInfo");
const levelController = require("../controllers/GET/level");
const userDownloadsController = require("../controllers/GET/downloads");
const validators = require("../validators/validateadmin");
const schValidator = require("../validators/validateSchool");
const facultyValidator = require("../validators/validateFaculty");
const deptValidator = require("../validators/validateDepartment");
const levelValidator = require("../validators/validateLevel");
const userController = require("../controllers/GET/users");
const lisenseKeyController = require("../controllers/lisenseKey");
const vendorController = require("../controllers/vendor");
const {getReferralBonus} = require("../requestsFromUserController/referral")
router.get("/stats", getController.fetchStatistics);
router.get("/schools", schoolController.fetchSchoolsDetails);
router.get("/activity/details", getController.fetchDetails);
router.get(
  "/users",
  validators.validateAdminOnGetRequest,
  userController.fetchUsers
);
const pastQuestionController = require("../controllers/pastquestion");
router.get(
  "/school/faculty",
  validators.validateAdminOnGetRequest,
  schValidator.validateSchool,
  facultyController
);
router.get(
  "/school/faculty/department",
  validators.validateAdminOnGetRequest,
  schValidator.validateSchool,
  facultyValidator.validateFaculty,
  deptController.fetchDepartment
);
router.get(
  "/school/faculty/dept/levels",
  validators.validateAdminOnGetRequest,
  schValidator.validateSchool,
  facultyValidator.validateFaculty,
  deptValidator.validateDepartment,
  levelController
);
router.get(
  "/pastquestions",
  validators.validateAdminOnGetRequest,
  schValidator.validateSchool,
  facultyValidator.validateFaculty,
  deptValidator.validateDepartment,
  levelValidator.validateLevel,
  pastQuestiongetController
);
router.get(
  "/transactions",
  validators.validateAdminOnGetRequest,
  transactionController
);
router.get(
  "/withdrawal/requests",
  validators.validateAdminOnGetRequest,
  withdrawalRequestController
);
router.get(
  "/user/referrallist",
  validators.validateAdminOnGetRequest,
  userInfoController.getAUserReferrals
);
router.get(
  "/user/transactions",
  validators.validateAdminOnGetRequest,
  userInfoController.getUserTransactions
);
router.get(
  "/user/downloads",
  validators.validateAdminOnGetRequest,
  userDownloadsController
);
router.post(
  "/pastquestion/amount",
  pastQuestionController.getPastQuestionsPrice
);
router.get("/freetrial/status", getController.checkForFreeTrialStatus);
router.get(
  "/keys/statistics",
  validators.validateAdminOnGetRequest,
  lisenseKeyController.getKeyStats
);
router.get(
  "/lisensekeys",
  validators.validateAdminOnGetRequest,
  lisenseKeyController.getLisensekeys
);
router.get(
  "/vendor/keys",
  validators.validateAdminOnGetRequest,
  vendorController.getVendorKeys
);
router.get("/vendors",validators.validateAdminOnGetRequest,vendorController.getVendors)
router.get("/vendor/stats",validators.validateAdminOnGetRequest,vendorController.getVendorStats)
router.get("/referral/bonus",getReferralBonus)
module.exports = router;
