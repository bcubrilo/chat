"use strict";
module.exports = (sequelize, DataTypes) => {
  const Channel = sequelize.define("Channel", {}, {});
  Channel.associate = function(models) {
    Channel.hasMany(models.Channelmember, { key: "channelId", as: "members" });
  };
  return Channel;
};
