const models = require("../models");
const sequelize = require("sequelize");
const userExtension = require("./userExtension");
const _ = require("lodash");

module.exports = {
  async saveMessage(data) {
    var originalMessage = null;
    var receiverMessage = null;
    try {
      var userId = userExtension.jwtGetPayload(data.jwt);
      if (userId != undefined) {
        var channelMembers = await models.ChannelMember.findAll({
          where: {
            channelId: data.message.channelId
          }
        });
        if (
          channelMembers == null ||
          _.findIndex(channelMembers, m => m.userId == userId) == -1
        )
          return;

        originalMessage = await models.Message.create({
          channelId: data.message.channelId,
          userId: userId,
          content: data.message.content,
          seen: true
        });

        var receiver = _.find(channelMembers, m => m.userId != userId);
        if (receiver != null && originalMessage != null) {
          receiverMessage = await models.Message.create({
            channelId: data.message.channelId,
            userId: userId,
            content: data.message.content,
            originalId: originalMessage.id,
            receiverId: receiver.userId,
            seen: false
          });
        }
      }
    } catch (err) {
      console.log("Error happend " + err);
    }

    return {
      originalMessage: originalMessage,
      receiverMessage: receiverMessage,
      tmpId: data.tmpId
    };
  }
};
