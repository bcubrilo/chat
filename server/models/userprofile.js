"use strict";
module.exports = (sequelize, DataTypes) => {
  const UserProfile = sequelize.define(
    "UserProfile",
    {
      userId: DataTypes.BIGINT,
      profileImageUrl: DataTypes.STRING,
      countryId: DataTypes.INTEGER,
      languageId: DataTypes.INTEGER,
      description: DataTypes.STRING
    },
    {}
  );
  UserProfile.associate = function(models) {
    // associations can be defined here
  };
  return UserProfile;
};
