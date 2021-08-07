const pastQuestionDb = require("../models/pastQuestion");
const fs = require("fs");
exports.createPastQuestion = async (req, res, next) => {
  try {
    const canCreate = req.canCreate;
    if (!canCreate) {
      //delete file from upload
      const fileName = req.fileName;
      return fs.unlink(`./uploads/${fileName}`, (e) => {
        return res.status(400).json({
          message: "an error occurred",
        });
      });
    }
    const { title, start, end, price, semester } = req.body;

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
      price: price,
      semester: semester,
    });
    const fileName = req.fileName;
    fs.unlink(`./uploads/${fileName}`, (e) => {
      res.status(200).json({
        code: 200,
        message: "successful",
        data: {
          title,
          start,
          end,
          pid: pq.pid,
          sid: req.school.sid,
          fid: req.faculty.fid,
          did: req.department.did,
        },
      });
    });
  } catch (e) {
    console.log(e);
    fs.unlink(`./uploads/${req.fileName}`, (e) => {
      res.status(500).json({
        message: "an error occurred",
      });
    });
  }
};
