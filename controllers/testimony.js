const testimonyDb = require("../models/testimony");
exports.checkForTestimony = async (req, res, next) => {
  try {
    const { user } = req.query;
    const testimony = await testimonyDb.findOne({
      where: {
        user: user,
      },
      attributes: ["user"],
    });
    if (!testimony) {
      return res.json({
        code: 404,
        message: "testimony not found",
      });
    }
    res.json({
      code: 200,
      message: "testimony found",
    });
  } catch (e) {
    console.log(e);
    res.status(500);
  }
};
exports.addUserTestimony = async (req, res, next) => {
  try {
    const { user, link, fileId, email, name } = req.body;
    const testimony = await testimonyDb.create({
      user: user,
      videoLink: link,
      videoId: fileId,
    });
    //send notification to admin
    res.status(200).json({
      code: 200,
      message: "testimony added",
    });
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
};
