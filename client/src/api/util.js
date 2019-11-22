import store from "../store";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:3030";
export default {
  request(method, url, data, cb, errorCb) {
    let token = store.getters["auth/token"];

    var headers = token
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
        if (result.response != undefined && result.response.status === 401) {
          store.dispatch("auth/clear");
          console.log("odlicno");
        }
        var errors = ["Error happend"];
        typeof errorCb === "function" && errorCb(errors);
        console.log("doslo je do greske" + errors);
      });
  }
};
