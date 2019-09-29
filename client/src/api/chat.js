import util from "./util";

export default {
  createChannel(params, cb, errorCb) {
    return util.request(
      "post",
      "/api/chat/create-channel",
      params,
      cb,
      errorCb
    );
  },
  getChannels(params, cb, errorCb) {
    return util.request("get", "/api/chat/channels", params, cb, errorCb);
  },
  saveMessage(params, cb, errorCb) {
    return util.request("post", "/api/chat/save-message", params, cb, errorCb);
  },
  deleteChannel(params, cb, errorCb) {
    return util.request(
      "post",
      "/api/chat/delete-channel",
      params,
      cb,
      errorCb
    );
  }
};
