const express = require("express");
const router = express.Router();
const keyController = require("../controllers/lisenseKey");
const transactionController = require("../controllers/transaction");
router.post("/key", keyController.updateKeyStatus);
router.post("/delete/transaction", transactionController.deleteTransaction);
module.exports = router;
