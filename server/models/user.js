"use strict";
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: DataTypes.BIGINT,
      name: DataTypes.STRING,
      cratedAt: DataTypes.DATE,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      username: DataTypes.STRING
    },
    {}
  );
  User.associate = function(models) {
    User.hasMany(models.Channel, {
      through: "Channelmembers",
      key: "userId",
      as: "channels"
    });
  };
  return User;
};
