const { User, UserProfile } = require("../models");

module.exports = {
  async index(req, res) {
    try {
      let users = await User.findAll();
      res.send(users);
    } catch (err) {
      res.status(400).send({
        error: "Error happend, try again." + err
      });
    }
  },

  async updateProfile(req, res) {
    try {
      const { userId } = req.body;
      if (userId > 0) {
        let profile = await UserProfile.findOne({
          where: {
            userId: userId
          }
        });
        if (profile) {
          await UserProfile.update(req.body, {
            where: {
              userId: userId
            }
          });
        } else {
          await UserProfile.create(req.body);
        }
        res.status(200).send({ message: "User is updated" });
      }
    } catch (err) {
      res.status(404).send({ error: "Error happend. Try again." + err });
    }
  }
};
