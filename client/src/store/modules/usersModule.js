import api from "../../api/user";
import _ from "lodash";

const state = {
  mostRecentUsers: null,
  users: []
};

const getters = {
  getByUsername: state => username => {
    console.log("Calling getByUsername");
    return _.find(state.users, user => user.username == username);
  }
};

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
  },
  getUserByUsername({ commit }, data) {
    console.log("Calling getUserbyUsername");
    return new Promise((resolve, reject) => {
      api.getUserPublicProfile(
        data,
        result => {
          commit("addUser", result.data);
          resolve(result);
        },
        erorrs => reject(erorrs)
      );
    });
  }
};

const mutations = {
  setMostRecentUsers(state, data) {
    state.mostRecentUsers = data;
    _.each(data, user => state.users.push(user));
  },
  addUser(state, user) {
    state.users.push(user);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
