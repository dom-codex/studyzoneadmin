const userDb = require("../models/user");
exports.validateWithdrawal = async (req, res, next) => {
  try {
    const { user } = req.body;
    //validate user
    const oldUser = await userDb.findOne({
      where: {
        sid: user,
      },
      attributes: ["id", "email", "sid", "name"],
    });
    if (!oldUser) {
      return res.status(404).json({
        code: 404,
        message: "user not found",
      });
    }
    req.canProceed = true;
    req.user = oldUser;
    next();
  } catch (e) {
    console.log(e);
    res.status(500).json({
      code: 500,
      message: "an error occurred",
    });
  }
};
