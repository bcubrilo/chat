'use strict';
module.exports = (sequelize, DataTypes) => {
  const ProfileLikes = sequelize.define('ProfileLikes', {
    userId: DataTypes.BIGINT,
    likedUserId: DataTypes.BIGINT
  }, {});
  ProfileLikes.associate = function(models) {
    // associations can be defined here
  };
  return ProfileLikes;
};