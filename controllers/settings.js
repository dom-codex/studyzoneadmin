const utilsDb = require("../models/utils");
exports.upDateSettings = async (req, res, next) => {
  try {
    const { canProceed } = req;
    if (!canProceed) {
      return res.status(400).json({
        code: 404,
        message: "admin not found",
      });
    }
    const { value, name, utilsId } = req.body;
    await utilsDb.update(
      { value: value },
      {
        where: {
          name: name,
          utilsId: utilsId,
        },
      }
    );
    res.status(200).json({
      code: 200,
      message: "updated",
    });
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
};
exports.getSettings = async (req, res, next) => {
  try {
    const { canProceed } = req;
    if (!canProceed) {
      return res.status(404).json({
        code: 404,
        message: "admin not found",
      });
    }
    const settings = await utilsDb.findAll({
      attributes: { exclude: ["id", "createdAt", "updatedAt"] },
    });
    res.status(200).json({
      code: 200,
      settings: settings,
    });
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
};
