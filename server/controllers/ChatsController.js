const models = require("../models");
const sequelize = require("sequelize");
const userExension = require("../models_extension/userExtension");
const channelExtension = require("../models_extension/channelExtension");

module.exports = function(io) {
  var controller = {};
  (controller.index = async function(req, res) {}),
    (controller.createChannel = async function(req, res) {
      let peer = await userExension.findUserByUsername(req.body.username);
      let channel = await channelExtension.findChannelForUsers(
        req.user.id,
        peer.id
      );
      if (channel == null) {
        channel = await models.Channel.create();
        models.sequelize
          .transaction(async t => {
            return await models.ChannelMember.create(
              {
                channelId: channel.id,
                userId: req.user.id
              },
              { transaction: t }
            ).then(async member1 => {
              if (member1) {
                await models.ChannelMember.create({
                  channelId: channel.id,
                  userId: peer.id
                });
              }
            });
          })
          .then(async result => {
            let channelExtended = await channelExtension.findChanelsExtendedByIds(
              [channel.id]
            );
            res.status(200).send({
              data:
                channelExtended != null && channelExtended.length > 0
                  ? channelExtended[0]
                  : null
            });
          })
          .catch(error => {
            res.status(500).send({
              message: "Error happend while creating channel." + error
            });
          });
      } else {
        res.status(200).send({ data: channel });
      }
    }),
    (controller.deleteChannel = async function(req, res) {
      try {
        var channel = await models.Channel.findOne({
          where: {
            id: req.body.id
          }
        });
        if (channel != null) {
          if (channel.hasUser(req.user.id)) {
            await models.ChannelMember.destroy({
              where: {
                channelId: req.body.id
              }
            });
            await models.Message.destroy({
              where: {
                channelId: req.body.id
              }
            });
            await models.Channel.destroy({
              where: {
                id: req.body.id
              }
            });
          }
        }
        res.status(200).send({ message: "OK" });
      } catch (error) {
        res.status(500).send({ message: "Error." });
      }
    }),
    (controller.deleteMessage = async function(req, res) {
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
    }),
    (controller.getMessages = async function(req, res) {}),
    (controller.saveMessage = async function(req, res) {
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
          io.emit("new_message", message);
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
    }),
    (controller.channels = async function(req, res) {
      let channels = await channelExtension.findChannelsByUserId(req.user.id);
      res.status(200).send({ channels: channels });
    });
  return controller;
};
