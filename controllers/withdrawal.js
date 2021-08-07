const utilsDb = require("../models/utils");
const withDrawalRequestDb = require("../models/withDrawalRequest");
exports.processWithDrawal = async (req, res, next) => {
  try {
    const { user, canProceed } = req;
    if (!canProceed) {
      return res.status(404).json({
        code: 400,
        message: "an error occurred, try again",
      });
    }
    const { amount } = req.body;
    //validate amount
    const minWithdrawal = await utilsDb.findOne({
      where: {
        name: "minWithdrawal",
      },
    });
    const maxWithdrawal = await utilsDb.findOne({
      where: {
        name: "maxWithdrawal",
      },
    });
    if (!minWithdrawal && !maxWithdrawal) {
      return res.status(500).json({
        code: 500,
        message: "an error occured please contact support",
      });
    }
    //parse value
    const minAmt = parseInt(minWithdrawal.value);
    const maxAmt = parseInt(maxWithdrawal.value);
    //validate amount
    if (amount < minAmt || amount > maxAmt) {
      return res.status(403).json({
        code: 403,
        message: "invalid amount,try again",
      });
    }
    //notify admin of withdrawal request
    const newRequest = await withDrawalRequestDb.create({
      amount: amount,
      userId: user.id,
    });
    //send notification to admin
    res.status(200).json({
      code: "200",
      message: "request placed successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      code: 500,
      message: "an error occurred",
    });
  }
};
