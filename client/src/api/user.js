import util from "./util";
export default {
  getProfile(params, cb, errorCb) {
    return util.request("get", "/api/profile/" + params, params, cb, errorCb);
  },
  saveProfile(params, cb, errorCb) {
    return util.request("post", "/api/profile", params, cb, errorCb);
  },
  getChannels(params, cb, errorCb) {
    return util.request("get", "/api/channels", params, cb, errorCb);
  },
  updateProfile(params, cb, errorCb) {
    return util.request("post", "/api/profile/update", params, cb, errorCb);
  },
  uploadProfileImage(params, cb, errorCb) {
    return util.request(
      "post",
      "/api/profile/upload-profile-image",
      params,
      cb,
      errorCb
    );
  }
};
