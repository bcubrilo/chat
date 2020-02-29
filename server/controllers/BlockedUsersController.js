const { BlockedUser, User } = require("../models");
module.exports = {
  async index(req, res) {
    try {
      var blockedUsers = await BlockedUser.findAll({
        where: {
          userId: req.user.id
        },
        include: [
          {
            model: User,
            as: "blockedUserInfo",
            attributes: ["name", "username"]
          }
        ]
      });
      res.status(200).send({
        blockedUsers: blockedUsers,
        message: "OK"
      });
    } catch (err) {
      res.status(500).send({ blockedUsers: null, message: "Error" });
    }
  },
  async create(req, res) {
    const { blockedUserId } = req.body;
    try {
      BlockedUser.findOrCreate({
        where: {
          userId: req.user.id,
          blockedUserId: blockedUserId
        }
      }).spread((blockedUser, created) => {
        res.status(200).send({
          message: "OK",
          blockedUser: blockedUser
        });
      });
    } catch (err) {
      res.status(500).send({ message: "Error happend" });
    }
  },
  async delete(req, res) {
    try {
      await BlockedUser.destroy({
        where: {
          userId: req.user.id,
          blockedUserId: req.params.blockedUserId
        }
      });
      res.status(200).send({ status: true, message: "OK" });
    } catch (err) {
      res.status(500).send({ status: false, message: "Error" });
    }
  }
};
