const nanoid = require("nanoid").nanoid;
const adminDb = require("../models/admin");
const lisenseKeyDb = require("../models/lisenseKey");
exports.genLisenseKey = async (req, res, next) => {
  try {
    const { whom, nkeys, worth } = req.body;
    const { canCreate, admin } = req;
    const keysToCreate = [];
    if (!canCreate) {
      return res.status(400).json({
        message: "cannot gen key",
        code: 400,
      });
    }
    let i = 1;
    while (i <= nkeys) {
      const newKey = nanoid(10);
      const keyObj = {
        key: newKey,
        forWhom: whom,
        worth: worth,
      };
      keysToCreate.push(keyObj);
      i++;
    }
    const keys = await lisenseKeyDb.bulkCreate(keysToCreate, {
      validate: true,
    });
    res.status(200).json({ code: 200, data: keys });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      code: 500,
      message: "an error occurred",
    });
  }
};
