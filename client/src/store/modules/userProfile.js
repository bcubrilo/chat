import api from "../../api/user";

const state = {
  profile: null
};

const getters = {
  check: state => {
    return !!state.profile;
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
    console.log("Added image upload");
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
  }
};

const mutations = {
  setProfile(state, data) {
    if (state != null) state.profile = data;
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
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
