const adminDb = require("../models/admin");
const { Op } = require("sequelize");
exports.validateKeyGen = async (req, res, next) => {
  try {
    const { whom, uid, email } = req.body;
    //validate admin
    const admin = await adminDb.findOne({
      where: {
        [Op.and]: [{ email: email }, { uid: uid }],
      },
      excludes: ["password"],
    });
    if (!admin) {
      return res.status(404).json({
        code: 404,
        message: "invalid",
        action: "log out",
      });
    }
    if (whom.length <= 0) {
      return res.status(404).json({
        code: 404,
        message: "supply a value for target",
      });
    }
    req.canCreate = true;
    req.admin = admin;
    next();
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      code: 500,
      message: "an error occurred",
    });
  }
};
