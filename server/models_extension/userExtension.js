const models = require("../models");

module.exports = {
  async findUserByUsername(username) {
    let user = await models.User.findOne({
      where: {
        username: username
      }
    });
    return user;
  }
};
