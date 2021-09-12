const express = require("express");
const router = express.Router();
const downloadController = require("../controllers/download");
router.post("/slugs", downloadController.createSlug);
router.post(
  "/get/pastquestions",
  downloadController.getOnePastQuestionForDownload
);
module.exports = router;
