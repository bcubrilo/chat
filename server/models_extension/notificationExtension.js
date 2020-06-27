const models = require("../models");
const sequelize = require("sequelize");
module.exports = {
  async getUnread(userId) {
    var res = await models.Notification.findAll({
      where: {
        notifiedUserId: userId,
        seen: 0,
      },
      attributes: ["content", "createdAt"],
      include: [
        {
          model: models.User,
          as: "user",
          attributes: ["name", "username"],
          include: [
            {
              model: models.UserProfile,
              as: "profile",
              attributes: ["profileImageUrl"],
            },
          ],
        },
      ],
    });
    return res;
  },
  async getPrevious(userId, date) {
    var res = await models.Notification.findAll({
      where: {
        userId: userId,
        updatedAt: {
          [sequelize.Op.lt]: date,
        },
      },
      attributes: ["id", "content", "createdAt"],
      include: [
        {
          model: models.User,
          as: "user",
          attributes: ["name", "username"],
          include: [
            {
              model: models.UserProfile,
              as: "profile",
              attributes: ["profileImageUrl"],
            },
          ],
        },
      ],
    });
    return res;
  },
  async setSeen(userId) {
    await models.Notification.update(
      { seen: true },
      {
        where: {
          userId: userId,
          seen: 0,
        },
      }
    );
  },
  async getByID(id) {
    var res = await models.Notification.findAll({
      where: {
        id: id,
      },
      attributes: ["content", "createdAt"],
      include: [
        {
          model: models.User,
          as: "user",
          attributes: ["name", "username"],
          include: [
            {
              model: models.UserProfile,
              as: "profile",
              attributes: ["profileImageUrl"],
            },
          ],
        },
      ],
    });
    return res;
  },
  async createNotification(userId, notifiedUserId, content, url) {
    try {
      var notification = await Notification.create({
        userId: userId,
        notifiedUserId: notifiedUserId,
        content: content,
        url: url,
      });
      var notfExtended = await this.getByID(notification.id);
      return notfExtended;
    } catch (error) {}
    return null;
  },
};
