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
  async getUserPublicProfile(username) {
    var data = {};
    try {
      var user = await models.User.findOne({
        where: {
          username: username
        },
        attributes: ["name", "username"],
        include: [
          {
            model: models.UserProfile,
            as: "profile",
            attributes: [
              "profileImageUrl",
              "countryId",
              "languageId",
              "description",
              "gender",
              "interestedInGender"
            ]
          }
        ]
      });
      if (user != null)
        data = {
          name: user.name,
          username: user.username,
          profileImageUrl:
            user.profile.length > 0 ? user.profile[0].profileImageUrl : "",
          countryId: user.profile.length > 0 ? user.profile[0].countryId : "",
          languageId: user.profile.length > 0 ? user.profile[0].languageId : "",
          description:
            user.profile.length > 0 ? user.profile[0].description : "",
          gender: user.profile.length > 0 ? user.profile[0].gender : "",
          interestedInGender:
            user.profile.length > 0 ? user.profile[0].interestedInGender : ""
        };
    } catch (ex) {
      console.log(ex);
    }
    return data;
  },
  jwtGetPayload(token) {
    var payload = jwt.verify(token, appConfig.authentication.jwtSecret);
    return payload;
  }
};
