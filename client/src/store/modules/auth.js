import api from "../../api/auth";

const state = {
  user: null
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
  setUser(state, user) {
    state.user = user;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
