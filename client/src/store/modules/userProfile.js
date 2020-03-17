import api from "../../api/user";
import path from "path";
import urlJoin from "url-join";
import { i18n } from "../../i18n";

const state = {
  profile: null,
  myProfileLikes: [],
  profilesILike: []
};

const getters = {
  check: state => {
    return !!state.profile;
  },
  languageCode: state => {
    return state.profile && state.profile.languageCode
      ? state.profile.languageCode
      : undefined;
  },
  userAvatar: state => {
    var imgUrl = null;
    if (state.profile && state.profile.profileImageUrl) {
      imgUrl = urlJoin(
        process.env.VUE_APP_IMAGES_REPOSITORY,
        "avatars",
        state.profile.profileImageUrl
      );
    } else {
      imgUrl = imgUrl = urlJoin(
        process.env.VUE_APP_IMAGES_REPOSITORY,
        "avatars",
        process.env.VUE_APP_AVATAR_IMAGE
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
  },
  getProfilesILike({ commit }) {
    return new Promise((resolve, reject) => {
      api.getProfileLikes(
        {},
        result => {
          resolve(result);
          commit("setProfilesILike", result.likes);
        },
        errors => reject(errors)
      );
    });
  },
  getMyProfileLikes({ commit }) {
    return new Promise((resolve, reject) => {
      api.getMyProfileLikes({}, result => {
        resolve(result);
        commit("setMyProfileLikes", result.likes);
      });
    });
  }
};

const mutations = {
  setProfile(state, data) {
    if (state != null) {
      state.profile = data;
      if (
        state.profile &&
        state.profile.languageCode &&
        state.profile.languageCode != i18n.locale
      ) {
        i18n.locale = state.profile.languageCode;
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
      case "countryCode":
        state.profile.countryCode = data.value;
        break;
      case "languageCode":
        state.profile.languageCode = data.value;
        break;
    }
  },
  deleteImage(state) {
    if (state.profile.gender == "M") {
      state.profile.profileImageUrl = "user-man.png";
    } else if (state.profile.gender == "F") {
      state.profile.profileImageUrl = "user-woman.png";
    }
  },
  setProfilesILike(state, data) {
    state.profilesILike = data;
  },
  setMyProfileLikes(state, data) {
    state.myProfileLikes = data;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
