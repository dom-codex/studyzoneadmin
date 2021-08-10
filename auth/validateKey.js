const keyDb = require("../models/lisenseKey");
module.exports = async (req, res, next) => {
  const { keys, amountToPay } = req.body;
  const key = await keyDb.findOne({
    where: {
      key: keys,
    },
  });
  if (!key) {
    return res.status(404).json({
      code: 404,
      message: "key not found",
      isValid: false,
    });
  }
  if (key.worth != amountToPay) {
    return res.status(401).json({
      code: 401,
      message: "asset worth is too small or too large for the current purchase",
      isValid: false,
    });
  }
  if (key.isUsed) {
    return res.status(403).json({
      code: 403,
      message: "key is already used by",
      isValid: false,
    });
  }
  return res.status(200).json({
    code: 200,
    message: "validation successful",
    isValid: true,
    data: {
      value: key.worth,
    },
  });
};
