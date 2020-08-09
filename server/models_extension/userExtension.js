const models = require("../models");
const jwt = require("jsonwebtoken");
const appConfig = require("../config/appconfig");
const _ = require("lodash");

module.exports = {
  async findUserByUsername(username) {
    let user = await models.User.findOne({
      where: {
        username: username,
      },
    });
    return user;
  },
  async getUserPublicProfile(username) {
    var data = {};
    try {
      var user = await models.User.findOne({
        where: {
          username: username,
        },
        attributes: ["name", "username"],
        include: [
          {
            model: models.UserProfile,
            as: "profile",
            attributes: [
              "profileImageUrl",
              "countryCode",
              "languageCode",
              "description",
              "gender",
              "interestedInGender",
            ],
          },
        ],
      });
      if (user != null)
        data = {
          name: user.name,
          username: user.username,
          profileImageUrl: user.profile ? user.profile.profileImageUrl : "",
          countryCode: user.profile ? user.profile.countryCode : "",
          languageCode: user.profile ? user.profile.languageCode : "",
          description: user.profile ? user.profile.description : "",
          gender: user.profile ? user.profile.gender : "",
          interestedInGender: user.profile
            ? user.profile.interestedInGender
            : "",
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
              "languageCode",
              "description",
              "gender",
              "interestedInGender",
            ],
            as: "profile",
          },
        ],
        order: [["id", "DESC"]],
      });
      if (users != null && users.length > 0) {
        _.each(users, (user) => {
          data.push({
            name: user.name,
            username: user.username,
            profileImageUrl: user.profile ? user.profile.profileImageUrl : "",
            countryCode: user.profile ? user.profile.countryCode : "",
            languageCode: user.profile ? user.profile.languageCode : "",
            description: user.profile ? user.profile.description : "",
            gender: user.profile ? user.profile.gender : "",
            interestedInGender: user.profile
              ? user.profile.interestedInGender
              : "",
          });
        });
      }
    } catch (error) {
      console.log(error);
    }
    return data;
  },
  async search(phrase, countryCode, skip = 0) {
    try {
      if (phrase === undefined || phrase === null || phrase.lenght == 0)
        return null;

      var res = await models.sequelize.query(
        `SELECT us.id FROM users us 
          LEFT JOIN userprofiles up
            on us.id = up.userId
        WHERE match(name,username) against(:against)
          AND (:countryCode IS NULL OR countryCode=:countryCode)
        LIMIT :skip, :limit`,
        {
          replacements: {
            against: phrase,
            countryCode: countryCode,
            skip: skip,
            limit: 10,
          },
          type: models.sequelize.QueryTypes.SELECT,
        }
      );
      let ids = res.map((r) => r.id);
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
              "interestedInGender",
            ],
            as: "profile",
          },
        ],
        where: {
          id: { [models.Sequelize.Op.in]: ids },
        },
        order: [["id", "DESC"]],
      });
      if (users && users.length > 0) {
        _.each(users, (user) => {
          data.push({
            name: user.name,
            username: user.username,
            profileImageUrl:
              user.profile && user.profile.length > 0
                ? user.profile[0].profileImageUrl
                : "",
            countryCode:
              user.profile && user.profile.length > 0
                ? user.profile[0].countryCode
                : "",
            languageId:
              user.profile && user.profile.length > 0
                ? user.profile[0].languageId
                : "",
            description:
              user.profile && user.profile.length > 0
                ? user.profile[0].description
                : "",
            gender:
              user.profile0 && user.profile.length > 0
                ? user.profile[0].gender
                : "",
            interestedInGender:
              user.profile && user.profile.length > 0
                ? user.profile[0].interestedInGender
                : "",
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
        email: email,
      },
    });
    return user;
  },
};
