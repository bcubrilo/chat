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
  saveMessage(params, cb, errorCb) {
    return util.request("post", "/api/chat/save-message", params, cb, errorCb);
  }
};
