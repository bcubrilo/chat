"use strict";
module.exports = (sequelize, DataTypes) => {
  const Channel = sequelize.define("Channel", {}, {});
  Channel.associate = function(models) {
    Channel.hasMany(models.ChannelMember, { key: "channelId", as: "members" }),
      Channel.hasMany(models.Message, { key: "channelId", as: "messages" });
  };
  return Channel;
};
