const axios = require("axios");
const transactionDb = require("../../models/transaction");
exports.getAUserReferrals = async (req, res, next) => {
  try {
    const { canProceed } = req;
    if (!canProceed) {
      return res.status(404).json({
        code: 404,
        message: "admin not found",
      });
    }
    const { user, page } = req.query;
    const url = `${process.env.userBase}/get/referrals?userId=${user}&page=${page}`;
    const { data } = await axios.get(url);
    if (data.code != 200) {
      return res.status(data.code).json({
        code: data.code,
        message: data.message,
      });
    }
    return res.status(200).json({
      code: 200,
      referrals: data.referredPersons,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      code: 500,
      message: "an error occured",
    });
  }
};
exports.getUserTransactions = async (req, res, next) => {
  try {
    const { canProceed } = req;
    if (!canProceed) {
      return res.status(400).json({
        code: 400,
        message: "cannot further request",
      });
    }
    const { user, page } = req.query;
    const limit = 1;
    const userTransactions = await transactionDb.findAll({
      limit: limit,
      offset: limit * page,
      where: {
        userRef: user,
      },
      attributes: {
        exclude: ["id", "updatedAt"],
      },
    });
    return res.status(200).json({
      code: 200,
      transactions: userTransactions,
    });
  } catch {
    console.log(e);
    res.status(500);
  }
};
