const pricingDb = require("../models/pricing");
const validateFullSchool = require("../utility/validateFullSchool");
const { Op } = require("sequelize");
const axios = require("axios")
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
    console.log(pricing)
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
const {semester,pricing} = req.body
if (!isValid) {
  return res.status(404).json({
    code: 404,
    message: "invalid school details",
    price: 0,
  });
}
//check if pricing already exists

const pricingLog = await pricingDb.findOne({
  where: {
    [Op.and]: [
      { schoolId: school.id },
      { facultyId: faculty.id },
      { departmentId: department.id },
      { levelId: level.id },
      { semester: semester },
    ],
  },
  attributes: ["id","price"]
});
if(!pricingLog){
  //create findOne
  const newPricing = await pricingDb.create({
    price:pricing,
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
pricingLog.price = pricing
await pricingLog.save()
/*await pricingDb.update({price:price},{
  where: {
    [Op.and]: [
      { schoolId: school.id },
      { facultyId: faculty.id },
      { departmentId: department.id },
      { levelId: level.id },
      { semester: semester },
    ],
  }
})*/
try{
  const uri = `${process.env.userBase}/notifications/realtime/update`
  await axios.post(uri,{
    name:"pricing",
    value:{
      level:level.lid,
      semester:semester,
      price:pricing
    }
  })
}catch(e){console.log(e)}
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
