import api from "../../api/auth";

import router from "../../router";
const state = {
  user: null,
  token: null,
  registerError: null
};

const getters = {
  check: state => {
    return !!state.user;
  },
  token: state => {
    return state.token;
  },
  isAuth: state => {
    return !!state.user;
  },
  userFirstLetter: state => {
    return state.user.name.chatAt(0);
  },
  registerError: state => {
    return state.registerError ? state.registerError.response.data : false;
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
          dispatch("userProfile/getProfile", null, { root: true });
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
        error => {
          try {
            console.log("Setujem gresku");
            reject(error);
          } catch (err) {
            console.log("Evo je greska", err);
          }
        }
      );
    });
  },
  logout() {
    router.push("login");
    localStorage.removeItem("vuex");
    location.reload();
  }
};

const mutations = {
  setUser(state, authData) {
    state.user = authData.user;
    state.token = authData.token;
  },
  setRegisterError(state, error) {
    console.log("Setting");
    state.registerError = error;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
