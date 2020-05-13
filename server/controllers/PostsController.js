const models = require("./../models");
module.exports = {
  async index(req, res) {},
  async create(req, res) {
    var post = null;
    try {
      post = await models.Post.create({
        userId: req.user.id,
        content: req.body.content,
        parentPostId: req.body.parentPostId || null,
      });
    } catch (err) {
      console.log("error happened");
    }
    res
      .status(post ? 200 : 500)
      .send({ message: post ? "OK" : "Error", post: post });
  },
};
