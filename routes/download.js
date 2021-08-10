const express = require("express");
const router = express.Router();
const downloadController = require("../controllers/download");
router.post("/slugs", downloadController.createSlug);
module.exports = router;
