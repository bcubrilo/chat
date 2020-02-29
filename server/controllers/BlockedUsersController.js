const { BlockedUser } = require("../models");
module.exports = {
  async index(req, res) {},
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
