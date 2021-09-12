const pastQuestionDb = require("../models/pastQuestion");
const { Storage } = require("@google-cloud/storage");
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
    const cloud = Storage({ keyFilename: "key.json" });
    const result = cloud.bucket("studyzonespark").file(pq.fileName).delete();
    //delete from database
    await pq.destroy();
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
