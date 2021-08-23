const transactionsDb = require("../models/transaction");
const keysDb = require("../models/lisenseKey");
exports.fetchAllTransactions = async (req) => {
  const { page } = req.query;
  return await transactionsDb.findAll({
    limit: 20,
    offset: page * 20,
    attributes: [
      "title",
      "userEmail",
      "userRef",
      "transactionRef",
      "amount",
      "paymentMethod",
      "semester",
      "key",
      "userTxId",
      "createdAt",
    ],
  });
};
exports.fetchAllKeys = async (req) => {
  const { page } = req.query;
  return keysDb.findAll({
    limit: 20,
    offset: page * 20,
    attributes: ["key", "forWhom", "worth", "createdAt", "usedBy", "isUsed"],
  });
};
exports.fetchUnUsedKeys = async (req) => {
  const { page } = req.query;
  return keysDb.findAll({
    limit: 20,
    offset: page * 20,
    where: {
      isUsed: false,
    },
    attributes: ["key", "forWhom", "worth", "createdAt", "usedBy", "isUsed"],
  });
};
exports.fetchUsedKeys = async (req) => {
  const { page } = req.query;
  return keysDb.findAll({
    limit: 20,
    offset: page * 20,
    where: {
      isUsed: true,
    },
    attributes: ["key", "forWhom", "worth", "createdAt", "usedBy", "isUsed"],
  });
};
