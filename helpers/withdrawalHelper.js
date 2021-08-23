const userDb = require("../models/user");
const utilsDb = require("../models/utils");
exports.validateWithdrawal = async (req, res, next) => {
  try {
    const { user, name, email } = req.body;
    //validate user
    /*const oldUser = await userDb.findOne({
      where: {
        uid: user,
      },
      attributes: ["id", "email", "uid", "name"],
    });
    console.log(oldUser);
    if (!oldUser) {
      return res.status(404).json({
        code: 404,
        message: "user not found",
      });
    }*/
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
    req.canProceed = true;
    (req.userName = name), (req.uid = user);
    req.userEmail = email;
    //req.user = oldUser;
    next();
  } catch (e) {
    console.log(e);
    res.status(500).json({
      code: 500,
      message: "an error occurred",
    });
  }
};
