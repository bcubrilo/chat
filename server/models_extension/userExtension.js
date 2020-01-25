const models = require("../models");
const jwt = require("jsonwebtoken");
const appConfig = require("../config/appconfig");
const _ = require("lodash");

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
  async getMostRecentUsers() {
    var data = [];
    try {
      let users = await models.User.findAll({
        attributes: ["name", "username"],
        limit: 10,
        include: [
          {
            model: models.UserProfile,
            attributes: [
              "profileImageUrl",
              "countryCode",
              "languageId",
              "description",
              "gender",
              "interestedInGender"
            ],
            as: "profile"
          }
        ],
        order: [["id", "DESC"]]
      });
      if (users != null && users.length > 0) {
        _.each(users, user => {
          data.push({
            name: user.name,
            username: user.username,
            profileImageUrl:
              user.profile.length > 0 ? user.profile[0].profileImageUrl : "",
            countryCode:
              user.profile.length > 0 ? user.profile[0].countryCode : "",
            languageId:
              user.profile.length > 0 ? user.profile[0].languageId : "",
            description:
              user.profile.length > 0 ? user.profile[0].description : "",
            gender: user.profile.length > 0 ? user.profile[0].gender : "",
            interestedInGender:
              user.profile.length > 0 ? user.profile[0].interestedInGender : ""
          });
        });
      }
    } catch (error) {
      console.log(error);
    }
    return data;
  },
  async search(phrase) {
    try {
      if (phrase === undefined || phrase === null || phrase.lenght == 0)
        return null;

      var res = await models.sequelize.query(
        "SELECT id FROM users WHERE match(name,username) against(:against)",
        {
          replacements: { against: phrase },
          type: models.sequelize.QueryTypes.SELECT
        }
      );
      let ids = res.map(r => r.id);
      return this.getByIds(ids);
    } catch (error) {
      console.log(error);
    }
    return null;
  },
  async getByIds(ids) {
    if (ids == null || ids === undefined || ids.length == 0) return null;
    var data = [];
    try {
      let users = await models.User.findAll({
        attributes: ["name", "username"],
        include: [
          {
            model: models.UserProfile,
            attributes: [
              "profileImageUrl",
              "countryCode",
              "languageId",
              "description",
              "gender",
              "interestedInGender"
            ],
            as: "profile"
          }
        ],
        where: {
          id: { [models.Sequelize.Op.in]: ids }
        },
        order: [["id", "DESC"]]
      });
      if (users != null && users.length > 0) {
        _.each(users, user => {
          data.push({
            name: user.name,
            username: user.username,
            profileImageUrl:
              user.profile.length > 0 ? user.profile[0].profileImageUrl : "",
            countryCode:
              user.profile.length > 0 ? user.profile[0].countryCode : "",
            languageId:
              user.profile.length > 0 ? user.profile[0].languageId : "",
            description:
              user.profile.length > 0 ? user.profile[0].description : "",
            gender: user.profile.length > 0 ? user.profile[0].gender : "",
            interestedInGender:
              user.profile.length > 0 ? user.profile[0].interestedInGender : ""
          });
        });
      }
    } catch (error) {
      console.log(error);
    }
    return data;
  },

  jwtGetPayload(token) {
    var payload = jwt.verify(token, appConfig.authentication.jwtSecret);
    return payload;
  },
  async findUserByEmail(email) {
    let user = await models.User.findOne({
      where: {
        email: email
      }
    });
    return user;
  }
};
