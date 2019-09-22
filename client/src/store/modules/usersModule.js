import api from "../../api/user";

const state = {
  mostRecentUsers: null
};

const getters = {};

const actions = {
  getMostRecentUsers({ commit }) {
    return new Promise((resolve, reject) => {
      api.getMostRecentUsers(
        {},
        result => {
          commit("setMostRecentUsers", result.data);
          resolve(result);
        },
        errors => reject(errors)
      );
    });
  }
};

const mutations = {
  setMostRecentUsers(state, data) {
    state.mostRecentUsers = data;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
