import util from "./util";

export default {
  register(params, cb, errorCb) {
    return util.request("post", "/users/register", params, cb, errorCb);
  },
  login(params, cb, errorCb) {
    return util.request("post", "/users/login", params, cb, errorCb);
  },
  logout(params, cb, errorCb) {
    return util.request("post", "/users/logout", params, cb, errorCb);
  }
};
