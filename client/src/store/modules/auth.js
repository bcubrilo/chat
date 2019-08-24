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
    return state.user && state.user.token;
  }
};

const actions = {
  login({ commit, dispatch }, credentials) {
    return new Promise((resolve, reject) => {
      api.login(
        credentials,
        result => {
          console.log("Logged user " + result.data.user.name);
          commit("setUser", result.data);
          resolve(result.data);
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
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
