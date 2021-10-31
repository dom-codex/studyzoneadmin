const pqDb = require("../../models/pastQuestion");
const pricingDb = require("../../models/pricing");
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
    const limit = 1;
    const pastquestions = await pqDb.findAll({
      limit: limit,
      offset: page * limit,
      attributes: [
        "title",
        "startYear",
        "endYear",
        "createdAt",
        "pid",
        "semester",
      ],
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
    //get price
    if (parseInt(page) == 0) {
      const pricing = await pricingDb.findOne({
        where: {
          [sequelize.Op.and]: [
            { schoolId: school.id },
            { facultyId: faculty.id },
            { departmentId: department.id },
            { levelId: level.id },
            { semester: semester },
          ],
        },
        attributes: ["price"],
      });
      return res.status(200).json({
        code: 200,
        pastquestions: pastquestions,
        pricing: pricing == null ? 0 : pricing.price,
      });
    }
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
