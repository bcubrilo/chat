const models = require("../models");
const sequelize = require("sequelize");

module.exports = function(io) {
  var controller = {};
  (controller.index = async function(req, res) {}),
    (controller.createChannel = async function(req, res) {
      let channel = await models.Channel.create();
      let members = [];
      if (channel != null) {
        models.sequelize
          .transaction(async t => {
            return models.ChannelMember.create(
              {
                channelId: channel.id,
                userId: req.body.userId
              },
              { transaction: t }
            ).then(async member1 => {
              if (member1) {
                members.push(member1);
                let member2 = await models.ChannelMember.create({
                  channelId: channel.id,
                  userId: req.body.peerId
                });
                if (member2) {
                  members.push(member2);
                }
              }
            });
          })
          .then(result => {
            res.status(200).send({
              message: "Channel Created",
              channel: channel.toJSON(),
              members: members
            });
          })
          .catch(error => {
            res.status(500).send({
              message: "Error happend while creating channel." + error
            });
          });
      }
    }),
    (controller.deleteChannel = async function(req, res) {}),
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
      let channels = null;
      try {
        let ch = models.sequelize
          .query(
            `
        SELECT DISTINCT C.id
        FROM Channels C
        LEFT JOIN ChannelMembers CM
          ON C.id = CM.channelId
        WHERE CM.userId = :userId
      `,
            {
              replacements: { userId: req.user.id },
              type: sequelize.QueryTypes.SELECT
            }
          )
          .then(async result => {
            if (result.length > 0) {
              let params = result.map(r => r.id);
              channels = await models.Channel.findAll({
                where: {
                  id: { [sequelize.Op.in]: params }
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
              res.status(200).send({ channels: channels });
            }
          });
      } catch (error) {
        res
          .status(200)
          .send({ channels: null, message: "Error happend." + error });
      }
    });
  return controller;
};
