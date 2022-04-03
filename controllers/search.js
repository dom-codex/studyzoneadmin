const { Op } = require("sequelize");
const schoolDb = require("../models/school");
const facultyDb  = require("../models/faculty")
const departmentDb = require("../models/department")
const vendorDb = require("../models/vendor")
const pastquestionDb = require("../models/pastQuestion")
exports.searchForVendor = async(req,res,next)=>{
  try{
    const {query} = req.query
    const vendors = await vendorDb.findAll({
      where:{
    
            name: {
              [Op.iLike]:`%${query}%`,
            },
          
      },
      attributes:["id","name","vendorId"]
    })
    
    return res.status(200).json({
      message:"success",
      results:vendors.length>0?vendors:[]
    })
  }catch(e){
    console.log(e)
    res.status(500).json({
      message:"an error occurred"
    })
  }
}
exports.searchForFaculty = async(req,res,next)=>{
  try{
    const {query} = req.query
    const faculties = await facultyDb.findAll({
      where:{
        name:{
          [Op.iLike]:`%${query}%`
        }
      },
      attributes:["id","name","fid"]
    })
    return res.status(200).json({
      message:"success",
      results:faculties.length>0?faculties:[]
    })
  }catch(e){
    console.log(e)
    res.status(500).json({
      message:"an error occurred"
    })
  }
}
exports.searchForDepartment = async(req,res,next)=>{
  try{
    const {query} = req.query
    const departments = await departmentDb.findAll({
      where:{
        name:{
          [Op.iLike]:`%${query}%`
        }
      },
      attributes:["id","name","did"]
    })
    return res.status(200).json({
      message:"success",
      results:departments.length>0?departments:[]
    })
  }catch(e){
    console.log(e)
    res.status(500).json({
      message:"an error occurred"
    })
  }
}
exports.searchForPastQuestion = async(req,res,next)=>{
  try{
    const {query} = req.query
    const pastquestions = await pastquestionDb.findAll({
      where:{
        title:{
          [Op.iLike]:`%${query}%`
        }
      },
      attributes:["id","pid","title","semester"]
    })
  }catch(e){
    console.log(e)
    res.status(500).json({
      message:"an error occurred"
    })
  }
}
exports.searchForSchool = async (req, res, next) => {
  try {
    const { query } = req.query;
    const schools = await schoolDb.findAll({
      where: {
        [Op.or]: [
          {
            name: {
              [Op.iLike]: `%${query}%`,
            },
          },
          {
            nameAbbr: {
              [Op.iLike]: `%${query}%`,
            },
          },
        ],
      },
      attributes:["id","name","sid","type"],
    });
    res.status(200).json({
      results:schools,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      code: 500,
      message: "an error occurred",
    });
  }
};
