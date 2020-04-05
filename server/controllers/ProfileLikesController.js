const { ProfileLikes, User, UserProfile } = require("../models");
const userExension = require("../models_extension/userExtension");
module.exports = {
  async index(req, res) {
    try {
      var likes = await ProfileLikes.findAll({
        where: {
          userId: req.user.id,
        },
        attributes: ["id"],
        include: [
          {
            model: User,
            as: "likedUser",
            attributes: ["name", "username"],
            include: [
              {
                model: UserProfile,
                as: "profile",
                attributes: ["profileImageUrl"],
              },
            ],
          },
        ],
      });
      res.status(200).send({ likes: likes, message: "OK" });
    } catch (err) {
      res.status(500).send({ likes: null, message: "OK" });
    }
  },
  async allLikes(req, res) {
    try {
      var likes = await ProfileLikes.findAll({
        where: {
          likedUserId: req.user.id,
        },
        attributes: ["id"],
        include: [
          {
            model: User,
            as: "user",
            attributes: ["name", "username"],
            include: [
              {
                model: UserProfile,
                as: "profile",
                attributes: ["profileImageUrl"],
              },
            ],
          },
        ],
      });
      res.status(200).send({
        likes: likes,
        message: "OK",
      });
    } catch (err) {
      res.status(500).send({
        likes: null,
        message: "Error",
      });
    }
  },
  async create(req, res) {
    try {
      const { likedUsername } = req.body;
      var user = await userExension.findUserByUsername(req.body.username);
      var like = await ProfileLikes.findOrCreate({
        where: {
          userId: req.user.id,
          likedUserId: user.id,
        },
      });
      var likeExt = null;
      if (like) {
        likeExt = await ProfileLikes.findOne({
          where: {
            userId: req.user.id,
            likedUserId: user.id,
          },
          attributes: ["id"],
          include: [
            {
              model: User,
              as: "likedUser",
              attributes: ["name", "username"],
              include: [
                {
                  model: UserProfile,
                  as: "profile",
                  attributes: ["profileImageUrl"],
                },
              ],
            },
          ],
        });
      }

      res.status(200).send({
        like: likeExt,
        message: "OK",
      });
    } catch (err) {
      res.status(500).send({ like: null, message: "Error" });
    }
  },
  async delete(req, res) {
    try {
      var user = await userExension.findUserByUsername(req.params.username);
      if (user) {
        await ProfileLikes.destroy({
          where: {
            userId: req.user.id,
            likedUserId: user.id,
          },
        });
        res.status(200).send({ message: "OK" });
      }
    } catch (err) {
      res.status(500).send({ message: "Error" });
    }
  },
};
