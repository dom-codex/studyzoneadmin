const express = require("express");
const router = express.Router();
const downloadController = require("../controllers/download");
const { getAPastQuestion } = require("../requestsFromUserController/download");
router.post("/slugs", downloadController.createSlug);
router.post(
  "/get/pastquestions",
  downloadController.getOnePastQuestionForDownload
);
router.post("/pastquestion", getAPastQuestion);
module.exports = router;
