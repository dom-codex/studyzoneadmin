const nanoid = require("nanoid").nanoid;
const adminDb = require("../models/admin");
const lisenseKeyDb = require("../models/lisenseKey");
const transactionDb = require("../models/transaction");
const axois = require("axios");
const { Op } = require("sequelize");
const vendorDb = require("../models/vendor");
const { limit } = require("../utility/constants");
const { generateOtp } = require("../utility/generateOtp");
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
    //find vendor
    const vendor = await vendorDb.findOne({
      where: {
        vendorId: whom,
      },
      attribute: ["id", "name", "vendorId"],
    });
    let i = 1;
    while (i <= nkeys) {
      const newKey = await generateOtp();//nanoid(10);
      const keyObj = {
        key: newKey,
        forWhom: vendor != null ? vendor.name : "ADMIN",
        vendorId: vendor.id,
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
    lisenseKey.user = email;
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
const createWhereCondition = (type) => {
  if (type == "USED") {
    return {
      isUsed: true,
    };
  } else if (type == "NOT_USED") {
    return {
      isUsed: false,
    };
  } else {
    return {};
  }
};
exports.getLisensekeys = async (req, res, next) => {
  try {
    const { canProceed } = req;
    if (!canProceed) {
      return res.status(404).json({
        code: 404,
        message: "access denied",
      });
    }
    const { type, page } = req.query;
    const condition = createWhereCondition(type);
    const keys = await lisenseKeyDb.findAll({
      where: condition,
      limit: limit,
      order:[["updatedAt","DESC"]],
      offset: (page-1) * limit,
      attribute: { exclude: ["adminId", "createdAt", "updatedAt"] },
    });
   
    return res.status(200).json({
      keys: keys,
      code: 200,
      message: "retrieved",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      code: 500,
      message: "an error occured",
    });
  }
};
exports.getKeyStats = async (req, res, next) => {
  try {
    const { canProceed } = req;
    if (!canProceed) {
      return res.status(404).json({
        code: 404,
        message: "access denied",
      });
    }
    const allKeys = await lisenseKeyDb.count();
    const usedKeys = await lisenseKeyDb.count({
      where: {
        isUsed: true,
      },
    });
    const costOfAllKeys = await lisenseKeyDb.sum("worth");
    const costOfUsedKeys = await lisenseKeyDb.sum("worth", {
      where: {
        isUsed: true,
      },
    });
    res.status(200).json({
      code: 200,
      message: "retrieved",
      nTotalKeys: allKeys,
      nUsedKeys: usedKeys,
      nNotUsedKeys: allKeys - usedKeys,
      costOfAllKeys,
      costOfUsedKeys,
      costOfUnUsedKeys: costOfAllKeys - costOfUsedKeys,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      code: 500,
      message: "an error occurred",
    });
  }
};
exports.updateKeyPrice = async (req, res, next) => {
  try {
    const { canProceed } = req;
    if (!canProceed) {
      return res.status(404).json({
        code: 404,
        message: "access denied",
      });
    }
    const { price, keyId } = req.body;
    if (price <= 0) {
      return res.status(401).json({
        code: 401,
        message: "pricing should be above zero",
      });
    }
    await lisenseKeyDb.update(
      { worth: price },
      {
        where: {
          keyId: keyId,
          isUsed: false,
        },
      }
    );
    return res.status(200).json({
      code: 200,
      message: "updated",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      code: 500,
      message: "an error occurred",
    });
  }
};
exports.deleteKey = async (req, res, next) => {
  try {
    const { canProceed } = req;
    if (!canProceed) {
      return res.status(404).json({
        code: 404,
        message: "access denied",
      });
    }
    const { keyId } = req.body;
    await lisenseKeyDb.destroy({
      where: {
        keyId: keyId,
      },
    });
    return res.status(200).json({
      code: 200,
      message: "done",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      code: 500,
      message: "an error occurred",
    });
  }
};
