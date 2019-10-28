const models = require("../models");
const sequelize = require("sequelize");

module.exports = {
  async findChannelsByUserId(userId) {
    let channels = [];
    let res = await models.sequelize.query(
      `
        SELECT DISTINCT C.id
        FROM Channels C
        LEFT JOIN ChannelMembers CM
          ON C.id = CM.channelId
        WHERE CM.userId = :userId
      `,
      {
        replacements: { userId: userId },
        type: sequelize.QueryTypes.SELECT
      }
    );
    let ids = res.map(r => r.id);
    channels = await this.findChanelsExtendedByIds(ids);
    return channels;
  },
  async findChanelsExtendedByIds(ids) {
    let channels = null;
    try {
      channels = await models.Channel.findAll({
        where: {
          id: { [sequelize.Op.in]: ids }
        },
        include: [
          {
            model: models.ChannelMember,
            as: "members",
            include: [
              {
                model: models.User,
                as: "user",
                attributes: ["name", "username"],
                include: [
                  {
                    model: models.UserProfile,
                    as: "profile"
                  }
                ]
              }
            ]
          },
          {
            model: models.Message,
            as: "messages"
          }
        ]
      });
    } catch (ex) {
      console.log(ex);
    }
    return channels;
  },

  async findChannelForUsers(userId1, userId2) {
    let res = await models.sequelize.query(
      `
        SELECT cm1.channelId
        FROM ChannelMembers cm1
        LEFT JOIN (SELECT channelId FROM ChannelMembers WHERE userId = :userId2) cm2
          on cm1.channelId = cm2.channelId 
        WHERE userId = :userId1 AND cm2.channelId is not null 
        limit 1
      `,
      {
        replacements: { userId1: userId1, userId2: userId2 },
        type: sequelize.QueryTypes.SELECT
      }
    );
    let ids = res.map(r => r.channelId);
    let channel = null;
    channel = await this.findChanelsExtendedByIds(ids);
    if (channel != null && channel.length > 0) {
      return channel[0];
    }
    return null;
  },
  async findChannelIdsForUser(userId) {
    let res = await models.sequelize.query(
      `
        SELECT DISTINCT C.id
        FROM Channels C
        LEFT JOIN ChannelMembers CM
          ON C.id = CM.channelId
        WHERE CM.userId = :userId
      `,
      {
        replacements: { userId: userId },
        type: sequelize.QueryTypes.SELECT
      }
    );
    let ids = res.map(r => r.id);
    return ids;
  }
};
