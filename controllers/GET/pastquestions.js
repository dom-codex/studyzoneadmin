const pqDb = require("../../models/pastQuestion");
const sequelize = require("sequelize");
module.exports = async (req, res, next) => {
  try {
    const { school, faculty, department, level, canProceed } = req;
    const { semester, page } = req.query;
    if (!canProceed) {
      return res.status(404).json({
        code: 400,
        message: "invalid credentials",
      });
    }
    const limit = 10;
    const pastquestions = await pqDb.findAll({
      limit: limit,
      offset: page * limit,
      attributes: ["title", "startYear", "endYear", "createdAt", "pid"],
      where: {
        [sequelize.Op.and]: [
          { schoolId: school.id },
          { facultyId: faculty.id },
          { departmentId: department.id },
          { levelId: level.id },
          { semester: semester },
        ],
      },
    });
    return res.status(200).json({
      code: 200,
      pastquestions: pastquestions,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      code: 500,
      message: "",
    });
  }
};
