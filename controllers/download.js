const downloadDb = require("../models/downloadSlug");
const pastQuestiondDb = require("../models/pastQuestion");
const levelDb = require("../models/levels");
const schDb = require("../models/school");
const facDb = require("../models/faculty");
const deptDb = require("../models/department");
const nanoid = require("nanoid").nanoid;
const { Op } = require("sequelize");
exports.createSlug = async (req, res, next) => {
  try {
    const { uid, email, deviceId, sch, fac, dept, lev, ref } = req.body;
    const data = await levelDb.findOne({
      where: {
        lid: lev,
      },
      include: [
        {
          model: schDb,
          where: {
            sid: sch,
          },
        },
        {
          model: facDb,
          where: {
            fid: fac,
          },
        },
        {
          model: deptDb,
          where: {
            did: dept,
          },
        },
      ],
    });
    if (!data) {
      return res.status(404).json({
        code: 404,
        inValid: false,
        message: "invalid info",
      });
    }
    const { school, faculty, department } = data;
    if (!school) {
      return res.status(404).json({
        code: 404,
        inValid: false,
        message: "invalid info",
      });
    }
    if (!faculty) {
      return res.status(404).json({
        code: 404,
        inValid: false,
        message: "invalid info",
      });
    }
    if (!department) {
      return res.status(404).json({
        code: 404,
        inValid: false,
        message: "invalid info",
      });
    }
    const pq = await pastQuestiondDb.findAll({
      where: {
        [Op.and]: [
          { schoolId: school.id },
          { facultyId: faculty.id },
          { levelId: data.id },
          { departmentId: department.id },
        ],
      },
      attributes: ["id", "pid"],
    });
    if (pq.length <= 0) {
      return res.status(404).json({
        inValid: false,
        code: 404,
        message: "past question not found",
      });
    }
    const slugs = [];
    for (let i = 0; i < pq.length; i++) {
      const slug = nanoid();
      const downloadData = {
        slug: slug,
        deviceId: deviceId,
        user: uid,
        email: email,
        pastQuestionId: pq[i].pid,
        trId: ref,
      };
      slugs.push(downloadData);
    }
    const downloads = await downloadDb.bulkCreate(slugs, { validate: true });
    res.status(200).json({
      isValid: true,
      data: downloads,
      code: 200,
      message: "successful",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      code: 500,
      message: "an error occurred",
    });
  }
};
