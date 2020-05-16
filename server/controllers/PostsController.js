const models = require("./../models");
const postExtension = require("./../models_extension/postExtension");
module.exports = {
  async index(req, res) {
    var post = await postExtension.getPostTree(req.params.postId);
    res.status(200).send({ message: "OK", post: post });
  },
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
  async update(req, res) {
    var status = false;
    try {
      var post = await models.Post.findOne({
        where: {
          userId: req.user.id,
          id: req.params.postId,
        },
      });
      if (post) {
        post.content = req.body.content;
        post.save();
      }
      status = true;
    } catch (error) {}
    res.status(status ? 200 : 500).send({ message: status ? "OK" : "Error" });
  },
  async delete(req, res) {
    var status = false;
    try {
      await models.Post.destroy({
        where: {
          id: req.params.postId,
        },
      });
      var status = true;
    } catch (error) {}
    res.status(status ? 200 : 500).send({ message: status ? "OK" : "Error" });
  },
  async getPostsTreesByUserID(req, res) {
    var posts = null;
    var user = await models.User.findOne({
      where: { username: req.params.username },
    });
    try {
      posts = await postExtension.getPostsTreesByUserID(user.id);
    } catch (error) {}
    res.status(200).send({ message: posts ? "OK" : "Error", posts: posts });
  },
};
