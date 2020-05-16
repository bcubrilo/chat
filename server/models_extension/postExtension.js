const models = require("./../models");
const sequelize = require("sequelize");
module.exports = {
  async getPostById(id) {
    var post = await models.Post.FindOne({
      where: {
        id: id,
      },
    });
  },
  async getPostTree(id) {
    var post = null;
    try {
      post = await models.sequelize.query(
        `with recursive cte (id, content, parentPostId, userId, createdAt) as (
                            select     id,
                                      content,
                                      parentPostId,
                                      userId,
                                      createdAt
                            from       posts 
							where      id = :id
                            union all
                            select     p.id,
                                      p.content,
                                      p.parentPostId,
                                      p.userId,
                                      p.createdAt
                            from       posts p
                            inner join cte
                                    on p.parentPostId = cte.id
                          )
                          select cte.*,u.name,u.username, up.profileImageUrl  
                          from cte
                          left join users u on cte.userId = u.id
                          left join userprofiles up on u.id = up.userid;`,
        { type: sequelize.QueryTypes.SELECT, replacements: { id: id } }
      );
    } catch (error) {}
    return post;
  },
  async getPostsTreesByUserID(userId) {
    var post = null;
    try {
      post = await models.sequelize.query(
        `with recursive cte (id, content, parentPostId, userId, createdAt) as (
                            select     id,
                                      content,
                                      parentPostId,
                                      userId,
                                      createdAt
                            from       posts 
							where      userId=:userId
                            union all
                            select     p.id,
                                      p.content,
                                      p.parentPostId,
                                      p.userId,
                                      p.createdAt
                            from       posts p
                            inner join cte
                                    on p.parentPostId = cte.id
                          )
                          select cte.*,u.name,u.username, up.profileImageUrl  
                          from cte
                          left join users u on cte.userId = u.id
                          left join userprofiles up on u.id = up.userid;`,
        { type: sequelize.QueryTypes.SELECT, replacements: { userId: userId } }
      );
    } catch (error) {}
    return post;
  },
};
