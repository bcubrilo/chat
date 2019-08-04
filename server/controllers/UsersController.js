const { User } = require("../models");

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
  }
};
