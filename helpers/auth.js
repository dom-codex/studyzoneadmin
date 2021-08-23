const adminDb = require("../models/admin");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
exports.validateUserSignUp = async (req, res, next) => {
  try {
    const { email } = req.body;
    //check for non existence of email
    const admin = await adminDb.findOne({
      where: { [Op.or]: [{ email: email }] },
      attribute: ["id", "email"],
    });
    if (admin) {
      return res.status(401).json({
        code: 401,
        message:
          " email is already associated with an account or master account already exists",
      });
    }

    req.canCreateAdmin = true;
    next();
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "an error occurred",
    });
  }
};
exports.validateLoginDetails = async (req, res, next) => {
  try {
    const { email, role, password } = req.body;
    //check for existence of the acccount
    const admin = await adminDb.findOne({
      where: { [Op.and]: [{ email: email }] },
    });
    if (!admin) {
      return res.status(404).json({
        code: 404,
        message: "account not found",
      });
    }
    if (!admin.isVerified) {
      return res.status(401).json({
        code: 400,
        message: " account not verified",
      });
    }
    //compare passwords
    const result = await bcrypt.compare(password, admin.password);
    if (!result) {
      return res.status(400).json({
        code: 400,
        message: "invalid email or password",
      });
    }
    req.canLogin = true;
    req.admin = admin;
    next();
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      code: 500,
      message: "an error occured try again",
    });
  }
};
exports.validateVerificationDetails = async (req, res, next) => {
  try {
    const { email, uid, verificationCode } = req.body;
    //find associated account]
    const admin = await adminDb.findOne({
      where: {
        [Op.and]: [
          { email: email },
          { uid: uid },
          { verificationCode: verificationCode },
        ],
      },
    });
    if (!admin) {
      return res.status(404).json({
        code: 404,
        message: "invalid email",
      });
    }
    req.canVerify = true;
    req.admin = admin;
    next();
  } catch (e) {
    res.status(500).json({
      code: 500,
      message: "an error occured try again",
    });
  }
};
