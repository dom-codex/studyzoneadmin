const withDrawalRequestDb = require("../models/withDrawalRequest");
exports.processWithDrawal = async (req, res, next) => {
  try {
    const { userName, uid, userEmail, canProceed } = req;
    if (!canProceed) {
      return res.json({
        code: 400,
        message: "an error occurred, try again",
      });
    }
    const { amount } = req.body;
    //notify admin of withdrawal request
    const newRequest = await withDrawalRequestDb.create({
      amount: amount,
      requestedBy: uid,
      requesteeName: userName,
      requesteeEmail: userEmail,
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
exports.processWithDrawalRequestStatus = async (req, res, next) => {
  try {
    //continue by updating the payment status
    const { canProceed } = req;
    if (!canProceed) {
      return res.status(404).json({
        code: 404,
        message: "admin not found",
      });
    }
    const { status, withdrawalHash } = req.body;
    const updated = await withDrawalRequestDb.update(
      {
        status: status,
      },
      {
        where: {
          wid: withdrawalHash,
        },
      }
    );
    return res.status(200).json({
      code: 200,
      message: "update",
      withdrawalId: withdrawalHash,
      status: status,
    });
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
};
