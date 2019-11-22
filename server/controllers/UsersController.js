const { User, UserProfile } = require("../models");
const UserExtension = require("../models_extension/userExtension");
var fs = require("fs-extra");
var path = require("path");
var base64Img = require("base64-img");
var jimp = require("jimp");

function decodeBase64Image(dataString) {
  var matches = dataString.match(/^data:([A-Za-z-+/]+);base64,(.+)$/),
    response = {};

  if (matches.length !== 3) {
    return new Error("Invalid input string");
  }

  response.type = matches[1];
  response.data = new Buffer(matches[2], "base64");

  return response;
}

module.exports = {
  async index(req, res) {
    try {
      let users = await User.findAll();
      res.send(users);
    } catch (err) {
      res.status(500).send({
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
            case "countryCode":
              profile.countryCode = req.body.value;
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
  async getPublicProfile(req, res) {
    var user = await UserExtension.getUserPublicProfile(req.params.username);
    res.status(200).send({ data: user, message: "OK" });
  },
  async uploadProfileImage(req, res) {
    try {
      let profile = await UserProfile.findOne({
        where: {
          userId: req.user.id
        }
      });

      let oldFileName = profile.profileImageUrl;
      let newFileName = profile.userId + "_" + Date.now() + ".jpg";
      let destinationPath = path.join(
        __basedir,
        "/public/images/profiles",
        newFileName
      );

      await fs.move(path.resolve(req.file.path), destinationPath).then(() => {
        jimp.read(destinationPath, (err, image) => {
          if (!err) {
            image
              .resize(48, 48)
              .quality(60)
              .write(
                path.join(__basedir, "/public/images/avatars", newFileName)
              );
          }
          try {
            if (oldFileName != null && oldFileName.length > 0) {
              let oldImagePath = path.join(
                __basedir,
                "/public/images/profiles",
                oldFileName
              );
              let oldAvatarPath = path.join(
                __basedir,
                "/public/images/avatars",
                oldFileName
              );
              if (fs.existsSync(oldImagePath)) {
                fs.unlink(oldImagePath);
              }
              if (fs.existsSync(oldAvatarPath)) {
                fs.unlink(oldAvatarPath);
              }
            }
          } catch (err) {}
        });
        profile.profileImageUrl = newFileName;

        profile
          .save()
          .then(() => res.status(200).send({ filename: newFileName }));
      });
    } catch (err) {
      res.status(500).status({ message: "Error happend during uplaod." });
    }
  },
  async deleteProfileImage(req, res) {
    try {
      let profile = await UserProfile.findOne({
        where: {
          userId: req.user.id
        }
      });
      if (profile != null) {
        if (
          profile.profileImageUrl != null &&
          profile.profileImageUrl.length > 0
        ) {
          if (
            fs.exists(
              path.join(
                __basedir,
                "/public/images/profiles/",
                profile.profileImageUrl
              )
            )
          ) {
            await fs.unlink(
              path.join(
                __basedir,
                "/public/images/profiles/",
                profile.profileImageUrl
              )
            );
          }
          if (
            fs.exists(
              path.join(
                __basedir,
                "/public/images/avatars/",
                profile.profileImageUrl
              )
            )
          ) {
            await fs.unlink(
              path.join(
                __basedir,
                "/public/images/avatars/",
                profile.profileImageUrl
              )
            );
          }
        }
      }
      res.status(200).send({ message: "OK" });
    } catch (err) {
      res.status(200).send({ message: "Error happend" });
    }
  },
  async getMostRecentUsers(req, res) {
    try {
      let users = await UserExtension.getMostRecentUsers();
      res.status(200).send({ data: users, message: "OK" });
    } catch (error) {
      res.status(500).send({ message: "Error happend." });
    }
  },
  async search(req, res) {
    try {
      var users = await UserExtension.search(req.body.phrase);
      res.status(200).send({ data: users, message: "OK" });
    } catch (error) {
      res.status(500).send({ message: "Error happend" });
    }
  }
};
