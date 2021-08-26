const utilsDb = require("../models/utils");
const withdrawalDb = require("../models/withDrawalRequest");
const { Op } = require("sequelize");
exports.validateWithdrawal = async (req, res, next) => {
  try {
    const { user, name, email, amount } = req.body;
    const hasPendingRequest = await withdrawalDb.findOne({
      where: {
        [Op.and]: [
          {
            requestedBy: user,
          },
          { status: "PENDING" },
          { attendedTo: false },
        ],
      },
    });
    if (hasPendingRequest) {
      return res.json({
        code: 401,
        message: "you still have a pending request awaiting review",
      });
    }
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
      return res.json({
        code: 400,
        message: "an error occured please contact support",
      });
    }
    //parse value
    const minAmt = parseInt(minWithdrawal.value);
    const maxAmt = parseInt(maxWithdrawal.value);
    //validate amount
    if (amount < minAmt || amount > maxAmt) {
      return res.json({
        code: 403,
        message:
          amount < minAmt
            ? `Amount too small,should be greater than ${minAmt}`
            : `Amount to large should be lesser than ${maxAmt}`,
      });
    }
    req.canProceed = true;
    req.userName = name;
    req.uid = user;
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
