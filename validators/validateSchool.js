const schoolDb = require("../models/school");
exports.validateSchool = async (req, res, next) => {
  try {
    const { sch } = req.query;
    const { canProceed } = req;
    if (!canProceed) {
      return res.status(404).json({
        code: 400,
        message: "admin not found",
      });
    }
    const school = await schoolDb.findOne({
      where: {
        sid: sch,
      },
      attributes: ["id", "sid"],
    });
    if (!school) {
      return res.status(404).json({
        message: "school does not exist",
        code: 400,
      });
    }
    req.school = school;
    req.canProceed = true;
    next();
  } catch (e) {
    console.log(e);
    res.status(500);
  }
};
