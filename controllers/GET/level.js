const levelDb = require("../../models/levels");
const sequelize = require("sequelize");
module.exports = async (req, res, next) => {
  try {
    const { canProceed, department } = req;
    if (!canProceed) {
      return res.status(404).json({
        code: 404,
        message: "",
      });
    }
    const levels = await levelDb.findAll({
      where: {
        departmentId: department.id,
      },
      attributes: ["lid", "level", "createdAt"],
    });
    res.status(200).json({
      code: 200,
      levels: levels,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      code: 500,
    });
  }
};
