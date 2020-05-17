import util from "./util";
export default {
  get(params, cb, errorCb) {
    return util.request("get", "/post", params, cb, errorCb);
  },
  create(params, cb, errorCb) {
    return util.request("post", "/post", params, cb, errorCb);
  },
  update(params, cb, errorCb) {
    return util.request("put", "/post", params, cb, errorCb);
  },
  userPosts(params, cb, errorCb) {
    return util.request("get", "post/user", params, cb, errorCb);
  },
  delete(params, cb, errorCb) {
    return util.request("delete", "post", params, cb, errorCb);
  },
};
