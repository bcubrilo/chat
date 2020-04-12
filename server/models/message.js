"use strict";
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define(
    "Message",
    {
      channelId: DataTypes.BIGINT,
      userId: DataTypes.BIGINT,
      content: DataTypes.TEXT,
      createdAt: DataTypes.DATE,
      originalId: DataTypes.BIGINT,
      receiverId: DataTypes.BIGINT,
      seen: DataTypes.BOOLEAN,
      isEmojiMessage: DataTypes.BOOLEAN,
      isMine: DataTypes.BOOLEAN,
      uuId: DataTypes.UUID,
    },
    {}
  );
  Message.associate = function (models) {
    Message.belongsTo(models.Channel, {
      foreignKey: "channelId",
      as: "channel",
    });
  };
  return Message;
};
