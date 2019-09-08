const models = require("../models");
const sequelize = require("sequelize");

module.exports = {
  async index(req, res) {},
  async createChannel(req, res) {
    let channel = await models.Channel.create();
    if (channel != null) {
      models.sequelize
        .transaction(async t => {
          return models.ChannelMember.create(
            {
              channelId: channel.id,
              userId: req.body.userId
            },
            { transaction: t }
          ).then(member1 => {
            if (member1) {
              models.ChannelMember.create({
                channelId: channel.id,
                userId: req.body.peerId
              });
            }
          });
        })
        .then(result => {
          res
            .status(200)
            .send({ message: "Channel Created", channel: channel.toJSON() });
        })
        .catch(error => {
          res
            .status(500)
            .send({ message: "Error happend while creating channel." + error });
        });
    }
  },
  async deleteChannel(req, res) {},
  async deleteMessage(req, res) {
    try {
      models.Message.destroy({
        where: {
          id: req.body.id,
          userId: req.user.id
        }
      });
      res.status(200).send({ message: "Message is deleted." });
    } catch (err) {
      res.status(500).send({ message: "Message is not deleted." });
    }
  },
  async getMessages(req, res) {},

  async saveMessage(req, res) {
    try {
      let message = null;
      let userId = req.user.id;
      if (req.body.id > 0) {
        message = await models.Message.findOne({
          where: {
            id: req.body.id,
            userId: userId
          }
        });
        if (message != null) {
          message.content = req.body.content;
          message.save();
        }
      } else {
        let channel = await models.Channel.findOne({
          where: {
            id: req.body.channelId
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
            channelId: req.body.channelId,
            userId: userId,
            content: req.body.content
          });
        }
      }
      if (message != null) {
        res
          .status(200)
          .send({ message: "Message is saved.", messageId: message.id });
      } else {
        res
          .status(500)
          .send({ messge: "Error happend, message is not saved." });
      }
    } catch (err) {
      res.status(500).send({ message: "Error happend." + err });
    }
  }
};
