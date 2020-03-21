"use strict";
module.exports = (sequelize, DataTypes) => {
  const ProfileLikes = sequelize.define(
    "ProfileLikes",
    {
      userId: DataTypes.BIGINT,
      likedUserId: DataTypes.BIGINT
    },
    {}
  );
  ProfileLikes.associate = function(models) {
    ProfileLikes.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user"
    });
    ProfileLikes.belongsTo(models.User, {
      foreignKey: "likedUserId",
      as: "likedUser"
    });
    ProfileLikes.hasOne(models.UserProfile, {
      foreignKey: "likedUserId",
      as: "likedUserProfile"
    });
  };
  return ProfileLikes;
};
