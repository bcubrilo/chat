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
  }
};

const mutations = {
  setProfile(state, data) {
    if (state != null) state.profile = data;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
