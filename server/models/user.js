const bcrypt = require("bcryptjs");
const myModels = require("./../models");
const UserProfile = require("./userprofile");

async function hashPassword(password) {
  let passwordHash = "";
  await bcrypt.genSalt(10, async (err, salt) => {
    await bcrypt.hash(password, salt, (err, hash) => {
      passwordHash = hash;
    });
  });
  return passwordHash;
}

async function hashPassword1(user) {
  const password = user.password;
  const saltRounds = 10;

  const hashedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, function (err, hash) {
      if (err) reject(err);
      resolve(hash);
    });
  });

  return hashedPassword;
}

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      username: DataTypes.STRING,
      passwordSalt: DataTypes.STRING,
    },
    {
      hooks: {
        beforeSave: async (user, options) => {
          user.passwordSalt = await bcrypt.genSalt(10);
          let tmp = user.password.slice(0);
          user.password = bcrypt.hashSync(user.password, user.passwordSalt);
        },
        afterCreate: async (user, options) => {
          sequelize.models.UserProfile.create({ userId: user.id });
        },
      },
    }
  );
  User.associate = function (models) {
    // User.hasMany(models.Channel, {
    //   through: "Channelmembers",
    //   key: "userId",
    //   as: "channels"
    // });
    User.hasOne(models.UserProfile, { foreignKey: "userId", as: "profile" });
  };

  User.prototype.comparePassword = async function (password) {
    let status = false;
    status = await bcrypt.compare(password, this.password);
    return status;
  };
  User.prototype.findByUsername = async function (username) {
    var user = {};
    try {
      user = User.findOne({
        where: {
          username: username,
        },
        attributes: ["name", "username"],
        include: [
          {
            model: myModels.UserProfile,
            as: "profile",
          },
        ],
      });
    } catch (ex) {
      console.log(ex);
    }
    return user;
  };
  return User;
};
