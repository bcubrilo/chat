'use strict';
module.exports = (sequelize, DataTypes) => {
  const BlockedUsers = sequelize.define('BlockedUsers', {
    userId: DataTypes.BIGINT,
    blockedUserId: DataTypes.BIGINT
  }, {});
  BlockedUsers.associate = function(models) {
    // associations can be defined here
  };
  return BlockedUsers;
};