const express = require("express");
const router = express.Router();
const {validateAdminOnGetRequest} = require("../validators/validateadmin")
const searchController = require("../controllers/search");
router.get("/school",validateAdminOnGetRequest ,searchController.searchForSchool);
router.get("/faculty",validateAdminOnGetRequest ,searchController.searchForFaculty);
router.get("/department",validateAdminOnGetRequest ,searchController.searchForDepartment);
router.get("/vendor",validateAdminOnGetRequest ,searchController.searchForVendor);
//  SEARCH ROUTES FOR USER
router.get("/for/school",searchController.searchForSchool);
router.get("/for/faculty",searchController.searchForFaculty);
router.get("/for/department",searchController.searchForDepartment);
module.exports = router;
