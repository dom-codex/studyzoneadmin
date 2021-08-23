const downloadsDb = require("../../models/downloadSlug");
const pastQuestionDb = require("../../models/pastQuestion");
const levelDb = require("../../models/levels");
const departmentDb = require("../../models/department");
const schoolDb = require("../../models/school");
const extractor = require("../../utility/pqinfoExtractor");
const resultCompiler = require("../../utility/complieDownloads");
const sequelize = require("sequelize");
module.exports = async (req, res, next) => {
  try {
    const { canProceed } = req;
    const { user, page } = req.query;
    if (!canProceed) {
      return res.json({
        code: 400,
        message: "cannot process request",
      });
    }
    const limit = 10;
    const downloads = await downloadsDb.findAll({
      limit: limit,
      offset: page * limit,
      attributes: ["user", "slug"],
      where: {
        user: user,
      },
      include: {
        model: pastQuestionDb,
        attributes: [
          "startYear",
          "endYear",
          "title",
          "schoolId",
          "departmentId",
          "levelId",
          "semester",
        ],
      },
    });
    if (!(downloads.length > 0)) {
      return res.status(201).json({
        code: 201,
        message: "no downloads",
        downloads: downloads,
      });
    }
    const schids = extractor.extractSchIds(downloads);
    const deptids = extractor.extractDeptIds(downloads);
    const levids = extractor.extractLevelIds(downloads);
    //FIND sch, dept , and level
    const schools = await schoolDb.findAll({
      where: {
        id: {
          [sequelize.Op.in]: schids,
        },
      },
      attributes: ["id", "nameAbbr"],
    });
    const depts = await departmentDb.findAll({
      where: {
        id: {
          [sequelize.Op.in]: deptids,
        },
      },
      attributes: ["id", "name"],
    });
    const levels = await levelDb.findAll({
      where: {
        id: {
          [sequelize.Op.in]: levids,
        },
      },
      attributes: ["level", "id"],
    });
    const result = resultCompiler(downloads, schools, depts, levels);
    res.status(200).json({
      code: 200,
      downloads: result,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      code: 500,
      message: "an error occurred",
    });
  }
};
