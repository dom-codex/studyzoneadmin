const { Op } = require("sequelize");
const schoolDb = require("../models/school");
exports.searchForSchool = async (req, res, next) => {
  try {
    const { school } = req.query;
    const schools = await schoolDb.findAll({
      where: {
        [Op.or]: [
          {
            name: {
              [Op.like]: `%${school}%`,
            },
          },
          {
            nameAbbr: {
              [Op.like]: `%${school}%`,
            },
          },
        ],
      },
      attributes: { exclude: ["id", "updatedAt"] },
    });
    res.status(200).json({
      schools,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      code: 500,
      message: "an error occurred",
    });
  }
};
