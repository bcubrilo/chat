import api from "../../api/auth";

const state = {
  user: null,
  token: null
};

const getters = {
  check: state => {
    return !!state.user;
  },
  token: state => {
    return state.token;
  }
};

const actions = {
  login({ commit, dispatch }, credentials) {
    return new Promise((resolve, reject) => {
      api.login(
        credentials,
        result => {
          resolve(result.data);
          commit("setUser", result.data);
          dispatch("chat/getChannels", null, { root: true });
        },
        errors => {
          reject(errors);
        }
      );
    });
  },
  register({ commit, dispatch }, credentials) {
    return new Promise((resolve, reject) => {
      api.register(
        credentials,
        result => {
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
  setUser(state, authData) {
    state.user = authData.user;
    state.token = authData.token;
    console.log("Imam token: " + state.token);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
