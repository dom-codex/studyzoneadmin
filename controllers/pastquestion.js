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
exports.setPastQuestionsPrice= async(req,res,next)=>{
  try{
const {canProceed} = req
if(!req.canProceed){
  return res.status(404).json({
    code:404,
    message:"access denied"
  })
}
const {
  isValid,
  school,
  faculty,
  department,
  level,
} = await validateFullSchool(req);
const {semester,price} = req.body
if (!isValid) {
  return res.status(404).json({
    code: 404,
    message: "invalid school details",
    price: 0,
  });
}
//check if pricing already exists

const pricing = await pricingDb.findOne({
  where: {
    [Op.and]: [
      { schoolId: school.id },
      { facultyId: faculty.id },
      { departmentId: department.id },
      { levelId: level.id },
      { semester: semester },
    ],
  },
  attributes: ["price"]
});
if(!pricing){
  //create findOne
  const newPricing = await pricingDb.create({
    price:price,
    title:`${level.name} ${school.name} ${department.name} pastquestions`,
    schoolId:school.id,
    facultyId:faculty.id,
    departmentId:department.id,
    levelId:level.id,
    semester:semester
  })
  return res.status(200).json({
    code:200,
    message:"price updated"
  })
}
await pricingDb.update({price:price},{
  where: {
    [Op.and]: [
      { schoolId: school.id },
      { facultyId: faculty.id },
      { departmentId: department.id },
      { levelId: level.id },
      { semester: semester },
    ],
  }
})
res.status(200).json({
  code:200,
  message:"price updated"
})
  }catch(e){
    console.log(e)
    res.status(500).json({
      code:500,
      message:"an error occured"
    })
  }
}
