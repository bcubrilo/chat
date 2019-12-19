const models = require("../models");
const sequelize = require("sequelize");
const userExtension = require("./userExtension");

module.exports = {
  async saveMessage(data) {
    var message = null;
    try {
      var userId = userExtension.jwtGetPayload(data.jwt);
      if (userId != undefined) {
        let channel = await models.Channel.findOne({
          where: {
            id: data.message.channelId
          },
          include: [
            {
              model: models.ChannelMember,
              as: "members",
              where: { userId: userId }
            }
          ]
        });
        if (channel != null) {
          message = await models.Message.create({
            channelId: data.message.channelId,
            userId: userId,
            content: data.message.content
          });
        }
      }
    } catch (err) {
      console.log("Error happend " + err);
    }

    return {
      message: message,
      tmp_id: data.tmp_id
    };
  }
};
