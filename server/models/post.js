"use strict";
const uuid = require("uuid");
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    "Post",
    {
      userId: DataTypes.BIGINT,
      content: DataTypes.TEXT,
    },
    {
      hooks: {
        beforeSave: async (post, options) => {
          post.uuId = uuid.v4();
        },
      },
    }
  );
  Post.associate = function (models) {
    Message.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });
  };
  return Post;
};
