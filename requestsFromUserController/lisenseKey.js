const lisenseDb = require("../models/lisenseKey");
exports.verifyLisenseKey = async (req, res, next) => {
  try {
    const { key, amount } = req.body;
    //check if keyexist
    const lisenseKey = await lisenseDb.findOne({
      where: {
        key: key,
      },
      attributes: ["worth", "isUsed"],
    });
    if (!lisenseKey) {
      return res.status(401).json({
        isUsed:true,
        message:"key does not exist"
      })
    } else if (lisenseKey.isUsed) {
      return res.status(200).json({
        isUsed: true,
      });
    } else if (lisenseKey.worth != amount) {
      return res.status(200).json({
        isUsed: true,
        message: "key's worth not equivalent to cost of pastquestion",
      });
    } else {
      return res.status(200).json({
        isUsed: false,
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "an error occurred",
    });
  }
};
