const department = require("../../models/department");
const faculty = require("../../models/faculty");
const levels = require("../../models/levels");
const school = require("../../models/school");
const transactionDb = require("../../models/transaction");
const level = require("./level");
module.exports = async (req, res, next) => {
  try {
    const { canProceed } = req;
    const { page } = req.query;
    if (!canProceed) {
      return res.status(404).json({
        code: 404,
        message: "invalid request",
      });
    }
    const limit = 15;
    const transactions = await transactionDb.findAll({
      limit: limit,
      offset: page * limit,
      attributes: {
        exclude: [
          "id",
          "updatedAt",
          "schoolId",
          "facultyId",
          "departmentId",
          "levelId",
        ],
      },
      include: [
        {
          model: school,
          attributes: ["name", "sid"],
        },
        {
          model: faculty,
          attributes: ["name", "fid"],
        },
        {
          model: department,
          attributes: ["name", "did"],
        },
        {
          model: levels,
          attributes: ["level", "lid"],
        },
      ],
    });
    return res.status(200).json({
      code: 200,
      transactions: transactions,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ code: 500 });
  }
};
