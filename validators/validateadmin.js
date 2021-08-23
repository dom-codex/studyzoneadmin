const adminDb = require("../models/admin");
exports.validateAdmin = async (req, res, next) => {
  try {
    const { email, adminId } = req.body;
    const admin = await adminDb.findOne({
      where: {
        email: email,
        uid: adminId,
      },
    });
    if (!admin) {
      return res.json({
        code: 404,
        message: "invalidate credentials",
      });
    }
    req.admin = admin;
    req.canProceed = true;
    next();
  } catch (e) {
    console.log(e);
    res.status(500).json({
      code: 500,
      message: "an error occurred",
    });
  }
};
exports.validateAdminOnGetRequest = async (req, res, next) => {
  try {
    const { adminId } = req.query;
    const admin = await adminDb.findOne({
      where: {
        uid: adminId,
      },
    });
    if (!admin) {
      return res.json({
        code: 404,
        message: "invalidate credentials",
      });
    }
    req.admin = admin;
    req.canProceed = true;
    next();
  } catch (e) {
    console.log(e);
    res.status(500).json({
      code: 500,
      message: "an error occurred",
    });
  }
};
