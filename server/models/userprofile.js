"use strict";
module.exports = (sequelize, DataTypes) => {
  const UserProfile = sequelize.define(
    "UserProfile",
    {
      userId: DataTypes.BIGINT,
      profileImageUrl: DataTypes.STRING,
      countryId: DataTypes.INTEGER,
      languageId: DataTypes.INTEGER,
      description: DataTypes.STRING,
      gender: DataTypes.STRING(1),
      interestedInGender: DataTypes.STRING(1)
    },
    {}
  );
  UserProfile.associate = function(models) {
    UserProfile.belongsTo(models.User);
  };
  return UserProfile;
};
