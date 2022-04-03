const lisenseKeyDb = require("../models/lisenseKey");
const vendor = require("../models/vendor");
const vendorDb = require("../models/vendor");
const { limit } = require("../utility/constants");
const { Op } = require("sequelize");
exports.createVendor = async (req, res, next) => {
  try {
    const { canProceed } = req;
    if (!canProceed) {
      return res.status(404).json({
        code: 404,
        message: "access denied",
      });
    }
    const { name, phone } = req.body;
    const vendor = await vendorDb.create({
      name: name,
      phone: phone,
    });
    return res.status(200).json({
      code: 200,
      message: "created",
      vendor: {
        name: vendor.name,
        phone: vendor.phone,
        vendorId: vendor.vendorId,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      code: 500,
      message: "an error occured",
    });
  }
};
exports.deleteVendor = async (req, res, next) => {
  try {
    const { canProceed } = req;
    if (!canProceed) {
      return res.status(404).json({
        code: 404,
        message: "access denied",
      });
    }
    const { id } = req.body;
    await vendor.destroy({
      where: {
        vendorId: id,
      },
    });
    res.status(200).json({
      code: 200,
      message: "deleted",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      code: 500,
      message: "an error occurred",
    });
  }
};
exports.getVendorStats = async (req, res, next) => {
  try {
    const { canProceed } = req;
    if (!canProceed) {
      return res.status(404).json({
        code: 404,
        message: "access denied",
      });
    }
    const { vendorId } = req.query;
    //find vendor
    const vendor = await vendorDb.findOne({
      where: {
        vendorId: vendorId,
      },
      attribute: ["id"],
    });
    console.log(vendor)
    if (!vendor) {
      return res.status(404).json({
        code: 404,
        message: "vendor not found",
      });
    }
    /* const vendorKeys = await lisenseKeyDb.findAll({
      where: {
        vendorId: vendor.id,
      },
      attribute: { exclude: ["createdAt", "id", "updatedAt"] },
    });*/
    /*const keysSold = await lisenseKeyDb.findAll({
      where: {
        vendorId: vendor.id,
        isUsed: true,
      },
      attribute: { exclude: ["createdAt", "id", "updatedAt"] },
    });*/
    const noOfKeysGenerated = await lisenseKeyDb.count({
      where: {
        vendorId: vendor.id,
      },
    });
    const totalcostOfKeys = await lisenseKeyDb.sum("worth", {
      where: {
        vendorId: vendor.id,
      },
    });
    const noOfUsedKeys = await lisenseKeyDb.count({
      where: {
        vendorId: vendor.id,
        isUsed: true,
      },
    });
    const totalcostOfUsedKeys = await lisenseKeyDb.sum("worth", {
      where: {
        vendorId: vendor.id,
        isUsed: true,
      },
    });
    return res.status(200).json({
      code: 200,
      message: "success",
      noOfUsedKeys,
      noOfKeysGenerated,
      totalcostOfKeys,
      totalcostOfUsedKeys,
      noOfUnUsedKeys: noOfKeysGenerated - noOfUsedKeys,
      totalcostOfUnUsedKeys: totalcostOfKeys - totalcostOfUsedKeys,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      code: 500,
      message: "an error occured",
    });
  }
};
exports.getVendorKeys = async (req, res, next) => {
  try {
    const { canProceed } = req;
    if (!canProceed) {
      return res.status(404).json({
        code: "404",
        message: "access denied",
      });
    }
    const { type, page, vendorId } = req.query;
    const vendor = await vendorDb.findOne({
      where: {
        vendorId: vendorId,
      },
      attribute: ["id"],
    });
    const keys = await lisenseKeyDb.findAll({
      limit: limit,
      offset: (page-1) * limit,
      where: {
        vendorId: vendor.id,
        isUsed: type == "USED",
      },
    });
    return res.status(200).json({
      code: 200,
      keys: keys,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      code: 500,
      message: "an error occurred",
    });
  }
};
exports.getVendors = async (req, res, next) => {
  try {
    const { canProceed } = req;
    if (!canProceed) {
      return res.status(404).json({
        code: 404,
        message: "access denied",
      });
    }
    const vendors = await vendorDb.findAll({
      attribute: { exclude: ["id", "createdAt", "updatedAt"] },
    });
    if (vendors.length <= 0) {
      //create new vendor as admin
      const newVendor = await vendorDb.create({
        name: "ADMIN",
      });
      //send response to the admin
      return res.status(200).json({
        vendors: [newVendor.dataValues],
      });
    }
    return res.status(200).json({
      code: 200,
      vendors,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      code: 500,
      message: "an error occured",
    });
  }
};
