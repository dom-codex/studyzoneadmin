const pastquestionDb = require("../models/pastQuestion");
const schoolDb = require("../models/school");
const facultyDb = require("../models/faculty");
const departmentDb = require("../models/department");
const levelDb = require("../models/levels");
const constants = require("../utility/constants");
const settings = require("../models/utils");
const pricingDb = require("../models/pricing");
exports.getPastQuestions = async (req, res, next) => {
  try {
    //retrieve params from requests
    const { school, faculty, department, level, semester, page } = req.query;
    //get the ids of school,faculty,department and level
    const institutionIds = await getInstitutionIds(
      school,
      faculty,
      department,
      level
    );
    if (!institutionIds)
      return res.status(404).json({
        message: "invalid information",
      });
    //get pastquestions
    const offset = constants.limit * page;
    const pastquestions = await pastquestionDb.findAll({
      where: {
        schoolId: institutionIds[0],
        facultyId: institutionIds[1],
        departmentId: institutionIds[2],
        levelId: institutionIds[3],
        semester: semester,
      },
      limit: constants.limit,
      offset: offset,
      attributes: ["pid", "title", "startYear", "endYear", "semester"],
    });
    res.status(200).json({
      pastquestions,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "an error occurred",
    });
  }
};
exports.getPastQuestionPrice = async (req, res, next) => {
  try {
    const { school, faculty, department, level, semester } = req.query;
    //get institutionIds
    const institutionIds = await getInstitutionIds(
      school,
      faculty,
      department,
      level
    );
    //get pricing
    const pricing = await pricingDb.findOne({
      where: {
        schoolId: institutionIds[0],
        facultyId: institutionIds[1],
        departmentId: institutionIds[2],
        levelId: institutionIds[3],
        semester: semester,
      },
      attributes: ["price"],
    });
    if (!pricing) {
      return res.status(200).json({
        price: 0,
      });
    }
    res.status(200).json({
      price: pricing.price,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      messgae: "an error occurred",
    });
  }
};
exports.checkFreeTrialAvailability = async (req, res, next) => {
  try {
    const freeTrialSettings = await settings.findOne({
      where: {
        name: "freeTrialAvailable",
      },
      attributes: ["value"],
    });
    if (!freeTrialSettings) {
      return res.status(200).json({
        freeTrialAvailable: false,
      });
    }
    res.status(200).json({
      freeTrialAvailable:
        freeTrialSettings.dataValues.value == "true" ? true : false,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "an error occurred",
    });
  }
};
const getInstitutionIds = async (school, faculty, department, level) => {
  //get school
  const sch = await schoolDb.findOne({
    where: {
      sid: school,
    },
    attribute: ["id"],
  });
  //get faculty
  const fac = await facultyDb.findOne({
    where: {
      fid: faculty,
    },
    attribute: ["id"],
  });
  //get department
  const dept = await departmentDb.findOne({
    where: {
      did: department,
    },
    attribute: ["id"],
  });
  //get level
  const lev = await levelDb.findOne({
    where: {
      lid: level,
    },
    attribute: ["id"],
  });
  if (sch && fac && dept && lev) {
    return [
      sch.dataValues.id,
      fac.dataValues.id,
      dept.dataValues.id,
      lev.dataValues.id,
    ];
  }
  return false;
};
