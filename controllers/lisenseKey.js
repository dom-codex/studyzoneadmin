const nanoid = require("nanoid").nanoid;
const adminDb = require("../models/admin");
const lisenseKeyDb = require("../models/lisenseKey");
const transactionDb = require("../models/transaction");
const axois = require("axios");
const { Op } = require("sequelize");
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
exports.updateKeyStatus = async (req, res, next) => {
  try {
    const { keys, uid, deviceId, email, TrxId } = req.body;
    //verify user
    const result = await axois.post(process.env.findUserUrl, {
      uid: uid,
      email: email,
      deviceId: deviceId,
    });
    if (!result.data.isValid) {
      return res.status(result.data.code).json({
        code: 401,
        message: result.message,
        isValid: false,
      });
    } //validate txId and key
    const transaction = await transactionDb.findOne({
      where: {
        [Op.and]: [{ key: keys }, { userTxId: TrxId }],
      },
    });
    if (!transaction) {
      return res.json({
        code: 404,
        message: "transaction not found",
        isValid: false,
      });
    }
    const lisenseKey = await lisenseKeyDb.findOne({
      where: {
        [Op.and]: [
          {
            isUsed: false,
          },
          { key: keys },
        ],
      },
    });
    if (!lisenseKey) {
      return res.json({
        code: 404,
        message: "no such key",
        isValid: false,
      });
    }
    lisenseKey.usedBy = uid;
    lisenseKey.isUsed = true;
    await lisenseKey.save();
    return res.status(200).json({
      code: 200,
      isValid: true,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      code: 500,
      isValid: false,
      message: "an error occurred",
    });
  }
};
