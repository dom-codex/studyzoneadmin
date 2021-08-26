const express = require("express");
const router = express.Router();
const testimonyController = require("../controllers/testimony");
router.get("/user", testimonyController.checkForTestimony);
router.post("/user/add", testimonyController.addUserTestimony);
module.exports = router;
