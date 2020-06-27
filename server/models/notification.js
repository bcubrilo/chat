"use strict";
module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define(
    "Notification",
    {
      userId: DataTypes.BIGINT,
      notifiedUserId: DataTypes.BIGINT,
      content: DataTypes.STRING,
      createdAt: DataTypes.DATE,
      seen: DataTypes.BOOLEAN,
    },
    {
      hooks: {
        beforeSave: async (notification, options) => {
          notification.id = uuid.v4();
        },
      },
    }
  );
  Notification.associate = function (models) {
    Notification.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });
    Notification.belongsTo(models.User, {
      foreignKey: "notifiedUserId",
      as: "notifiedUser",
    });
  };
  return Notification;
};
