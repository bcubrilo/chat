const bcrypt = require("bcryptjs");

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
    bcrypt.hash(password, saltRounds, function(err, hash) {
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
      passwordSalt: DataTypes.STRING
    },
    {
      hooks: {
        beforeSave: async (user, options) => {
          user.passwordSalt = await bcrypt.genSalt(10);
          let tmp = user.password.slice(0);
          user.password = bcrypt.hashSync(user.password, user.passwordSalt);
        }
      }
    }
  );
  User.associate = function(models) {
    // User.hasMany(models.Channel, {
    //   through: "Channelmembers",
    //   key: "userId",
    //   as: "channels"
    // });
    User.hasMany(models.UserProfile, { key: "userId", as: "profile" });
  };

  User.prototype.comparePassword = async function(password) {
    let status = false;
    status = await bcrypt.compare(password, this.password);
    return status;
  };
  return User;
};
