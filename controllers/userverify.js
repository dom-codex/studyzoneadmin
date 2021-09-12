const transactionDb = require("../models/transaction");
exports.verifyUserPayment = async (req, res, next) => {
  try {
    const { transactionId, user } = req.body;
    const transaction = await transactionDb.findOne({
      where: {
        userTxId: transactionId,
        userRef: user,
      },
    });
    res.status(200).json({
      transaction,
      code: 200,
    });
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
};
