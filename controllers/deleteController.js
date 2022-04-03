const pastQuestionDb = require("../models/pastQuestion");
const { Storage } = require("@google-cloud/storage");
const cloudinary = require("cloudinary")
const {Dropbox} = require("dropbox")
const axios = require("axios")
exports.deletePastQuestion = async (req, res, next) => {
  try {
    const { canProceed } = req;
    if (!canProceed) {
      return res.status(404).json({
        code: 404,
        message: "admin not found",
      });
    }
    const { id } = req.body;
    //get pq from db
    const pq = await pastQuestionDb.findOne({
      where: {
        pid: id,
      },
      attributes: ["id", "fileName"],
    });
    //delete from cloud
    const dropbox = new Dropbox({accessToken:process.env.dropboxToken})
    await dropbox.filesDeleteV2({path:`/pastquestions/${pq.dataValues.fileName}`})
  //  await dropbox.filesPermanentlyDelete({path:`pastquestions/${pq.dataValues.fileName}`})
    /*const cloud = Storage({ keyFilename: "key.json" });
    const result = cloud.bucket("studyzonespark").file(pq.fileName).delete();*/
    //await clodunary.v2.uploader.destroy(pq.cloudUri)
    //delete from database
    await pq.destroy();
    const uri = `${process.env.userBase}/notifications/notify/delete/pastquestion`
    await axios.post(uri,{
      ...pq.dataValues
    })
    res.status(200).json({
      code: 200,
      message: "deleted successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      code: 500,
      message: "an error occured",
    });
  }
};
