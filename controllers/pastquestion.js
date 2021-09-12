const pricingDb = require("../models/pricing");
const validateFullSchool = require("../utility/validateFullSchool");
const { Op } = require("sequelize");
exports.getPastQuestionsPrice = async (req, res, next) => {
  try {
    const {
      isValid,
      school,
      faculty,
      department,
      level,
    } = await validateFullSchool(req);
    if (!isValid) {
      return res.status(404).json({
        code: 404,
        message: "invalid school details",
        price: 0,
      });
    }
    const { sem } = req.body;
    //get price of past question price
    const pricing = await pricingDb.findOne({
      where: {
        [Op.and]: [
          { schoolId: school.id },
          { facultyId: faculty.id },
          { departmentId: department.id },
          { levelId: level.id },
          { semester: sem },
        ],
      },
      attributes: ["price"],
    });
    return res.status(200).json({
      code: 200,
      price: pricing != null ? pricing.dataValues.price : 0,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ code: 500, price: 0, message: "an error occured" });
  }
};
