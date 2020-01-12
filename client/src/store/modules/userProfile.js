import api from "../../api/user";
import path from "path";
import urlJoin from "url-join";

const state = {
  profile: null
};

const getters = {
  check: state => {
    return !!state.profile;
  },
  userAvatar: state => {
    var imgUrl = null;
    if (
      state.profile != null &&
      state.profile.profileImageUrl != undefined &&
      state.profile.profileImageUrl.length > 0
    ) {
      imgUrl = urlJoin(
        process.env.VUE_APP_IMAGES_REPOSITORY,
        "avatars",
        state.profile.profileImageUrl
      );
    } else {
      imgUrl = imgUrl = urlJoin(
        process.env.VUE_APP_IMAGES_REPOSITORY,
        "avatars",
        "avatar"
      );
    }
    return imgUrl;
  }
};

const actions = {
  getProfile({ commit, rootState }) {
    return new Promise((resolve, reject) => {
      api.getProfile(
        rootState.auth.user.id,
        result => {
          commit("setProfile", result.data);
          resolve(result.data);
        },
        errors => {
          reject(errors);
        }
      );
    });
  },
  updateProfile({ commit, rootState }, data) {
    return new Promise((resolve, reject) => {
      api.updateProfile(
        data,
        result => {
          resolve(result);
          commit("updateProfile", data);
        },
        errors => {
          reject(errors);
        }
      );
    });
  },
  uploadProfileImage({ commit }, data) {
    return new Promise((resolve, reject) => {
      api.uploadProfileImage(data, result => {
        resolve(result);
        console.log(result);
        let d = {
          field: "profileImageUrl",
          value: result.filename
        };
        commit("updateProfile", d);
      }),
        errors => {
          reject(errors);
        };
    });
  },
  deleteProfileImage({ commit }) {
    console.log("Deleting use rimage");
    return new Promise((resolve, reject) => {
      api.deleteProfileImage(
        {},
        result => {
          resolve(result);
          commit("deleteImage");
        },
        errors => reject(errors)
      );
    });
  }
};

const mutations = {
  setProfile(state, data) {
    if (state != null) {
      state.profile = data;
      if (
        state.profile.profileImageUrl == undefined ||
        state.profile.profileImageUrl.length == 0
      ) {
        if (state.profile.gender == "M") {
          state.profile.profileImageUrl = "user-man.png";
        } else if (state.profile.gender == "F") {
          state.profile.profileImageUrl = "user-woman.png";
        }
      }
    }
  },
  updateProfile(state, data) {
    switch (data.field) {
      case "description":
        state.profile.description = data.value;
        break;
      case "profileImageUrl":
        state.profile.profileImageUrl = data.value;
        break;
    }
  },
  deleteImage(state) {
    console.log("Delete image - mutations");
    if (state.profile.gender == "M") {
      state.profile.profileImageUrl = "user-man.png";
    } else if (state.profile.gender == "F") {
      state.profile.profileImageUrl = "user-woman.png";
    }
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
