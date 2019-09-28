const { User, UserProfile } = require("../models");
var fs = require("fs-extra");
var path = require("path");

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

  async saveProfile(req, res) {
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
  },

  async getProfile(req, res) {
    let userId = req.user.id;
    if (userId > 0) {
      try {
        let profile = await UserProfile.findOne({
          where: {
            userId: userId
          }
        });
        if (profile == null) {
          profile = await UserProfile.create({ userId: userId });
        }
        if (profile != null) {
          res.status(200).send({
            data: profile.toJSON()
          });
        } else {
          res.status(200).send({ message: "Not found" });
        }
      } catch (err) {
        res
          .status(404)
          .send({ message: "Error happened while fetching the user." + err });
      }
    } else {
      res.status(404).send({ message: "User not provided" });
    }
  },

  async updateProfile(req, res) {
    try {
      let userId = req.user.id;
      if (userId > 0) {
        let profile = await UserProfile.findOne({
          where: {
            userId: userId
          }
        });
        if (profile != null) {
          switch (req.body.field) {
            case "description":
              profile.description = req.body.value;
              break;
            case "profileImageUrl":
              profile.profileImageUrl = req.body.value;
              break;
            case "gender":
              profile.gender = req.body.value;
              break;
            case "interestedInGender":
              profile.interestedInGender = req.body.value;
              break;
            default:
              break;
          }
          profile
            .save()
            .then(() => res.status(200).send({ message: "Updated" }));
        } else {
          res.status(200).send({ message: "Could not find profile" });
        }
      }
    } catch (err) {
      res.status(500).send({ message: "Error happend while updating profile" });
    }
  },
  async uploadProfileImage(req, res) {
    try {
      let profile = await UserProfile.findOne({
        where: {
          userId: req.user.id
        }
      });

      let destFolder = __dirname + "/../public/images/";
      let newFileName = profile.userId + "_" + req.file.filename + ".jpg";
      let destinationPath = destFolder + "/" + newFileName;

      await fs.move(path.resolve(req.file.path), destinationPath).then(() => {
        profile.profileImageUrl = newFileName;
        profile
          .save()
          .then(() => res.status(200).send({ filename: newFileName }));
      });
    } catch (err) {
      res.status(500).status({ message: "Error happend during uplaod." });
    }
  },
  async getMostRecentUsers(req, res) {
    try {
      let users = await User.findAll({
        attributes: ["name", "username"],
        limit: 10,
        include: [
          {
            model: UserProfile,
            attributes: ["profileImageUrl", "gender", "countryId"],
            as: "profile"
          }
        ]
      });
      res.status(200).send({ data: users, message: "OK" });
    } catch (error) {
      res.status(500).send({ message: "Error happend." });
    }
  }
};
