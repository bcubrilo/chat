import util from "./util";
export default {
  get(params, cb, errorCb) {
    return util.request(
      "get",
      "/api/post/" + params.postId,
      params,
      cb,
      errorCb
    );
  },
  create(params, cb, errorCb) {
    return util.request("post", "/api/post", params, cb, errorCb);
  },
  update(params, cb, errorCb) {
    return util.request("put", "/api/post", params, cb, errorCb);
  },
  userPosts(params, cb, errorCb) {
    return util.request("get", "/apipost/user", params, cb, errorCb);
  },
  delete(params, cb, errorCb) {
    return util.request(
      "delete",
      "/api/post/" + params.postId,
      params,
      cb,
      errorCb
    );
  },
  recentPosts(params, cb, errorCb) {
    return util.request("post", "/api/post/recent", params, cb, errorCb);
  },
  getComments(params, cb, errorCb) {
    return util.request(
      "get",
      "/api/post/comments/" + params.postId,
      cb,
      errorCb
    );
  },
};
