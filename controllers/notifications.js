const axios = require("axios");
const notificationDb = require("../models/notification");
const announcementDb = require("../models/announcement");
const { limit } = require("../utility/constants");
exports.postNotificationToUser = async (req, res, next) => {
  try {
    const { canProceed } = req;
    if (!canProceed) {
      return res.status(404).json({
        code: 404,
        message: "user not found",
      });
      //retrieve user ref
      //send post request to user database
      //return default response
    }
    const { user, message, subject } = req.body;
    const uri = `${process.env.userBase}/notifications/post`;
    const { data } = await axios.post(uri, {
      user: user,
      message: message,
      subject: subject,
    });
    if (data.code != 201) {
      return res.status(data.code).json({
        code: data.code,
        message: data.message,
      });
    }
    return res.status(200).json({
      code: 200,
      message: "sent successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(e).end;
  }
};
exports.getNotifications = async (req, res, next) => {
  try {
    const { canProceed } = req;
    if (!canProceed) {
      return res.status(404).json({
        code: 404,
        message: "admin not found",
      });
    }
    
    const { page } = req.query;
    
    const notifications = await notificationDb.findAll({
      limit: limit,
      order:[["id","DESC"]],
      offset: (page - 1) * limit,
    });
    return res.status(200).json({
      code: 200,
      notifications: notifications,
    });
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
};
exports.deleteNotification = async (req, res, next) => {
  try {
    const { canProceed } = req;
    if (!canProceed) {
      return res.status(404).json({
        code: 404,
        message: "admin not found",
      });
    }
    const { id } = req.body;
    await notificationDb.destroy({
      where: {
        nid: id,
      },
    });
    res.status(200).json({
      code: 200,
      message: "deleted",
    });
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
};
exports.getAnnouncements = async (req, res, next) => {
  try {
    const { canProceed } = req;
    if (!canProceed) {
      return res.status(404).json({
        code: 404,
        message: "admin not found",
      });
    }
    const limit = 1;
    const { page } = req.query;
    const announcements = await announcementDb.findAll({
      limit: limit,
      offset: page * limit,
    });
    return res.status(200).json({
      code: 200,
      announcements: announcements,
    });
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
};
exports.sendAnnouncement = async (req, res, next) => {
  try {
    const { canProceed } = req;
    if (!canProceed) {
      return res.status(404).json({
        code: 404,
        message: "admin not found",
      });
    }
    const { user, message, subject } = req.body;
    const announcement = await announcementDb.create({
      message,
      subject,
    });

    //call notification hook on user server
    const uri = `${process.env.userBase}/notifications/announcement`;
    await axios.post(uri, {
      announcement: announcement.dataValues,
    });
    res.status(201).json({
      code: 200,
      message: "sent",
      announcement,
    });
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
};
exports.deleteAnnouncement = async (req, res, next) => {
  try {
    const { canProceed } = req;
    if (!true) {
      return res.status(404).json({
        code: 404,
        message: "admin not found",
      });
    }
    const { id } = req.body;
    await announcementDb.destroy({
      where: {
        aid: id,
      },
    });
    res.status(200).json({
      code: 200,
      message: "deleted",
    });
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
};
