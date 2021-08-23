const levelDb = require("../models/levels");
const sequelize = require("sequelize");
exports.validateLevel = async (req, res, next) => {
  try {
    const { school, faculty, department, canProceed } = req;
    const { lid } = req.query;
    if (!canProceed) {
      return res.status(400).json({
        code: 400,
        message: "bad request",
      });
    }
    req.canProceed = false;
    const level = await levelDb.findOne({
      attributes: ["id"],
      where: {
        [sequelize.Op.and]: [
          {
            schoolId: school.id,
            facultyId: faculty.id,
            departmentId: department.id,
            lid: lid,
          },
        ],
      },
    });
    if (!level) {
      return res.status(404).json({
        code: 404,
        message: "level does not exist",
      });
    }
    req.level = level;
    req.canProceed = true;
    next();
  } catch (e) {
    console.log(e);
    return res.status(500);
  }
};
