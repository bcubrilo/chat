"use strict";
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      username: DataTypes.STRING
    },
    {}
  );
  User.associate = function(models) {
    // User.hasMany(models.Channel, {
    //   through: "Channelmembers",
    //   key: "userId",
    //   as: "channels"
    // });
  };
  return User;
};
