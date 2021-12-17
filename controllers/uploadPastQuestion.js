const pricing = require("../models/pricing");
const pastQuestionDb = require("../models/pastQuestion");
const fs = require("fs");
const path = require("path")
exports.createPastQuestion = async (req, res, next) => {
  try {
      //delete file from upload
     /* const fileName = req.fileName;
      return fs.unlink(`./uploads/${fileName}`, (e) => {
        return res.status(400).json({
          message: "an error occurred",
        });
      });*/
  
    const { title, start, end, semester } = JSON.parse(req.body.data);

    const pq = await pastQuestionDb.create({
      title: title,
      startYear: start,
      endYear: end,
      schoolId: req.school.id,
      facultyId: req.faculty.id,
      departmentId: req.department.id,
      levelId: req.level.id,
      cloudId: req.fileId,
      cloudUri: req.uri,
      fileName: req.fileName,
      semester: semester,
    });
    //create pricing entry
    const fileName = req.fileName;
    const pathTofile = path.join(`./uploads/${req.fileName}`);
    const resCallback = (e)=>{
      if(e){
        console.log(e)
      }
         res.status(200).json({
      code: 200,
      message: "successful",
      data: {
        title,
        start,
        end,
        pid: pq.pid,
        createdAt: pq.createdAt,
      },
    });
    }

    fs.unlink(pathTofile,resCallback)

  } catch (e) {
    console.log(e);
    const pathTofile = path.join(`./uploads/${req.fileName}`);
    fs.unlink(pathTofile, (e) => {
      if(e)console.log(e)
      res.status(500).json({
        message: "an error occurred",
      });
    });
  }
};
