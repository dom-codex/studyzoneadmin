const express = require("express");
const router = express.Router();
const searchController = require("../controllers/search");
router.get("/schools", searchController.searchForSchool);
module.exports = router;
