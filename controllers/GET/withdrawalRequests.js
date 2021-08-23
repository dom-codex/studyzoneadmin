const withDrawalDb = require("../../models/withDrawalRequest");
module.exports = async (req, res, next) => {
  try {
    const { canProceed } = req;
    const { page } = req.query;
    if (!canProceed) {
      return res.status(400).json({
        code: 400,
        message: "cannot carry out this operation",
      });
    }
    const limit = 10;
    const requests = await withDrawalDb.findAll({
      limit: limit,
      offset: page * 1,
      attributes: {
        exclude: ["id", "updatedAt"],
      },
    });
    return res.status(200).json({
      code: 200,
      requests: requests,
    });
  } catch (e) {
    console.log(e);
    res.status(500);
  }
};
