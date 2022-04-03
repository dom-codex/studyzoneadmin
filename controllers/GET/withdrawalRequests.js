const withDrawalDb = require("../../models/withDrawalRequest");
const testimonyDb = require("../../models/testimony");
const {
  extractUserRefs,
  compileRequestResult,
} = require("../../utility/withdrawalRequestUtils");
const { Op } = require("sequelize");
const { limit } = require("../../utility/constants");
module.exports = async (req, res, next) => {
  try {
    const { canProceed } = req;
    const { page, status } = req.query;
    if (!canProceed) {
      return res.status(400).json({
        code: 400,
        message: "cannot carry out this operation",
      });
    }
    const requests = await withDrawalDb.findAll({
      limit: limit,
      offset: (page - 1) * 1,
      order:[["createdAt","DESC"]],
      where: {
        status: status,
      },
      attributes: {
        exclude: ["id", "updatedAt"],
      },
    });
    //extract user ids
    const refs = extractUserRefs(requests);
    //retrieve testimonies
    const testimonies = await testimonyDb.findAll({
      where: {
        user: {
          [Op.in]: refs,
        },
      },
      attributes: ["user", "videoLink"],
    });
    //merge result
    const result = compileRequestResult(requests, testimonies);

    return res.status(200).json({
      code: 200,
      requests: result,
      //requests: requests,
    });
  } catch (e) {
    console.log(e);
    res.status(500);
  }
};
