import store from "../store";
import axios from "axios";

export default {
  request(method, url, data, cb, errorCb) {
    let token = store.getters["auth/token"];
    let headers = token
      ? {
          Authorization: "Bearer " + token
        }
      : {};

    return axios({
      method,
      url,
      data,
      headers
    })
      .then(response => {
        typeof cb === "function" && cb(response.data);
      })
      .catch(result => {
        if (result.response.status === 401) {
          store.dispatch("auth/clear");
        }
        var errors = ["Error happend"];
        typeof errorCb === "function" && errorCb(errors);
      });
  }
};
