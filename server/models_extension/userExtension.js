const models = require("../models");
const jwt = require("jsonwebtoken");
const appConfig = require("../config/appconfig");

module.exports = {
  async findUserByUsername(username) {
    let user = await models.User.findOne({
      where: {
        username: username
      }
    });
    return user;
  },
  jwtGetPayload(token) {
    var payload = jwt.verify(token, appConfig.authentication.jwtSecret);
    return payload;
  }
};
